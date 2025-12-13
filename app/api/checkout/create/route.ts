import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import Stripe from "stripe";
import { z } from "zod";
import { requireEnv } from "@/lib/env";
import { resolvePrisma } from "@/lib/db";
import { verifyTurnstile } from "@/lib/security/turnstile";
import { getStripe } from "@/lib/stripe/client";
import { checkoutItemMetadataKey } from "@/lib/stripe/webhook";

const bodySchema = z.object({
  items: z.array(
    z.object({ productId: z.string(), quantity: z.number().int().positive() }),
  ),
  turnstileToken: z.string().optional(),
  customerEmail: z.string().email().optional(),
});

export async function POST(request: Request) {
  const stripeEnvCheck = requireEnv([
    "STRIPE_SECRET_KEY",
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "STRIPE_SUCCESS_URL",
    "STRIPE_CANCEL_URL",
  ]);
  if (!stripeEnvCheck.ok) {
    return NextResponse.json(
      {
        error: "Stripe not configured",
        required: stripeEnvCheck.missing,
      },
      { status: 503 },
    );
  }

  const dbEnvCheck = requireEnv(["DATABASE_URL"]);
  if (!dbEnvCheck.ok) {
    return NextResponse.json(
      { error: "Database not configured", required: dbEnvCheck.missing },
      { status: 503 },
    );
  }

  const env = stripeEnvCheck.env;

  const json = await request.json().catch(() => null);
  const parseResult = bodySchema.safeParse(json);

  if (!parseResult.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { items, turnstileToken, customerEmail } = parseResult.data;

  const turnstileOk = await verifyTurnstile(
    turnstileToken,
    request.headers.get("x-forwarded-for"),
  );
  if (!turnstileOk) {
    return NextResponse.json(
      { error: "Turnstile verification failed" },
      { status: 400 },
    );
  }

  const prismaResult = resolvePrisma();
  if (!prismaResult.ok) {
    return NextResponse.json(
      { error: "Database not configured", required: prismaResult.missing },
      { status: 503 },
    );
  }
  const prisma = prismaResult.prisma;

  const productIds = items.map((item) => item.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });

  if (products.length !== items.length) {
    return NextResponse.json(
      { error: "One or more products are invalid" },
      { status: 400 },
    );
  }

  const currency = "usd";
  const total = new Prisma.Decimal(
    items.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.productId)!;
      return sum + Number(product.price) * item.quantity;
    }, 0),
  );

  const order = await prisma.order.create({
    data: {
      status: "PENDING",
      currency,
      total,
      items: {
        create: items.map((item) => {
          const product = products.find((p) => p.id === item.productId)!;
          return {
            productId: product.id,
            productName: product.name,
            imageUrl: product.imageUrl,
            unitPrice: product.price,
            quantity: item.quantity,
          };
        }),
      },
    },
  });

  const lineItems = items.map((item) => {
    const product = products.find((p) => p.id === item.productId)!;
    const unitAmount = Math.round(Number(product.price) * 100);
    return {
      quantity: item.quantity,
      price_data: {
        currency: "usd",
        product_data: {
          name: product.name,
          description: product.description,
          images: product.imageUrl ? [product.imageUrl] : [],
        },
        unit_amount: unitAmount,
      },
      } satisfies Stripe.Checkout.SessionCreateParams.LineItem;
    });

  const stripe = getStripe(env);
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: env.STRIPE_SUCCESS_URL ?? env.APP_URL,
      cancel_url: env.STRIPE_CANCEL_URL ?? env.APP_URL,
      metadata: {
        orderId: order.id,
        [checkoutItemMetadataKey]: JSON.stringify(items),
      },
      customer_email: customerEmail,
      payment_intent_data: {
        metadata: {
          orderId: order.id,
        },
      },
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: session.id },
    });

    return NextResponse.json({ url: session.url, id: session.id });
  } catch (error) {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "FAILED" },
    });
    console.error("Failed to create Stripe checkout session", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 },
    );
  }
}

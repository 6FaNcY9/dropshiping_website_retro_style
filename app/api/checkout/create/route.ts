import { NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyTurnstile } from "@/lib/security/turnstile";
import { stripe } from "@/lib/stripe/client";
import { checkoutItemMetadataKey } from "@/lib/stripe/webhook";
import { env } from "@/lib/env";

const bodySchema = z.object({
  items: z.array(
    z.object({ productId: z.string(), quantity: z.number().int().positive() }),
  ),
  turnstileToken: z.string().optional(),
  customerEmail: z.string().email().optional(),
});

export async function POST(request: Request) {
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

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    success_url: env.STRIPE_SUCCESS_URL,
    cancel_url: env.STRIPE_CANCEL_URL,
    metadata: {
      [checkoutItemMetadataKey]: JSON.stringify(items),
    },
    customer_email: customerEmail,
  });

  return NextResponse.json({ url: session.url, id: session.id });
}

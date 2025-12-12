import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getEnv } from "@/lib/env";
import { getPrisma } from "@/lib/db";
import {
  constructStripeEvent,
  parseCheckoutItemsFromMetadata,
} from "@/lib/stripe/webhook";

export async function POST(request: Request) {
  const env = getEnv();
  if (!env.HAS_STRIPE) {
    return NextResponse.json(
      {
        error: "Stripe not configured",
        required: [
          "STRIPE_SECRET_KEY",
          "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
          "STRIPE_WEBHOOK_SECRET",
          "STRIPE_SUCCESS_URL",
          "STRIPE_CANCEL_URL",
        ],
      },
      { status: 503 },
    );
  }

  let prisma;
  try {
    prisma = getPrisma();
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Database not configured", required: ["DATABASE_URL"] },
      { status: 503 },
    );
  }

  const signature = request.headers.get("stripe-signature");
  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = await constructStripeEvent(rawBody, signature, env);
  } catch (error) {
    console.error("Stripe signature verification failed", error);
    return new NextResponse("Signature verification failed", { status: 400 });
  }

  const existingEvent = await prisma.processedEvent.findUnique({
    where: { eventId: event.id },
  });
  if (existingEvent) {
    return NextResponse.json({ received: true });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const items = parseCheckoutItemsFromMetadata(session.metadata);

    if (!items.length) {
      return new NextResponse("Missing checkout metadata", { status: 400 });
    }

    const products = await prisma.product.findMany({
      where: { id: { in: items.map((item) => item.productId) } },
    });

    const currency = session.currency ?? "usd";

    try {
      await prisma.$transaction(async (tx) => {
        const order = await tx.order.create({
          data: {
            stripeSessionId: session.id,
            status: "PAID",
            currency,
            total: new Prisma.Decimal(
              items.reduce((sum, item) => {
                const product = products.find((p) => p.id === item.productId);
                const price = product ? Number(product.price) : 0;
                return sum + price * item.quantity;
              }, 0),
            ),
            items: {
              create: items.map((item) => {
                const product = products.find((p) => p.id === item.productId);
                const unitPrice = product
                  ? product.price
                  : new Prisma.Decimal(0);
                return {
                  productId: item.productId,
                  productName: product?.name ?? "Unknown product",
                  imageUrl: product?.imageUrl,
                  unitPrice,
                  quantity: item.quantity,
                };
              }),
            },
            userId:
              typeof session.client_reference_id === "string"
                ? session.client_reference_id
                : null,
          },
        });

        await tx.payment.create({
          data: {
            orderId: order.id,
            status: "SUCCEEDED",
            provider: "stripe",
            providerPaymentId:
              typeof session.payment_intent === "string"
                ? session.payment_intent
                : null,
            amount: order.total,
            currency,
          },
        });

        await tx.processedEvent.create({
          data: { eventId: event.id, provider: "stripe" },
        });
      });
    } catch (error) {
      console.error("Failed to persist checkout.session.completed", error);
      return new NextResponse("Failed to persist event", { status: 500 });
    }
  }

  if (event.type === "payment_intent.payment_failed") {
    const intent = event.data.object as Stripe.PaymentIntent;
    const order = await prisma.order.findFirst({
      where: { stripeSessionId: intent.metadata?.checkout_session_id },
    });
    if (order) {
      await prisma.payment.updateMany({
        where: { orderId: order.id },
        data: { status: "FAILED" },
      });
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "FAILED" },
      });
    }
    await prisma.processedEvent.create({
      data: { eventId: event.id, provider: "stripe" },
    });
  }

  return NextResponse.json({ received: true });
}

export const runtime = "nodejs";

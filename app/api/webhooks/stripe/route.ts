import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { requireEnv } from "@/lib/env";
import { resolvePrisma } from "@/lib/db";
import {
  constructStripeEvent,
  PrismaIdempotencyStore,
} from "@/lib/stripe/webhook";

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

  const prismaResult = resolvePrisma();
  if (!prismaResult.ok) {
    return NextResponse.json(
      { error: "Database not configured", required: prismaResult.missing },
      { status: 503 },
    );
  }
  const prisma = prismaResult.prisma;

  const signature = request.headers.get("stripe-signature");
  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = await constructStripeEvent(rawBody, signature, env);
  } catch (error) {
    console.error("Stripe signature verification failed", error);
    return new NextResponse("Signature verification failed", { status: 400 });
  }

  const idempotency = new PrismaIdempotencyStore(prisma);
  if (await idempotency.hasProcessed(event.id)) {
    return NextResponse.json({ received: true });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderIdFromMetadata = session.metadata?.orderId;

      const order = orderIdFromMetadata
        ? await prisma.order.findUnique({ where: { id: orderIdFromMetadata } })
        : await prisma.order.findUnique({
            where: { stripeSessionId: session.id },
          });

      if (!order) {
        return new NextResponse("Order not found for checkout session", {
          status: 400,
        });
      }

      const amountTotal =
        typeof session.amount_total === "number"
          ? session.amount_total
          : Number(order.totalAmount) * 100;
      const amount = new Prisma.Decimal(amountTotal / 100);
      const currency = session.currency ?? order.currency;

      await prisma.$transaction(async (tx) => {
        await tx.order.update({
          where: { id: order.id },
          data: {
            status: "PAID",
            currency,
            totalAmount: amount,
            stripeSessionId: order.stripeSessionId ?? session.id,
          },
        });

        await tx.payment.upsert({
          where: { orderId: order.id },
          update: {
            status: "SUCCEEDED",
            providerPaymentId:
              typeof session.payment_intent === "string"
                ? session.payment_intent
                : null,
            amount,
            currency,
          },
          create: {
            orderId: order.id,
            status: "SUCCEEDED",
            provider: "stripe",
            providerPaymentId:
              typeof session.payment_intent === "string"
                ? session.payment_intent
                : null,
            amount,
            currency,
          },
        });

        await tx.processedEvent.create({
          data: { eventId: event.id, provider: "stripe" },
        });
      });
    }

    if (event.type === "payment_intent.succeeded") {
      const intent = event.data.object as Stripe.PaymentIntent;
      const orderIdFromMetadata = intent.metadata?.orderId;
      const checkoutSessionId = intent.metadata?.checkout_session_id;

      let order = orderIdFromMetadata
        ? await prisma.order.findUnique({ where: { id: orderIdFromMetadata } })
        : null;
      if (!order && checkoutSessionId) {
        order = await prisma.order.findUnique({
          where: { stripeSessionId: checkoutSessionId },
        });
      }

      if (!order) {
        return new NextResponse("Order not found for payment intent", {
          status: 400,
        });
      }

      const amountCents =
        typeof intent.amount_received === "number"
          ? intent.amount_received
          : typeof intent.amount === "number"
            ? intent.amount
            : Number(order.totalAmount) * 100;
      const amount = new Prisma.Decimal(amountCents / 100);
      const currency = intent.currency ?? order.currency;

      await prisma.$transaction(async (tx) => {
        await tx.order.update({
          where: { id: order!.id },
          data: {
            status: "PAID",
            currency,
            totalAmount: amount,
            stripeSessionId: order!.stripeSessionId ?? checkoutSessionId,
          },
        });

        await tx.payment.upsert({
          where: { orderId: order!.id },
          update: {
            status: "SUCCEEDED",
            providerPaymentId: intent.id,
            amount,
            currency,
          },
          create: {
            orderId: order!.id,
            status: "SUCCEEDED",
            provider: "stripe",
            providerPaymentId: intent.id,
            amount,
            currency,
          },
        });

        await tx.processedEvent.create({
          data: { eventId: event.id, provider: "stripe" },
        });
      });
    }

    if (event.type === "payment_intent.payment_failed") {
      const intent = event.data.object as Stripe.PaymentIntent;
      const order = await prisma.order.findFirst({
        where: { stripeSessionId: intent.metadata?.checkout_session_id },
      });
      if (order) {
        await prisma.$transaction(async (tx) => {
          await tx.payment.updateMany({
            where: { orderId: order.id },
            data: { status: "FAILED" },
          });
          await tx.order.update({
            where: { id: order.id },
            data: { status: "FAILED" },
          });

          await tx.processedEvent.create({
            data: { eventId: event.id, provider: "stripe" },
          });
        });
      }
    }
  } catch (error) {
    console.error("Failed to handle Stripe webhook", error);
    return new NextResponse("Failed to process event", { status: 500 });
  }

  return NextResponse.json({ received: true });
}

export const runtime = "nodejs";

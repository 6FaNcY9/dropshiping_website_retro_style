import { Prisma, PrismaClient } from "@prisma/client";
import Stripe from "stripe";
import { type Env } from "../env";
import { getStripe } from "./client";

export interface IdempotencyStore {
  hasProcessed(eventId: string): Promise<boolean>;
  markProcessed(eventId: string): Promise<void>;
}

type PrismaClientOrTx = PrismaClient | Prisma.TransactionClient;

export class PrismaIdempotencyStore implements IdempotencyStore {
  constructor(private prisma: PrismaClientOrTx) {}

  async hasProcessed(eventId: string): Promise<boolean> {
    const existing = await this.prisma.processedEvent.findUnique({
      where: { eventId },
    });
    return Boolean(existing);
  }

  async markProcessed(eventId: string): Promise<void> {
    await this.prisma.processedEvent.create({
      data: { eventId, provider: "stripe" },
    });
  }
}

export const checkoutItemMetadataKey = "order_items";

export type CheckoutItemMetadata = Array<{
  productId: string;
  quantity: number;
}>;

export function parseCheckoutItemsFromMetadata(
  metadata: Stripe.Metadata | null,
): CheckoutItemMetadata {
  if (!metadata) return [];
  const raw = metadata[checkoutItemMetadataKey];
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter(
        (item): item is { productId: string; quantity: number } =>
          typeof item?.productId === "string" &&
          typeof item?.quantity === "number",
      );
    }
  } catch (error) {
    console.error("Failed to parse checkout metadata", error);
  }
  return [];
}

export async function constructStripeEvent(
  rawBody: string | Buffer,
  signature: string | null,
  env: Env,
) {
  if (!signature) {
    throw new Error("Missing Stripe signature");
  }

  const stripe = getStripe(env);

  return stripe.webhooks.constructEvent(
    rawBody,
    signature,
    env.STRIPE_WEBHOOK_SECRET ?? "",
  );
}

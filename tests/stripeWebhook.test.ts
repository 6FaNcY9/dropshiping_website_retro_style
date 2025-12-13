import { Prisma } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST as stripeWebhook } from "../app/api/webhooks/stripe/route";
import { clearEnvCache } from "@/lib/env";

const constructStripeEvent = vi.hoisted(() => vi.fn());

vi.mock("@/lib/stripe/webhook", async () => {
  const actual = await vi.importActual<typeof import("@/lib/stripe/webhook")>(
    "@/lib/stripe/webhook",
  );
  return {
    ...actual,
    constructStripeEvent,
  };
});

type OrderRecord = {
  id: string;
  status: string;
  currency: string;
  totalAmount: Prisma.Decimal;
  stripeSessionId: string | null;
};

type PaymentRecord = {
  orderId: string;
  status: string;
  provider: string;
  providerPaymentId: string | null;
  amount: Prisma.Decimal;
  currency: string;
};

let orders: Record<string, OrderRecord>;
let payments: Record<string, PaymentRecord>;
let processedEvents: Set<string>;

const prisma = {
  order: {
    findUnique: vi.fn(async ({ where }: any) => {
      if (where.id) return orders[where.id] ?? null;
      if (where.stripeSessionId)
        return (
          Object.values(orders).find(
            (order) => order.stripeSessionId === where.stripeSessionId,
          ) ?? null
        );
      return null;
    }),
    findFirst: vi.fn(async ({ where }: any) => {
      if (where.stripeSessionId)
        return (
          Object.values(orders).find(
            (order) => order.stripeSessionId === where.stripeSessionId,
          ) ?? null
        );
      return null;
    }),
    update: vi.fn(async ({ where, data }: any) => {
      const existing = orders[where.id];
      orders[where.id] = { ...existing, ...data };
      return orders[where.id];
    }),
  },
  payment: {
    upsert: vi.fn(async ({ where, create, update }: any) => {
      const existing = payments[where.orderId];
      if (existing) {
        payments[where.orderId] = { ...existing, ...update };
        return payments[where.orderId];
      }
      payments[where.orderId] = { ...create } as PaymentRecord;
      return payments[where.orderId];
    }),
    updateMany: vi.fn(async ({ where, data }: any) => {
      Object.values(payments)
        .filter((payment) => payment.orderId === where.orderId)
        .forEach((payment) => {
          payment.status = data.status;
        });
      return { count: 1 };
    }),
  },
  processedEvent: {
    findUnique: vi.fn(async ({ where }: any) =>
      processedEvents.has(where.eventId)
        ? { id: "pe_1", provider: "stripe", eventId: where.eventId }
        : null,
    ),
    create: vi.fn(async ({ data }: any) => {
      processedEvents.add(data.eventId);
      return { ...data, id: data.eventId };
    }),
  },
  $transaction: vi.fn(async (callback: any) => callback(prisma)),
};

vi.mock("@/lib/db", () => ({
  resolvePrisma: () => ({ ok: true, prisma }),
}));

function resetEnv(overrides: Record<string, string | undefined> = {}) {
  process.env = {
    ...process.env,
    STRIPE_SECRET_KEY: "sk_test_123",
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: "pk_test_123",
    STRIPE_WEBHOOK_SECRET: "whsec_test",
    STRIPE_SUCCESS_URL: "https://example.com/success",
    STRIPE_CANCEL_URL: "https://example.com/cancel",
    DATABASE_URL: "postgres://example",
    DIRECT_URL: "postgres://example",
    ...overrides,
  };
  clearEnvCache();
}

function resetData() {
  orders = {
    order_1: {
      id: "order_1",
      status: "PENDING",
      currency: "usd",
      totalAmount: new Prisma.Decimal(10),
      stripeSessionId: null,
    },
  };
  payments = {};
  processedEvents = new Set();
  constructStripeEvent.mockReset();
  prisma.$transaction.mockClear();
  prisma.order.update.mockClear();
  prisma.payment.upsert.mockClear();
  prisma.payment.updateMany.mockClear();
  prisma.processedEvent.create.mockClear();
  prisma.processedEvent.findUnique.mockClear();
}

describe("stripe webhook", () => {
  beforeEach(() => {
    resetEnv();
    resetData();
  });

  it("rejects invalid signatures", async () => {
    constructStripeEvent.mockRejectedValueOnce(new Error("bad signature"));

    const response = await stripeWebhook(
      new Request("http://localhost/api/webhooks/stripe", {
        method: "POST",
        headers: { "stripe-signature": "sig" },
        body: "{}",
      }),
    );

    expect(response.status).toBe(400);
    expect(prisma.processedEvent.create).not.toHaveBeenCalled();
  });

  it("skips already processed events", async () => {
    processedEvents.add("evt_processed");
    constructStripeEvent.mockResolvedValueOnce({
      id: "evt_processed",
      type: "checkout.session.completed",
      data: { object: { id: "cs_test" } },
    } as any);

    const response = await stripeWebhook(
      new Request("http://localhost/api/webhooks/stripe", {
        method: "POST",
        headers: { "stripe-signature": "sig" },
        body: "{}",
      }),
    );

    expect(response.status).toBe(200);
    expect(prisma.order.update).not.toHaveBeenCalled();
  });

  it("marks checkout session orders as paid", async () => {
    constructStripeEvent.mockResolvedValueOnce({
      id: "evt_checkout",
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_test_1",
          amount_total: 1500,
          currency: "usd",
          metadata: { orderId: "order_1" },
          payment_intent: "pi_test_1",
        },
      },
    } as any);

    const response = await stripeWebhook(
      new Request("http://localhost/api/webhooks/stripe", {
        method: "POST",
        headers: { "stripe-signature": "sig" },
        body: "{}",
      }),
    );

    expect(response.status).toBe(200);
    expect(orders.order_1.status).toBe("PAID");
    expect(orders.order_1.stripeSessionId).toBe("cs_test_1");
    expect(payments.order_1.amount.toString()).toBe("15");
    expect(processedEvents.has("evt_checkout")).toBe(true);
  });
});

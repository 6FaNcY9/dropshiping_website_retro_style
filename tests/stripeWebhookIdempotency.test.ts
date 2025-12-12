import { describe, expect, it, vi } from "vitest";
import { PrismaIdempotencyStore } from "@/lib/stripe/webhook";

function createMockPrisma(processedIds: Set<string>) {
  return {
    processedEvent: {
      findUnique: vi.fn(async ({ where: { eventId } }: any) =>
        processedIds.has(eventId)
          ? { id: "1", eventId, provider: "stripe" }
          : null,
      ),
      create: vi.fn(async ({ data: { eventId } }: any) => {
        if (processedIds.has(eventId)) {
          throw new Error("Unique constraint failed");
        }
        processedIds.add(eventId);
        return { id: "1", eventId, provider: "stripe" };
      }),
    },
  } as any;
}

describe("PrismaIdempotencyStore", () => {
  it("marks and detects processed events", async () => {
    const processedIds = new Set<string>();
    const store = new PrismaIdempotencyStore(createMockPrisma(processedIds));

    expect(await store.hasProcessed("evt_1")).toBe(false);
    await store.markProcessed("evt_1");
    expect(await store.hasProcessed("evt_1")).toBe(true);
  });

  it("throws when marking the same event twice", async () => {
    const processedIds = new Set<string>();
    const store = new PrismaIdempotencyStore(createMockPrisma(processedIds));

    await store.markProcessed("evt_dup");
    await expect(store.markProcessed("evt_dup")).rejects.toThrow();
  });
});

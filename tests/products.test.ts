import { beforeEach, describe, expect, it, vi } from "vitest";
import { demoProducts, getProductById, listProducts } from "@/lib/products";

const mockPrisma = vi.hoisted(() => ({
  product: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    count: vi.fn(),
  },
}));

const resolvePrisma = vi.hoisted(() =>
  vi.fn<
    () =>
      | { ok: true; prisma: typeof mockPrisma }
      | { ok: false; missing: string[] }
  >(() => ({ ok: true as const, prisma: mockPrisma })),
);

vi.mock("@/lib/db", () => ({ resolvePrisma }));

describe("product helpers", () => {
  beforeEach(() => {
    vi.resetModules();
    mockPrisma.product.findMany.mockResolvedValue([]);
    mockPrisma.product.findUnique.mockResolvedValue(null);
    mockPrisma.product.count.mockResolvedValue(0);
    resolvePrisma.mockReturnValue({ ok: true, prisma: mockPrisma });
  });

  it("returns database products when present", async () => {
    const dbProducts = [
      {
        id: "p1",
        name: "DB Product",
        description: "From db",
        price: 10,
        createdAt: new Date(),
      },
    ];
    mockPrisma.product.findMany.mockResolvedValueOnce(dbProducts);

    const result = await listProducts();

    expect(result.source).toBe("db");
    expect(result.products).toEqual(dbProducts);
    expect(result.missingEnv).toEqual([]);
  });

  it("falls back to demo products when the database is empty", async () => {
    mockPrisma.product.findMany.mockResolvedValueOnce([]);

    const result = await listProducts();

    expect(result.source).toBe("demo");
    expect(result.products).toEqual(demoProducts);
  });

  it("returns demo detail when database is empty and ids match", async () => {
    mockPrisma.product.findUnique.mockResolvedValueOnce(null);
    mockPrisma.product.count.mockResolvedValueOnce(0);

    const result = await getProductById(demoProducts[0].id);

    expect(result.source).toBe("demo");
    expect(result.product?.id).toBe(demoProducts[0].id);
  });

  it("surfaces missing env when prisma is unavailable", async () => {
    resolvePrisma.mockReturnValueOnce({ ok: false, missing: ["DATABASE_URL"] });

    const result = await listProducts();

    expect(result.missingEnv).toEqual(["DATABASE_URL"]);
    expect(result.products).toEqual([]);
    expect(result.source).toBe("missing");
  });
});

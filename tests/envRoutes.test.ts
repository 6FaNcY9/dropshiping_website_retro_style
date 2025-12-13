import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { POST as checkoutCreate } from "../app/api/checkout/create/route";
import { POST as login } from "../app/api/auth/login/route";
import { GET as productsIndex } from "../app/api/products/route";
import { GET as productDetail } from "../app/api/products/[id]/route";
import { vi } from "vitest";
import { clearEnvCache } from "@/lib/env";

const originalEnv = { ...process.env, NODE_ENV: process.env.NODE_ENV ?? "test" };

function resetEnv(overrides: Record<string, string | undefined> = {}) {
  process.env = { ...originalEnv, NODE_ENV: "test", ...overrides };
  clearEnvCache();
}

describe("runtime env guarded routes", () => {
  beforeEach(() => {
    resetEnv();
    vi.restoreAllMocks();
  });

  afterAll(() => {
    resetEnv();
  });

  it("returns 503 when Stripe checkout env is missing", async () => {
    resetEnv({
      DATABASE_URL: "postgres://example",
      DIRECT_URL: "postgres://example",
      STRIPE_SECRET_KEY: undefined,
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: undefined,
      STRIPE_WEBHOOK_SECRET: undefined,
      STRIPE_SUCCESS_URL: undefined,
      STRIPE_CANCEL_URL: undefined,
    });

    const response = await checkoutCreate(
      new Request("http://localhost/api/checkout/create", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          items: [{ productId: "prod_1", quantity: 1 }],
          turnstileToken: "token",
          customerEmail: "user@example.com",
        }),
      }),
    );

    expect(response.status).toBe(503);
    const body = await response.json();
    expect(body.required).toEqual(
      expect.arrayContaining([
        "STRIPE_SECRET_KEY",
        "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
        "STRIPE_WEBHOOK_SECRET",
        "STRIPE_SUCCESS_URL",
        "STRIPE_CANCEL_URL",
      ]),
    );
  });

  it("returns 503 when database env is missing for auth", async () => {
    resetEnv({
      DATABASE_URL: undefined,
      DIRECT_URL: undefined,
    });

    const response = await login(
      new Request("http://localhost/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: "user@example.com",
          password: "password",
        }),
      }),
    );

    expect(response.status).toBe(503);
    const body = await response.json();
    expect(body.required).toEqual(expect.arrayContaining(["DATABASE_URL"]));
  });

  it("returns 503 when database env is missing for product listing", async () => {
    resetEnv({ DATABASE_URL: undefined, DIRECT_URL: undefined });

    const response = await productsIndex();

    expect(response.status).toBe(503);
    const body = await response.json();
    expect(body.required).toEqual(expect.arrayContaining(["DATABASE_URL"]));
  });

  it("returns 503 when database env is missing for product detail", async () => {
    resetEnv({ DATABASE_URL: undefined, DIRECT_URL: undefined });

    const response = await productDetail(new Request("http://localhost/api/products/abc"), {
      params: { id: "abc" },
    });

    expect(response.status).toBe(503);
    const body = await response.json();
    expect(body.required).toEqual(expect.arrayContaining(["DATABASE_URL"]));
  });

  it("returns 503 when R2 env is missing for uploads", async () => {
    resetEnv({ R2_ENDPOINT: undefined });

    const { POST: presignUpload } = await import("../app/api/uploads/presign/route");

    const response = await presignUpload(
      new Request("http://localhost/api/uploads/presign", {
        method: "POST",
        headers: { "content-type": "application/json", "x-admin-token": "token" },
        body: JSON.stringify({ filename: "test.jpg", contentType: "image/jpeg" }),
      }),
    );

    expect(response.status).toBe(503);
    const body = await response.json();
    expect(body.required).toEqual(
      expect.arrayContaining(["R2_ENDPOINT", "R2_BUCKET", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_PUBLIC_BASE_URL"]),
    );
  });

  it("requires admin token header for uploads", async () => {
    vi.resetModules();
    vi.doMock("@/lib/auth/session", () => ({
      getCurrentUser: vi.fn().mockResolvedValue({ id: "admin", role: "ADMIN" }),
    }));

    resetEnv({
      DATABASE_URL: "postgres://example",
      DIRECT_URL: "postgres://example",
      R2_ENDPOINT: "https://r2.example",
      R2_BUCKET: "bucket",
      R2_ACCESS_KEY_ID: "key",
      R2_SECRET_ACCESS_KEY: "secret",
      R2_PUBLIC_BASE_URL: "https://cdn.example",
      ADMIN_ACCESS_TOKEN: "supersecret",
    });

    const { POST: presignUpload } = await import("../app/api/uploads/presign/route");

    const response = await presignUpload(
      new Request("http://localhost/api/uploads/presign", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ filename: "test.jpg", contentType: "image/jpeg" }),
      }),
    );

    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body.error).toMatch(/Admin token/);
  });
});

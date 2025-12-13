import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST as login } from "../app/api/auth/login/route";
import { POST as checkoutCreate } from "../app/api/checkout/create/route";
import { clearEnvCache } from "@/lib/env";
import { resetTurnstileWarningState } from "@/lib/security/turnstile";

const originalEnv = {
  ...process.env,
  NODE_ENV: process.env.NODE_ENV ?? "test",
} as Record<string, string | undefined>;

function resetEnv(overrides: Record<string, string | undefined> = {}) {
  process.env = { ...originalEnv, NODE_ENV: "test", ...overrides };
  clearEnvCache();
  resetTurnstileWarningState();
}

describe("turnstile protected routes", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    resetEnv({
      TURNSTILE_SECRET_KEY: "secret-key",
      NEXT_PUBLIC_TURNSTILE_SITE_KEY: "public-key",
      DATABASE_URL: "postgres://example",
      DIRECT_URL: "postgres://example",
      STRIPE_SECRET_KEY: "sk_test",
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: "pk_test",
      STRIPE_WEBHOOK_SECRET: "whsec_123",
      STRIPE_SUCCESS_URL: "https://example.com/success",
      STRIPE_CANCEL_URL: "https://example.com/cancel",
    });
  });

  afterAll(() => {
    resetEnv();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("rejects login when Turnstile verification fails", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: false }),
    });
    vi.stubGlobal("fetch", fetchMock as unknown as typeof fetch);

    const response = await login(
      new Request("http://localhost/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: "user@example.com", password: "pw" }),
      }),
    );

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toMatch(/Turnstile verification failed/);
  });

  it("rejects checkout creation when Turnstile verification fails", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: false }),
    });
    vi.stubGlobal("fetch", fetchMock as unknown as typeof fetch);

    const response = await checkoutCreate(
      new Request("http://localhost/api/checkout/create", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          items: [{ productId: "prod_1", quantity: 1 }],
          customerEmail: "user@example.com",
        }),
      }),
    );

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toMatch(/Turnstile verification failed/);
  });
});

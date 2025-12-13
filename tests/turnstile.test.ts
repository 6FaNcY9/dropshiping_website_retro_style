import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { clearEnvCache } from "@/lib/env";
import { resetTurnstileWarningState, verifyTurnstile } from "@/lib/security/turnstile";
import { mergeTestEnv } from "./setup-env";

function resetEnv(overrides: Record<string, string | undefined> = {}) {
  mergeTestEnv(overrides);
  clearEnvCache();
  resetTurnstileWarningState();
}

describe("verifyTurnstile", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    resetEnv();
  });

  afterAll(() => {
    resetEnv();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("verifies tokens with configured secrets", async () => {
    resetEnv({
      TURNSTILE_SECRET_KEY: "secret-key",
      NEXT_PUBLIC_TURNSTILE_SITE_KEY: "public-key",
    });

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });
    vi.stubGlobal("fetch", fetchMock as unknown as typeof fetch);

    const result = await verifyTurnstile("token-123", "1.1.1.1");

    expect(result).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain("turnstile");
    const body = options.body as URLSearchParams;
    expect(body.get("secret")).toBe("secret-key");
    expect(body.get("response")).toBe("token-123");
    expect(body.get("remoteip")).toBe("1.1.1.1");
  });

  it("warns and bypasses when keys are missing", async () => {
    resetEnv({
      TURNSTILE_SECRET_KEY: undefined,
      NEXT_PUBLIC_TURNSTILE_SITE_KEY: undefined,
    });

    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock as unknown as typeof fetch);

    const result = await verifyTurnstile("token-123", "1.1.1.1");

    expect(result).toBe(true);
    expect(warnSpy).toHaveBeenCalledWith(
      "Turnstile is not configured; verification is bypassed until keys are set.",
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("logs when bypass is enabled", async () => {
    resetEnv({ TURNSTILE_BYPASS: "true" });

    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock as unknown as typeof fetch);

    const result = await verifyTurnstile("token-123");

    expect(result).toBe(true);
    expect(warnSpy).toHaveBeenCalledWith(
      "TURNSTILE_BYPASS=true detected; verification is skipped. Disable this in production.",
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

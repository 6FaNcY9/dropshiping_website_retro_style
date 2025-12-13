import { getEnv } from "../env";

type TurnstileResponse = {
  success: boolean;
  "error-codes"?: string[];
};

let warnedTurnstileMissing = false;
let warnedTurnstileBypass = false;

export async function verifyTurnstile(
  token: string | undefined,
  remoteip?: string | null,
) {
  const env = getEnv();

  if (env.TURNSTILE_BYPASS) {
    if (!warnedTurnstileBypass) {
      console.warn(
        "TURNSTILE_BYPASS=true detected; verification is skipped. Disable this in production.",
      );
      warnedTurnstileBypass = true;
    }
    return true;
  }
  if (!env.HAS_TURNSTILE) {
    if (!warnedTurnstileMissing) {
      console.warn(
        "Turnstile is not configured; verification is bypassed until keys are set.",
      );
      warnedTurnstileMissing = true;
    }
    return true;
  }
  if (!token) return false;

  const body = new URLSearchParams();
  body.append("secret", env.TURNSTILE_SECRET_KEY ?? "");
  body.append("response", token);
  if (remoteip) {
    body.append("remoteip", remoteip);
  }

  const res = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      body,
    },
  );

  if (!res.ok) return false;

  const data = (await res.json()) as TurnstileResponse;
  return data.success;
}

export function resetTurnstileWarningState() {
  warnedTurnstileMissing = false;
  warnedTurnstileBypass = false;
}

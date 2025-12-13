import { NextResponse } from "next/server";
import { deleteSession } from "@/lib/auth/session";
import { requireEnv } from "@/lib/env";

export async function POST() {
  const envCheck = requireEnv(["DATABASE_URL"]);
  if (!envCheck.ok) {
    return NextResponse.json(
      { error: "Database not configured", required: envCheck.missing },
      { status: 503 },
    );
  }

  await deleteSession();
  return NextResponse.json({ ok: true });
}

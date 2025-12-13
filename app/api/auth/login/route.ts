import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { createSession } from "@/lib/auth/session";
import { resolvePrisma } from "@/lib/db";
import { requireEnv } from "@/lib/env";
import { verifyTurnstile } from "@/lib/security/turnstile";

export async function POST(request: Request) {
  const envCheck = requireEnv(["DATABASE_URL"]);
  if (!envCheck.ok) {
    return NextResponse.json(
      { error: "Database not configured", required: envCheck.missing },
      { status: 503 },
    );
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { email, password, turnstileToken } = body as {
    email?: string;
    password?: string;
    turnstileToken?: string;
  };

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 },
    );
  }

  if (
    !(await verifyTurnstile(
      turnstileToken,
      request.headers.get("x-forwarded-for"),
    ))
  ) {
    return NextResponse.json(
      { error: "Turnstile verification failed" },
      { status: 400 },
    );
  }

  const prismaResult = resolvePrisma();
  if (!prismaResult.ok) {
    return NextResponse.json(
      { error: "Database not configured", required: prismaResult.missing },
      { status: 503 },
    );
  }
  const prisma = prismaResult.prisma;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  await createSession(user.id);

  return NextResponse.json({
    user: { id: user.id, email: user.email, role: user.role },
  });
}

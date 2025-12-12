import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { createSession } from "@/lib/auth/session";
import { getPrisma } from "@/lib/db";
import { verifyTurnstile } from "@/lib/security/turnstile";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { email, password, name, turnstileToken } = body as {
    email?: string;
    password?: string;
    name?: string;
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

  let prisma;
  try {
    prisma = getPrisma();
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: "Database not configured",
        required: ["DATABASE_URL"],
      },
      { status: 503 },
    );
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      passwordHash,
    },
  });

  await createSession(user.id);

  return NextResponse.json({
    user: { id: user.id, email: user.email, role: user.role },
  });
}

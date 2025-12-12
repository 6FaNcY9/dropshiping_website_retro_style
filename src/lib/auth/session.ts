import crypto from "crypto";
import { cookies } from "next/headers";
import { prisma } from "../prisma";

const SESSION_COOKIE = "session_token";
const SESSION_TTL_DAYS = 7;

export async function createSession(userId: string) {
  const expires = new Date();
  expires.setDate(expires.getDate() + SESSION_TTL_DAYS);

  const session = await prisma.session.create({
    data: {
      sessionToken: crypto.randomUUID(),
      userId,
      expires,
    },
  });

  cookies().set(SESSION_COOKIE, session.sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    expires,
  });

  return session;
}

export async function deleteSession() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return;
  await prisma.session.deleteMany({ where: { sessionToken: token } });
  cookies().delete(SESSION_COOKIE);
}

export async function getCurrentUser() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = await prisma.session.findUnique({
    where: { sessionToken: token },
    include: { user: true },
  });
  if (!session || session.expires < new Date()) {
    cookies().delete(SESSION_COOKIE);
    return null;
  }
  return session.user;
}

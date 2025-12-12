import { NextResponse } from "next/server";
import { z } from "zod";
import { createPresignedUpload } from "@/lib/storage/r2";
import { getCurrentUser } from "@/lib/auth/session";
import { env } from "@/lib/env";

const bodySchema = z.object({
  filename: z.string().min(1),
  contentType: z.string().min(1),
});

function isAuthorizedAdmin(
  userRole?: string | null,
  tokenHeader?: string | null,
) {
  if (userRole === "ADMIN") return true;
  if (
    env.ADMIN_ACCESS_TOKEN &&
    tokenHeader &&
    tokenHeader === env.ADMIN_ACCESS_TOKEN
  )
    return true;
  return false;
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  const tokenHeader = request.headers.get("x-admin-token");

  const raw = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (!isAuthorizedAdmin(user?.role, tokenHeader)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const upload = await createPresignedUpload(parsed.data);
  return NextResponse.json(upload);
}

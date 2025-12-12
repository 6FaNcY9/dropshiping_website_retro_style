import { NextResponse } from "next/server";
import { z } from "zod";
import { createPresignedUpload } from "@/lib/storage/r2";
import { getCurrentUser } from "@/lib/auth/session";
import { getEnv } from "@/lib/env";

const bodySchema = z.object({
  filename: z.string().min(1),
  contentType: z.string().min(1),
});

function isAuthorizedAdmin(
  userRole: string | null | undefined,
  tokenHeader: string | null,
  adminToken: string | undefined,
) {
  if (userRole === "ADMIN") return true;
  if (adminToken && tokenHeader && tokenHeader === adminToken) return true;
  return false;
}

export async function POST(request: Request) {
  const env = getEnv();
  if (!env.HAS_R2) {
    return NextResponse.json(
      {
        error: "R2 not configured",
        required: [
          "R2_ENDPOINT",
          "R2_BUCKET",
          "R2_ACCESS_KEY_ID",
          "R2_SECRET_ACCESS_KEY",
          "R2_PUBLIC_BASE_URL",
        ],
      },
      { status: 503 },
    );
  }

  const user = await getCurrentUser();
  const tokenHeader = request.headers.get("x-admin-token");

  const raw = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (!isAuthorizedAdmin(user?.role, tokenHeader, env.ADMIN_ACCESS_TOKEN)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const upload = await createPresignedUpload(parsed.data);
  return NextResponse.json(upload);
}

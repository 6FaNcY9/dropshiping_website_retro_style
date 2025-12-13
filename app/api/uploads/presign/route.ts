import { NextResponse } from "next/server";
import { z } from "zod";
import {
  createPresignedDownload,
  createPresignedUpload,
} from "@/lib/storage/r2";
import { getCurrentUser } from "@/lib/auth/session";
import { requireEnv } from "@/lib/env";

const bodySchema = z.object({
  filename: z.string().min(1),
  contentType: z.string().min(1),
  operation: z.enum(["put", "get"]).optional(),
  key: z.string().min(1).optional(),
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
  const r2EnvCheck = requireEnv([
    "R2_ENDPOINT",
    "R2_BUCKET",
    "R2_ACCESS_KEY_ID",
    "R2_SECRET_ACCESS_KEY",
    "R2_PUBLIC_BASE_URL",
    "ADMIN_ACCESS_TOKEN",
  ]);
  if (!r2EnvCheck.ok) {
    return NextResponse.json(
      {
        error: "R2 not configured",
        required: r2EnvCheck.missing,
      },
      { status: 503 },
    );
  }

  const dbEnvCheck = requireEnv(["DATABASE_URL"]);
  if (!dbEnvCheck.ok) {
    return NextResponse.json(
      { error: "Database not configured", required: dbEnvCheck.missing },
      { status: 503 },
    );
  }

  const env = r2EnvCheck.env;

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

  if (!tokenHeader || tokenHeader !== env.ADMIN_ACCESS_TOKEN) {
    return NextResponse.json(
      { error: "Admin token required" },
      { status: 401 },
    );
  }

  const { operation = "put", key } = parsed.data;

  if (operation === "get") {
    if (!key) {
      return NextResponse.json(
        { error: "Key is required for GET presign" },
        { status: 400 },
      );
    }

    const download = await createPresignedDownload(env, key);
    return NextResponse.json(download);
  }

  const upload = await createPresignedUpload(env, parsed.data);
  return NextResponse.json(upload);
}

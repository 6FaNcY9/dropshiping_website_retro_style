import { NextResponse } from "next/server";
import { resolvePrisma } from "@/lib/db";

export async function GET() {
  const prismaResult = resolvePrisma();
  if (!prismaResult.ok) {
    return NextResponse.json(
      { error: "Database not configured", required: prismaResult.missing },
      { status: 503 },
    );
  }

  const products = await prismaResult.prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ products });
}

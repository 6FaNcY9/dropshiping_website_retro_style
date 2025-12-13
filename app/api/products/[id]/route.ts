import { NextResponse } from "next/server";
import { resolvePrisma } from "@/lib/db";

interface Params {
  params: { id: string };
}

export async function GET(_request: Request, { params }: Params) {
  const prismaResult = resolvePrisma();
  if (!prismaResult.ok) {
    return NextResponse.json(
      { error: "Database not configured", required: prismaResult.missing },
      { status: 503 },
    );
  }

  const product = await prismaResult.prisma.product.findUnique({
    where: { id: params.id },
  });

  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ product });
}

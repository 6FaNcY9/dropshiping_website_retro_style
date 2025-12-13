import { NextResponse } from "next/server";
import { getProductById } from "@/lib/products";

interface Params {
  params: { id: string };
}

export async function GET(_request: Request, { params }: Params) {
  const { product, missingEnv, source } = await getProductById(params.id);

  if (missingEnv.length) {
    return NextResponse.json(
      { error: "Database not configured", required: missingEnv },
      { status: 503 },
    );
  }

  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ product, source });
}

import { NextResponse } from "next/server";
import { listProducts } from "@/lib/products";

export async function GET() {
  const { products, missingEnv, source } = await listProducts();

  if (missingEnv.length) {
    return NextResponse.json(
      { error: "Database not configured", required: missingEnv },
      { status: 503 },
    );
  }

  return NextResponse.json({ products, source });
}

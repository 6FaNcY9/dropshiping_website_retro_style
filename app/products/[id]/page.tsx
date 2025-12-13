import type { Prisma } from "@prisma/client";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getProductById } from "@/lib/products";

export const revalidate = 0;

function formatPrice(value: number | string | Prisma.Decimal) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value));
}

interface Params {
  params: { id: string };
}

export default async function ProductDetailPage({ params }: Params) {
  const { product, missingEnv, source } = await getProductById(params.id);

  if (missingEnv.length) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
        Add DATABASE_URL to load product details.
      </div>
    );
  }

  if (!product) {
    return notFound();
  }

  return (
    <div className="grid gap-8 rounded-3xl border border-slate-200 bg-white p-10 shadow-sm md:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-4">
        <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase text-brand-700">
          Product detail
        </span>
        <h1 className="text-3xl font-bold text-slate-900">{product.name}</h1>
        <p className="text-slate-700 whitespace-pre-line">
          {product.description}
        </p>
      </div>
      <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-6">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold text-slate-800">Price</p>
          <p className="text-2xl font-bold text-slate-900">
            {formatPrice(Number(product.price))}
          </p>
        </div>
        {source === "demo" ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Showing demo product data. Seed your database to replace this
            product.
          </div>
        ) : null}
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={1200}
            height={800}
            sizes="(min-width: 768px) 50vw, 100vw"
            className="h-auto w-full rounded-xl border border-slate-200 object-cover"
          />
        ) : (
          <div className="h-48 w-full rounded-xl border border-dashed border-slate-200 bg-white/50" />
        )}
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          Orders and payments are persisted via Prisma during checkout and
          Stripe webhook processing.
        </div>
      </div>
    </div>
  );
}

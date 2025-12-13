import type { Prisma } from "@prisma/client";
import Link from "next/link";
import { listProducts } from "@/lib/products";

export const revalidate = 0;

function formatPrice(value: number | string | Prisma.Decimal) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value));
}

export default async function ProductsPage() {
  const { products, missingEnv, source } = await listProducts();

  if (missingEnv.length) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900">Catalog</h1>
          <p className="text-slate-600">
            Browse products synced from your database. Connect your Postgres
            database to populate this list.
          </p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
          Add DATABASE_URL to enable the catalog.
        </div>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900">Catalog</h1>
          <p className="text-slate-600">
            Browse products synced from your database. Connect your Postgres
            database to populate this list.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-slate-700">
          No products found. Seed your database to get started.
        </div>
      </div>
    );
  }

  const isDemo = source === "demo";

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">Catalog</h1>
        <p className="text-slate-600">
          Live products rendered directly from the Product table.
        </p>
      </div>
      {isDemo ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
          Showing demo products. Seed your database to replace these with your
          own catalog.
        </div>
      ) : null}
      <div className="grid gap-6 md:grid-cols-3">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="space-y-2">
              <p className="text-sm font-semibold text-brand-800">
                {product.name}
              </p>
              <p className="text-sm text-slate-600 line-clamp-3">
                {product.description}
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-lg font-bold text-slate-900">
                {formatPrice(Number(product.price))}
              </p>
              <span className="text-xs font-semibold uppercase tracking-wide text-brand-700">
                View details
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

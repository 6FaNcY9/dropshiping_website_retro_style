import type { Prisma } from "@prisma/client";
import Link from "next/link";
import { Zap, Package, Truck } from "lucide-react";
import { listProducts, demoProducts } from "@/lib/products";
import { AddToCartButton } from "./AddToCartButton";

export const revalidate = 0;

function formatPrice(value: number | string | Prisma.Decimal) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value));
}

export default async function ProductsPage() {
  const { products, missingEnv, source } = await listProducts();

  // Use demo products if database not connected or no products
  const displayProducts = products.length > 0 ? products : demoProducts;
  const isDemo = source !== "db" || !products.length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b-2 border-retro-cyan pb-6">
        <div className="flex items-center gap-4">
          <Zap className="h-10 w-10 text-retro-cyan" />
          <h1 className="font-display text-4xl font-bold tracking-wider text-retro-cyan text-neon-sm">
            SHOP
          </h1>
        </div>
        <p className="mt-2 font-retro text-xl text-cream/70">
          Browse our curated collection of retro gadgets and vintage tech
        </p>
      </div>

      {/* Info badges */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2 border-2 border-neon-green bg-dark-800 px-4 py-2">
          <Package className="h-5 w-5 text-neon-green" />
          <span className="font-retro text-lg text-neon-green">FREE SHIPPING $50+</span>
        </div>
        <div className="flex items-center gap-2 border-2 border-neon-pink bg-dark-800 px-4 py-2">
          <Truck className="h-5 w-5 text-neon-pink" />
          <span className="font-retro text-lg text-neon-pink">2-7 DAY DELIVERY</span>
        </div>
      </div>

      {isDemo && (
        <div className="border-2 border-retro-orange bg-dark-800 p-4">
          <p className="font-retro text-lg text-retro-orange">
            📦 DEMO MODE - Showing sample products. Connect database for live catalog.
          </p>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {displayProducts.map((product) => (
          <div
            key={product.id}
            className="group border-2 border-dark-600 bg-dark-800 transition-all duration-300 hover:border-retro-cyan hover:shadow-[0_0_20px_rgba(0,255,255,0.2)]"
          >
            {/* Product Image */}
            <div className="relative aspect-square overflow-hidden border-b-2 border-dark-600 bg-dark-700">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Package className="h-16 w-16 text-dark-500" />
                </div>
              )}
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-dark-900/90 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              
              {/* Quick view link */}
              <Link
                href={`/products/${product.id}`}
                className="absolute bottom-4 left-4 right-4 border-2 border-retro-cyan bg-dark-900/90 py-2 text-center font-retro text-lg text-retro-cyan opacity-0 transition-all hover:bg-retro-cyan hover:text-dark-900 group-hover:opacity-100"
              >
                VIEW DETAILS
              </Link>
            </div>

            {/* Product Info */}
            <div className="p-4">
              <Link href={`/products/${product.id}`}>
                <h3 className="font-retro text-xl text-cream transition-colors hover:text-retro-cyan line-clamp-2">
                  {product.name}
                </h3>
              </Link>
              <p className="mt-2 font-retro text-base text-cream/60 line-clamp-2">
                {product.description}
              </p>
              
              <div className="mt-4 flex items-center justify-between">
                <p className="font-display text-2xl font-bold text-neon-green text-neon-sm">
                  {formatPrice(Number(product.price))}
                </p>
                <AddToCartButton
                  product={{
                    id: product.id,
                    name: product.name,
                    price: Number(product.price),
                    imageUrl: product.imageUrl,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

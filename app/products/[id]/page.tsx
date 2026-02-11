import type { Prisma } from "@prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Package,
  Truck,
  Shield,
  RefreshCw,
  Zap,
  Star,
} from "lucide-react";
import { getProductById } from "@/lib/products";
import { ProductActions } from "./ProductActions";

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
      <div className="border-2 border-retro-orange bg-dark-800 p-6">
        <p className="font-retro text-xl text-retro-orange">
          ⚠ DATABASE NOT CONNECTED - Add DATABASE_URL to load product details.
        </p>
      </div>
    );
  }

  if (!product) {
    return notFound();
  }

  return (
    <div className="space-y-8">
      {/* Back link */}
      <Link
        href="/products"
        className="inline-flex items-center gap-2 font-retro text-lg text-cream/70 transition-colors hover:text-retro-cyan"
      >
        <ArrowLeft className="h-5 w-5" />
        BACK TO SHOP
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="relative aspect-square border-2 border-retro-cyan bg-dark-800 overflow-hidden">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Package className="h-24 w-24 text-dark-500" />
              </div>
            )}
            {/* Corner decorations */}
            <div className="absolute left-0 top-0 h-4 w-4 border-l-2 border-t-2 border-neon-pink" />
            <div className="absolute right-0 top-0 h-4 w-4 border-r-2 border-t-2 border-neon-pink" />
            <div className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-neon-pink" />
            <div className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-neon-pink" />
          </div>

          {/* Badges */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 border-2 border-dark-600 bg-dark-800 p-3">
              <Truck className="h-6 w-6 text-neon-green" />
              <div>
                <p className="font-retro text-sm text-neon-green">FREE SHIPPING</p>
                <p className="font-retro text-xs text-cream/60">Orders $50+</p>
              </div>
            </div>
            <div className="flex items-center gap-3 border-2 border-dark-600 bg-dark-800 p-3">
              <RefreshCw className="h-6 w-6 text-neon-blue" />
              <div>
                <p className="font-retro text-sm text-neon-blue">30 DAY RETURNS</p>
                <p className="font-retro text-xs text-cream/60">Easy refunds</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {source === "demo" && (
            <div className="border-2 border-retro-orange bg-dark-800 p-3">
              <p className="font-retro text-sm text-retro-orange">
                📦 DEMO PRODUCT - Connect database for live data
              </p>
            </div>
          )}

          {/* Category badge */}
          <div className="flex items-center gap-2">
            <span className="border-2 border-retro-cyan bg-dark-800 px-3 py-1 font-pixel text-xs text-retro-cyan">
              VINTAGE TECH
            </span>
            <div className="flex items-center gap-1 text-retro-yellow">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
              <span className="ml-2 font-retro text-sm text-cream/60">(42 reviews)</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="font-display text-3xl font-bold tracking-wider text-cream lg:text-4xl">
            {product.name}
          </h1>

          {/* Price */}
          <div className="flex items-baseline gap-4">
            <span className="font-display text-4xl font-bold text-neon-green text-neon-sm">
              {formatPrice(Number(product.price))}
            </span>
            <span className="font-retro text-lg text-cream/40 line-through">
              {formatPrice(Number(product.price) * 1.3)}
            </span>
            <span className="border-2 border-neon-pink bg-neon-pink px-2 py-1 font-pixel text-xs text-dark-900">
              SAVE 23%
            </span>
          </div>

          {/* Description */}
          <div className="border-l-2 border-retro-cyan pl-4">
            <p className="font-retro text-xl leading-relaxed text-cream/80 whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Stock indicator */}
          <div className="flex items-center gap-3">
            <Zap className="h-5 w-5 text-neon-green animate-pulse" />
            <span className="font-retro text-lg text-neon-green">IN STOCK - Ships within 24h</span>
          </div>

          {/* Add to cart actions */}
          <ProductActions
            product={{
              id: product.id,
              name: product.name,
              price: Number(product.price),
              imageUrl: product.imageUrl,
            }}
          />

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-4 border-t-2 border-dark-600 pt-6">
            <div className="text-center">
              <Shield className="mx-auto h-8 w-8 text-retro-cyan" />
              <p className="mt-2 font-retro text-sm text-cream/60">SECURE CHECKOUT</p>
            </div>
            <div className="text-center">
              <Package className="mx-auto h-8 w-8 text-neon-pink" />
              <p className="mt-2 font-retro text-sm text-cream/60">QUALITY GUARANTEE</p>
            </div>
            <div className="text-center">
              <Truck className="mx-auto h-8 w-8 text-neon-green" />
              <p className="mt-2 font-retro text-sm text-cream/60">FAST SHIPPING</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

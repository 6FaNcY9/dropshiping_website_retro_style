import type { Prisma } from "@prisma/client";
import Link from "next/link";
import {
  Zap,
  Truck,
  Shield,
  RefreshCw,
  Package,
  Star,
  ArrowRight,
} from "lucide-react";
import { demoProducts, listProducts } from "@/lib/products";

function formatPrice(value: number | string | Prisma.Decimal) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value));
}

const features = [
  {
    icon: Truck,
    title: "FAST SHIPPING",
    description: "Free shipping on orders over $50. 2-7 day delivery worldwide.",
    color: "neon-green",
  },
  {
    icon: Shield,
    title: "SECURE CHECKOUT",
    description: "SSL encrypted payments powered by Stripe for your safety.",
    color: "neon-pink",
  },
  {
    icon: RefreshCw,
    title: "EASY RETURNS",
    description: "30-day hassle-free returns. No questions asked.",
    color: "neon-blue",
  },
];

export default async function Home() {
  const { products, missingEnv, source } = await listProducts();
  const isDemoCatalog = source !== "db" || !products.length;
  const featuredProducts = products.length ? products.slice(0, 3) : demoProducts;

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative">
        <div className="relative border-4 border-retro-cyan bg-dark-800 p-8 md:p-12">
          {/* Corner decorations */}
          <div className="absolute -right-2 -top-2 h-6 w-6 bg-neon-pink" />
          <div className="absolute -bottom-2 -left-2 h-6 w-6 bg-neon-green" />
          <div className="absolute -bottom-2 -right-2 h-4 w-4 bg-retro-cyan" />
          <div className="absolute -left-2 -top-2 h-4 w-4 bg-neon-blue" />

          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 border-2 border-retro-cyan bg-dark-900 px-4 py-2">
                <Zap className="h-5 w-5 animate-pulse text-retro-cyan" />
                <span className="font-pixel text-xs tracking-wider text-retro-cyan">
                  VINTAGE TECH MARKETPLACE
                </span>
              </div>

              <h1 className="font-display text-4xl font-bold leading-tight tracking-wider text-cream md:text-5xl lg:text-6xl">
                YOUR{" "}
                <span className="text-retro-cyan text-neon-sm">RETRO</span>{" "}
                FINDS DELIVERED
              </h1>

              <p className="max-w-lg font-retro text-xl leading-relaxed text-cream/70">
                Step back in time with our curated collection of vintage gadgets, 
                retro tech, and nostalgic treasures. Fast shipping, secure checkout, 
                and a 30-day guarantee.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/products"
                  className="group flex items-center gap-2 border-4 border-neon-pink bg-neon-pink px-8 py-4 font-display text-lg font-bold text-dark-900 transition-all hover:bg-transparent hover:text-neon-pink"
                >
                  SHOP NOW
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/about"
                  className="flex items-center gap-2 border-4 border-retro-cyan px-8 py-4 font-display text-lg font-bold text-retro-cyan transition-all hover:bg-retro-cyan hover:text-dark-900"
                >
                  LEARN MORE
                </Link>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 border-t-2 border-dark-600 pt-6">
                <div>
                  <p className="font-display text-3xl font-bold text-neon-green">500+</p>
                  <p className="font-retro text-sm text-cream/50">PRODUCTS</p>
                </div>
                <div>
                  <p className="font-display text-3xl font-bold text-neon-pink">10K+</p>
                  <p className="font-retro text-sm text-cream/50">HAPPY CUSTOMERS</p>
                </div>
                <div>
                  <p className="font-display text-3xl font-bold text-retro-cyan">4.9</p>
                  <p className="font-retro text-sm text-cream/50">AVG RATING</p>
                </div>
              </div>
            </div>

            {/* Featured product card */}
            <div className="relative">
              <div className="border-2 border-neon-pink bg-dark-900 p-6">
                <div className="flex items-center justify-between">
                  <span className="font-pixel text-xs text-neon-pink animate-pulse">
                    ★ HOT DROP ★
                  </span>
                  <span className="border-2 border-neon-green bg-neon-green px-2 py-1 font-pixel text-xs text-dark-900">
                    LIMITED
                  </span>
                </div>
                <h3 className="mt-4 font-display text-2xl font-bold text-cream">
                  Vintage Walkman Bundle
                </h3>
                <p className="mt-2 font-retro text-lg text-cream/60">
                  Classic Sony Walkman restored with modern internals
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-display text-3xl font-bold text-neon-green text-neon-sm">
                    $149.00
                  </span>
                  <Link
                    href="/products"
                    className="border-2 border-retro-cyan px-4 py-2 font-retro text-lg text-retro-cyan transition-all hover:bg-retro-cyan hover:text-dark-900"
                  >
                    VIEW →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Database notice */}
      {missingEnv.length > 0 && (
        <div className="border-2 border-retro-orange bg-dark-800 p-4">
          <p className="font-retro text-lg text-retro-orange">
            ⚠ DATABASE NOT CONNECTED - Configure DATABASE_URL to enable live catalog.
          </p>
        </div>
      )}

      {/* Features Section */}
      <section className="grid gap-6 md:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="border-2 border-dark-600 bg-dark-800 p-6 transition-all hover:border-retro-cyan hover:shadow-[0_0_20px_rgba(0,255,255,0.2)]"
          >
            <feature.icon className="h-10 w-10 text-retro-cyan" />
            <h3 className="mt-4 font-display text-xl font-bold text-cream">
              {feature.title}
            </h3>
            <p className="mt-2 font-retro text-lg text-cream/60">
              {feature.description}
            </p>
          </div>
        ))}
      </section>

      {/* Featured Products */}
      <section className="space-y-8">
        <div className="flex items-center justify-between border-b-2 border-retro-cyan pb-4">
          <div className="flex items-center gap-4">
            <Star className="h-8 w-8 text-retro-cyan" />
            <h2 className="font-display text-3xl font-bold tracking-wider text-retro-cyan text-neon-sm">
              FEATURED DROPS
            </h2>
          </div>
          <Link
            href="/products"
            className="flex items-center gap-2 font-retro text-lg text-cream/70 transition-colors hover:text-retro-cyan"
          >
            VIEW ALL
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        {isDemoCatalog && (
          <div className="border-2 border-retro-orange bg-dark-800 p-3">
            <p className="font-retro text-sm text-retro-orange">
              📦 DEMO MODE - Showing sample products. Connect database for live catalog.
            </p>
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="group border-2 border-dark-600 bg-dark-800 transition-all duration-300 hover:border-retro-cyan hover:shadow-[0_0_20px_rgba(0,255,255,0.2)]"
            >
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
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900/90 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <Link
                  href={`/products/${product.id}`}
                  className="absolute bottom-4 left-4 right-4 border-2 border-retro-cyan bg-dark-900/90 py-2 text-center font-retro text-lg text-retro-cyan opacity-0 transition-all hover:bg-retro-cyan hover:text-dark-900 group-hover:opacity-100"
                >
                  VIEW DETAILS
                </Link>
              </div>
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
                  <Link
                    href={`/products/${product.id}`}
                    className="border-2 border-neon-pink px-4 py-2 font-retro text-base text-neon-pink transition-all hover:bg-neon-pink hover:text-dark-900"
                  >
                    ADD
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative border-4 border-neon-pink bg-dark-800 p-8 text-center md:p-12">
        <div className="absolute -right-2 -top-2 h-4 w-4 bg-retro-cyan" />
        <div className="absolute -bottom-2 -left-2 h-4 w-4 bg-neon-green" />

        <Zap className="mx-auto h-16 w-16 text-neon-pink" />
        <h2 className="mt-6 font-display text-3xl font-bold tracking-wider text-cream md:text-4xl">
          READY TO GO{" "}
          <span className="text-neon-pink text-neon-sm">RETRO</span>?
        </h2>
        <p className="mx-auto mt-4 max-w-xl font-retro text-xl text-cream/70">
          Join thousands of happy customers who have already found their 
          perfect vintage treasures. Start shopping today!
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/products"
            className="border-4 border-retro-cyan bg-retro-cyan px-8 py-4 font-display text-xl font-bold text-dark-900 transition-all hover:bg-transparent hover:text-retro-cyan"
          >
            BROWSE CATALOG
          </Link>
          <Link
            href="/contact"
            className="border-4 border-cream px-8 py-4 font-display text-xl font-bold text-cream transition-all hover:bg-cream hover:text-dark-900"
          >
            CONTACT US
          </Link>
        </div>
      </section>
    </div>
  );
}

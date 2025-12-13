import Link from "next/link";
import { listProducts } from "@/lib/products";

type CatalogCard = {
  id?: string;
  name: string;
  description: string;
  price: string;
  shipping: string;
  tag: string;
};

const heroPerks = [
  {
    title: "Fast global shipping",
    description: "Under-7-day delivery to US/EU from trusted suppliers.",
  },
  {
    title: "Buyer-first policies",
    description: "Easy returns, live order tracking, and secure checkout.",
  },
  {
    title: "Retro collection",
    description: "Curated gadgets, decor, and accessories that feel nostalgic.",
  },
];

const highlights = [
  {
    title: "Curated catalog",
    description:
      "Upload or sync products from suppliers, then merchandize them with retro styling that stands out.",
  },
  {
    title: "Automated fulfillment",
    description:
      "Connect suppliers and shipping providers to keep inventory fresh and orders flowing without manual work.",
  },
  {
    title: "Analytics ready",
    description:
      "Monitor conversion, cart performance, and fulfillment metrics with a production-ready foundation.",
  },
];

const bestSellers: CatalogCard[] = [
  {
    name: "Polaroid Sun 600 Revival",
    description:
      "Rebuilt instant camera with new color filters and eco film packs.",
    price: "$129",
    shipping: "Free priority shipping",
    tag: "Customer favorite",
  },
  {
    name: "Cassette Bluetooth Speaker",
    description:
      "Retro tape design hiding a modern 360° Bluetooth 5.2 speaker.",
    price: "$89",
    shipping: "Ships in 48h",
    tag: "Trending now",
  },
  {
    name: "Neon Desk Clock",
    description:
      "Warm glow clock with silent sweep movement and dimmable light.",
    price: "$59",
    shipping: "Carbon-neutral",
    tag: "Gift-ready",
  },
];

const howItWorks = [
  {
    step: "Browse curated drops",
    detail:
      "Filter by category, price, or delivery speed so shoppers land on the right product instantly.",
  },
  {
    step: "Add with confidence",
    detail:
      "Every item shows supplier stock, estimated arrival date, and verified reviews to reduce cart hesitation.",
  },
  {
    step: "One-tap checkout",
    detail:
      "Secure payments, saved addresses, and express pay options keep purchase frictionless.",
  },
];

function formatPrice(value: number | string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value));
}

export default async function Home() {
  const { products, missingEnv } = await listProducts();
  const featured = products.slice(0, 3).map<CatalogCard>((product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: formatPrice(Number(product.price)),
    shipping: "Ships fast from trusted suppliers",
    tag: "Live catalog",
  }));

  const catalogCards = featured.length ? featured : bestSellers;

  return (
    <div className="space-y-24">
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
        <div className="absolute -left-24 -top-32 h-64 w-64 rounded-full bg-brand-500/10 blur-3xl" />
        <div className="absolute -bottom-20 -right-28 h-72 w-72 rounded-full bg-brand-700/10 blur-3xl" />
        <div className="relative grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase text-brand-700 shadow-sm shadow-brand-700/5">
              Retro dropshipping marketplace
            </span>
            <h1 className="text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
              Your retro finds, delivered faster than the nostalgia hits.
            </h1>
            <p className="text-lg text-slate-700">
              Beautifully merchandized drops that feel like a boutique and
              checkouts that feel like magic. Give shoppers the trust signals,
              shipping clarity, and product storytelling they need to buy right
              away.
            </p>
            <div className="flex flex-wrap gap-4" id="cta">
              <Link
                href="#catalog"
                className="rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/30 transition hover:scale-105 hover:bg-brand-700"
              >
                Shop the catalog
              </Link>
              <Link
                href="/auth/login"
                className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-800 transition hover:border-brand-600 hover:text-brand-700"
              >
                Start selling
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>2-day average handling</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>3k+ verified reviews</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>Secure checkout powered by Stripe</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute left-6 top-6 h-24 w-24 rounded-full bg-brand-500/10 blur-2xl" />
            <div className="relative space-y-4">
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-900 p-5 text-white shadow-lg">
                <div>
                  <p className="text-xs text-emerald-200">Drop of the week</p>
                  <p className="text-lg font-semibold">
                    Vintage Walkman Bundle
                  </p>
                  <p className="text-sm text-slate-200">
                    Arrives Jan 18 - Jan 22
                  </p>
                </div>
                <div className="rounded-lg bg-white/10 px-3 py-2 text-sm font-semibold">
                  $149
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {heroPerks.map((perk) => (
                  <div
                    key={perk.title}
                    className="rounded-xl border border-dashed border-brand-200 bg-brand-50/60 p-4 text-brand-900"
                  >
                    <p className="text-sm font-semibold">{perk.title}</p>
                    <p className="mt-1 text-sm text-brand-800/80">
                      {perk.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="space-y-10">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">
            Why shoppers stay
          </p>
          <h2 className="text-3xl font-bold text-slate-900">
            Build trust, remove friction, lift conversion
          </h2>
          <p className="max-w-2xl text-slate-700">
            Every block is built for the modern dropshipping playbook: clear
            logistics, strong guarantees, and effortless browsing that nudges
            buyers to checkout.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {highlights.map((highlight) => (
            <div
              key={highlight.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-slate-900">
                {highlight.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                {highlight.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="catalog"
        className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm"
      >
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">
              Featured catalog
            </p>
            <h3 className="text-2xl font-bold text-slate-900">
              Retro drops worth adding to cart
            </h3>
            <p className="text-slate-700">
              Merchandized with clear pricing, promise badges, and delivery
              expectations to keep shoppers moving.
            </p>
          </div>
          <div className="flex gap-3">
            <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-800">
              New this week
            </span>
            <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-800">
              Gifts under $100
            </span>
            <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-800">
              Express ship
            </span>
          </div>
        </div>
        {featured.length === 0 && missingEnv.length > 0 ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
            Configure your database connection (DATABASE_URL) to show live products.
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {catalogCards.map((item) => (
              <div
                key={item.name}
                className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50/50 p-6"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-brand-800">
                    {item.tag}
                  </p>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                    In stock
                  </span>
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-slate-900">
                    {item.name}
                  </p>
                  <p className="text-sm text-slate-600">{item.description}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-slate-900">
                      {item.price}
                    </p>
                    <p className="text-xs font-semibold text-emerald-700">
                      {item.shipping}
                    </p>
                  </div>
                  <Link
                    href={item.id ? `/products/${item.id}` : "/products"}
                    className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-brand-600/30 transition hover:scale-105 hover:bg-brand-700"
                  >
                    View product
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="grid gap-10 rounded-3xl border border-brand-200 bg-brand-50/60 p-10 shadow-sm md:grid-cols-2">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">
            Buyer experience
          </p>
          <h3 className="text-2xl font-bold text-slate-900">
            Crafted for checkout confidence
          </h3>
          <p className="text-slate-700">
            Highlight urgency and trust: estimated delivery, return windows,
            secure payments, and genuine reviews. Layer in bundles and add-ons
            to increase cart value without friction.
          </p>
          <div className="flex flex-wrap gap-3 text-sm font-semibold text-brand-900">
            <span className="rounded-full bg-white px-4 py-2 shadow-sm">
              Delivery ETA on every card
            </span>
            <span className="rounded-full bg-white px-4 py-2 shadow-sm">
              Bundle & upsell blocks
            </span>
            <span className="rounded-full bg-white px-4 py-2 shadow-sm">
              Sticky cart actions
            </span>
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between text-sm font-semibold text-slate-800">
              <span>Estimated arrival</span>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
                Jan 17 - Jan 20
              </span>
            </div>
            <p className="mt-3 text-sm text-slate-600">
              Show the delivery promise up front so shoppers have no surprises
              at checkout.
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-xl border border-dashed border-brand-200 bg-brand-50/80 p-4 text-brand-900">
                <p className="text-sm font-semibold">Trusted suppliers</p>
                <p className="mt-1 text-sm text-brand-800/80">
                  Auto-sync stock, avoid oversells.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">
                  Seamless returns
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Printable labels, fast refunds.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">
            How it works
          </p>
          <h3 className="text-2xl font-bold text-slate-900">
            From browsing to buy in three steps
          </h3>
          <p className="max-w-2xl text-slate-700">
            Clear milestones keep shoppers oriented and confident that their
            order will arrive without hassle.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {howItWorks.map((item, index) => (
            <div
              key={item.step}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-800">
                {index + 1}
              </div>
              <p className="mt-4 text-lg font-semibold text-slate-900">
                {item.step}
              </p>
              <p className="mt-2 text-sm text-slate-600">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="contact"
        className="space-y-4 rounded-3xl border border-slate-200 bg-white p-10 shadow-sm"
      >
        <h3 className="text-2xl font-bold text-slate-900">
          Ready to ship your retro experience?
        </h3>
        <p className="max-w-3xl text-slate-700">
          Configure your Postgres database, generate the Prisma client, and
          start building product, cart, and checkout flows on top of the Next.js
          App Router foundation. Add your supplier feeds and environment secrets
          to start accepting orders.
        </p>
        <div className="flex flex-wrap gap-4 text-sm font-semibold text-brand-900">
          <span className="rounded-full bg-brand-50 px-4 py-2 shadow-sm">
            Validated environment schema
          </span>
          <span className="rounded-full bg-brand-50 px-4 py-2 shadow-sm">
            Prisma + Postgres ready
          </span>
          <span className="rounded-full bg-brand-50 px-4 py-2 shadow-sm">
            Tailwind styling baseline
          </span>
          <span className="rounded-full bg-brand-50 px-4 py-2 shadow-sm">
            Stripe-powered checkout
          </span>
        </div>
      </section>
    </div>
  );
}

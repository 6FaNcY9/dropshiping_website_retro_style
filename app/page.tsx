import Link from 'next/link';

const highlights = [
  {
    title: 'Curated catalog',
    description: 'Upload or sync products from suppliers, then merchandize them with retro styling that stands out.'
  },
  {
    title: 'Automated fulfillment',
    description: 'Connect suppliers and shipping providers to keep inventory fresh and orders flowing without manual work.'
  },
  {
    title: 'Analytics ready',
    description: 'Monitor conversion, cart performance, and fulfillment metrics with a production-ready foundation.'
  }
];

export default function Home() {
  return (
    <div className="space-y-24">
      <section className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase text-brand-700 shadow-sm shadow-brand-700/10">
            Retro commerce starter
          </span>
          <h1 className="text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
            Launch a nostalgic dropshipping storefront with modern performance.
          </h1>
          <p className="text-lg text-slate-700">
            Built with Next.js App Router, Tailwind CSS, and Prisma for Postgres so you can go from idea to launch without
            stitching together the basics.
          </p>
          <div className="flex flex-wrap gap-4" id="cta">
            <Link
              href="#catalog"
              className="rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/30 transition hover:scale-105 hover:bg-brand-700"
            >
              View sample catalog
            </Link>
            <Link
              href="https://prisma.io"
              className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-800 transition hover:border-brand-600 hover:text-brand-700"
            >
              How Prisma fits
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>Optimized for Postgres + Prisma</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>App Router + Server Actions ready</span>
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-brand-900/5">
          <div className="absolute -left-16 -top-16 h-32 w-32 rounded-full bg-brand-500/10 blur-3xl" />
          <div className="absolute -bottom-12 -right-14 h-36 w-36 rounded-full bg-brand-700/10 blur-3xl" />
          <div className="relative space-y-4">
            <div className="rounded-xl border border-slate-200 bg-slate-900 p-4 text-white shadow-lg">
              <p className="text-xs text-emerald-200">postgresql://...</p>
              <p className="text-sm font-semibold">Connected through Prisma</p>
              <div className="mt-3 space-y-1 rounded-lg bg-slate-800 p-3 text-xs text-slate-200">
                <p>$ prisma generate</p>
                <p>$ npm run dev</p>
                <p>Project ready for App Router</p>
              </div>
            </div>
            <div className="rounded-xl border border-dashed border-brand-200 bg-brand-50/60 p-4 text-sm text-brand-900">
              Typed database access, Tailwind styling, and linting/formatting are configured so you can focus on features.
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="space-y-10">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">Why this starter</p>
          <h2 className="text-3xl font-bold text-slate-900">A foundation for commerce teams</h2>
          <p className="max-w-2xl text-slate-700">
            Compose a storefront, hook it up to your supplier feeds, and customize the retro brand identity. Deploy to Vercel or
            your favorite platform with environment validation baked in.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {highlights.map((highlight) => (
            <div key={highlight.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">{highlight.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{highlight.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="catalog" className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">Starter catalog</p>
            <h3 className="text-2xl font-bold text-slate-900">Built for retro tech accessories</h3>
            <p className="text-slate-700">Swap in your own categories and supplier SKUs with Prisma models.</p>
          </div>
          <div className="flex gap-3">
            <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-800">Power adapters</span>
            <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-800">Vinyl players</span>
            <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-800">Retro cameras</span>
          </div>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6">
              <p className="text-sm font-semibold text-brand-800">Featured Item #{item}</p>
              <p className="mt-2 text-sm text-slate-600">
                Showcase your top-performing SKUs with stock status and supplier mappings powered by Prisma.
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="space-y-4 rounded-3xl border border-brand-200 bg-brand-50/60 p-10 shadow-sm">
        <h3 className="text-2xl font-bold text-slate-900">Ready to ship your retro experience?</h3>
        <p className="max-w-2xl text-slate-700">
          Configure your Postgres database, generate the Prisma client, and start building product, cart, and checkout flows on
          top of the Next.js App Router foundation.
        </p>
        <div className="flex flex-wrap gap-4 text-sm font-semibold text-brand-900">
          <span className="rounded-full bg-white px-4 py-2 shadow-sm">Validated environment schema</span>
          <span className="rounded-full bg-white px-4 py-2 shadow-sm">Prisma + Postgres ready</span>
          <span className="rounded-full bg-white px-4 py-2 shadow-sm">Tailwind styling baseline</span>
        </div>
      </section>
    </div>
  );
}

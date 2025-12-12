import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white/70">
      <div className="container flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-lg font-semibold">
            <span className="rounded bg-brand-500 px-2 py-1 text-white">
              DS
            </span>
            <span>Dropship Retro</span>
          </div>
          <p className="mt-2 text-sm text-slate-600">
            Retro-inspired dropshipping storefront template built with Next.js,
            Prisma, and Tailwind.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-slate-600">
          <Link href="#privacy" className="hover:text-brand-700">
            Privacy
          </Link>
          <Link href="#terms" className="hover:text-brand-700">
            Terms
          </Link>
          <Link href="#support" className="hover:text-brand-700">
            Support
          </Link>
        </div>
      </div>
    </footer>
  );
}

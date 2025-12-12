'use client';

import Link from 'next/link';
import { useState } from 'react';

const links = [
  { href: '#features', label: 'Features' },
  { href: '#catalog', label: 'Catalog' },
  { href: '#contact', label: 'Contact' }
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="container flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
          <span className="rounded bg-brand-500 px-2 py-1 text-white">DS</span>
          <span>Dropship Retro</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-700 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-brand-700">
              {link.label}
            </Link>
          ))}
          <Link
            href="#cta"
            className="rounded-full bg-brand-600 px-4 py-2 text-white shadow-lg shadow-brand-600/30 transition hover:scale-105 hover:bg-brand-700"
          >
            Launch store
          </Link>
        </nav>
        <button
          className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 md:hidden"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          <span className="block h-0.5 w-5 bg-slate-800" />
        </button>
      </div>
      {isOpen && (
        <div className="container pb-4 md:hidden">
          <nav className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 text-sm font-medium text-slate-700 shadow-sm">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-brand-700">
                {link.label}
              </Link>
            ))}
            <Link
              href="#cta"
              className="rounded-full bg-brand-600 px-4 py-2 text-center text-white shadow-lg shadow-brand-600/30 transition hover:scale-105 hover:bg-brand-700"
            >
              Launch store
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

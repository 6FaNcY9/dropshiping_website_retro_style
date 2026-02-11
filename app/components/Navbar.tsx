"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, Menu, X, Zap } from "lucide-react";
import { useCart } from "./CartContext";
import { CartDrawer } from "./CartDrawer";

const links = [
  { href: "/products", label: "SHOP" },
  { href: "/about", label: "ABOUT" },
  { href: "/contact", label: "CONTACT" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { totalItems, toggleCart, state } = useCart();

  return (
    <>
      <header className="sticky top-0 z-40 border-b-2 border-retro-cyan bg-dark-900/95 backdrop-blur-sm">
        <div className="container flex items-center justify-between py-4">
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative flex h-12 w-12 items-center justify-center border-2 border-retro-cyan bg-dark-800">
              <Zap className="h-6 w-6 text-retro-cyan" />
              <div className="absolute -right-1 -top-1 h-2 w-2 bg-neon-pink" />
            </div>
            <div className="flex flex-col">
              <span className="font-pixel text-xs tracking-wider text-retro-cyan group-hover:text-neon-pink transition-colors">
                RETRO
              </span>
              <span className="font-display text-lg font-bold tracking-widest text-cream">
                DROPS
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-retro text-xl tracking-widest text-cream transition-all hover:text-retro-cyan hover:text-neon-sm"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleCart}
              className="relative flex h-12 w-12 items-center justify-center border-2 border-neon-pink bg-dark-800 transition-all hover:bg-neon-pink/20 hover:shadow-neon-sm"
              aria-label="Open cart"
            >
              <ShoppingCart className="h-5 w-5 text-neon-pink" />
              {totalItems > 0 && (
                <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center bg-retro-cyan font-pixel text-[10px] text-dark-900">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </button>

            <Link
              href="/auth/login"
              className="hidden md:block btn-neon border-retro-cyan text-retro-cyan px-4 py-2 font-retro text-lg"
            >
              LOGIN
            </Link>

            <button
              className="flex h-12 w-12 items-center justify-center border-2 border-retro-cyan bg-dark-800 md:hidden transition-all hover:bg-retro-cyan/20"
              onClick={() => setIsOpen((prev) => !prev)}
              aria-label="Toggle navigation"
            >
              {isOpen ? (
                <X className="h-5 w-5 text-retro-cyan" />
              ) : (
                <Menu className="h-5 w-5 text-retro-cyan" />
              )}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="container pb-4 md:hidden">
            <nav className="flex flex-col gap-2 border-2 border-retro-cyan bg-dark-800 p-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="border-b border-dark-600 py-3 font-retro text-xl tracking-widest text-cream transition-colors hover:text-retro-cyan"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/auth/login"
                className="mt-2 btn-neon border-retro-cyan text-retro-cyan text-center py-3 font-retro text-xl"
                onClick={() => setIsOpen(false)}
              >
                LOGIN
              </Link>
            </nav>
          </div>
        )}
      </header>

      <CartDrawer isOpen={state.isOpen} />
    </>
  );
}

import Link from "next/link";
import { Zap, Mail, MapPin, Phone, CreditCard, Truck, Shield, RefreshCw } from "lucide-react";

const footerLinks = {
  shop: [
    { href: "/products", label: "All Products" },
    { href: "/products?category=gadgets", label: "Retro Gadgets" },
    { href: "/products?category=audio", label: "Vintage Audio" },
    { href: "/products?category=decor", label: "Home Decor" },
  ],
  support: [
    { href: "/contact", label: "Contact Us" },
    { href: "/shipping", label: "Shipping Info" },
    { href: "/returns", label: "Returns & Refunds" },
    { href: "/faq", label: "FAQ" },
  ],
  legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/impressum", label: "Impressum" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t-2 border-retro-cyan bg-dark-900">
      {/* Trust badges */}
      <div className="border-b-2 border-dark-700">
        <div className="container grid grid-cols-2 gap-4 py-8 md:grid-cols-4">
          <div className="flex items-center gap-3">
            <Truck className="h-8 w-8 text-neon-green" />
            <div>
              <p className="font-retro text-lg text-neon-green">FREE SHIPPING</p>
              <p className="font-retro text-sm text-cream/50">Orders over $50</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <RefreshCw className="h-8 w-8 text-neon-blue" />
            <div>
              <p className="font-retro text-lg text-neon-blue">30 DAY RETURNS</p>
              <p className="font-retro text-sm text-cream/50">Easy refunds</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-neon-pink" />
            <div>
              <p className="font-retro text-lg text-neon-pink">SECURE CHECKOUT</p>
              <p className="font-retro text-sm text-cream/50">SSL encrypted</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CreditCard className="h-8 w-8 text-retro-cyan" />
            <div>
              <p className="font-retro text-lg text-retro-cyan">SAFE PAYMENTS</p>
              <p className="font-retro text-sm text-cream/50">Stripe powered</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="group flex items-center gap-3">
              <div className="relative flex h-12 w-12 items-center justify-center border-2 border-retro-cyan bg-dark-800">
                <Zap className="h-6 w-6 text-retro-cyan" />
                <div className="absolute -right-1 -top-1 h-2 w-2 bg-neon-pink" />
              </div>
              <div className="flex flex-col">
                <span className="font-pixel text-xs tracking-wider text-retro-cyan">
                  RETRO
                </span>
                <span className="font-display text-lg font-bold tracking-widest text-cream">
                  DROPS
                </span>
              </div>
            </Link>
            <p className="mt-4 max-w-sm font-retro text-lg text-cream/60">
              Your destination for vintage tech, retro gadgets, and nostalgic
              finds. Step back in time with our curated collection.
            </p>
            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-3 font-retro text-lg text-cream/60">
                <Mail className="h-5 w-5 text-retro-cyan" />
                <span>hello@retrodrops.store</span>
              </div>
              <div className="flex items-center gap-3 font-retro text-lg text-cream/60">
                <Phone className="h-5 w-5 text-retro-cyan" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 font-retro text-lg text-cream/60">
                <MapPin className="h-5 w-5 text-retro-cyan" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Shop links */}
          <div>
            <h3 className="font-display text-lg font-bold tracking-wider text-retro-cyan">
              SHOP
            </h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-retro text-lg text-cream/60 transition-colors hover:text-retro-cyan"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support links */}
          <div>
            <h3 className="font-display text-lg font-bold tracking-wider text-neon-pink">
              SUPPORT
            </h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-retro text-lg text-cream/60 transition-colors hover:text-neon-pink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h3 className="font-display text-lg font-bold tracking-wider text-neon-green">
              LEGAL
            </h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-retro text-lg text-cream/60 transition-colors hover:text-neon-green"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t-2 border-dark-700">
        <div className="container flex flex-col items-center justify-between gap-4 py-6 md:flex-row">
          <p className="font-retro text-lg text-cream/40">
            © {new Date().getFullYear()} RETRO DROPS. All rights reserved.
          </p>
          <p className="font-retro text-sm text-cream/30">
            Built with Next.js, Prisma & Stripe
          </p>
        </div>
      </div>
    </footer>
  );
}

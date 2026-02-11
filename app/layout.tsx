import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { CartProvider } from "./components/CartContext";

export const metadata: Metadata = {
  title: "RETRO DROPS | Vintage Tech & Nostalgia Store",
  description:
    "Step back in time with our curated collection of retro gadgets, vintage tech, and nostalgic finds. Fast shipping, secure checkout.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-dark-900 text-cream">
        <CartProvider>
          <Navbar />
          <main className="container pb-16 pt-8">{children}</main>
          <Footer />
        </CartProvider>
        <Analytics />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Dropship Retro Storefront",
  description:
    "Retro-inspired dropshipping starter built with Next.js App Router and Prisma.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <Navbar />
        <main className="container pb-16 pt-10">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}

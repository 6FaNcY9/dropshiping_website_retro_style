import { Truck, ArrowLeft, Clock, Globe, Package } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Shipping Information | RETRO DROPS",
  description: "Learn about our shipping policies, delivery times, and shipping costs.",
};

const shippingOptions = [
  {
    name: "Standard Shipping",
    time: "5-7 business days",
    price: "$9.99",
    freeOver: "$50",
    icon: Package,
  },
  {
    name: "Express Shipping",
    time: "2-3 business days",
    price: "$19.99",
    freeOver: "$150",
    icon: Truck,
  },
  {
    name: "International",
    time: "7-14 business days",
    price: "$24.99",
    freeOver: "$200",
    icon: Globe,
  },
];

export default function ShippingPage() {
  return (
    <div className="space-y-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 font-retro text-lg text-cream/70 transition-colors hover:text-retro-cyan"
      >
        <ArrowLeft className="h-5 w-5" />
        BACK TO HOME
      </Link>

      <div className="border-b-2 border-neon-green pb-6">
        <div className="flex items-center gap-4">
          <Truck className="h-10 w-10 text-neon-green" />
          <h1 className="font-display text-4xl font-bold tracking-wider text-neon-green text-neon-sm">
            SHIPPING INFO
          </h1>
        </div>
        <p className="mt-2 font-retro text-lg text-cream/60">
          Everything you need to know about getting your retro finds delivered
        </p>
      </div>

      {/* Shipping Options */}
      <section className="space-y-6">
        <h2 className="font-display text-2xl font-bold text-retro-cyan">
          SHIPPING OPTIONS
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {shippingOptions.map((option) => (
            <div
              key={option.name}
              className="border-2 border-dark-600 bg-dark-800 p-6 transition-all hover:border-neon-green"
            >
              <option.icon className="h-10 w-10 text-neon-green" />
              <h3 className="mt-4 font-display text-xl font-bold text-cream">
                {option.name}
              </h3>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-cream/60" />
                  <span className="font-retro text-lg text-cream/80">{option.time}</span>
                </div>
                <p className="font-display text-2xl font-bold text-neon-green">
                  {option.price}
                </p>
                <p className="font-retro text-sm text-cream/50">
                  FREE on orders over {option.freeOver}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-3xl space-y-8">
        <section className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-neon-pink">
            PROCESSING TIME
          </h2>
          <div className="border-l-2 border-dark-600 pl-4 font-retro text-lg text-cream/80 space-y-4">
            <p>
              All orders are processed within 1-2 business days. Orders placed on weekends 
              or holidays will be processed on the next business day.
            </p>
            <p>
              You will receive a shipping confirmation email with tracking information once 
              your order has shipped.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-retro-cyan">
            SHIPPING DESTINATIONS
          </h2>
          <div className="border-l-2 border-dark-600 pl-4 font-retro text-lg text-cream/80 space-y-4">
            <p>We currently ship to the following countries:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>United States (all 50 states)</li>
              <li>Canada</li>
              <li>United Kingdom</li>
              <li>European Union countries</li>
              <li>Australia</li>
              <li>Japan</li>
            </ul>
            <p className="text-cream/60">
              Don&apos;t see your country? Contact us and we&apos;ll do our best to accommodate!
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-neon-green">
            TRACKING YOUR ORDER
          </h2>
          <div className="border-l-2 border-dark-600 pl-4 font-retro text-lg text-cream/80">
            <p>
              Once your order ships, you&apos;ll receive an email with a tracking number. 
              You can track your package using the link provided or by visiting the 
              carrier&apos;s website directly.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-neon-pink">
            CUSTOMS & DUTIES
          </h2>
          <div className="border-l-2 border-dark-600 pl-4 font-retro text-lg text-cream/80">
            <p>
              International orders may be subject to customs fees, import duties, and taxes. 
              These fees are the responsibility of the recipient and are not included in the 
              shipping cost or order total.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-retro-cyan">
            QUESTIONS?
          </h2>
          <div className="border-l-2 border-dark-600 pl-4 font-retro text-lg text-cream/80">
            <p>
              If you have any questions about shipping, please{" "}
              <Link href="/contact" className="text-retro-cyan hover:underline">
                contact our support team
              </Link>
              . We&apos;re happy to help!
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

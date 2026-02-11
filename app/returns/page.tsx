import { RefreshCw, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Returns & Refunds | RETRO DROPS",
  description: "Learn about our 30-day return policy and how to request a refund.",
};

export default function ReturnsPage() {
  return (
    <div className="space-y-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 font-retro text-lg text-cream/70 transition-colors hover:text-retro-cyan"
      >
        <ArrowLeft className="h-5 w-5" />
        BACK TO HOME
      </Link>

      <div className="border-b-2 border-neon-blue pb-6">
        <div className="flex items-center gap-4">
          <RefreshCw className="h-10 w-10 text-neon-blue" />
          <h1 className="font-display text-4xl font-bold tracking-wider text-neon-blue text-neon-sm">
            RETURNS & REFUNDS
          </h1>
        </div>
        <p className="mt-2 font-retro text-lg text-cream/60">
          Our hassle-free 30-day return policy
        </p>
      </div>

      {/* Highlight box */}
      <div className="border-4 border-neon-green bg-dark-800 p-6">
        <h2 className="font-display text-2xl font-bold text-neon-green">
          30-DAY MONEY BACK GUARANTEE
        </h2>
        <p className="mt-2 font-retro text-xl text-cream/80">
          Not satisfied with your purchase? Return it within 30 days for a full refund. 
          No questions asked.
        </p>
      </div>

      <div className="max-w-3xl space-y-8">
        <section className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-retro-cyan">
            RETURN ELIGIBILITY
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="border-2 border-neon-green bg-dark-800 p-4">
              <div className="flex items-center gap-2 text-neon-green">
                <CheckCircle className="h-6 w-6" />
                <h3 className="font-retro text-lg">ELIGIBLE</h3>
              </div>
              <ul className="mt-4 space-y-2 font-retro text-lg text-cream/80">
                <li>• Items in original condition</li>
                <li>• Unused and undamaged</li>
                <li>• Original packaging included</li>
                <li>• Within 30 days of delivery</li>
              </ul>
            </div>
            <div className="border-2 border-neon-pink bg-dark-800 p-4">
              <div className="flex items-center gap-2 text-neon-pink">
                <XCircle className="h-6 w-6" />
                <h3 className="font-retro text-lg">NOT ELIGIBLE</h3>
              </div>
              <ul className="mt-4 space-y-2 font-retro text-lg text-cream/80">
                <li>• Used or damaged items</li>
                <li>• Missing original packaging</li>
                <li>• Over 30 days from delivery</li>
                <li>• Final sale items</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-neon-pink">
            HOW TO RETURN
          </h2>
          <div className="border-l-2 border-dark-600 pl-4 font-retro text-lg text-cream/80 space-y-4">
            <ol className="list-decimal list-inside space-y-4">
              <li>
                <span className="text-neon-pink">Contact us</span> at returns@retrodrops.store 
                with your order number
              </li>
              <li>
                We&apos;ll send you a <span className="text-neon-pink">prepaid return label</span>
              </li>
              <li>
                Pack the item securely in its <span className="text-neon-pink">original packaging</span>
              </li>
              <li>
                Drop off the package at any <span className="text-neon-pink">authorized carrier location</span>
              </li>
            </ol>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-neon-green">
            REFUND PROCESS
          </h2>
          <div className="border-l-2 border-dark-600 pl-4 font-retro text-lg text-cream/80 space-y-4">
            <p>
              Once we receive your return, we&apos;ll inspect the item and process your refund 
              within 3-5 business days.
            </p>
            <p>
              Refunds are issued to your original payment method. Please allow 5-10 business 
              days for the refund to appear in your account.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-retro-cyan">
            EXCHANGES
          </h2>
          <div className="border-l-2 border-dark-600 pl-4 font-retro text-lg text-cream/80">
            <p>
              Want a different item? We recommend returning your original purchase for a 
              refund and placing a new order. This ensures the fastest processing time 
              for both transactions.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-neon-pink">
            DAMAGED OR DEFECTIVE ITEMS
          </h2>
          <div className="border-l-2 border-dark-600 pl-4 font-retro text-lg text-cream/80">
            <p>
              Received a damaged or defective item? Contact us immediately at{" "}
              <a href="mailto:support@retrodrops.store" className="text-neon-pink hover:underline">
                support@retrodrops.store
              </a>{" "}
              with photos of the damage. We&apos;ll send a replacement or issue a full refund 
              at no extra cost to you.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-neon-green">
            NEED HELP?
          </h2>
          <div className="border-l-2 border-dark-600 pl-4 font-retro text-lg text-cream/80">
            <p>
              Our support team is here to help with any return questions.{" "}
              <Link href="/contact" className="text-neon-green hover:underline">
                Contact us
              </Link>{" "}
              and we&apos;ll get back to you within 24 hours.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

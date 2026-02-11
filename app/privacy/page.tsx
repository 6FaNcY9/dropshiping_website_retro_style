import { Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | RETRO DROPS",
  description: "Learn how RETRO DROPS collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="space-y-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 font-retro text-lg text-cream/70 transition-colors hover:text-retro-cyan"
      >
        <ArrowLeft className="h-5 w-5" />
        BACK TO HOME
      </Link>

      <div className="border-b-2 border-retro-cyan pb-6">
        <div className="flex items-center gap-4">
          <Shield className="h-10 w-10 text-retro-cyan" />
          <h1 className="font-display text-4xl font-bold tracking-wider text-retro-cyan text-neon-sm">
            PRIVACY POLICY
          </h1>
        </div>
        <p className="mt-2 font-retro text-lg text-cream/60">
          Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </p>
      </div>

      <div className="max-w-3xl space-y-8">
        <section className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-neon-pink">
            1. INFORMATION WE COLLECT
          </h2>
          <div className="border-l-2 border-dark-600 pl-4 font-retro text-lg text-cream/80 space-y-4">
            <p>
              We collect information you provide directly to us, such as when you create an account, 
              make a purchase, or contact us for support.
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Name and contact information (email, address, phone)</li>
              <li>Payment information (processed securely by Stripe)</li>
              <li>Order history and preferences</li>
              <li>Communications with our support team</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-neon-green">
            2. HOW WE USE YOUR INFORMATION
          </h2>
          <div className="border-l-2 border-dark-600 pl-4 font-retro text-lg text-cream/80 space-y-4">
            <p>We use the information we collect to:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Process and fulfill your orders</li>
              <li>Send you order confirmations and shipping updates</li>
              <li>Respond to your comments, questions, and requests</li>
              <li>Improve our products and services</li>
              <li>Send promotional communications (with your consent)</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-retro-cyan">
            3. INFORMATION SHARING
          </h2>
          <div className="border-l-2 border-dark-600 pl-4 font-retro text-lg text-cream/80 space-y-4">
            <p>
              We do not sell, trade, or rent your personal information to third parties. 
              We may share your information with:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Service providers (payment processors, shipping carriers)</li>
              <li>Legal authorities when required by law</li>
              <li>Business partners with your explicit consent</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-neon-pink">
            4. DATA SECURITY
          </h2>
          <div className="border-l-2 border-dark-600 pl-4 font-retro text-lg text-cream/80">
            <p>
              We implement appropriate technical and organizational measures to protect your 
              personal information. All payment information is encrypted and processed through 
              Stripe&apos;s secure payment infrastructure.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-neon-green">
            5. YOUR RIGHTS
          </h2>
          <div className="border-l-2 border-dark-600 pl-4 font-retro text-lg text-cream/80 space-y-4">
            <p>You have the right to:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Access and receive a copy of your personal data</li>
              <li>Correct inaccurate personal data</li>
              <li>Request deletion of your personal data</li>
              <li>Object to processing of your personal data</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-retro-cyan">
            6. CONTACT US
          </h2>
          <div className="border-l-2 border-dark-600 pl-4 font-retro text-lg text-cream/80">
            <p>
              If you have any questions about this Privacy Policy, please contact us at{" "}
              <a href="mailto:privacy@retrodrops.store" className="text-retro-cyan hover:underline">
                privacy@retrodrops.store
              </a>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

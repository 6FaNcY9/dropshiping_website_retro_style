import { FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Terms of Service | RETRO DROPS",
  description: "Read the terms and conditions for using RETRO DROPS store.",
};

export default function TermsPage() {
  return (
    <div className="space-y-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 font-retro text-lg text-cream/70 transition-colors hover:text-retro-cyan"
      >
        <ArrowLeft className="h-5 w-5" />
        BACK TO HOME
      </Link>

      <div className="border-b-2 border-neon-pink pb-6">
        <div className="flex items-center gap-4">
          <FileText className="h-10 w-10 text-neon-pink" />
          <h1 className="font-display text-4xl font-bold tracking-wider text-neon-pink text-neon-sm">
            TERMS OF SERVICE
          </h1>
        </div>
        <p className="mt-2 font-retro text-lg text-cream/60">
          Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </p>
      </div>

      <div className="max-w-3xl space-y-8">
        <section className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-retro-cyan">
            1. ACCEPTANCE OF TERMS
          </h2>
          <div className="border-l-2 border-dark-600 pl-4 font-retro text-lg text-cream/80">
            <p>
              By accessing and using RETRO DROPS, you accept and agree to be bound by the terms 
              and provisions of this agreement. If you do not agree to these terms, please do 
              not use our services.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-neon-green">
            2. USE OF SERVICE
          </h2>
          <div className="border-l-2 border-dark-600 pl-4 font-retro text-lg text-cream/80 space-y-4">
            <p>You agree to use our service only for lawful purposes. You must not:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Use the service in any way that violates applicable laws</li>
              <li>Attempt to gain unauthorized access to any part of the service</li>
              <li>Use automated systems to access the service without permission</li>
              <li>Interfere with or disrupt the service or servers</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-neon-pink">
            3. ACCOUNTS
          </h2>
          <div className="border-l-2 border-dark-600 pl-4 font-retro text-lg text-cream/80">
            <p>
              When you create an account, you must provide accurate and complete information. 
              You are responsible for maintaining the security of your account and password. 
              RETRO DROPS cannot and will not be liable for any loss or damage from your failure 
              to comply with this security obligation.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-retro-cyan">
            4. PRODUCTS AND PRICING
          </h2>
          <div className="border-l-2 border-dark-600 pl-4 font-retro text-lg text-cream/80 space-y-4">
            <p>
              All prices are displayed in USD and are subject to change without notice. 
              We reserve the right to:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Modify or discontinue products without notice</li>
              <li>Limit quantities of products available for purchase</li>
              <li>Refuse any order you place with us</li>
              <li>Correct pricing errors</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-neon-green">
            5. PAYMENT
          </h2>
          <div className="border-l-2 border-dark-600 pl-4 font-retro text-lg text-cream/80">
            <p>
              All payments are processed securely through Stripe. By providing payment information, 
              you represent that you are authorized to use the payment method. You agree to pay 
              all charges at the prices then in effect for your purchases.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-neon-pink">
            6. INTELLECTUAL PROPERTY
          </h2>
          <div className="border-l-2 border-dark-600 pl-4 font-retro text-lg text-cream/80">
            <p>
              All content on this website, including text, graphics, logos, images, and software, 
              is the property of RETRO DROPS or its content suppliers and is protected by 
              international copyright laws.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-retro-cyan">
            7. LIMITATION OF LIABILITY
          </h2>
          <div className="border-l-2 border-dark-600 pl-4 font-retro text-lg text-cream/80">
            <p>
              RETRO DROPS shall not be liable for any indirect, incidental, special, consequential, 
              or punitive damages resulting from your use of or inability to use the service. 
              Our total liability shall not exceed the amount you paid for the product in question.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-neon-green">
            8. CONTACT
          </h2>
          <div className="border-l-2 border-dark-600 pl-4 font-retro text-lg text-cream/80">
            <p>
              Questions about the Terms of Service should be sent to us at{" "}
              <a href="mailto:legal@retrodrops.store" className="text-neon-green hover:underline">
                legal@retrodrops.store
              </a>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

import { Zap, Heart, Users, Star, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "About Us | RETRO DROPS",
  description: "Learn about RETRO DROPS - your destination for vintage tech and nostalgic finds.",
};

export default function AboutPage() {
  return (
    <div className="space-y-12">
      <Link
        href="/"
        className="inline-flex items-center gap-2 font-retro text-lg text-cream/70 transition-colors hover:text-retro-cyan"
      >
        <ArrowLeft className="h-5 w-5" />
        BACK TO HOME
      </Link>

      {/* Hero Section */}
      <div className="relative border-4 border-retro-cyan bg-dark-800 p-8 md:p-12">
        <div className="absolute -right-2 -top-2 h-4 w-4 bg-neon-pink" />
        <div className="absolute -bottom-2 -left-2 h-4 w-4 bg-neon-green" />
        
        <div className="flex items-center gap-4">
          <Zap className="h-12 w-12 text-retro-cyan" />
          <h1 className="font-display text-4xl font-bold tracking-wider text-retro-cyan text-neon-sm md:text-5xl">
            ABOUT US
          </h1>
        </div>
        <p className="mt-6 max-w-2xl font-retro text-2xl leading-relaxed text-cream/80">
          We&apos;re on a mission to bring back the golden age of technology. 
          Curated vintage finds, delivered with modern convenience.
        </p>
      </div>

      {/* Story Section */}
      <section className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <h2 className="font-display text-3xl font-bold text-neon-pink">
            OUR STORY
          </h2>
          <div className="space-y-4 border-l-2 border-neon-pink pl-6 font-retro text-xl text-cream/80">
            <p>
              RETRO DROPS started in 2023 when a group of tech enthusiasts realized 
              something was missing in the modern world - the charm and character of 
              vintage technology.
            </p>
            <p>
              We scour the globe to find the best retro gadgets, vintage audio equipment, 
              and nostalgic décor pieces. Each item is carefully selected, tested, and 
              sometimes restored to its former glory.
            </p>
            <p>
              Whether you&apos;re a collector, a design enthusiast, or someone who 
              misses the simpler times, we&apos;ve got something special for you.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="border-2 border-retro-cyan bg-dark-800 p-6 text-center">
            <span className="font-display text-4xl font-bold text-retro-cyan">500+</span>
            <p className="mt-2 font-retro text-lg text-cream/60">PRODUCTS</p>
          </div>
          <div className="border-2 border-neon-pink bg-dark-800 p-6 text-center">
            <span className="font-display text-4xl font-bold text-neon-pink">10K+</span>
            <p className="mt-2 font-retro text-lg text-cream/60">HAPPY CUSTOMERS</p>
          </div>
          <div className="border-2 border-neon-green bg-dark-800 p-6 text-center">
            <span className="font-display text-4xl font-bold text-neon-green">30+</span>
            <p className="mt-2 font-retro text-lg text-cream/60">COUNTRIES</p>
          </div>
          <div className="border-2 border-neon-blue bg-dark-800 p-6 text-center">
            <span className="font-display text-4xl font-bold text-neon-blue">4.9</span>
            <p className="mt-2 font-retro text-lg text-cream/60">AVG RATING</p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="space-y-8">
        <h2 className="text-center font-display text-3xl font-bold text-neon-green">
          OUR VALUES
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="border-2 border-dark-600 bg-dark-800 p-6 transition-all hover:border-retro-cyan">
            <Heart className="h-10 w-10 text-neon-pink" />
            <h3 className="mt-4 font-display text-xl font-bold text-cream">
              PASSION FOR RETRO
            </h3>
            <p className="mt-2 font-retro text-lg text-cream/60">
              We genuinely love vintage tech. Every item we sell is something we&apos;d 
              be excited to own ourselves.
            </p>
          </div>
          <div className="border-2 border-dark-600 bg-dark-800 p-6 transition-all hover:border-neon-green">
            <Star className="h-10 w-10 text-retro-yellow" />
            <h3 className="mt-4 font-display text-xl font-bold text-cream">
              QUALITY FIRST
            </h3>
            <p className="mt-2 font-retro text-lg text-cream/60">
              We carefully vet every product and supplier. If it doesn&apos;t meet our 
              standards, it doesn&apos;t make it to our store.
            </p>
          </div>
          <div className="border-2 border-dark-600 bg-dark-800 p-6 transition-all hover:border-neon-pink">
            <Users className="h-10 w-10 text-neon-blue" />
            <h3 className="mt-4 font-display text-xl font-bold text-cream">
              CUSTOMER OBSESSED
            </h3>
            <p className="mt-2 font-retro text-lg text-cream/60">
              Your satisfaction is our priority. We&apos;re here to help with any 
              questions, concerns, or just to geek out about retro tech.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-4 border-neon-pink bg-dark-800 p-8 text-center md:p-12">
        <h2 className="font-display text-3xl font-bold text-neon-pink">
          JOIN THE RETRO REVOLUTION
        </h2>
        <p className="mx-auto mt-4 max-w-xl font-retro text-xl text-cream/80">
          Ready to add some vintage charm to your life? Browse our curated 
          collection and find your next favorite piece.
        </p>
        <Link
          href="/products"
          className="mt-8 inline-block border-4 border-retro-cyan bg-retro-cyan px-8 py-4 font-display text-xl font-bold text-dark-900 transition-all hover:bg-transparent hover:text-retro-cyan"
        >
          SHOP NOW
        </Link>
      </section>
    </div>
  );
}

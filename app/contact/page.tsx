"use client";

import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  CheckCircle,
} from "lucide-react";

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormState({ name: "", email: "", subject: "", message: "" });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (isSubmitted) {
    return (
      <div className="mx-auto max-w-2xl text-center">
        <div className="border-4 border-neon-green bg-dark-800 p-12">
          <CheckCircle className="mx-auto h-20 w-20 text-neon-green" />
          <h1 className="mt-6 font-display text-3xl font-bold text-neon-green">
            MESSAGE SENT!
          </h1>
          <p className="mt-4 font-retro text-xl text-cream/80">
            Thanks for reaching out! We&apos;ll get back to you within 24 hours.
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="mt-8 border-2 border-retro-cyan px-8 py-3 font-retro text-lg text-retro-cyan transition-all hover:bg-retro-cyan hover:text-dark-900"
          >
            SEND ANOTHER MESSAGE
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="border-b-2 border-retro-cyan pb-6">
        <div className="flex items-center gap-4">
          <MessageSquare className="h-10 w-10 text-retro-cyan" />
          <h1 className="font-display text-4xl font-bold tracking-wider text-retro-cyan text-neon-sm">
            CONTACT US
          </h1>
        </div>
        <p className="mt-2 font-retro text-xl text-cream/70">
          Got a question? We&apos;d love to hear from you!
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="name"
                className="block font-retro text-lg text-cream/80"
              >
                YOUR NAME
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formState.name}
                onChange={handleChange}
                required
                className="input-retro mt-2"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block font-retro text-lg text-cream/80"
              >
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formState.email}
                onChange={handleChange}
                required
                className="input-retro mt-2"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="subject"
              className="block font-retro text-lg text-cream/80"
            >
              SUBJECT
            </label>
            <select
              id="subject"
              name="subject"
              value={formState.subject}
              onChange={handleChange}
              required
              className="input-retro mt-2"
            >
              <option value="">Select a topic...</option>
              <option value="order">Order Inquiry</option>
              <option value="shipping">Shipping Question</option>
              <option value="return">Returns & Refunds</option>
              <option value="product">Product Question</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="message"
              className="block font-retro text-lg text-cream/80"
            >
              YOUR MESSAGE
            </label>
            <textarea
              id="message"
              name="message"
              value={formState.message}
              onChange={handleChange}
              required
              rows={6}
              className="input-retro mt-2 resize-none"
              placeholder="How can we help you?"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-3 border-4 border-neon-pink bg-neon-pink py-4 font-display text-xl font-bold text-dark-900 transition-all hover:bg-transparent hover:text-neon-pink disabled:opacity-50"
          >
            <Send className="h-6 w-6" />
            {isSubmitting ? "SENDING..." : "SEND MESSAGE"}
          </button>
        </form>

        {/* Contact Info */}
        <div className="space-y-6">
          <div className="border-2 border-retro-cyan bg-dark-800 p-6">
            <h2 className="font-display text-xl font-bold text-retro-cyan">
              GET IN TOUCH
            </h2>
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center border-2 border-neon-green">
                  <Mail className="h-6 w-6 text-neon-green" />
                </div>
                <div>
                  <p className="font-retro text-sm text-cream/60">EMAIL</p>
                  <p className="font-retro text-lg text-cream">
                    hello@retrodrops.store
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center border-2 border-neon-pink">
                  <Phone className="h-6 w-6 text-neon-pink" />
                </div>
                <div>
                  <p className="font-retro text-sm text-cream/60">PHONE</p>
                  <p className="font-retro text-lg text-cream">
                    +1 (555) 123-4567
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center border-2 border-neon-blue">
                  <MapPin className="h-6 w-6 text-neon-blue" />
                </div>
                <div>
                  <p className="font-retro text-sm text-cream/60">ADDRESS</p>
                  <p className="font-retro text-lg text-cream">
                    123 Retro Street
                    <br />
                    San Francisco, CA 94102
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-2 border-neon-green bg-dark-800 p-6">
            <h2 className="font-display text-xl font-bold text-neon-green">
              RESPONSE TIME
            </h2>
            <p className="mt-4 font-retro text-lg text-cream/80">
              We typically respond to all inquiries within 24 hours during
              business days (Monday - Friday, 9am - 6pm PST).
            </p>
          </div>

          <div className="border-2 border-neon-pink bg-dark-800 p-6">
            <h2 className="font-display text-xl font-bold text-neon-pink">
              QUICK LINKS
            </h2>
            <ul className="mt-4 space-y-2">
              <li>
                <a
                  href="/faq"
                  className="font-retro text-lg text-cream/80 hover:text-neon-pink"
                >
                  → Frequently Asked Questions
                </a>
              </li>
              <li>
                <a
                  href="/shipping"
                  className="font-retro text-lg text-cream/80 hover:text-neon-pink"
                >
                  → Shipping Information
                </a>
              </li>
              <li>
                <a
                  href="/returns"
                  className="font-retro text-lg text-cream/80 hover:text-neon-pink"
                >
                  → Returns & Refunds
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

import Stripe from "stripe";
import { type Env } from "../env";

let cachedStripe: Stripe | null = null;
let cachedKey: string | null = null;

export function getStripe(env: Env) {
  if (!env.STRIPE_SECRET_KEY) {
    throw new Error("Stripe is not configured. STRIPE_SECRET_KEY is missing.");
  }

  if (!cachedStripe || cachedKey !== env.STRIPE_SECRET_KEY) {
    cachedStripe = new Stripe(env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-06-20",
    });
    cachedKey = env.STRIPE_SECRET_KEY;
  }

  return cachedStripe;
}

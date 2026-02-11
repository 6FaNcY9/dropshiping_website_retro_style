"use client";

import Link from "next/link";
import {
  ShoppingCart,
  Minus,
  Plus,
  Trash2,
  ArrowLeft,
  CreditCard,
  Truck,
  Shield,
} from "lucide-react";
import { useCart } from "../components/CartContext";
import { useState } from "react";

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export default function CartPage() {
  const { state, removeItem, updateQuantity, totalPrice, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    if (state.items.length === 0) return;

    setIsCheckingOut(true);

    try {
      const response = await fetch("/api/checkout/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: state.items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else if (data.error) {
        alert(data.error + (data.required ? ` (Missing: ${data.required.join(", ")})` : ""));
      }
    } catch {
      alert("Checkout failed. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  const shippingCost = totalPrice >= 50 ? 0 : 9.99;
  const grandTotal = totalPrice + shippingCost;

  if (state.items.length === 0) {
    return (
      <div className="space-y-8">
        <div className="border-b-2 border-retro-cyan pb-6">
          <div className="flex items-center gap-4">
            <ShoppingCart className="h-10 w-10 text-retro-cyan" />
            <h1 className="font-display text-4xl font-bold tracking-wider text-retro-cyan text-neon-sm">
              YOUR CART
            </h1>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-6 flex h-32 w-32 items-center justify-center border-2 border-dashed border-dark-500">
            <ShoppingCart className="h-16 w-16 text-dark-500" />
          </div>
          <h2 className="font-display text-2xl font-bold text-cream">
            YOUR CART IS EMPTY
          </h2>
          <p className="mt-2 font-retro text-xl text-cream/60">
            Looks like you haven&apos;t added any retro goodies yet!
          </p>
          <Link
            href="/products"
            className="mt-8 border-4 border-retro-cyan bg-retro-cyan px-8 py-4 font-display text-xl font-bold text-dark-900 transition-all hover:bg-transparent hover:text-retro-cyan"
          >
            START SHOPPING
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-retro-cyan pb-6">
        <div className="flex items-center gap-4">
          <ShoppingCart className="h-10 w-10 text-retro-cyan" />
          <h1 className="font-display text-4xl font-bold tracking-wider text-retro-cyan text-neon-sm">
            YOUR CART
          </h1>
          <span className="border-2 border-neon-pink bg-neon-pink px-3 py-1 font-pixel text-xs text-dark-900">
            {state.items.length} {state.items.length === 1 ? "ITEM" : "ITEMS"}
          </span>
        </div>
        <Link
          href="/products"
          className="flex items-center gap-2 font-retro text-lg text-cream/70 transition-colors hover:text-retro-cyan"
        >
          <ArrowLeft className="h-5 w-5" />
          CONTINUE SHOPPING
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        {/* Cart Items */}
        <div className="space-y-4">
          {state.items.map((item) => (
            <div
              key={item.id}
              className="border-2 border-dark-600 bg-dark-800 p-4 transition-all hover:border-retro-cyan"
            >
              <div className="flex gap-4">
                {/* Product image */}
                <div className="h-24 w-24 flex-shrink-0 border-2 border-dark-600 bg-dark-700">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <ShoppingCart className="h-10 w-10 text-dark-500" />
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <Link
                      href={`/products/${item.id}`}
                      className="font-retro text-xl text-cream transition-colors hover:text-retro-cyan"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-1 font-display text-lg font-bold text-neon-green">
                      {formatPrice(item.price)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    {/* Quantity controls */}
                    <div className="flex items-center border-2 border-dark-600">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="flex h-10 w-10 items-center justify-center text-cream transition-colors hover:bg-dark-600 hover:text-neon-pink"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="flex h-10 w-14 items-center justify-center border-x-2 border-dark-600 font-retro text-xl text-cream">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="flex h-10 w-10 items-center justify-center text-cream transition-colors hover:bg-dark-600 hover:text-neon-green"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Subtotal and remove */}
                    <div className="flex items-center gap-4">
                      <span className="font-display text-xl font-bold text-cream">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="flex h-10 w-10 items-center justify-center border-2 border-dark-600 text-cream/60 transition-colors hover:border-neon-pink hover:text-neon-pink"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Clear cart */}
          <button
            onClick={clearCart}
            className="font-retro text-lg text-cream/50 transition-colors hover:text-neon-pink"
          >
            Clear all items
          </button>
        </div>

        {/* Order Summary */}
        <div className="h-fit space-y-6 border-2 border-retro-cyan bg-dark-800 p-6">
          <h2 className="font-display text-2xl font-bold text-retro-cyan">
            ORDER SUMMARY
          </h2>

          <div className="space-y-3 border-b-2 border-dark-600 pb-4">
            <div className="flex justify-between font-retro text-lg text-cream">
              <span>Subtotal</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between font-retro text-lg text-cream">
              <span>Shipping</span>
              <span className={shippingCost === 0 ? "text-neon-green" : ""}>
                {shippingCost === 0 ? "FREE" : formatPrice(shippingCost)}
              </span>
            </div>
            {shippingCost > 0 && (
              <p className="font-retro text-sm text-cream/50">
                Add {formatPrice(50 - totalPrice)} more for free shipping!
              </p>
            )}
          </div>

          <div className="flex justify-between">
            <span className="font-display text-xl font-bold text-cream">TOTAL</span>
            <span className="font-display text-2xl font-bold text-neon-green text-neon-sm">
              {formatPrice(grandTotal)}
            </span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={isCheckingOut}
            className="flex w-full items-center justify-center gap-3 border-4 border-neon-pink bg-neon-pink py-4 font-display text-xl font-bold text-dark-900 transition-all hover:bg-transparent hover:text-neon-pink disabled:opacity-50"
          >
            <CreditCard className="h-6 w-6" />
            {isCheckingOut ? "PROCESSING..." : "CHECKOUT"}
          </button>

          {/* Trust badges */}
          <div className="grid grid-cols-2 gap-4 border-t-2 border-dark-600 pt-4">
            <div className="flex items-center gap-2 text-cream/60">
              <Shield className="h-5 w-5 text-retro-cyan" />
              <span className="font-retro text-sm">SECURE PAYMENT</span>
            </div>
            <div className="flex items-center gap-2 text-cream/60">
              <Truck className="h-5 w-5 text-neon-green" />
              <span className="font-retro text-sm">FAST DELIVERY</span>
            </div>
          </div>

          {/* Payment icons placeholder */}
          <div className="flex items-center justify-center gap-4 border-t-2 border-dark-600 pt-4">
            <span className="font-retro text-sm text-cream/40">
              Powered by Stripe
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

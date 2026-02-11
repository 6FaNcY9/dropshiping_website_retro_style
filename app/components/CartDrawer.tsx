"use client";

import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useCart } from "./CartContext";

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export function CartDrawer({ isOpen }: { isOpen: boolean }) {
  const { state, closeCart, removeItem, updateQuantity, totalPrice, totalItems } = useCart();

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-dark-900/80 backdrop-blur-sm"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-md transform border-l-2 border-retro-cyan bg-dark-900 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-retro-cyan p-4">
          <div className="flex items-center gap-3">
            <ShoppingBag className="h-6 w-6 text-retro-cyan" />
            <h2 className="font-display text-xl font-bold tracking-wider text-cream">
              YOUR CART
            </h2>
            {totalItems > 0 && (
              <span className="bg-neon-pink px-2 py-1 font-pixel text-xs text-dark-900">
                {totalItems}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="flex h-10 w-10 items-center justify-center border-2 border-neon-pink transition-all hover:bg-neon-pink/20"
            aria-label="Close cart"
          >
            <X className="h-5 w-5 text-neon-pink" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4" style={{ maxHeight: "calc(100vh - 200px)" }}>
          {state.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center border-2 border-dashed border-dark-500">
                <ShoppingBag className="h-10 w-10 text-dark-500" />
              </div>
              <p className="font-retro text-xl text-cream/60">
                YOUR CART IS EMPTY
              </p>
              <p className="mt-2 font-retro text-lg text-cream/40">
                Add some retro goodies!
              </p>
              <Link
                href="/products"
                onClick={closeCart}
                className="mt-6 btn-neon border-retro-cyan text-retro-cyan px-6 py-3 font-retro text-lg"
              >
                BROWSE SHOP
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {state.items.map((item) => (
                <div
                  key={item.id}
                  className="border-2 border-dark-600 bg-dark-800 p-4 transition-all hover:border-retro-cyan"
                >
                  <div className="flex gap-4">
                    {/* Product image placeholder */}
                    <div className="h-20 w-20 flex-shrink-0 border-2 border-dark-600 bg-dark-700">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <ShoppingBag className="h-8 w-8 text-dark-500" />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col">
                      <h3 className="font-retro text-lg text-cream line-clamp-2">
                        {item.name}
                      </h3>
                      <p className="mt-1 font-display text-lg font-bold text-retro-cyan">
                        {formatPrice(item.price)}
                      </p>

                      <div className="mt-2 flex items-center justify-between">
                        {/* Quantity controls */}
                        <div className="flex items-center border-2 border-dark-600">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="flex h-8 w-8 items-center justify-center text-cream transition-colors hover:bg-dark-600 hover:text-neon-pink"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="flex h-8 w-10 items-center justify-center border-x-2 border-dark-600 font-retro text-lg text-cream">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="flex h-8 w-8 items-center justify-center text-cream transition-colors hover:bg-dark-600 hover:text-neon-green"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Remove button */}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="flex h-8 w-8 items-center justify-center text-cream/60 transition-colors hover:text-neon-pink"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {state.items.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 border-t-2 border-retro-cyan bg-dark-900 p-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-retro text-xl text-cream/80">TOTAL:</span>
              <span className="font-display text-2xl font-bold text-neon-green text-neon-sm">
                {formatPrice(totalPrice)}
              </span>
            </div>
            <div className="space-y-2">
              <Link
                href="/cart"
                onClick={closeCart}
                className="block w-full border-2 border-retro-cyan bg-transparent py-3 text-center font-retro text-lg text-retro-cyan transition-all hover:bg-retro-cyan hover:text-dark-900"
              >
                VIEW CART
              </Link>
              <Link
                href="/cart"
                onClick={closeCart}
                className="block w-full border-2 border-neon-pink bg-neon-pink py-3 text-center font-retro text-lg text-dark-900 transition-all hover:bg-transparent hover:text-neon-pink"
              >
                CHECKOUT
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

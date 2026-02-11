"use client";

import { useState } from "react";
import { ShoppingCart, Check, Minus, Plus } from "lucide-react";
import { useCart } from "../../components/CartContext";

type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl?: string | null;
};

export function ProductActions({ product }: { product: Product }) {
  const { addItem, state } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const incrementQty = () => setQuantity((q) => Math.min(q + 1, 10));
  const decrementQty = () => setQuantity((q) => Math.max(q - 1, 1));

  const itemInCart = state.items.find((item) => item.id === product.id);

  return (
    <div className="space-y-4">
      {/* Quantity selector */}
      <div className="flex items-center gap-4">
        <span className="font-retro text-lg text-cream/70">QTY:</span>
        <div className="flex items-center border-2 border-retro-cyan">
          <button
            onClick={decrementQty}
            className="flex h-12 w-12 items-center justify-center text-cream transition-colors hover:bg-retro-cyan hover:text-dark-900"
            aria-label="Decrease quantity"
          >
            <Minus className="h-5 w-5" />
          </button>
          <span className="flex h-12 w-16 items-center justify-center border-x-2 border-retro-cyan font-display text-xl font-bold text-cream">
            {quantity}
          </span>
          <button
            onClick={incrementQty}
            className="flex h-12 w-12 items-center justify-center text-cream transition-colors hover:bg-retro-cyan hover:text-dark-900"
            aria-label="Increase quantity"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Add to cart button */}
      <button
        onClick={handleAdd}
        disabled={added}
        className={`flex w-full items-center justify-center gap-3 border-4 py-4 font-display text-xl font-bold uppercase tracking-wider transition-all ${
          added
            ? "border-neon-green bg-neon-green text-dark-900"
            : "border-neon-pink bg-neon-pink text-dark-900 hover:bg-transparent hover:text-neon-pink hover:shadow-[0_0_20px_rgba(255,20,147,0.4)]"
        }`}
      >
        {added ? (
          <>
            <Check className="h-6 w-6" />
            ADDED TO CART!
          </>
        ) : (
          <>
            <ShoppingCart className="h-6 w-6" />
            ADD TO CART
          </>
        )}
      </button>

      {/* Cart status */}
      {itemInCart && !added && (
        <p className="text-center font-retro text-lg text-cream/60">
          You have {itemInCart.quantity} of this item in your cart
        </p>
      )}
    </div>
  );
}

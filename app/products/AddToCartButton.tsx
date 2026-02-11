"use client";

import { ShoppingCart, Check } from "lucide-react";
import { useState } from "react";
import { useCart } from "../components/CartContext";

type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl?: string | null;
};

export function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <button
      onClick={handleAdd}
      disabled={added}
      className={`flex items-center gap-2 border-2 px-4 py-2 font-retro text-base transition-all ${
        added
          ? "border-neon-green bg-neon-green text-dark-900"
          : "border-neon-pink bg-transparent text-neon-pink hover:bg-neon-pink hover:text-dark-900"
      }`}
    >
      {added ? (
        <>
          <Check className="h-4 w-4" />
          <span>ADDED!</span>
        </>
      ) : (
        <>
          <ShoppingCart className="h-4 w-4" />
          <span>ADD</span>
        </>
      )}
    </button>
  );
}

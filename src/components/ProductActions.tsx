"use client";

import { useState } from "react";
import { Product } from "@/lib/types";
import { useCart } from "@/lib/cart-context";
import { Button } from "./Button";
import { Minus, Plus } from "lucide-react";

export default function ProductActions({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const { add } = useCart();

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-3 rounded-full border border-line px-3 py-2.5">
        <button
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="text-silver hover:text-ion"
          aria-label="Уменьшить количество"
        >
          <Minus size={14} />
        </button>
        <span className="w-5 text-center text-sm">{quantity}</span>
        <button
          onClick={() => setQuantity((q) => q + 1)}
          className="text-silver hover:text-ion"
          aria-label="Увеличить количество"
        >
          <Plus size={14} />
        </button>
      </div>
      <Button onClick={() => add(product, quantity)} className="flex-1 sm:flex-none">
        Добавить в корзину
      </Button>
    </div>
  );
}

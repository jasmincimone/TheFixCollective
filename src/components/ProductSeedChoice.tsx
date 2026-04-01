"use client";

import { useMemo, useState } from "react";

import type { Product } from "@/types/product";
import { AddToCartButton } from "@/components/AddToCartButton";

type Props = {
  product: Product;
};

export function ProductSeedChoice({ product }: Props) {
  const seedOption = useMemo(() => product.options?.find((o) => o.id === "seed"), [product.options]);
  const defaultChoiceId = seedOption?.choices?.[0]?.id;
  const [choiceId, setChoiceId] = useState<string>(defaultChoiceId ?? "");

  if (!seedOption) return null;

  const selectedLabel = seedOption.choices.find((c) => c.id === choiceId)?.label;
  const selections = choiceId ? { [seedOption.id]: choiceId } : undefined;

  return (
    <div className="rounded-2xl border border-fix-border/15 bg-fix-surface p-4">
      <div className="text-sm font-semibold text-fix-heading">{seedOption.label}</div>
      <p className="mt-1 text-xs text-fix-text-muted">Pick one seed pack (5 seeds) for this kit.</p>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="min-w-0 flex-1">
          <span className="sr-only">{seedOption.label}</span>
          <select
            value={choiceId}
            onChange={(e) => setChoiceId(e.target.value)}
            className="w-full rounded-xl border border-fix-border/20 bg-fix-bg-muted px-3 py-2 text-sm text-fix-text focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber"
          >
            {seedOption.choices.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </label>

        <AddToCartButton
          productId={product.id}
          selections={selections}
          size="lg"
          variant="cta"
          className="sm:shrink-0"
        >
          Add {selectedLabel ? `(${selectedLabel})` : ""} to cart
        </AddToCartButton>
      </div>
    </div>
  );
}


"use client";

import { useState } from "react";

const EXTENSIONS = ["png", "svg", "webp", "jpg"] as const;

type Props = {
  shopSlug: string;
  shopDisplayName: string;
  className?: string;
};

export function ShopLogo({ shopSlug, shopDisplayName, className }: Props) {
  const [attempt, setAttempt] = useState(0);
  const [showFallback, setShowFallback] = useState(false);

  const ext = EXTENSIONS[attempt];
  const src = `/images/shops/${shopSlug}/logo.${ext}`;

  const handleError = () => {
    if (attempt + 1 < EXTENSIONS.length) {
      setAttempt((a) => a + 1);
    } else {
      setShowFallback(true);
    }
  };

  if (showFallback) {
    return (
      <span
        className={`flex h-full w-full items-center justify-center text-lg font-bold text-clay/80 ${className ?? ""}`}
        aria-hidden
      >
        {shopDisplayName.charAt(0)}
      </span>
    );
  }

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element -- try multiple extensions via onError */}
      <img
        src={src}
        alt=""
        className={className}
        onError={handleError}
      />
    </>
  );
}

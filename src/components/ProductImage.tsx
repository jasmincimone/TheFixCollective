"use client";

import { useState } from "react";
import { getProductImageUrls } from "@/lib/productImage";

type Props = {
  shop: string;
  productId: string;
  /** When set (e.g. admin-uploaded catalog URL), uses this instead of /images/shops/... paths. */
  src?: string | null;
  alt?: string;
  placeholderText?: string;
  className?: string;
  imgClassName?: string;
  /** `cover` fills the frame (may crop). `contain` shows the full image (good for book covers). */
  fit?: "cover" | "contain";
};

/** Shows product image (tries .jpg, .png, .webp) with placeholder fallback when missing. */
export function ProductImage({
  shop,
  productId,
  src: directSrc,
  alt = "",
  placeholderText = "Product",
  className = "",
  imgClassName = "",
  fit = "cover",
}: Props) {
  const urls = directSrc?.trim()
    ? [directSrc.trim()]
    : getProductImageUrls(shop, productId);
  const [attempt, setAttempt] = useState(0);
  const failed = attempt >= urls.length;

  if (failed) {
    return (
      <div
        className={`flex items-center justify-center bg-fix-bg-muted text-fix-text-muted ${className}`}
      >
        <span className="text-sm font-medium">{placeholderText}</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element -- multi-extension fallback via onError */}
      <img
        src={urls[attempt]}
        alt={alt}
        className={`h-full w-full ${fit === "contain" ? "object-contain" : "object-cover"} ${imgClassName}`}
        onError={() => setAttempt((a) => a + 1)}
      />
    </div>
  );
}

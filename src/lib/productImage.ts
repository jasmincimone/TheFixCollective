const EXTENSIONS = ["jpg", "png", "webp"] as const;

/**
 * Standard path for a product image. Place files in
 * public/images/shops/{shop}/products/{productId}.jpg (or .png, .webp).
 */
export function getProductImageUrl(shop: string, productId: string, ext: (typeof EXTENSIONS)[number] = "jpg"): string {
  return `/images/shops/${shop}/products/${productId}.${ext}`;
}

export function getProductImageUrls(shop: string, productId: string): string[] {
  return EXTENSIONS.map((e) => getProductImageUrl(shop, productId, e));
}

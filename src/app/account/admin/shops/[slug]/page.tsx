import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminShopListingsClient } from "@/components/AdminShopListingsClient";
import { AdminShopPageEditor } from "@/components/AdminShopPageEditor";
import { getShop } from "@/config/shops";

export default function AdminShopDetailPage({ params }: { params: { slug: string } }) {
  const shop = getShop(params.slug);
  if (!shop) notFound();

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            href="/account/admin/shops"
            className="text-sm font-medium text-fix-link hover:text-fix-link-hover"
          >
            ← All shops
          </Link>
          <h2 className="mt-2 text-lg font-semibold text-fix-heading">{shop.name}</h2>
          <p className="mt-1 text-sm text-fix-text-muted">{shop.tagline}</p>
        </div>
        <Link
          href={`/shops/${shop.slug}`}
          className="text-sm font-medium text-fix-link hover:text-fix-link-hover"
        >
          View public shop
        </Link>
      </div>

      <AdminShopPageEditor shopSlug={shop.slug} shopName={shop.name} />
      <AdminShopListingsClient shopSlug={shop.slug} />
    </div>
  );
}

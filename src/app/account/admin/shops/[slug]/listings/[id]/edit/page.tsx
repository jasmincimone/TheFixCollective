import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminShopCatalogListingForm } from "@/components/AdminShopCatalogListingForm";
import { getShop } from "@/config/shops";

export default function AdminEditShopListingPage({
  params,
}: {
  params: { slug: string; id: string };
}) {
  const shop = getShop(params.slug);
  if (!shop) notFound();

  return (
    <div className="space-y-6">
      <Link
        href={`/account/admin/shops/${shop.slug}`}
        className="text-sm font-medium text-fix-link hover:text-fix-link-hover"
      >
        ← Back to {shop.name}
      </Link>
      <AdminShopCatalogListingForm shopSlug={shop.slug} listingId={params.id} />
    </div>
  );
}

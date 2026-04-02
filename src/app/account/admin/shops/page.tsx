import Link from "next/link";

import { SHOPS } from "@/config/shops";
import { Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";

export default function AdminShopsHubPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-fix-heading">Platform shops</h2>
        <p className="mt-1 text-sm text-fix-text-muted">
          Edit each shop&apos;s public landing page and catalog listings (merged with the built-in product
          seed data).
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {SHOPS.map((shop) => (
          <Card key={shop.slug} className="p-5">
            <div className="text-sm font-semibold text-fix-heading">{shop.name}</div>
            <p className="mt-2 text-sm text-fix-text-muted">{shop.tagline}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <ButtonLink href={`/account/admin/shops/${shop.slug}`} variant="cta" size="sm">
                Manage
              </ButtonLink>
              <Link
                href={`/shops/${shop.slug}`}
                className="inline-flex items-center rounded-full px-4 py-2 text-sm font-medium text-fix-link ring-1 ring-fix-border/20 hover:bg-fix-bg-muted"
              >
                View public page
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

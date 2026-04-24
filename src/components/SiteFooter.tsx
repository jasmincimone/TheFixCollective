import Link from "next/link";

import { Container } from "@/components/Container";
import { SHOPS } from "@/config/shops";

export function SiteFooter() {
  return (
    <footer className="border-t border-fix-border/15 bg-fix-bg-muted">
      <Container className="py-10">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="text-sm font-semibold text-fix-heading">
              RootSync
            </div>
            <p className="mt-2 text-sm text-fix-text-muted">
              Connecting what people make with the communities around them.
            </p>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-fix-text-muted">
              Shops
            </div>
            <div className="mt-3 grid gap-2">
              {SHOPS.map((shop) => (
                <Link
                  key={shop.slug}
                  href={`/shops/${shop.slug}`}
                  className="text-sm text-fix-link hover:text-fix-link-hover"
                >
                  {shop.name}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-fix-text-muted">
              RootSync
            </div>
            <div className="mt-3 grid gap-2">
              <Link
                href="/about"
                className="text-sm text-fix-link hover:text-fix-link-hover"
              >
                About us
              </Link>
              <Link
                href="/community"
                className="text-sm text-fix-link hover:text-fix-link-hover"
              >
                Community
              </Link>
              <Link
                href="/marketplace"
                className="text-sm text-fix-link hover:text-fix-link-hover"
              >
                Farmer marketplace
              </Link>
              <Link
                href="/rootsyncai"
                className="text-sm text-fix-link hover:text-fix-link-hover"
              >
                RootSync (AI assistant)
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-fix-border/15 pt-6 text-xs text-fix-text-muted sm:flex-row sm:items-center sm:justify-between">
          <div>
            © {new Date().getFullYear()} RootSync, Inc., powered by The Fix Collective, LLC.
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <Link href="/about" className="hover:text-fix-heading">
              About us
            </Link>
            <Link href="/privacy" className="hover:text-fix-heading">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-fix-heading">
              Terms
            </Link>
            <Link href="/disclaimer" className="hover:text-fix-heading">
              Disclaimer
            </Link>
            <Link href="/ai-disclaimer" className="hover:text-fix-heading">
              AI disclaimer
            </Link>
            <Link href="/vendor-agreement" className="hover:text-fix-heading">
              Vendor agreement
            </Link>
            <Link href="/seller-terms" className="hover:text-fix-heading">
              Seller terms
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CircleUser, Menu, ShoppingBag } from "lucide-react";
import { useSession } from "next-auth/react";
import { useContext, useMemo, useState } from "react";

import { CartContext } from "@/context/CartContext";
import {
  isPlatformHeaderRootsyncSectionActive,
  PLATFORM_HEADER_ROOTSYNC_MENU_LINKS,
} from "@/config/platformNav";
import { SHOPS } from "@/config/shops";
import { cn } from "@/lib/cn";
import { rememberPathBeforeCart } from "@/lib/cartReturn";
import { leaveMenu, rememberPathBeforeMenu } from "@/lib/menuReturn";

import { Container } from "./Container";
import { ButtonLink } from "./ui/Button";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const [shopsOpen, setShopsOpen] = useState(false);
  const [rootsyncOpen, setRootsyncOpen] = useState(false);
  const cart = useContext(CartContext);
  const cartCount = cart?.itemCount ?? 0;

  const accountHref =
    sessionStatus === "loading" || session
      ? "/account"
      : "/login?callbackUrl=/account";
  const accountAria =
    sessionStatus === "loading"
      ? "Account"
      : session?.user?.email
        ? `Account (${session.user.email})`
        : "Sign in to account";

  const activeShop = useMemo(() => {
    const match = pathname.match(/^\/shops\/([^/]+)/);
    const slug = match?.[1];
    return SHOPS.find((s) => s.slug === slug);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-fix-border/15 bg-fix-surface">
      <Container className="flex h-16 items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {pathname === "/menu" ? (
            <button
              type="button"
              onClick={() => leaveMenu(router)}
              className="relative z-10 -ml-1 inline-flex h-11 min-w-[44px] shrink-0 items-center justify-center gap-1.5 rounded-full px-2 text-fix-text hover:bg-fix-bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-fix-cta focus-visible:ring-offset-2 active:opacity-90 lg:hidden"
              aria-label="Close menu"
            >
              <Menu className="h-6 w-6 shrink-0" aria-hidden />
              <span className="text-sm font-medium">Menu</span>
            </button>
          ) : (
            <Link
              href="/menu"
              onClick={() => rememberPathBeforeMenu(pathname)}
              className="relative z-10 -ml-1 inline-flex h-11 min-w-[44px] shrink-0 items-center justify-center gap-1.5 rounded-full px-2 text-fix-text hover:bg-fix-bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-fix-cta focus-visible:ring-offset-2 active:opacity-90 lg:hidden"
              aria-label="Menu"
            >
              <Menu className="h-6 w-6 shrink-0" aria-hidden />
              <span className="text-sm font-medium">Menu</span>
            </Link>
          )}

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-fix-cta focus-visible:ring-offset-2"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-fix-bg-muted text-bark ring-1 ring-inset ring-fix-border/20">
              TF
            </span>
            <div className="leading-tight">
              <div className="text-sm font-semibold text-fix-heading">
                RootSync
              </div>
              <div className="text-xs text-fix-text-muted">
                {activeShop ? activeShop.name : "Stay Synced!"}
              </div>
            </div>
          </Link>
        </div>

        <nav className="relative hidden flex-wrap items-center gap-1 lg:flex">
          <div
            className="relative"
            onMouseLeave={() => setShopsOpen(false)}
          >
            <button
              type="button"
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm text-fix-text hover:bg-fix-bg-muted hover:text-fix-heading focus:outline-none focus-visible:ring-2 focus-visible:ring-fix-cta focus-visible:ring-offset-2",
                pathname.startsWith("/shops") && "bg-fix-bg-muted text-fix-heading"
              )}
              aria-haspopup="menu"
              aria-expanded={shopsOpen}
              onClick={() => {
                setRootsyncOpen(false);
                setShopsOpen((v) => !v);
              }}
              onMouseEnter={() => {
                setRootsyncOpen(false);
                setShopsOpen(true);
              }}
            >
              The Fix Shops
              <span
                className={cn(
                  "text-[10px] transition-transform",
                  shopsOpen && "rotate-180"
                )}
              >
                ▾
              </span>
            </button>
            {shopsOpen ? (
              <div
                className="absolute left-0 top-full z-40 w-72 pt-2"
                role="menu"
                onMouseEnter={() => setShopsOpen(true)}
              >
                <div className="rounded-2xl border border-fix-border/15 bg-fix-surface p-2 shadow-soft">
                  <Link
                    href="/shops"
                    className="block rounded-xl px-3 py-2 text-xs font-semibold uppercase tracking-wide text-fix-text-muted hover:bg-fix-bg-muted"
                    onClick={() => setShopsOpen(false)}
                  >
                    View all shops
                  </Link>
                  <div className="mt-1 grid gap-1">
                    {SHOPS.map((shop) => (
                      <Link
                        key={shop.slug}
                        href={`/shops/${shop.slug}`}
                        onClick={() => setShopsOpen(false)}
                        className="block rounded-xl px-3 py-2 text-sm text-fix-link hover:bg-fix-bg-muted hover:text-fix-link-hover"
                      >
                        <div className="font-semibold text-fix-heading">
                          {shop.name}
                        </div>
                        <div className="text-xs text-fix-text-muted">
                          {shop.tagline}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <div className="relative" onMouseLeave={() => setRootsyncOpen(false)}>
            <button
              type="button"
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm text-fix-text hover:bg-fix-bg-muted hover:text-fix-heading focus:outline-none focus-visible:ring-2 focus-visible:ring-fix-cta focus-visible:ring-offset-2",
                isPlatformHeaderRootsyncSectionActive(pathname) && "bg-fix-bg-muted text-fix-heading"
              )}
              aria-haspopup="menu"
              aria-expanded={rootsyncOpen}
              onClick={() => {
                setShopsOpen(false);
                setRootsyncOpen((v) => !v);
              }}
              onMouseEnter={() => {
                setShopsOpen(false);
                setRootsyncOpen(true);
              }}
            >
              RootSync
              <span
                className={cn(
                  "text-[10px] transition-transform",
                  rootsyncOpen && "rotate-180"
                )}
              >
                ▾
              </span>
            </button>
            {rootsyncOpen ? (
              <div
                className="absolute left-0 top-full z-40 w-72 pt-2"
                role="menu"
                onMouseEnter={() => setRootsyncOpen(true)}
              >
                <div className="rounded-2xl border border-fix-border/15 bg-fix-surface p-2 shadow-soft">
                  <Link
                    href="/rootsync"
                    className="block rounded-xl px-3 py-2 text-xs font-semibold uppercase tracking-wide text-fix-text-muted hover:bg-fix-bg-muted"
                    onClick={() => setRootsyncOpen(false)}
                  >
                    View RootSync platform
                  </Link>
                  <div className="mt-1 grid gap-1">
                    {PLATFORM_HEADER_ROOTSYNC_MENU_LINKS.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setRootsyncOpen(false)}
                        className={cn(
                          "block rounded-xl px-3 py-2 text-sm text-fix-link hover:bg-fix-bg-muted hover:text-fix-link-hover",
                          isActive(pathname, item.href) && "bg-fix-bg-muted font-medium text-fix-heading"
                        )}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </nav>

        <div className="flex items-center gap-2">
          <ButtonLink
            href="/shops"
            variant="secondary"
            size="sm"
            className="shrink-0 justify-center text-center"
          >
            Browse shops
          </ButtonLink>
          <Link
            href={accountHref}
            aria-label={accountAria}
            className={cn(
              "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-fix-text hover:bg-fix-bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-fix-cta focus-visible:ring-offset-2",
              pathname.startsWith("/account") && "bg-fix-bg-muted text-fix-heading"
            )}
          >
            <CircleUser className="h-5 w-5" aria-hidden />
          </Link>
          <Link
            href="/cart"
            onClick={() => {
              if (pathname !== "/cart") rememberPathBeforeCart(pathname);
            }}
            aria-label={cartCount > 0 ? `Cart (${cartCount} items)` : "Cart"}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-fix-text hover:bg-fix-bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-fix-cta focus-visible:ring-offset-2"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-forest px-1.5 text-xs font-semibold text-fix-primary-foreground">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            ) : null}
          </Link>
        </div>
      </Container>
    </header>
  );
}

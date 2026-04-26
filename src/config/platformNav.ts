/** Shared labels for header + /menu + mobile panel (single source of truth). */
export const PLATFORM_NAV_LINKS = [
  { href: "/rootsync", label: "RootSync" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/rootsyncai", label: "RootSync AI" },
  { href: "/messages/inbox", label: "Messages" },
  { href: "/community", label: "Community" },
  { href: "/courses", label: "Courses" },
  { href: "/downloads", label: "Downloads" },
] as const;

/** Large-screen header: items under the RootSync dropdown (order matches product copy). */
export const PLATFORM_HEADER_ROOTSYNC_MENU_LINKS = [
  { href: "/marketplace", label: "Marketplace" },
  { href: "/community", label: "Community" },
  { href: "/rootsyncai", label: "RootSync AI" },
  { href: "/messages/inbox", label: "Messages" },
  { href: "/courses", label: "Courses" },
  { href: "/downloads", label: "Downloads" },
] as const;

export function isPlatformHeaderRootsyncSectionActive(pathname: string): boolean {
  if (pathname.startsWith("/rootsyncai")) return true;
  if (pathname === "/rootsync" || pathname.startsWith("/rootsync/")) return true;
  if (pathname.startsWith("/marketplace")) return true;
  if (pathname.startsWith("/community")) return true;
  if (pathname.startsWith("/messages")) return true;
  if (pathname.startsWith("/courses")) return true;
  if (pathname.startsWith("/downloads")) return true;
  return false;
}

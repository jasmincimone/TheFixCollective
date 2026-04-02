export const MENU_RETURN_PATH_KEY = "tfc_menu_return";

type RouterLike = { push: (href: string) => void; back: () => void };

/** Call when navigating to /menu so Close can return to this path. */
export function rememberPathBeforeMenu(pathname: string): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(MENU_RETURN_PATH_KEY, pathname);
  } catch {
    // private mode / quota
  }
}

function isSafeInternalPath(p: string): boolean {
  return p.startsWith("/") && !p.startsWith("//") && !p.includes("://");
}

/** Leave /menu: prefer stored path, then history.back(), then home. */
export function leaveMenu(router: RouterLike): void {
  if (typeof window === "undefined") return;
  try {
    const stored = sessionStorage.getItem(MENU_RETURN_PATH_KEY);
    sessionStorage.removeItem(MENU_RETURN_PATH_KEY);
    if (stored && isSafeInternalPath(stored)) {
      router.push(stored);
      return;
    }
  } catch {
    // ignore
  }
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push("/");
  }
}

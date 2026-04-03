export const CART_RETURN_PATH_KEY = "tfc_cart_return";

type RouterLike = { push: (href: string) => void; back: () => void };

/** Call when navigating to /cart so Close can return to this path. */
export function rememberPathBeforeCart(pathname: string): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(CART_RETURN_PATH_KEY, pathname);
  } catch {
    // private mode / quota
  }
}

function isSafeInternalPath(p: string): boolean {
  return p.startsWith("/") && !p.startsWith("//") && !p.includes("://");
}

/** Leave /cart: prefer stored path, then history.back(), then home. */
export function leaveCart(router: RouterLike): void {
  if (typeof window === "undefined") return;
  try {
    const stored = sessionStorage.getItem(CART_RETURN_PATH_KEY);
    sessionStorage.removeItem(CART_RETURN_PATH_KEY);
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

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";

import { getProduct as getStaticProduct } from "@/data/products";
import type { CartItem } from "@/types/product";
import type { Product } from "@/types/product";

const CART_STORAGE_KEY = "fix-collective-cart-v2";

type CartContextValue = {
  items: CartItem[];
  addItem: (productId: string, quantity?: number, selections?: CartItem["selections"]) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  itemCount: number;
  clearCart: () => void;
  /** Merged catalog (DB + seed). Falls back to static until the snapshot loads. */
  resolveProduct: (productId: string) => Product | undefined;
};

export const CartContext = createContext<CartContextValue | null>(null);

function stableStringifySelections(selections: CartItem["selections"]) {
  if (!selections) return "";
  const entries = Object.entries(selections).sort(([a], [b]) => a.localeCompare(b));
  return entries.map(([k, v]) => `${k}:${v}`).join("|");
}

function makeCartKey(productId: string, selections: CartItem["selections"]) {
  const s = stableStringifySelections(selections);
  return s ? `${productId}__${s}` : productId;
}

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((x): CartItem | null => {
        if (!x || typeof x !== "object") return null;
        const obj = x as Partial<CartItem> & { productId?: unknown; quantity?: unknown };
        const productId = typeof obj.productId === "string" ? obj.productId : null;
        const quantity = typeof obj.quantity === "number" ? obj.quantity : 1;
        const selections =
          obj.selections && typeof obj.selections === "object" ? (obj.selections as CartItem["selections"]) : undefined;
        if (!productId) return null;
        const key = typeof obj.key === "string" ? obj.key : makeCartKey(productId, selections);
        return { key, productId, quantity, selections };
      })
      .filter((x): x is CartItem => x != null);
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [catalogById, setCatalogById] = useState<Map<string, Product> | null>(null);

  useEffect(() => {
    setItems(loadCart());
    setMounted(true);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/catalog/products")
      .then((r) => r.json())
      .then((data: { products?: Product[] }) => {
        if (cancelled || !Array.isArray(data.products)) return;
        const m = new Map<string, Product>();
        for (const p of data.products) {
          m.set(p.id, p);
        }
        setCatalogById(m);
      })
      .catch(() => {
        if (!cancelled) setCatalogById(new Map());
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const resolveProduct = useCallback(
    (productId: string) => catalogById?.get(productId) ?? getStaticProduct(productId),
    [catalogById],
  );

  useEffect(() => {
    if (mounted) saveCart(items);
  }, [items, mounted]);

  const addItem = useCallback(
    (productId: string, quantity = 1, selections?: CartItem["selections"]) => {
      const product = resolveProduct(productId);
      if (!product) return;
    const key = makeCartKey(productId, selections);
    setItems((prev) => {
      const existing = prev.find((i) => i.key === key);
      const next = existing
        ? prev.map((i) =>
            i.key === key
              ? { ...i, quantity: i.quantity + quantity }
              : i
          )
        : [...prev, { key, productId, quantity, selections }];
      return next;
    });
  },
    [resolveProduct],
  );

  const removeItem = useCallback((key: string) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const updateQuantity = useCallback((key: string, quantity: number) => {
    if (quantity < 1) {
      setItems((prev) => prev.filter((i) => i.key !== key));
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.key === key ? { ...i, quantity } : i
      )
    );
  }, []);

  const itemCount = useMemo(
    () => items.reduce((n, i) => n + i.quantity, 0),
    [items]
  );

  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      itemCount,
      clearCart,
      resolveProduct,
    }),
    [items, addItem, removeItem, updateQuantity, itemCount, clearCart, resolveProduct]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

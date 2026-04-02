import { NextResponse } from "next/server";

import { getAllMergedProductsForPublic } from "@/lib/shopCatalog";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = await getAllMergedProductsForPublic();
    return NextResponse.json({ products });
  } catch (e) {
    console.error("[catalog/products]", e);
    return NextResponse.json({ error: "Failed to load catalog" }, { status: 500 });
  }
}

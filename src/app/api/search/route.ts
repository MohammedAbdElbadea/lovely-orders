import { NextRequest, NextResponse } from "next/server";
import { searchProducts } from "@/services/search.service";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") ?? "";
  const limit = Math.min(
    parseInt(request.nextUrl.searchParams.get("limit") ?? "10", 10),
    50
  );

  if (!q.trim()) {
    return NextResponse.json({ results: [] });
  }

  try {
    const results = await searchProducts(q, limit);
    return NextResponse.json({
      results: results.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        brand: p.brand?.name,
        imageUrl:
          p.images?.find((i) => i.is_primary)?.url ?? p.images?.[0]?.url,
      })),
    });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}

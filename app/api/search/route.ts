import { isLocale } from "@/lib/labels";
import { SearchError, searchBusinesses } from "@/lib/search";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const query = params.get("q") ?? "";
  const city = params.get("city") ?? "";
  const hlParam = params.get("hl") ?? "en";
  const hl = isLocale(hlParam) ? hlParam : "en";

  try {
    const result = await searchBusinesses({ query, cityId: city, hl });
    return Response.json(result);
  } catch (error) {
    if (error instanceof SearchError) {
      const status = error.code === "upstream" ? 502 : 400;
      return Response.json({ error: error.code }, { status });
    }
    return Response.json({ error: "upstream" }, { status: 502 });
  }
}

import { connection } from "next/server";
import { getCity } from "@/lib/cities";
import { buildDemoPayload } from "@/lib/demo";
import type { Locale } from "@/lib/labels";
import { normalizeLocalResults } from "@/lib/normalize";
import { serpApiMapsUrl } from "@/lib/serpapi";
import type { SearchResponse } from "@/lib/types";

export class SearchError extends Error {
  constructor(readonly code: "missing_query" | "unknown_city" | "upstream") {
    super(code);
  }
}

export async function searchBusinesses(input: {
  query: string;
  cityId: string;
  hl: Locale;
}): Promise<SearchResponse> {
  const query = input.query.trim();
  const city = getCity(input.cityId);
  if (!city) throw new SearchError("unknown_city");
  if (!query || query.length > 80) throw new SearchError("missing_query");

  await connection();
  const apiKey = process.env.SERPAPI_API_KEY?.trim();
  if (!apiKey) {
    return {
      mode: "demo",
      language: input.hl,
      city: city.id,
      query,
      results: normalizeLocalResults(buildDemoPayload(city.id, query, input.hl)),
    };
  }

  const url = serpApiMapsUrl({
    apiKey,
    query,
    cityId: city.id,
    hl: input.hl,
  });
  if (!url) throw new SearchError("unknown_city");

  let response: Response;
  try {
    response = await fetch(url, { cache: "no-store" });
  } catch {
    throw new SearchError("upstream");
  }
  if (!response.ok) throw new SearchError("upstream");

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new SearchError("upstream");
  }

  return {
    mode: "live",
    language: input.hl,
    city: city.id,
    query,
    results: normalizeLocalResults(payload),
  };
}

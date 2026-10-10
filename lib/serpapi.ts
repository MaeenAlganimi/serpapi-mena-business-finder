import { getCity } from "@/lib/cities";
import type { Locale } from "@/lib/labels";

export function serpApiMapsUrl(input: {
  apiKey: string;
  query: string;
  cityId: string;
  hl: Locale;
}): string | null {
  const city = getCity(input.cityId);
  if (!city) return null;
  const url = new URL("https://serpapi.com/search.json");
  url.searchParams.set("engine", "google_maps");
  url.searchParams.set("type", "search");
  url.searchParams.set("q", input.query);
  url.searchParams.set("ll", city.ll);
  url.searchParams.set("hl", input.hl);
  url.searchParams.set("api_key", input.apiKey);
  return url.toString();
}

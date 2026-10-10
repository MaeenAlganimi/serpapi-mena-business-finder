import { getCity } from "@/lib/cities";
import type { Locale } from "@/lib/labels";
import places from "@/fixtures/demo-places.json";

type Copy = {
  title: string;
  type: string;
  address: string;
  hours: string;
};

type DemoPlace = {
  cityId: string;
  categories: string[];
  rating: number;
  reviews: number;
  phone: string;
  website: string;
  latitude: number;
  longitude: number;
  en: Copy;
  ar: Copy;
};

const demoPlaces = places as DemoPlace[];

export function buildDemoPayload(cityId: string, query: string, hl: Locale) {
  const city = getCity(cityId);
  const needle = query.trim().toLowerCase();
  const matches = demoPlaces.filter((place) => {
    if (place.cityId !== cityId || needle.length === 0) return false;
    const haystack = [
      ...place.categories,
      place.en.title,
      place.ar.title,
      place.en.type,
      place.ar.type,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(needle);
  });

  return {
    search_metadata: {
      id: "demo",
      status: "Success",
      json_endpoint: "demo://fixtures/demo-places.json",
    },
    search_parameters: {
      engine: "google_maps",
      type: "search",
      q: query,
      ll: city?.ll ?? "",
      hl,
    },
    local_results: matches.map((place, index) => {
      const copy = place[hl];
      return {
        position: index + 1,
        title: copy.title,
        rating: place.rating,
        reviews: place.reviews,
        type: copy.type,
        address: copy.address,
        phone: place.phone,
        hours: copy.hours,
        website: place.website,
        gps_coordinates: {
          latitude: place.latitude,
          longitude: place.longitude,
        },
      };
    }),
  };
}

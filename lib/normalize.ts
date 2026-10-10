import type { BusinessListing } from "@/lib/types";

function asRecord(value: unknown): Record<string, unknown> | null {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return null;
}

function asString(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return "";
}

function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function formatOperatingHours(value: unknown): string {
  const record = asRecord(value);
  if (!record) return "";
  return Object.entries(record)
    .filter((entry): entry is [string, string] => typeof entry[1] === "string" && entry[1].trim() !== "")
    .map(([day, hours]) => `${day}: ${hours.trim()}`)
    .join("; ");
}

function hoursOf(place: Record<string, unknown>): string {
  const hours = asString(place.hours);
  if (hours) return hours;
  const openState = asString(place.open_state);
  if (openState) return openState;
  return formatOperatingHours(place.operating_hours);
}

function linkOf(place: Record<string, unknown>): string {
  const website = asString(place.website);
  if (website) return website;
  const link = asString(place.link);
  if (link) return link;
  const coords = asRecord(place.gps_coordinates);
  const latitude = coords ? asNumber(coords.latitude) : null;
  const longitude = coords ? asNumber(coords.longitude) : null;
  if (latitude !== null && longitude !== null) {
    return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
  }
  const placeId = asString(place.place_id);
  if (placeId) {
    return `https://www.google.com/maps/search/?api=1&query_place_id=${encodeURIComponent(placeId)}`;
  }
  return "";
}

export function normalizePlace(place: unknown): BusinessListing | null {
  const record = asRecord(place);
  if (!record) return null;
  const name = asString(record.title);
  if (!name) return null;
  return {
    name,
    rating: asNumber(record.rating),
    reviews: asNumber(record.reviews),
    address: asString(record.address),
    phone: asString(record.phone),
    hours: hoursOf(record),
    link: linkOf(record),
    type: asString(record.type),
  };
}

export function normalizeLocalResults(payload: unknown): BusinessListing[] {
  const record = asRecord(payload);
  if (!record) return [];
  const local = Array.isArray(record.local_results) ? record.local_results : [];
  const listings = local
    .map((place) => normalizePlace(place))
    .filter((place): place is BusinessListing => place !== null);
  if (listings.length > 0) return listings;
  const single = normalizePlace(record.place_results);
  return single ? [single] : [];
}

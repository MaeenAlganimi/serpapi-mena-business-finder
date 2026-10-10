import type { BusinessListing } from "@/lib/types";

const columns = ["name", "type", "rating", "reviews", "address", "phone", "hours", "link"] as const;

export type CsvColumn = (typeof columns)[number];
export type CsvHeaders = Record<CsvColumn, string>;

function cell(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replaceAll('"', '""')}"`;
  }
  return value;
}

export function listingsToCsv(listings: BusinessListing[], headers: CsvHeaders): string {
  const headerRow = columns.map((key) => cell(headers[key])).join(",");
  const rows = listings.map((listing) =>
    columns
      .map((key) => {
        const value = listing[key];
        return cell(value === null ? "" : String(value));
      })
      .join(","),
  );
  return `\uFEFF${[headerRow, ...rows].join("\r\n")}`;
}

import { buildDemoPayload } from "@/lib/demo";
import { normalizeLocalResults } from "@/lib/normalize";
import { describe, expect, it } from "vitest";

describe("normalizeLocalResults", () => {
  it("maps a Google Maps local result into the listing shape", () => {
    const listings = normalizeLocalResults({
      local_results: [
        {
          title: "Mina Cardamom",
          rating: 4.6,
          reviews: 214,
          type: "Coffee shop",
          address: "14 Harbour Lane, Tripoli",
          phone: "+218 91 000 1101",
          hours: "Open · Closes 11 PM",
          website: "https://mina-cardamom.example",
        },
      ],
    });

    expect(listings).toEqual([
      {
        name: "Mina Cardamom",
        rating: 4.6,
        reviews: 214,
        type: "Coffee shop",
        address: "14 Harbour Lane, Tripoli",
        phone: "+218 91 000 1101",
        hours: "Open · Closes 11 PM",
        link: "https://mina-cardamom.example",
      },
    ]);
  });

  it("fills hours from operating_hours and a maps link from coordinates", () => {
    const listings = normalizeLocalResults({
      local_results: [
        {
          title: "Hill Oven",
          rating: "4.4",
          reviews: "151",
          operating_hours: {
            saturday: "7 AM–6 PM",
            sunday: "Closed",
          },
          gps_coordinates: { latitude: 31.9486, longitude: 35.9402 },
        },
        { title: "   " },
        "skip-me",
      ],
    });

    expect(listings).toHaveLength(1);
    expect(listings[0]?.hours).toBe("saturday: 7 AM–6 PM; sunday: Closed");
    expect(listings[0]?.link).toBe("https://www.google.com/maps/search/?api=1&query=31.9486,35.9402");
    expect(listings[0]?.rating).toBe(4.4);
    expect(listings[0]?.reviews).toBe(151);
  });

  it("uses a single place_results object when local_results is empty", () => {
    const listings = normalizeLocalResults({
      local_results: [],
      place_results: {
        title: "Najd Table",
        open_state: "Closed · Opens 1 PM",
        place_id: "demo-place",
      },
    });

    expect(listings[0]?.name).toBe("Najd Table");
    expect(listings[0]?.hours).toBe("Closed · Opens 1 PM");
    expect(listings[0]?.link).toContain("query_place_id=demo-place");
  });

  it("returns an empty list for payloads without places", () => {
    expect(normalizeLocalResults(null)).toEqual([]);
    expect(normalizeLocalResults({ local_results: [] })).toEqual([]);
  });

  it("normalises fictional demo fixtures in Arabic and English", () => {
    const english = normalizeLocalResults(buildDemoPayload("tripoli", "cafe", "en"));
    const arabic = normalizeLocalResults(buildDemoPayload("cairo", "صيدلية", "ar"));
    const none = normalizeLocalResults(buildDemoPayload("dubai", "dentist", "en"));

    expect(english.map((place) => place.name)).toEqual(["Mina Cardamom"]);
    expect(english[0]?.link).toBe("https://mina-cardamom.example");
    expect(arabic.map((place) => place.name)).toEqual(["صيدلية الورد"]);
    expect(arabic[0]?.address).toContain("القاهرة");
    expect(none).toEqual([]);
  });
});

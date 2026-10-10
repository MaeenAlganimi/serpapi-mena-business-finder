import { cities } from "@/lib/cities";
import { getLabels, suggestions, translateQuery } from "@/lib/labels";
import { describe, expect, it } from "vitest";

const arabic = /[\u0600-\u06FF]/;

describe("labels", () => {
  it("uses the same keys in Arabic and English", () => {
    const english = getLabels("en");
    const arabicLabels = getLabels("ar");
    expect(Object.keys(arabicLabels).sort()).toEqual(Object.keys(english).sort());
    expect(getLabels("fr").title).toBe(english.title);
  });

  it("keeps Arabic copy in Arabic and English copy in English", () => {
    const english = getLabels("en");
    const arabicLabels = getLabels("ar");

    expect(arabicLabels.title).toBe("محلة");
    expect(english.title).toBe("Mahalla");
    expect(arabicLabels.search).toMatch(arabic);
    expect(arabicLabels.exportCsv).toMatch(arabic);
    expect(arabicLabels.tagline).toMatch(arabic);
    expect(english.search).toBe("Search");
    expect(english.exportCsv).toBe("Export CSV");
    expect(arabicLabels.language).toBe("English");
    expect(english.language).toBe("العربية");
  });

  it("names every preset city in both languages", () => {
    const ids = cities.map((city) => city.id);
    expect(ids).toEqual(["tripoli", "benghazi", "cairo", "tunis", "amman", "dubai", "riyadh"]);
    for (const city of cities) {
      expect(city.ar).toMatch(arabic);
      expect(city.en.length).toBeGreaterThan(0);
      expect(city.ll.startsWith("@")).toBe(true);
    }
  });

  it("translates the preset business types", () => {
    expect(suggestions.map((item) => item.en)).toEqual(["cafe", "pharmacy", "bakery", "restaurant"]);
    expect(translateQuery("cafe", "en", "ar")).toBe("مقهى");
    expect(translateQuery("مطعم", "ar", "en")).toBe("restaurant");
    expect(translateQuery("dentist", "en", "ar")).toBe("dentist");
  });
});

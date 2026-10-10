export const cities = [
  {
    id: "tripoli",
    ll: "@32.8872,13.1913,13z",
    en: "Tripoli",
    ar: "طرابلس",
    countryEn: "Libya",
    countryAr: "ليبيا",
  },
  {
    id: "benghazi",
    ll: "@32.1167,20.0667,13z",
    en: "Benghazi",
    ar: "بنغازي",
    countryEn: "Libya",
    countryAr: "ليبيا",
  },
  {
    id: "cairo",
    ll: "@30.0444,31.2357,12z",
    en: "Cairo",
    ar: "القاهرة",
    countryEn: "Egypt",
    countryAr: "مصر",
  },
  {
    id: "tunis",
    ll: "@36.8065,10.1815,13z",
    en: "Tunis",
    ar: "تونس",
    countryEn: "Tunisia",
    countryAr: "تونس",
  },
  {
    id: "amman",
    ll: "@31.9454,35.9284,13z",
    en: "Amman",
    ar: "عمّان",
    countryEn: "Jordan",
    countryAr: "الأردن",
  },
  {
    id: "dubai",
    ll: "@25.2048,55.2708,12z",
    en: "Dubai",
    ar: "دبي",
    countryEn: "United Arab Emirates",
    countryAr: "الإمارات",
  },
  {
    id: "riyadh",
    ll: "@24.7136,46.6753,12z",
    en: "Riyadh",
    ar: "الرياض",
    countryEn: "Saudi Arabia",
    countryAr: "السعودية",
  },
] as const;

export type City = (typeof cities)[number];
export type CityId = City["id"];

export function getCity(id: string): City | undefined {
  return cities.find((city) => city.id === id);
}

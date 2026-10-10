export const locales = ["en", "ar"] as const;

export type Locale = (typeof locales)[number];

export type Labels = {
  title: string;
  tagline: string;
  businessType: string;
  businessPlaceholder: string;
  city: string;
  search: string;
  searching: string;
  language: string;
  demoBanner: string;
  liveBanner: string;
  results: string;
  empty: string;
  exportCsv: string;
  rating: string;
  reviews: string;
  address: string;
  phone: string;
  hours: string;
  link: string;
  name: string;
  type: string;
  openLink: string;
  errorMissing: string;
  errorUnknownCity: string;
  errorUpstream: string;
  noRating: string;
};

const dictionary: Record<Locale, Labels> = {
  en: {
    title: "Mahalla",
    tagline: "Find local businesses across the Middle East and North Africa.",
    businessType: "Business type",
    businessPlaceholder: "Cafe, pharmacy, bakery…",
    city: "City",
    search: "Search",
    searching: "Searching…",
    language: "العربية",
    demoBanner:
      "Sample places are shown because SERPAPI_API_KEY is not set. Add a key to search live Google Maps results.",
    liveBanner: "Live results from SerpApi Google Maps.",
    results: "Results",
    empty: "No places matched this search.",
    exportCsv: "Export CSV",
    rating: "Rating",
    reviews: "Reviews",
    address: "Address",
    phone: "Phone",
    hours: "Hours",
    link: "Link",
    name: "Name",
    type: "Type",
    openLink: "Open link",
    errorMissing: "Enter a business type and choose a city.",
    errorUnknownCity: "Choose a city from the list.",
    errorUpstream: "The search service did not respond. Try again.",
    noRating: "No rating",
  },
  ar: {
    title: "محلة",
    tagline: "ابحث عن الأنشطة المحلية في مدن الشرق الأوسط وشمال أفريقيا.",
    businessType: "نوع النشاط",
    businessPlaceholder: "مقهى، صيدلية، مخبز…",
    city: "المدينة",
    search: "بحث",
    searching: "جارٍ البحث…",
    language: "English",
    demoBanner:
      "تُعرض أماكن تجريبية لأن مفتاح SERPAPI_API_KEY غير مضبوط. أضف المفتاح لنتائج خرائط جوجل المباشرة.",
    liveBanner: "نتائج مباشرة من محرك خرائط جوجل عبر SerpApi.",
    results: "النتائج",
    empty: "لا توجد أماكن مطابقة لهذا البحث.",
    exportCsv: "تصدير CSV",
    rating: "التقييم",
    reviews: "المراجعات",
    address: "العنوان",
    phone: "الهاتف",
    hours: "ساعات العمل",
    link: "الرابط",
    name: "الاسم",
    type: "النوع",
    openLink: "فتح الرابط",
    errorMissing: "أدخل نوع النشاط واختر مدينة.",
    errorUnknownCity: "اختر مدينة من القائمة.",
    errorUpstream: "تعذر الوصول إلى خدمة البحث. حاول مرة أخرى.",
    noRating: "بلا تقييم",
  },
};

export function isLocale(value: string): value is Locale {
  return value === "en" || value === "ar";
}

export function getLabels(locale: string): Labels {
  if (isLocale(locale)) return dictionary[locale];
  return dictionary.en;
}

export const suggestions = [
  { en: "cafe", ar: "مقهى" },
  { en: "pharmacy", ar: "صيدلية" },
  { en: "bakery", ar: "مخبز" },
  { en: "restaurant", ar: "مطعم" },
] as const;

export function translateQuery(query: string, from: Locale, to: Locale): string {
  const trimmed = query.trim().toLowerCase();
  const match = suggestions.find((item) => item[from].toLowerCase() === trimmed);
  return match ? match[to] : query;
}

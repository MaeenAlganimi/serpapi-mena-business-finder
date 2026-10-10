export type BusinessListing = {
  name: string;
  rating: number | null;
  reviews: number | null;
  address: string;
  phone: string;
  hours: string;
  link: string;
  type: string;
};

export type SearchMode = "demo" | "live";

export type SearchResponse = {
  mode: SearchMode;
  language: "en" | "ar";
  city: string;
  query: string;
  results: BusinessListing[];
};

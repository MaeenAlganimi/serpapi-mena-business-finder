"use client";

import { cities } from "@/lib/cities";
import { listingsToCsv } from "@/lib/csv";
import {
  getLabels,
  suggestions,
  translateQuery,
  type Locale,
} from "@/lib/labels";
import type { BusinessListing, SearchMode, SearchResponse } from "@/lib/types";
import { type FormEvent, useEffect, useRef, useState } from "react";

type ErrorCode = "missing_query" | "unknown_city" | "upstream" | null;

function errorText(code: ErrorCode, labels: ReturnType<typeof getLabels>): string | null {
  if (code === "missing_query") return labels.errorMissing;
  if (code === "unknown_city") return labels.errorUnknownCity;
  if (code === "upstream") return labels.errorUpstream;
  return null;
}

export function Finder() {
  const [locale, setLocale] = useState<Locale>("en");
  const [query, setQuery] = useState("cafe");
  const [cityId, setCityId] = useState("tripoli");
  const [results, setResults] = useState<BusinessListing[]>([]);
  const [mode, setMode] = useState<SearchMode | null>(null);
  const [error, setError] = useState<ErrorCode>(null);
  const [searching, setSearching] = useState(false);
  const queryRef = useRef(query);
  const cityRef = useRef(cityId);
  queryRef.current = query;
  cityRef.current = cityId;

  const labels = getLabels(locale);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  useEffect(() => {
    void runSearch(queryRef.current, cityRef.current, locale);
  }, [locale]);

  async function runSearch(nextQuery: string, nextCity: string, nextLocale: Locale) {
    const trimmed = nextQuery.trim();
    if (!trimmed) {
      setError("missing_query");
      setResults([]);
      setMode(null);
      return;
    }

    setSearching(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        q: trimmed,
        city: nextCity,
        hl: nextLocale,
      });
      const response = await fetch(`/api/search?${params.toString()}`);
      const body = (await response.json()) as SearchResponse | { error?: string };
      if (!response.ok || !("results" in body)) {
        const code = "error" in body ? body.error : "upstream";
        setError(code === "unknown_city" || code === "missing_query" ? code : "upstream");
        setResults([]);
        setMode(null);
        return;
      }
      setResults(body.results);
      setMode(body.mode);
    } catch {
      setError("upstream");
      setResults([]);
      setMode(null);
    } finally {
      setSearching(false);
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void runSearch(query, cityId, locale);
  }

  function switchLocale() {
    const next = locale === "en" ? "ar" : "en";
    setQuery((current) => translateQuery(current, locale, next));
    setLocale(next);
  }

  function exportCsv() {
    const csv = listingsToCsv(results, {
      name: labels.name,
      type: labels.type,
      rating: labels.rating,
      reviews: labels.reviews,
      address: labels.address,
      phone: labels.phone,
      hours: labels.hours,
      link: labels.link,
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `mahalla-${cityId}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  const message = errorText(error, labels);

  return (
    <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col px-4 py-8 sm:px-6">
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-palm text-lg font-semibold text-white">
            م
          </span>
          <div>
            <p className="text-lg font-semibold leading-none">{labels.title}</p>
            <p className="mt-1 text-sm text-muted">Maeen Alganimi</p>
          </div>
        </div>
        <button
          type="button"
          onClick={switchLocale}
          className="rounded-full border border-line bg-card px-4 py-2 text-sm font-medium hover:border-palm"
          aria-label={labels.language}
        >
          {labels.language}
        </button>
      </header>

      <main className="mt-8 flex-1">
        <h1 className="max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">
          {labels.tagline}
        </h1>

        <form
          onSubmit={onSubmit}
          className="mt-6 rounded-3xl border border-line bg-card p-4 shadow-sm sm:p-5"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium">
              {labels.businessType}
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={labels.businessPlaceholder}
                className="mt-2 w-full rounded-2xl border border-line bg-paper px-3 py-2.5 text-base outline-none focus:border-palm"
                name="q"
              />
            </label>
            <label className="block text-sm font-medium">
              {labels.city}
              <select
                value={cityId}
                onChange={(event) => setCityId(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-line bg-paper px-3 py-2.5 text-base outline-none focus:border-palm"
                name="city"
              >
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {locale === "ar" ? `${city.ar}، ${city.countryAr}` : `${city.en}, ${city.countryEn}`}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {suggestions.map((item) => (
              <button
                key={item.en}
                type="button"
                onClick={() => {
                  const nextQuery = item[locale];
                  setQuery(nextQuery);
                  void runSearch(nextQuery, cityId, locale);
                }}
                className="rounded-full bg-sand px-3 py-1.5 text-sm hover:bg-palm hover:text-white"
              >
                {item[locale]}
              </button>
            ))}
          </div>
          <button
            type="submit"
            disabled={searching}
            className="mt-4 rounded-full bg-palm px-5 py-2.5 text-sm font-semibold text-white hover:bg-palm-dark disabled:opacity-60"
          >
            {searching ? labels.searching : labels.search}
          </button>
        </form>

        {mode ? (
          <p className="mt-4 rounded-2xl bg-sand px-4 py-3 text-sm text-ink" role="status">
            {mode === "demo" ? labels.demoBanner : labels.liveBanner}
          </p>
        ) : null}
        {message ? (
          <p className="mt-4 text-sm text-saffron" role="alert">
            {message}
          </p>
        ) : null}

        <div className="mt-6 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">
            {labels.results}
            <span className="ms-2 text-sm font-normal text-muted">{results.length}</span>
          </h2>
          <button
            type="button"
            onClick={exportCsv}
            disabled={results.length === 0}
            className="rounded-full border border-line bg-card px-4 py-2 text-sm font-medium hover:border-palm disabled:opacity-50"
          >
            {labels.exportCsv}
          </button>
        </div>

        {results.length === 0 && !searching && !message ? (
          <p className="mt-4 text-sm text-muted">{labels.empty}</p>
        ) : null}

        <ul className="mt-4 space-y-3" aria-live="polite">
          {results.map((place) => (
            <li key={`${place.name}-${place.address}`} className="rounded-3xl border border-line bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold">{place.name}</h3>
                  {place.type ? <p className="text-sm text-muted">{place.type}</p> : null}
                </div>
                <p className="shrink-0 text-sm font-semibold text-saffron">
                  {place.rating === null ? labels.noRating : place.rating.toFixed(1)}
                  {place.reviews !== null ? (
                    <span className="font-normal text-muted"> ({place.reviews})</span>
                  ) : null}
                </p>
              </div>
              <dl className="mt-3 space-y-1 text-sm">
                {place.address ? (
                  <div>
                    <dt className="inline font-medium">{labels.address}: </dt>
                    <dd className="inline">{place.address}</dd>
                  </div>
                ) : null}
                {place.phone ? (
                  <div>
                    <dt className="inline font-medium">{labels.phone}: </dt>
                    <dd className="inline">
                      <a className="underline decoration-line underline-offset-2" href={`tel:${place.phone}`}>
                        {place.phone}
                      </a>
                    </dd>
                  </div>
                ) : null}
                {place.hours ? (
                  <div>
                    <dt className="inline font-medium">{labels.hours}: </dt>
                    <dd className="inline">{place.hours}</dd>
                  </div>
                ) : null}
                {place.link ? (
                  <div>
                    <dt className="inline font-medium">{labels.link}: </dt>
                    <dd className="inline">
                      <a
                        className="break-all underline decoration-line underline-offset-2"
                        href={place.link}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {labels.openLink}
                      </a>
                    </dd>
                  </div>
                ) : null}
              </dl>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

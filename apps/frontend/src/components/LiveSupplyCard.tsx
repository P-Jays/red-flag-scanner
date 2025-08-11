"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useSWR from "swr";
import { useEffect, useMemo, useState } from "react";

type Supply = { token: string; total_supply: number | null; circulating_supply: number | null };
type Cached = { data: Supply; savedAt: number };

const fetcher = (url: string) =>
  fetch(url).then(r => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  });

const readCache = (key: string): Cached | null => {
  if (typeof window === "undefined") return null;
  try { return JSON.parse(localStorage.getItem(key) || "null"); } catch { return null; }
};
const writeCache = (key: string, value: Cached) => {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
};

const fmtAgo = (t?: number) => {
  if (!t) return "—";
  const s = Math.max(0, Math.floor((Date.now() - t) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  return `${h}h ago`;
};

export function LiveSupplyCard({ token }: { token: string }) {
  const cacheKey = `supply:${token.toLowerCase()}`;

  // ✅ Read cache once per token; stable reference
  const initialCache = useMemo(() => readCache(cacheKey), [cacheKey]);
  const [savedAt, setSavedAt] = useState<number | undefined>(initialCache?.savedAt);

  // ✅ Pass a stable fallbackData reference
  const fallbackData = useMemo(() => initialCache?.data, [initialCache]);

  const { data, error, isValidating, mutate } = useSWR<Supply>(
    token ? `/api/supply/${token}` : null,
    fetcher,
    {
      fallbackData,              // stable across renders
      refreshInterval: 60_000,
      revalidateOnFocus: true,
      shouldRetryOnError: true,
      errorRetryInterval: 10_000,
    }
  );

  // ✅ Only runs when `data` actually changes
  useEffect(() => {
    if (!data) return;
    const now = Date.now();
    writeCache(cacheKey, { data, savedAt: now });
    setSavedAt(now);
  }, [data, cacheKey]);

  const total = data?.total_supply ?? null;
  const circ = data?.circulating_supply ?? null;

  const showingCached =
    !!initialCache &&
    (!data || JSON.stringify(data) === JSON.stringify(initialCache.data));

  return (
    <Card className="mb-4 border-blue-200">
      <CardContent className="p-4">
        {/* header */}
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Live Token Supply</h3>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-1 rounded ${isValidating ? "bg-gray-200 text-gray-700" : "bg-green-100 text-green-700"}`}>
              {isValidating ? "Refreshing…" : "LIVE"}
            </span>
            {showingCached && (
              <span className="text-xs px-2 py-1 rounded bg-amber-100 text-amber-800">Cached</span>
            )}
            <Button variant="outline" size="sm" onClick={() => mutate()}>Refresh</Button>
          </div>
        </div>

        {error && !data && <p className="mt-3 text-sm text-red-600">Couldn’t reach backend. Showing cached data if available.</p>}
        {!data && !error && (
          <div className="mt-3 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-48 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-64" />
          </div>
        )}

        {data && (
          <div className="mt-3 text-sm">
            <p><strong>Total Supply:</strong> {total == null ? "N/A" : total.toLocaleString()} {token.toUpperCase()}</p>
            <p><strong>Circulating Supply:</strong> {circ == null ? "N/A" : circ.toLocaleString()} {token.toUpperCase()}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Source: backend • Last updated {fmtAgo(savedAt ?? initialCache?.savedAt)}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default LiveSupplyCard;

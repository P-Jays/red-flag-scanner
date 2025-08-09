// apps/frontend/src/components/LiveSupplyCard.tsx
"use client";
import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { formatNum } from "@/lib/format";
import { Button } from "@/components/ui/button";
type Supply = { token: string; total_supply: number | null; circulating_supply: number | null };
type Cached = { data: Supply; savedAt: number }; // epoch ms
import useSWR from "swr";
import { useEffect, useState } from "react";

// type Props = {
//   token: string;
//   total?: number | null;
//   circulating?: number | null;
//   loading?: boolean;
//   error?: string | null;
// };

const fetcher = (url: string) => fetch(url).then(r => {
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
});

// localStorage helpers (safe on server)
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
  const cached = readCache(cacheKey);

  // keep a local copy of when our currently shown data was saved
  const [savedAt, setSavedAt] = useState<number | undefined>(cached?.savedAt);

  const { data, error, isValidating, mutate } = useSWR<Supply>(
    token ? `/api/supply/${token}` : null,
    fetcher,
    {
      // seed with last good value if present
      fallbackData: cached?.data,
      refreshInterval: 60_000,       // auto refresh every 60s
      revalidateOnFocus: true,       // refresh when tab refocuses
      shouldRetryOnError: true,
      errorRetryInterval: 10_000,
    }
  );

  // When we get fresh data, persist it
  useEffect(() => {
    if (!data) return;
    writeCache(cacheKey, { data, savedAt: Date.now() });
    setSavedAt(Date.now());
  }, [data, cacheKey]);

  const total = data?.total_supply ?? null;
  const circ  = data?.circulating_supply ?? null;

  // Are we showing cached only (either first load from cache or fetch error)?
  const showingCached = !isValidating && !!cached && (!data || !!error);

  return (
    <Card className="mb-4 border-blue-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Live Token Supply</h3>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-1 rounded ${
              isValidating ? "bg-gray-200 text-gray-700" : "bg-green-100 text-green-700"
            }`}>
              {isValidating ? "Refreshing…" : "LIVE"}
            </span>
            {showingCached && (
              <span className="text-xs px-2 py-1 rounded bg-amber-100 text-amber-800">
                Cached
              </span>
            )}
            <Button variant="outline" size="sm" onClick={() => mutate()}>
              Refresh
            </Button>
          </div>
        </div>

        {/* States */}
        {error && !data && (
          <p className="mt-3 text-sm text-red-600">
            Couldn’t reach backend. Showing cached data if available.
          </p>
        )}

        {!data && !error && (
          <div className="mt-3 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-48 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-64" />
          </div>
        )}

        {data && (
          <div className="mt-3 text-sm">
            <p><strong>Total Supply:</strong> {total ? total.toLocaleString() : "N/A"}</p>
            <p><strong>Circulating Supply:</strong> {circ ? circ.toLocaleString() : "N/A"}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Source: backend (Fly.io) • Last updated {fmtAgo(savedAt ?? cached?.savedAt)}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default LiveSupplyCard;

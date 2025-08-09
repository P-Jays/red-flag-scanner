// apps/frontend/src/components/LiveSupplyCard.tsx
"use client";
import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { formatNum } from "@/lib/format";
import { Button } from "@/components/ui/button";
import useSWR from "swr";

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

export function LiveSupplyCard({ token }: { token: string }) {
  const { data, error, isValidating, mutate } = useSWR(
    token ? `/api/supply/${token}` : null,
    fetcher,
    {
      refreshInterval: 60_000,       // auto refresh every 60s
      revalidateOnFocus: true,       // refresh when tab refocuses
      shouldRetryOnError: true,
      errorRetryInterval: 10_000,
    }
  );

  const total = data?.total_supply ?? null;
  const circ  = data?.circulating_supply ?? null;

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
            <Button variant="outline" size="sm" onClick={() => mutate()}>
              Refresh
            </Button>
          </div>
        </div>

        {/* States */}
        {error && (
          <p className="mt-3 text-sm text-red-600">
            Couldn’t fetch live supply. Showing nothing until it recovers.
          </p>
        )}

        {!data && !error && (
          <div className="mt-3 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-48 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-64" />
          </div>
        )}

        {data && !error && (
          <div className="mt-3 text-sm">
            <p><strong>Total Supply:</strong> {total ? total.toLocaleString() : "N/A"}</p>
            <p><strong>Circulating Supply:</strong> {circ ? circ.toLocaleString() : "N/A"}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Source: backend (Fly.io) • refreshes auto every 60s
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


// export default function LiveSupplyCard({ token, total, circulating, loading, error }: Props) {
//   return (
//     <Card className="mb-4 border-blue-200">
//       <CardContent className="p-4">
//         <div className="flex items-center justify-between space-y-1">
//           <h3 className="font-semibold">Live Token Supply</h3>
//           <Badge className="bg-emerald-600">LIVE</Badge>
//         </div>

//         {loading ? (
//           <div className="animate-pulse space-y-2">
//             <div className="h-4 bg-muted rounded w-2/3" />
//             <div className="h-4 bg-muted rounded w-2/3" />
//           </div>
//         ) : error ? (
//           <p className="text-sm text-red-600">Couldn’t load live data: {error}</p>
//         ) : (
//           <div className="space-y-1 text-sm">
//             <p><strong>Total Supply:</strong> {formatNum(total)} {token.toUpperCase()}</p>
//             <p><strong>Circulating Supply:</strong> {formatNum(circulating)} {token.toUpperCase()}</p>
//             <p className="text-xs text-muted-foreground mt-2">
//               Source: backend (Fly.io) • updates on refresh
//             </p>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// }

// export { LiveSupplyCard }
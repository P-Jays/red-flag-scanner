// apps/frontend/src/components/LiveSupplyCard.tsx
"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatNum } from "@/lib/format";

type Props = {
  token: string;
  total?: number | null;
  circulating?: number | null;
  loading?: boolean;
  error?: string | null;
};

export default function LiveSupplyCard({ token, total, circulating, loading, error }: Props) {
  return (
    <Card className="mb-4 border-blue-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between space-y-1">
          <h3 className="font-semibold">Live Token Supply</h3>
          <Badge className="bg-emerald-600">LIVE</Badge>
        </div>

        {loading ? (
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-muted rounded w-2/3" />
            <div className="h-4 bg-muted rounded w-2/3" />
          </div>
        ) : error ? (
          <p className="text-sm text-red-600">Couldn’t load live data: {error}</p>
        ) : (
          <div className="space-y-1 text-sm">
            <p><strong>Total Supply:</strong> {formatNum(total)} {token.toUpperCase()}</p>
            <p><strong>Circulating Supply:</strong> {formatNum(circulating)} {token.toUpperCase()}</p>
            <p className="text-xs text-muted-foreground mt-2">
              Source: backend (Fly.io) • updates on refresh
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export { LiveSupplyCard }
// apps/frontend/src/lib/format.ts
export function formatNum(n?: number | null) {
  if (n == null || Number.isNaN(n)) return "N/A";
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(n);
}
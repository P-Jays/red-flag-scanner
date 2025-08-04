"use client";

import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
// import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
// import ReactToPrint from "react-to-print";
// import PrintableResult from "@/components/PrintableResult"; // adjust path

const handleCopyLink = () => {
  const url = typeof window !== "undefined" ? window.location.href : "";
  navigator.clipboard.writeText(url);
  toast("📎 Link copied!", {
    description: "You can now share this scan result.",
    duration: 2500,
  });
};

type ScanResult = {
  token: string;
  score: string;
  flags: {
    title: string;
    status: "red" | "yellow" | "green";
    retail: string;
    analyst?: string;
    source?: string;
  }[];
};


export default function ResultPage() {
  // const router = useRouter();
  const [token, setToken] = useState<string>("xrp");
  const [data, setData] = useState<ScanResult | null>(null);
  const calculateTrustScore = (flags: ScanResult["flags"]) => {
    let score = 5;
    for (const flag of flags) {
      if (flag.status === "red") score -= 2;
      else if (flag.status === "yellow") score -= 1;
      else if (flag.status === "green") score += 1;
    }
    return Math.max(1, Math.min(score, 10));
  };
  const trustScore = data ? calculateTrustScore(data.flags) : null;
  const getScoreExplanation = (score: number) => {
    if (score <= 2) {
      return "⚠️ This project raises multiple critical red flags. Proceed with extreme caution.";
    } else if (score <= 4) {
      return "🟡 This project has some concerning issues. Review carefully before engaging.";
    } else if (score <= 6) {
      return "🟠 Moderate trust level. Flags are present, but not severe.";
    } else if (score <= 8) {
      return "🟢 Relatively safe. Minor flags found, but overall structure seems solid.";
    } else {
      return "✅ Strong project — no major red flags detected.";
    }
  };

  const [error, setError] = useState("");
  const [showSources, setShowSources] = useState(false);
  const [isAnalyst, setIsAnalyst] = useState(false);
  const handleToggle = (checked: boolean) => {
    setIsAnalyst(checked);

    const urlParams = new URLSearchParams(window.location.search);
    if (checked) {
      urlParams.set("mode", "analyst");
    } else {
      urlParams.delete("mode");
    }
    const newRelativePathQuery = `${
      window.location.pathname
    }?${urlParams.toString()}`;
    window.history.replaceState(null, "", newRelativePathQuery);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const redCount = data?.flags.filter(
    (f) => f.status && f.status === "red"
  ).length;
  const yellowCount = data?.flags.filter(
    (f) => f.status && f.status === "yellow"
  ).length;
  const greenCount = data?.flags.filter(
    (f) => f.status && f.status === "green"
  ).length;
  const [supply, setSupply] = useState<number | null>(null);
  // Get token from URL on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get("token") || "";
      const modeParam = urlParams.get("mode");
      setToken(urlToken);
      if (modeParam === "analyst") {
        setIsAnalyst(true);
      }
    }

    async function fetchSupply() {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/coins/ripple"
        );
        const data = await res.json();
        console.table(data);
        console.log("🟢  "+`${data.id}`+ " Total Supply:", data.market_data.total_supply);
        console.log("🟢  "+`${data.id}`+ " Circulating Supply:", data.market_data.circulating_supply);
        setSupply(data.market_data.circulating_supply);
        // console.log(supply);
        
      } catch (err) {
        console.error("🔴 Error fetching supply:", err);
      }
    }

    fetchSupply();
  }, []);

  const sources = data?.flags
    ? Array.from(
        new Set(
          data.flags.map((flag) => flag.source).filter((s): s is string => !!s)
        )
      )
    : [];

  useEffect(() => {
    if (token) {
      fetch(`/data/${token}.json`)
        .then((res) => {
          if (!res.ok) throw new Error("Token not found");
          return res.json();
        })
        .then((json) => setData(json))
        .catch((err) => setError(err.message));
    }
  }, [token]);

  if (error) {
    return <div className="p-4 text-red-600 font-semibold">{error}</div>;
  }

  if (!data) {
    return (
      <main className="flex justify-center items-center h-screen text-gray-500">
        <div className="text-center space-y-2 animate-pulse">
          <div className="text-2xl">🔍 Scanning Token…</div>
          <div className="text-sm">Please wait while we analyze red flags.</div>
        </div>
      </main>
    );
  }

  return (
    <div className="relative">
      {isAnalyst && (
        <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs px-3 py-1 rounded-full shadow-md z-10">
          Analyst Mode ON
        </div>
      )}
      <main
        className={`max-w-screen-md mx-auto px-4 py-8 transition-colors duration-300 ${
          isAnalyst ? "bg-blue-50" : ""
        }`}
      >
        <h1 className="text-3xl font-bold text-center mb-2">
          🔍Scan Result: {data.token.toUpperCase()}
        </h1>
        <p className="text-muted-foreground text-center mb-6">{data.score}</p>
        <div className="flex items-center gap-2 mb-6">
          <Switch checked={isAnalyst} onCheckedChange={handleToggle} />
          {/* <span className="text-sm text-gray-600">
            {isAnalyst ? "🔬 Analyst Mode" : "👤 Retail View"}
          </span> */}
          <Badge
            variant="outline"
            className={
              isAnalyst
                ? "bg-blue-600 text-white"
                : "bg-muted text-muted-foreground"
            }
          >
            {isAnalyst ? "Analyst Mode ON" : "Retail View"}
          </Badge>
        </div>
        {/* {isAnalyst && (
          <div className="text-xs text-blue-600 italic mb-2 text-right">
            Analyst Mode ON — Showing deeper technical insights
          </div>
        )} */}

        <div className="text-sm text-muted-foreground mb-4">
          Summary:{" "}
          <span className="text-red-500 font-medium">{redCount} Red</span> •{" "}
          <span className="text-yellow-600 font-medium">
            {yellowCount} Yellow
          </span>{" "}
          •{" "}
          <span className="text-green-600 font-medium">{greenCount} Green</span>{" "}
          Flags
        </div>
        {/* {trustScore && (
          <div className="mb-6 text-lg font-semibold text-center">
            🔎 Trust Score:{" "}
            <span
              className={
                trustScore <= 3
                  ? "text-red-600"
                  : trustScore <= 6
                  ? "text-yellow-600"
                  : "text-green-600"
              }
            >
              {trustScore} / 10
            </span>
            <div className="w-full bg-gray-200 rounded h-2 mb-6">
              <div
                className={`h-2 rounded transition-all duration-300 ${
                  trustScore <= 3
                    ? "bg-red-500"
                    : trustScore <= 6
                    ? "bg-yellow-500"
                    : "bg-green-500"
                }`}
                style={{ width: `${trustScore * 10}%` }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Lower score = higher risk based on detected red flags
            </p>
            {trustScore && (
              <p className="text-sm text-muted-foreground mb-6 text-center italic">
                {getScoreExplanation(trustScore)}
              </p>
            )}
          </div>
        )} */}
        {trustScore && (
          <div className="mb-4 text-center">
            <p className="text-lg font-semibold">
              Trust Score:{" "}
              <span
                className={
                  trustScore <= 3
                    ? "text-red-600"
                    : trustScore <= 6
                    ? "text-yellow-600"
                    : "text-green-600"
                }
              >
                {trustScore} / 10
              </span>
            </p>

            <div className="w-full h-2 bg-gray-200 rounded mt-2 mb-2">
              <div
                className={`h-2 rounded transition-all duration-300 ${
                  trustScore <= 3
                    ? "bg-red-500"
                    : trustScore <= 6
                    ? "bg-yellow-500"
                    : "bg-green-500"
                }`}
                style={{ width: `${trustScore * 10}%` }}
              ></div>
            </div>

            <p className="text-sm italic text-muted-foreground">
              {getScoreExplanation(trustScore)}
            </p>
          </div>
        )}

        <div className="space-y-4">
          {data.flags.map((flag, index) => {
            const colorBorder =
              flag.status === "red"
                ? "border-red-500 bg-red-100"
                : flag.status === "yellow"
                ? "border-yellow-500 bg-yellow-100"
                : "border-green-500 bg-green-100";

            return (
              // <Card
              //   key={index}
              //   className={`border-l-4 ${colorBorder} animate-fade-in-up`}
              // >
              //   <CardContent className="p-4 space-y-1">
              //     <h2 className="font-semibold">{flag.title}</h2>
              //     {/* <p className="text-sm text-muted-foreground">{flag.retail}</p> */}
              //     <p className="text-sm text-muted-foreground">
              //       {isAnalyst && flag.analyst ? flag.analyst : flag.retail}
              //     </p>
              //   </CardContent>
              // </Card>
              <Card
                key={index}
                className={`border-l-4 shadow-sm ${colorBorder} bg-white`}
              >
                <CardContent className="p-4 space-y-2">
                  <h2 className="font-semibold text-base">{flag.title}</h2>
                  <p className="text-sm text-gray-700">
                    {isAnalyst ? flag.analyst : flag.retail}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-8">
          <Link href="/scanner">
            <Button variant="default" className="mt-8">
              🔁 Scan Another Token
            </Button>
          </Link>
        </div>

        <div className="mt-10 border-t pt-6">
          <Button
            variant="link"
            className="text-sm"
            onClick={() => setShowSources(!showSources)}
          >
            {showSources ? "Hide Sources" : "Show Sources"}
          </Button>

          {showSources && (
            <ul className="text-xs mt-2 text-gray-500 space-y-1 list-disc list-inside">
              {sources.map((url) => (
                <li key={url}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    {url}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
        <Button
          onClick={handleCopyLink}
          variant="secondary"
          className="text-sm mt-4 mx-auto block"
        >
          📎 Copy Report Link
        </Button>

        <Card className="mt-10 bg-muted/30 text-sm text-muted-foreground text-center p-4 border border-gray-200 shadow-sm rounded-xl">
          <p className="mb-2">💬 Got suggestions? Help us improve:</p>
          <div className="flex justify-center flex-wrap gap-3 text-blue-600 font-medium">
            <a
              href="https://tally.so/r/nWa7jv"
              target="_blank"
              className="underline"
            >
              Feedback Form
            </a>
            <span>|</span>
            <a
              href="https://twitter.com/pjonchain"
              target="_blank"
              className="underline"
            >
              Twitter
            </a>
            <span>|</span>
            <a
              href="https://linkedin.com/in/kelvin-prajnawi-7b5851177"
              target="_blank"
              className="underline"
            >
              LinkedIn
            </a>
          </div>
        </Card>
      </main>
    </div>
  );
}

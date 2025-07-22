"use client";

import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
// import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

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
  const [error, setError] = useState("");
  const [showSources, setShowSources] = useState(false);
  const [isAnalyst, setIsAnalyst] = useState(false);
  const handleToggle = (checked: boolean) => {
    setIsAnalyst(checked);
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

  // Get token from URL on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get("token") || "xrp";
      setToken(urlToken);
    }
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
        <h1 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
          🧪 Scan Result: {data.token.toUpperCase()}
        </h1>
        <p className="text-sm text-muted-foreground mb-1">{data.score}</p>
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
          🧾 Summary:{" "}
          <span className="text-red-500 font-medium">{redCount} Red</span> •{" "}
          <span className="text-yellow-600 font-medium">
            {yellowCount} Yellow
          </span>{" "}
          •{" "}
          <span className="text-green-600 font-medium">{greenCount} Green</span>{" "}
          Flags
        </div>
        <div className="space-y-4">
          {data.flags.map((flag, index) => {
            const colorBorder =
              flag.status === "red"
                ? "border-red-500 bg-red-100"
                : flag.status === "yellow"
                ? "border-yellow-500 bg-yellow-100"
                : "border-green-500 bg-green-100";

            return (
              <Card
                key={index}
                className={`border-l-4 ${colorBorder} animate-fade-in-up`}
              >
                <CardContent className="p-4 space-y-1">
                  <h2 className="font-semibold">{flag.title}</h2>
                  {/* <p className="text-sm text-muted-foreground">{flag.retail}</p> */}
                  <p className="text-sm text-muted-foreground">
                    {isAnalyst && flag.analyst ? flag.analyst : flag.retail}
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

        {/* <Button
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
        */}
        <div className="mt-8">
          <Button
            variant="outline"
            className="text-sm"
            onClick={() => setShowSources(!showSources)}
          >
            {showSources ? "Hide Sources 🔽" : "Show Sources 📚"}
          </Button>

          {showSources && (
            <Card className="mt-4 p-4 bg-muted/50">
              <h3 className="font-semibold text-sm mb-2 text-muted-foreground">
                🔗 References
              </h3>
              <ul className="text-xs space-y-2 list-disc list-inside text-blue-700">
                {sources.map((url) => (
                  <li key={url}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline break-words"
                    >
                      {url}
                    </a>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>

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

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
// import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

// Get token from URL on mount
useEffect(() => {
if (typeof window !== 'undefined') {
const urlParams = new URLSearchParams(window.location.search);
const urlToken = urlParams.get('token') || 'xrp';
setToken(urlToken);
}
}, []);

const sources = data?.flags
  ? Array.from(
      new Set(data.flags.map((flag) => flag.source).filter((s): s is string => !!s))
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
return <div className="p-4 text-gray-500">Loading scan result…</div>;
}

return (
<main className="max-w-screen-md mx-auto px-4 py-8">
<h1 className="text-2xl font-bold mb-2">🧪 Scan Result: {data.token}</h1>
<p className="text-gray-600 mb-4">{data.score}</p>


  <div className="space-y-4">
    {data.flags.map((flag, index) => {
      const colorBorder =
        flag.status === "red"
          ? "border-red-500 bg-red-100"
          : flag.status === "yellow"
          ? "border-yellow-500 bg-yellow-100"
          : "border-green-500 bg-green-100";

      return (
        <Card key={index} className={`border-l-4 ${colorBorder}`}>
          <CardContent className="p-4 space-y-1">
            <h2 className="font-semibold">{flag.title}</h2>
            <p className="text-sm text-muted-foreground">{flag.retail}</p>
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
            className="underline">
            {url}
          </a>
        </li>
      ))}
    </ul>
  )}
</main>


);
}
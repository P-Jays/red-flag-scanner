import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Red Flag Scanner — Crypto Trust Score",
  description: "Instantly see trust scores and red flags for any crypto token.",
  openGraph: {
    title: "Red Flag Scanner — Crypto Trust Score",
    description: "Instantly see trust scores and red flags for any crypto token.",
    images: [
      {
        url: "/api/og/xrp",
        width: 1200,
        height: 630,
        alt: "Red Flag Scanner Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Red Flag Scanner — Crypto Trust Score",
    description: "Instantly see trust scores and red flags for any crypto token.",
    images: ["/api/og/xrp"],
  },
};

export default function ResultLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

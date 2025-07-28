import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Red Flag Scanner — Crypto Trust Score",
  description: "Instantly see trust scores and red flags for any crypto token.",
  openGraph: {
    title: "Red Flag Scanner — Crypto Trust Score",
    description: "Instantly see trust scores and red flags for any crypto token.",
    url: "https://red-flag-scanner-ten.vercel.app",
    siteName: "Red Flag Scanner",
    images: [
      {
        url: "/api/og/xrp", // Dynamic route
        width: 1200,
        height: 630,
        alt: "Red Flag Scanner Preview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Red Flag Scanner — Crypto Trust Score",
    description: "Instantly see trust scores and red flags for any crypto token.",
    images: ["/api/og/xrp"],
  },
};

export default function ResultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

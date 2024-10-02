import type { Metadata } from "next";
import "./globals.css";
import * as React from "react";
import { JosefinSans } from "./fonts";
import Providers from "@/providers";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export const metadata: Metadata = {
  metadataBase: new URL(`${process.env.NEXT_PUBLIC_SERVER_URL}`),
  applicationName: "Carrefour",
  keywords: ["nextjs", "reactjs", "ecommerce", "sylvaincodes"],
  authors: [{ name: "sylvaincodes", url: "https://github.com/sylvaincodes" }],
  publisher: "vercel",

  alternates: {
    canonical: "/",
    languages: {
      en: "en",
    },
  },

  robots: {
    index: false,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      noimageindex: false,
    },
  },

  manifest: `${process.env.NEXT_PUBLIC_SERVER_URL}/manifest.webmanifest`,

  icons: {
    icon: "/assets/images/logo/logo.svg",
    shortcut: "/assets/images/logo/logo.svg",
    apple: "/assets/images/logo/logo.svg",
  },

  twitter: {
    card: "summary_large_image",
    title: "Carrefour Shopping Online E-commerce Plateforme",
    description:
      "Carrefour - Online store selling electronics fashions and more.",
    siteId: "Carrefour",
    creator: "sylvaincodes",
    images: [`${process.env.NEXT_PUBLIC_SERVER_URL}/assets/images/og.png`],
  },

  openGraph: {
    siteName: "Carrefour",
    type: "website",
    url: `${process.env.NEXT_PUBLIC_SERVER_URL}`,
    title: "Carrefour - Online store",
    description:
      "Carrefour - Online store selling electronics fashions and more.",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SERVER_URL}/assets/images/og.png`,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn("min-h-screen", JosefinSans.className)}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

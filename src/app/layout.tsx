import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getServerSession } from "next-auth";

import { Providers } from "@/components/Providers";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { authOptions } from "@/lib/authOptions";

import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "The Fix Collective",
    template: "%s • The Fix Collective"
  },
  description:
    "The Fix Collective is a modern ecommerce and community platform with four shops: Urban Roots, Self-Care, Stitch, and Survival Kits.",
  metadataBase: new URL("https://thefixcollective.com"),
  openGraph: {
    title: "The Fix Collective",
    description:
      "Four distinct shops under one brand: Urban Roots, Self-Care, Stitch, and Survival Kits.",
    type: "website"
  }
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  // getServerSession throws on non-200 (e.g. bad NEXTAUTH_SECRET vs cookie, corrupt session).
  // Never let that take down the whole app — show the site and log in dev.
  let session = null;
  try {
    session = await getServerSession(authOptions);
  } catch (e) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[next-auth] getServerSession failed (check NEXTAUTH_SECRET / clear cookies):", e);
    }
  }

  return (
    <html lang="en" className={inter.className}>
      <body>
        <Providers session={session}>
          <div className="flex min-h-dvh flex-col bg-fix-bg text-fix-text">
            <SiteHeader />
            <main className="flex min-h-0 flex-1 flex-col">{children}</main>
            <SiteFooter />
          </div>
        </Providers>
      </body>
    </html>
  );
}


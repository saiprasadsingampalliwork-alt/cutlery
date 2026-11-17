import type { Metadata } from "next";
import { Newsreader, Roboto_Condensed } from "next/font/google";
import { ActivityIndicator } from "@/components/activity";
import { SiteShell } from "@/components/site-shell";
import { StoreProvider } from "@/lib/store";
import "./globals.css";

const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  weight: "variable",
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-roboto-condensed",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-newsreader",
});

export const metadata: Metadata = {
  title: {
    default: "Earthen — Bakeware, knives, and grills",
    template: "%s — Earthen",
  },
  description: "Cake moulds, knives, and charcoal grills, supplied from Visakhapatnam.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${robotoCondensed.variable} ${newsreader.variable}`}>
      <body className={`${robotoCondensed.className} antialiased`}>
        <StoreProvider>
          <SiteShell>{children}</SiteShell>
          <ActivityIndicator />
        </StoreProvider>
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Noto_Serif_SC, Space_Grotesk } from "next/font/google";
import "./globals.css";

/*
 * US-002 — type stacks for the dual rails.
 *  - America rail: Space Grotesk (grotesque).
 *  - China rail:   Noto Serif SC. Its Google metadata only exposes the
 *    subsets cyrillic / latin / latin-ext / vietnamese — we take "latin";
 *    CJK glyphs fall through to the Songti / SimSun serif stack in CSS.
 */

const grotesk = Space_Grotesk({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
});

const cjkSerif = Noto_Serif_SC({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-cjk-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "China × America — The AI Race, Filmed",
  description:
    "A dual-rail landing: America on black, NASA blue and legal-pad amber; China on lacquer, cinnabar, jade and gold — divided by one spine.",
};

export const viewport: Viewport = {
  themeColor: "#070506",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${grotesk.variable} ${cjkSerif.variable}`}>
      <body>{children}</body>
    </html>
  );
}

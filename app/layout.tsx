import type { Metadata } from "next";
import { Oxanium, Space_Grotesk } from "next/font/google";
import "./globals.css";

const oxanium = Oxanium({
  subsets: ["latin"],
  variable: "--font-display",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Akash Kumar Gosain | Software Engineer · Interactive Portfolio",
  description:
    "Explore Akash Kumar Gosain’s interactive developer world: full-stack engineering, AI research, Rebound, HFME and experience at NIT Silchar and Springer Capital.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${oxanium.variable} ${spaceGrotesk.variable}`}>
      <body>{children}</body>
    </html>
  );
}

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
  title: "Akash Kumar Gosain | Anime 3D Portfolio",
  description:
    "Interactive anime-inspired 3D portfolio for Akash Kumar Gosain, Frontend Developer Intern at Springer Capital and AI builder behind HFME 2.0.",
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

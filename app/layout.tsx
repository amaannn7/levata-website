import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SmoothScrollProvider from "./components/SmoothScrollProvider";
import TextReveal from "./components/TextReveal";
import BookCallProvider from "./components/BookCallProvider";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Levata, Digital Solutions & Software",
  description:
    "Levata builds digital products, platforms, and automation that move ambitious businesses forward, engineered to compound, not just ship.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`antialiased ${dmSans.variable} ${GeistMono.variable}`}
    >
      <head>
        <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=switzer@300,400,500,600,700&display=swap" />
      </head>
      <body className="min-h-screen bg-[#0E1014] text-[#E6E6E6] overflow-x-hidden">
        <SmoothScrollProvider>
          <BookCallProvider>
            <TextReveal />
            <Navbar />
            {children}
            <Footer />
          </BookCallProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}

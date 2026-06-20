import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SmoothScrollProvider from "./components/SmoothScrollProvider";
import TextReveal from "./components/TextReveal";
import RevealFallback from "./components/RevealFallback";
import BookCallProvider from "./components/BookCallProvider";
import BookCallFloating from "./components/BookCallFloating";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://levatahq.com"),
  title: {
    default: "Levata - AI & Digital Solutions",
    template: "%s - Levata",
  },
  description:
    "Levata builds AI systems, automation, and digital infrastructure that help businesses operate smarter and scale faster.",
  keywords: [
    "AI solutions", "business automation", "digital infrastructure",
    "product engineering", "sales intelligence", "AI agency",
  ],
  authors: [{ name: "Levata", url: "https://levatahq.com" }],
  openGraph: {
    type: "website",
    siteName: "Levata",
    title: "Levata - AI & Digital Solutions",
    description:
      "Levata builds AI systems, automation, and digital infrastructure that help businesses operate smarter and scale faster.",
    url: "https://levatahq.com",
    images: [
      {
        url: "/levatalogo.png",
        width: 1200,
        height: 630,
        alt: "Levata",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Levata - AI & Digital Solutions",
    description:
      "Levata builds AI systems, automation, and digital infrastructure that help businesses operate smarter and scale faster.",
    images: ["/levatalogo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: "/levatalogo.png",
    shortcut: "/levatalogo.png",
    apple: "/levatalogo.png",
  },
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
        <link rel="preconnect" href="https://calendly.com" />
        <link rel="preconnect" href="https://assets.calendly.com" />
        <link rel="dns-prefetch" href="https://calendly.com" />
        <link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet" />
        <script src="https://assets.calendly.com/assets/external/widget.js" async />
        <script src="https://www.google.com/recaptcha/api.js?render=6Lc7XiotAAAAAHnhwQ1haiQ6iaEv3MuWkQJ-2LIj" async />
      </head>
      <body className="min-h-screen bg-[#0E1014] text-[#E6E6E6]">
        <SmoothScrollProvider>
          <BookCallProvider>
            <TextReveal />
            <RevealFallback />
            <Navbar />
            {children}
            <Footer />
            <BookCallFloating />
          </BookCallProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}

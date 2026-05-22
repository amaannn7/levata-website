import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SmoothScrollProvider from "./components/SmoothScrollProvider";
import TextReveal from "./components/TextReveal";
import BookCallProvider from "./components/BookCallProvider";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono-code",
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
      className={`antialiased ${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-[#0E1014] text-[#E6E6E6]">
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

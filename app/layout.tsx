import type { Metadata } from "next";
import { Geist, Geist_Mono, Manrope, Space_Grotesk, Plus_Jakarta_Sans } from "next/font/google";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SmoothScrollProvider from "./components/SmoothScrollProvider";
import TextReveal from "./components/TextReveal";
import BookCallProvider from "./components/BookCallProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Levata — Digital Solutions & Software",
  description:
    "Levata builds digital products, platforms, and automation that move ambitious businesses forward — engineered to compound, not just ship.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${manrope.variable} ${spaceGrotesk.variable} ${plusJakarta.variable} antialiased`}
    >
      <body className="min-h-screen bg-[#07001F]" style={{ fontFamily: 'var(--font-manrope), Manrope, "Manrope Fallback", Helvetica, Arial, sans-serif' }}>
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

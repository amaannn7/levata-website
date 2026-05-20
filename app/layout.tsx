import type { Metadata } from "next";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SmoothScrollProvider from "./components/SmoothScrollProvider";
import TextReveal from "./components/TextReveal";
import BookCallProvider from "./components/BookCallProvider";
import "./globals.css";

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
    <html lang="en" className="antialiased">
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

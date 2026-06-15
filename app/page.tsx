import type { Metadata } from "next";
import HeroSection from "./components/HeroSection";

export const metadata: Metadata = {
  title: "Levata — AI & Digital Solutions",
  description:
    "Levata builds AI systems, automation, and digital infrastructure that help ambitious businesses operate smarter and scale faster.",
  openGraph: {
    url: "https://levatahq.com",
  },
};

export default function Home() {
  return <HeroSection />;
}


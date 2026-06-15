import type { Metadata } from "next";
import SalesIntelligencePage from "./SalesIntelligencePage";

export const metadata: Metadata = {
    title: "Sales Intelligence Platform",
    description:
        "The AI-powered sales workspace for B2B teams. Research prospects, prioritize leads, generate personalized outreach, and push qualified opportunities into your CRM, all from one place.",
    openGraph: { url: "https://levatahq.com/products/sales-intelligence-platform" },
};

export default function Page() {
    return <SalesIntelligencePage />;
}

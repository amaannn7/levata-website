import type { Metadata } from "next";
import SalesIntelligencePage from "./SalesIntelligencePage";

export const metadata: Metadata = {
    title: "Sales Intelligence Platform | Levata",
    description:
        "The AI-powered sales workspace for B2B teams. Research prospects, prioritize leads, generate personalized outreach, and push qualified opportunities into your CRM, all from one place.",
};

export default function Page() {
    return <SalesIntelligencePage />;
}

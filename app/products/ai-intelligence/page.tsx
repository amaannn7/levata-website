import AIIntelligencePage from "./AIIntelligencePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "AI & Intelligence | Levata",
    description:
        "Levata builds AI integration systems, custom model deployments, and intelligent automation for modern businesses. Build the intelligence layer your business deserves.",
};

export default function Page() {
    return <AIIntelligencePage />;
}

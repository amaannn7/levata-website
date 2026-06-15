import type { Metadata } from "next";
import AutomationSystemsPage from "./AutomationSystemsPage";

export const metadata: Metadata = {
    title: "Automation & Systems",
    description:
        "AI-powered operations infrastructure, workflow automation, decision systems, and executive dashboards that connect every part of your business.",
    openGraph: { url: "https://levatahq.com/products/automation-systems" },
};

export default function Page() {
    return <AutomationSystemsPage />;
}

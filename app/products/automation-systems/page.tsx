import type { Metadata } from "next";
import AutomationSystemsPage from "./AutomationSystemsPage";

export const metadata: Metadata = {
    title: "Automation & Systems | Levata",
    description:
        "AI-powered operations infrastructure — workflow automation, decision systems, and executive dashboards that connect every part of your business.",
};

export default function Page() {
    return <AutomationSystemsPage />;
}

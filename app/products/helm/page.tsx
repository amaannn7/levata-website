import type { Metadata } from "next";
import HelmPage from "./HelmPage";

export const metadata: Metadata = {
    title: "Helm: Leadership Operating System",
    description:
        "Helm gets your leadership team pulling in the same direction: one shared plan, a weekly scorecard, 90-day priorities and a Monday meeting that solves problems. Free to start.",
    openGraph: { url: "https://levatahq.com/products/helm" },
};

export default function Page() {
    return <HelmPage />;
}

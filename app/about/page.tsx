import type { Metadata } from "next";
import AboutPage from "./AboutPage";

export const metadata: Metadata = {
    title: "About",
    description:
        "Learn about Levata — our mission, team, and approach to building AI systems and digital infrastructure for ambitious businesses.",
    openGraph: {
        url: "https://levatahq.com/about",
    },
};

export default function Page() {
    return <AboutPage />;
}

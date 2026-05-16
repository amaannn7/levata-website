import type { Metadata } from "next";
import DigitalProductsPage from "./DigitalProductsPage";

export const metadata: Metadata = {
    title: "Digital Products | Levata",
    description:
        "AI-native MVP and product development for founders and teams that need to ship validated software fast — without overbuilding, rebuilding, or guessing.",
};

export default function Page() {
    return <DigitalProductsPage />;
}

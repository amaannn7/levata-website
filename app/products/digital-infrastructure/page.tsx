import type { Metadata } from "next";
import DigitalServicesPage from "./DigitalServicesPage";

export const metadata: Metadata = {
    title: "Digital Infrastructure | Levata",
    description:
        "Building high-performance websites, ecommerce platforms, and digital systems that form the foundation of modern business.",
};

export default function Page() {
    return <DigitalServicesPage />;
}

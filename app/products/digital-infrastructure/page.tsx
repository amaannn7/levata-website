import type { Metadata } from "next";
import DigitalServicesPage from "./DigitalServicesPage";

export const metadata: Metadata = {
    title: "Digital Infrastructure",
    description:
        "Building high-performance websites, ecommerce platforms, and digital systems that form the foundation of modern business.",
    openGraph: { url: "https://levatahq.com/products/digital-infrastructure" },
};

export default function Page() {
    return <DigitalServicesPage />;
}

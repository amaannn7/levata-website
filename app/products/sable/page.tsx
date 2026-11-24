import type { Metadata } from "next";
import SablePage from "./SablePage";

export const metadata: Metadata = {
    title: "Sable: The Restaurant System for Sri Lanka",
    description:
        "Sable runs billing, kitchen, guests, stock, staff and accounts for restaurants, cafés and hotels in Sri Lanka as one system. VAT and SSCL ready, Sinhala, Tamil and English, and it keeps billing offline. From Rs 15,000 a month.",
    openGraph: { url: "https://levatahq.com/products/sable" },
};

export default function Page() {
    return <SablePage />;
}

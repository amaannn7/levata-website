import type { Metadata } from "next";
import DigitalProductsPage from "./DigitalProductsPage";

export const metadata: Metadata = {
    title: "Product Engineering",
    description:
        "We help founders and businesses test assumptions, validate market demand, and transform ideas into market-ready products through strategic design and scalable engineering.",
    openGraph: { url: "https://levatahq.com/products/product-engineering" },
};

export default function Page() {
    return <DigitalProductsPage />;
}

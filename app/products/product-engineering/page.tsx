import type { Metadata } from "next";
import DigitalProductsPage from "./DigitalProductsPage";

export const metadata: Metadata = {
    title: "Product Engineering | Levata",
    description:
        "We help founders and businesses test assumptions, validate market demand, and transform ideas into market-ready products through strategic design and scalable engineering.",
};

export default function Page() {
    return <DigitalProductsPage />;
}

import type { Metadata } from "next";
import DigitalServicesPage from "./DigitalServicesPage";

export const metadata: Metadata = {
    title: "Digital Services | Levata",
    description:
        "Revenue-engineered websites, platforms, e-commerce, and custom systems — built to convert, scale, and compound. Not brochureware.",
};

export default function Page() {
    return <DigitalServicesPage />;
}

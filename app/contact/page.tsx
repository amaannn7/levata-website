import ContactCTASection from "@/app/components/ContactCTASection";
import BookCallSection from "@/app/components/BookCallSection";
import ContactHero from "@/app/components/ContactHero";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact | Levata",
    description: "Book a free AI strategy call or send us your project brief. We respond within 48 hours.",
};

export default function ContactPage() {
    return (
        <main className="relative min-h-screen w-full bg-[#0E1014] flex flex-col overflow-hidden page-dividers">

            {/* Aurora glow matching home page */}
            <div
                aria-hidden
                className="pointer-events-none absolute z-0"
                style={{
                    top: "calc(100vh - 260px)",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "140vw",
                    height: "520px",
                    background: [
                        "radial-gradient(ellipse 30% 60% at 35% 80%, rgba(75,145,247,0.14) 0%, transparent 70%)",
                        "radial-gradient(ellipse 30% 60% at 65% 80%, rgba(75,145,247,0.18) 0%, transparent 70%)",
                    ].join(", "),
                }}
            />

            {/* Hero, cursor-reactive orbs + Lyzr typography */}
            <ContactHero />

            {/* Form */}
            <ContactCTASection showHeading={false} />

            {/* Book a Call */}
            <BookCallSection />
        </main>
    );
}

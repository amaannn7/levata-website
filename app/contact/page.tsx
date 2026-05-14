import ContactCTASection from "@/app/components/ContactCTASection";
import BookCallSection from "@/app/components/BookCallSection";
import PageArcs from "@/app/components/PageArcs";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact | Levata",
    description: "Book a free AI strategy call or send us your project brief. We respond within 48 hours.",
};

export default function ContactPage() {
    return (
        <main className="relative min-h-screen w-full bg-[#07001F] flex flex-col overflow-hidden">
            <PageArcs />

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
                        "radial-gradient(ellipse 30% 60% at 35% 80%, rgba(114,200,245,0.14) 0%, transparent 70%)",
                        "radial-gradient(ellipse 30% 60% at 65% 80%, rgba(155,47,255,0.18) 0%, transparent 70%)",
                    ].join(", "),
                }}
            />

            {/* Hero — centered inside arc rings, same pattern as home */}
            <section
                data-hero
                className="relative z-10 flex flex-1 flex-col items-center justify-start text-center px-6"
                style={{ paddingTop: "calc(72px + 9.5vw)", paddingBottom: "clamp(60px, 8vw, 120px)" }}
            >
                <div className="mb-4 inline-flex items-center gap-3">
                    <span className="flex items-center">
                        <span className="animate-label-line" />
                        <span className="animate-label-dot" />
                    </span>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/50">Strategy call</p>
                </div>

                <h1
                    className="mb-6 max-w-3xl text-balance text-[1.9rem] font-semibold leading-[1.06] tracking-[-0.02em] text-white sm:text-[2.25rem] md:text-[2.7rem] lg:text-[3rem]"
                    style={{ fontFamily: "var(--font-space-grotesk), 'Space Grotesk', sans-serif" }}
                >
                    Let&apos;s build the intelligence layer your business deserves.
                </h1>

                <p className="mb-8 max-w-xl text-base leading-relaxed text-white/55">
                    Tell us about your business. We&apos;ll come back with a clear path to AI-powered operations
                    within 48 hours.
                </p>
            </section>

            {/* Form */}
            <ContactCTASection showHeading={false} />

            {/* Book a Call */}
            <BookCallSection />
        </main>
    );
}

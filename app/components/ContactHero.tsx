"use client";

import dynamic from "next/dynamic";
import SectionLabel from "@/app/components/SectionLabel";

const HeroHorizon = dynamic(() => import("@/app/components/HeroHorizon"), { ssr: false });

export default function ContactHero() {
    return (
        <section
            data-hero
            className="relative z-10 flex flex-1 flex-col items-center justify-start text-center px-6"
            style={{ paddingTop: "calc(60px + 9.5vw)", paddingBottom: "clamp(60px, 8vw, 120px)" }}
        >
            <div className="relative z-10 mb-4">
                            </div>

            <h1 className="display-hero-title max-w-3xl relative z-10 mb-6 text-center">
                <span className="display-muted-line">The intelligence layer</span>
                <span className="display-strong-line">your business deserves.</span>
            </h1>

            <p className="relative z-10 mb-8 max-w-[32rem] text-base leading-7 text-[#A1A1AA]">
                Tell us about your business. We&apos;ll come back with a clear path to AI-powered operations
                within 48 hours.
            </p>
            <HeroHorizon />
        </section>
    );
}

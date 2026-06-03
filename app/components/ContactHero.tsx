"use client";

import dynamic from "next/dynamic";
import SectionLabel from "@/app/components/SectionLabel";

const HeroHorizon = dynamic(() => import("@/app/components/HeroHorizon"), { ssr: false });

export default function ContactHero() {
    return (
        <section
            data-hero
            className="relative z-10 flex min-h-[96svh] flex-1 flex-col items-center justify-center overflow-hidden text-center px-6 md:min-h-0 md:justify-start"
            style={{ paddingTop: "calc(56px + 4vw)", paddingBottom: "clamp(48px, 6vw, 120px)" }}
        >
            <div className="relative z-10 mb-4">
                            </div>

            <h1 className="display-hero-title max-w-4xl relative z-10 mb-6 text-center">
                <span className="display-muted-line">Build the intelligence layer</span>
                <span className="display-strong-line">your business deserves.</span>
            </h1>

            <p className="relative z-10 mb-8 max-w-2xl text-base leading-relaxed text-white/55 md:text-[1.05rem]">
                Tell us about your business, operations, and goals. We&apos;ll assess where smarter systems,
                automation, and AI can unlock greater efficiency, visibility, and growth.
            </p>
            <HeroHorizon />
        </section>
    );
}

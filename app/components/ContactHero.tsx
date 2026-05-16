"use client";

import { useRef } from "react";
import HeroBubbles from "@/app/components/HeroBubbles";

export default function ContactHero() {
    const heroRef = useRef<HTMLElement>(null);

    return (
        <section
            ref={heroRef}
            data-hero
            className="relative z-10 flex flex-1 flex-col items-center justify-start text-center px-6"
            style={{ paddingTop: "calc(72px + 9.5vw)", paddingBottom: "clamp(60px, 8vw, 120px)" }}
        >
            <HeroBubbles containerRef={heroRef} />
            <div className="relative z-10 mb-4 inline-flex items-center gap-3">
                <span className="flex items-center">
                    <span className="animate-label-line" />
                    <span className="animate-label-dot" />
                </span>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/50">Strategy call</p>
            </div>

            <h1
                className="relative z-10 mb-6 max-w-3xl text-balance text-[2rem] font-semibold leading-[1.05] tracking-[-0.025em] text-white sm:text-[2.5rem] md:text-[2.75rem] lg:text-[3rem]"
                style={{
                    fontFamily: "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
                }}
            >
                Let&apos;s build the intelligence layer <span className="italic">your business deserves.</span>
            </h1>

            <p className="relative z-10 mb-8 max-w-xl text-base leading-relaxed text-white/55 md:text-[1.05rem]">
                Tell us about your business. We&apos;ll come back with a clear path to AI-powered operations
                within 48 hours.
            </p>
        </section>
    );
}

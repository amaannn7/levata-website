"use client";

import { useEffect, useRef } from "react";
import CTAAurora from "@/app/components/CTAAurora";

const CALENDLY_URL = "https://calendly.com/levatahq/30min?hide_gdpr_banner=1&primary_color=7B55EA";

export default function BookCallSection() {
    const sectionRef = useRef<HTMLElement>(null);

    // Auto-scroll into view when navigated to via #book-call
    useEffect(() => {
        if (window.location.hash === "#book-call") {
            setTimeout(() => {
                sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 300);
        }
    }, []);

    return (
        <section
            ref={sectionRef}
            id="book-call"
            className="relative w-full overflow-hidden bg-[var(--background)] px-6 pb-16"
        >
            <CTAAurora intent="subtle" variant={3} />
            <div className="relative z-10 mx-auto max-w-5xl">

                <div className="h-px w-full bg-white/8" />

                <div className="mt-16">
                    <div className="mb-10">
                        <h2 className="display-section-title">
                            Book a{" "}
                            <span className="text-white">30-minute call.</span>
                        </h2>
                        <p className="mt-3 max-w-sm text-body-sm text-white/45">
                            Skip the form. Pick a slot and we&apos;ll meet you there.
                        </p>
                    </div>

                    {/* Calendly inline widget — always visible, no toggle */}
                    <div className="overflow-hidden rounded-2xl border border-white/8" style={{ height: "700px" }}>
                        <iframe
                            src={CALENDLY_URL}
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            title="Book a strategy call with Levata"
                            style={{ display: "block", border: "none" }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

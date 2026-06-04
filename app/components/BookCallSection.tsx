"use client";

import { useState } from "react";
import CTAAurora from "@/app/components/CTAAurora";

const CALENDLY_URL = "https://calendly.com/levatahq/30min?hide_gdpr_banner=1&primary_color=7B55EA";

export default function BookCallSection() {
    const [open, setOpen] = useState(false);

    return (
        <section
            id="book-call"
            className="relative w-full overflow-hidden bg-[var(--background)] px-6 pb-16"
        >
            <CTAAurora intent="subtle" variant={3} />
            <div className="relative z-10 mx-auto max-w-5xl">

                <div className="h-px w-full bg-white/8" />

                <div className="mt-16">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h2 className="display-section-title">
                                Book a{" "}
                                <span className="text-white">30-minute call.</span>
                            </h2>
                            <p className="mt-3 max-w-sm text-body-sm text-white/45">
                                Skip the form. Pick a slot and we&apos;ll meet you there.
                            </p>
                        </div>

                        {/* Toggle button */}
                        <button
                            type="button"
                            onClick={() => setOpen((v) => !v)}
                            className="group/cta inline-flex shrink-0 items-center gap-4"
                        >
                            <span className="text-eyebrow text-white/80 transition-colors group-hover/cta:text-white">
                                {open ? "Close" : "Pick a Time"}
                            </span>
                            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white transition-all duration-300 group-hover/cta:border-[#7B55EA]/60 group-hover/cta:shadow-[0_0_14px_rgba(123,85,234,0.35)]">
                                <span
                                    className="transition-transform duration-300"
                                    style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)" }}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                                        <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </span>
                            </span>
                        </button>
                    </div>

                    {open && (
                        <div className="mt-10 overflow-hidden rounded-2xl border border-white/8" style={{ height: "700px" }}>
                            <iframe
                                src={CALENDLY_URL}
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                title="Book a strategy call with Levata"
                                style={{ display: "block", border: "none" }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

"use client";

import { useState, useRef } from "react";
import CTAAurora from "@/app/components/CTAAurora";
import SectionLabel from "@/app/components/SectionLabel";

export default function BookCallSection() {
    const [open, setOpen] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

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
                    {/* Header row */}
                    <div
                        className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
                        data-book-heading
                    >
                        <div>
                                                        <h2 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
                                Book a{" "}
                                <span className="text-white">
                                    30-minute call.
                                </span>
                            </h2>
                            <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/45">
                                Skip the form. Pick a slot and we&apos;ll meet you there.
                            </p>
                        </div>

                        {/* Arrow CTA button */}
                        <button
                            type="button"
                            onClick={() => setOpen((v) => !v)}
                            className="group/cta inline-flex shrink-0 items-center gap-4"
                            data-book-button
                        >
                            <span className="text-sm font-semibold uppercase tracking-[0.22em] text-white/80 transition-colors group-hover/cta:text-white">
                                {open ? "Close" : "Pick a Time"}
                            </span>
                            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white transition-all duration-300 group-hover/cta:border-[#7B55EA]/60 group-hover/cta:shadow-[0_0_14px_rgba(123, 85, 234,0.35)]">
                                <span
                                    className="transition-transform duration-300 group-hover/cta:drop-shadow-[0_0_6px_#7B55EA]"
                                    style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)" }}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                                        <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </span>
                            </span>
                        </button>
                    </div>

                    {/* Calendly embed */}
                    {open && (
                        <div className="mt-10 overflow-hidden rounded-2xl border border-white/8">
                            <div className="flex flex-col items-center justify-center gap-5 bg-white/[0.02] py-28 text-center">
                                <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 text-white/30">
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                                        <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
                                        <path d="M3 9H21M8 2V6M16 2V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                </span>
                                <div>
                                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/30">
                                        Calendly widget coming soon
                                    </p>
                                    <p className="mt-2 max-w-xs text-xs text-white/20">
                                        Replace the placeholder in{" "}
                                        <code className="text-white/30">BookCallSection.tsx</code>{" "}
                                        with your Calendly embed URL.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

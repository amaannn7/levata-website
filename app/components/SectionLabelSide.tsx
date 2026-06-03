"use client";

import { useEffect, useRef, useState } from "react";

export default function SectionLabelSide() {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            setVisible(true);
            return;
        }
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
            { threshold: 0, rootMargin: "0px 0px 0px 0px" }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    return (
        <>
            {/* Mobile: vertical beam */}
            <div className="flex flex-col items-start gap-0 md:hidden">
                <span aria-hidden className={`section-label-beam${visible ? " section-label-beam--active" : ""}`} />
                <span aria-hidden className={`section-label-dot${visible ? " section-label-dot--active" : ""}`} />
            </div>
            {/* Desktop: horizontal beam */}
            <div ref={ref} className="hidden md:flex flex-row items-center">
                <span aria-hidden className={`section-label-beam-side${visible ? " section-label-beam-side--active" : ""}`} />
                <span aria-hidden className={`section-label-dot-side${visible ? " section-label-dot-side--active" : ""}`} />
            </div>
        </>
    );
}

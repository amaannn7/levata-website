"use client";

import { useEffect, useRef, useState } from "react";

export default function SectionLabelSide() {
    const ref = useRef<HTMLDivElement>(null);
    const [active, setActive] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setActive(true); observer.disconnect(); } },
            { threshold: 0.1 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={ref} className="flex flex-row items-center">
            <span aria-hidden className={`section-label-beam-side${active ? " section-label-beam-side--active" : ""}`} />
            <span aria-hidden className={`section-label-dot-side${active ? " section-label-dot-side--active" : ""}`} />
        </div>
    );
}

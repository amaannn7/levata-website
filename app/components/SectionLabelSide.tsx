"use client";

import { useEffect, useRef, useState } from "react";

export default function SectionLabelSide() {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
            { threshold: 0 }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    return (
        <div ref={ref} className="flex flex-row items-center">
            <span aria-hidden className={`section-label-beam-side${visible ? " section-label-beam-side--active" : ""}`} />
            <span aria-hidden className={`section-label-dot-side${visible ? " section-label-dot-side--active" : ""}`} />
        </div>
    );
}

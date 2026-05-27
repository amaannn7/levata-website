"use client";

import { useEffect, useRef, useState } from "react";

export default function SectionLabel() {
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
        <div ref={ref} className="flex flex-col items-center gap-0">
            <span aria-hidden className={`section-label-beam${visible ? " section-label-beam--active" : ""}`} />
            <span aria-hidden className={`section-label-dot${visible ? " section-label-dot--active" : ""}`} />
        </div>
    );
}

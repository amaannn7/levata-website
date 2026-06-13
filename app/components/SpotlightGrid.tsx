"use client";

import { useRef, useEffect } from "react";

/**
 * Ambient hero background: a dim dot grid that brightens near the cursor.
 * The cursor position is written to CSS vars (--mx / --my) on the section,
 * and a masked overlay reveals the bright dots in a soft radius around it.
 * Pure CSS compositing -- no React re-renders per mouse move.
 */
export default function SpotlightGrid() {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const target = el.parentElement ?? el;

        const onMove = (e: MouseEvent) => {
            const rect = el.getBoundingClientRect();
            el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
            el.style.setProperty("--my", `${e.clientY - rect.top}px`);
        };

        target.addEventListener("mousemove", onMove);
        return () => target.removeEventListener("mousemove", onMove);
    }, []);

    return <div ref={ref} aria-hidden className="spotlight-grid pointer-events-none absolute inset-0 z-0" />;
}

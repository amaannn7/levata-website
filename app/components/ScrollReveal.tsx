"use client";

import { useEffect } from "react";

/**
 * Site-wide scroll reveal. Mark any element with `data-reveal` (optionally
 * `data-reveal-delay="120"` in ms) and it fades up once when it scrolls into view.
 *
 * The look lives in globals.css (`.reveal-on [data-reveal]`). This component only
 * ever ADDS `is-revealed` — nothing hides an element again, so nothing can blink.
 * `.reveal-on` is set by an inline script in <head> before first paint, and is
 * skipped for prefers-reduced-motion, so without JS or with reduced motion
 * everything is simply visible.
 */
const MAX_DELAY_MS = 450;

export default function ScrollReveal() {
    useEffect(() => {
        const root = document.documentElement;
        if (!root.classList.contains("reveal-on")) return;
        root.setAttribute("data-reveal-ready", "");

        const finish = (el: HTMLElement) => el.classList.add("reveal-done");

        const reveal = (el: HTMLElement) => {
            if (el.classList.contains("is-revealed")) return;
            const delay = Math.min(MAX_DELAY_MS, Number(el.dataset.revealDelay) || 0);
            if (delay) el.style.setProperty("--reveal-delay", `${delay}ms`);
            el.classList.add("is-revealed");
            // Drop the reveal transition once done, so the element's own hover
            // transitions behave exactly as before.
            el.addEventListener("transitionend", (e) => { if (e.target === el) finish(el); }, { once: true });
            setTimeout(() => finish(el), 900 + delay);
        };

        if (!("IntersectionObserver" in window)) {
            root.classList.remove("reveal-on");
            return;
        }

        const io = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    // Reveal on entering the viewport, or if it is already above it
                    // (anchor jumps, back navigation, fast flings).
                    if (entry.isIntersecting || entry.boundingClientRect.bottom < 0) {
                        reveal(entry.target as HTMLElement);
                        io.unobserve(entry.target);
                    }
                }
            },
            { rootMargin: "0px 0px -8% 0px" },
        );

        const observeIn = (scope: ParentNode) => {
            if (scope instanceof HTMLElement && scope.matches("[data-reveal]:not(.is-revealed)")) io.observe(scope);
            scope.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-revealed)").forEach((el) => io.observe(el));
        };
        observeIn(document);

        // Pick up elements rendered later (route changes, tabs, accordions).
        const mo = new MutationObserver((records) => {
            for (const r of records) r.addedNodes.forEach((n) => { if (n instanceof HTMLElement) observeIn(n); });
        });
        mo.observe(document.body, { childList: true, subtree: true });

        // Safety net for browsers where the observer misfires: anything sitting
        // in view gets revealed. Only ever reveals, never hides.
        const sweep = () => {
            const vh = window.innerHeight;
            document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-revealed)").forEach((el) => {
                const r = el.getBoundingClientRect();
                if (r.height > 0 && r.top < vh * 0.92) reveal(el);
            });
        };
        const sweepTimer = setInterval(sweep, 1200);

        return () => {
            io.disconnect();
            mo.disconnect();
            clearInterval(sweepTimer);
        };
    }, []);

    return null;
}

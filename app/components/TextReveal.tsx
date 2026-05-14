"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Cinematic text reveal — lines slide up from behind overflow-hidden clip masks.
 * Each line is a masked wrapper; words inside stagger for a cascading effect.
 * Lenis smooth scroll is handled in SmoothScrollProvider (already wired).
 *
 * Excluded: [data-hero], form, footer, nav, header, [data-no-reveal], FAQ answers.
 * Included: all h2, h3, p outside those zones + FAQ question spans.
 */
export default function TextReveal() {
    const pathname = usePathname();

    useEffect(() => {
        gsap.registerPlugin(SplitText, ScrollTrigger);

        const splits: InstanceType<typeof SplitText>[] = [];
        let frame: number;

        const animateEl = (el: HTMLElement) => {
            // Split into lines; each line gets an overflow:clip wrapper via mask
            const split = new SplitText(el, {
                type: "lines",
                mask: "lines",
            });
            splits.push(split);

            // Each line slides up as a whole unit with a stagger between lines
            gsap.from(split.lines, {
                yPercent: 120,
                stagger: 0.08,
                ease: "power4.out",
                duration: 1.2,
                scrollTrigger: {
                    trigger: el,
                    start: "top 92%",
                    once: true,
                },
            });
        };

        frame = requestAnimationFrame(() => {
            const textEls = gsap.utils.toArray<HTMLElement>("h2, h3, p").filter(
                (el) =>
                    !el.closest("[data-hero]") &&
                    !el.closest("form") &&
                    !el.closest("footer") &&
                    !el.closest("nav") &&
                    !el.closest("header") &&
                    !el.closest("[data-no-reveal]") &&
                    !el.closest("[data-faq-item]") &&
                    !!el.textContent?.trim()
            );

            // FAQ question spans — always visible in DOM, safe to split
            const faqSpans = Array.from(
                document.querySelectorAll<HTMLElement>("[data-faq-item] button > span:first-child")
            );

            [...textEls, ...faqSpans].forEach(animateEl);
        });

        return () => {
            cancelAnimationFrame(frame);
            splits.forEach((s) => s.revert());
            ScrollTrigger.getAll().forEach((t) => t.kill());
        };
    }, [pathname]);

    return null;
}

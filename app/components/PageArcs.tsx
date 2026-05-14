"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function PageArcs() {
    const outerRef = useRef<HTMLImageElement>(null);
    const innerRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        if (!outerRef.current || !innerRef.current) return;
        const t1 = gsap.to(outerRef.current, {
            rotation: -360, duration: 45, ease: "none", repeat: -1, transformOrigin: "center center",
        });
        const t2 = gsap.to(innerRef.current, {
            rotation: 360, duration: 45, ease: "none", repeat: -1, transformOrigin: "center center",
        });
        return () => { t1.kill(); t2.kill(); };
    }, []);

    return (
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            <div style={{
                position: "absolute", top: "100px", left: "50%",
                transform: "translateX(-50%)", width: "160vw", height: "160vw",
            }}>
                <img
                    ref={outerRef}
                    src="/circular-hero-out.svg"
                    alt="" aria-hidden
                    style={{ display: "block", width: "100%", height: "100%" }}
                />
            </div>
            <div style={{
                position: "absolute", top: "calc(100px + 16vw)", left: "50%",
                transform: "translateX(-50%)", width: "128vw", height: "128vw",
            }}>
                <img
                    ref={innerRef}
                    src="/688ce43e4092c9990ed4a821_hero-circular-in.svg"
                    alt="" aria-hidden
                    style={{ display: "block", width: "100%", height: "100%" }}
                />
            </div>
        </div>
    );
}

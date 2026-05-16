"use client";

import { Button as NeonButton, type ButtonProps } from "@/app/components/ui/neon-button";
import { useBookCall } from "@/app/components/BookCallProvider";

export default function BookCallButton({ children = "Book a Strategy Call", ...props }: ButtonProps) {
    const { open } = useBookCall();
    return (
        <NeonButton
            variant={props.variant ?? "solid"}
            size={props.size ?? "default"}
            className={props.className ?? "text-sm font-semibold tracking-wide px-6 py-2.5"}
            {...props}
            onClick={(e) => {
                props.onClick?.(e);
                if (!e.defaultPrevented) open();
            }}
        >
            {children}
        </NeonButton>
    );
}

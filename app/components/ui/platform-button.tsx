"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const SIZE_CLASS: Record<Size, string> = {
    sm: "h-8 px-4 text-xs gap-1.5",
    md: "h-10 px-5 text-sm gap-2",
    lg: "h-11 px-6 text-[13px] gap-2",
};

const VARIANT_CLASS: Record<Variant, string> = {
    primary: "bg-[#7B55EA] text-white hover:bg-[#6b4cd8] border border-transparent",
    secondary: "bg-transparent text-white border border-white/20 hover:border-white/40 hover:bg-white/5",
    ghost: "bg-transparent text-white/75 border border-transparent hover:text-white",
};

interface PlatformButtonProps {
    variant?: Variant;
    size?: Size;
    href?: string;
    className?: string;
    children: React.ReactNode;
    icon?: React.ReactNode;
    fullWidth?: boolean;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
}

export function PlatformButton({
    variant = "primary",
    size = "md",
    href,
    className,
    children,
    icon,
    fullWidth,
    onClick,
    type = "button",
    disabled,
}: PlatformButtonProps) {
    const base = cn(
        "inline-flex items-center justify-center rounded-full font-semibold tracking-tight transition-all duration-200 cursor-pointer select-none whitespace-nowrap",
        SIZE_CLASS[size],
        VARIANT_CLASS[variant],
        fullWidth && "w-full",
        disabled && "opacity-50 cursor-not-allowed pointer-events-none",
        className,
    );

    if (href && !disabled) {
        return (
            <Link href={href} className={base}>
                {icon && <span className="shrink-0">{icon}</span>}
                {children}
            </Link>
        );
    }

    return (
        <button type={type} onClick={onClick} disabled={disabled} className={base}>
            {icon && <span className="shrink-0">{icon}</span>}
            {children}
        </button>
    );
}

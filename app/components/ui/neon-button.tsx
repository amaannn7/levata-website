import React from 'react'
import { cn } from '@/lib/utils'
import { VariantProps, cva } from "class-variance-authority";

const buttonVariants = cva(
    "relative group border text-foreground mx-auto text-center rounded-full transition-all duration-200",
    {
        variants: {
            variant: {
                default: "bg-[#9B2FFF]/10 hover:bg-[#9B2FFF]/5 border-[#9B2FFF]/30 text-white",
                solid: "bg-[#9B2FFF] hover:bg-[#8520ee] text-white border-transparent hover:border-[#72C8F5]/40",
                ghost: "border-white/20 bg-transparent hover:border-white/40 hover:bg-white/5 text-white/70 hover:text-white",
            },
            size: {
                default: "px-7 py-1.5",
                sm: "px-4 py-1.5",
                lg: "px-10 py-3.5",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> { neon?: boolean }

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, neon = true, size, variant, children, ...props }, ref) => {
        return (
            <button
                className={cn(buttonVariants({ variant, size }), className)}
                ref={ref}
                {...props}
            >
                <span className={cn("absolute h-px opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out inset-x-0 top-0 bg-gradient-to-r w-3/4 mx-auto from-transparent via-[#72C8F5] to-transparent hidden", neon && "block")} />
                {children}
                <span className={cn("absolute group-hover:opacity-50 opacity-0 transition-all duration-500 ease-in-out inset-x-0 h-px -bottom-px bg-gradient-to-r w-3/4 mx-auto from-transparent via-[#9B2FFF] to-transparent hidden", neon && "block")} />
            </button>
        );
    }
)

Button.displayName = 'Button';

export { Button, buttonVariants };

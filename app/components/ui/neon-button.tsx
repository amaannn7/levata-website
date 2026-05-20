import React from 'react'
import { cn } from '@/lib/utils'
import { VariantProps, cva } from "class-variance-authority";

const buttonVariants = cva(
    "inline-flex items-center justify-center rounded-full border text-center font-semibold tracking-[-0.01em] transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-60",
    {
        variants: {
            variant: {
                default: "border-[#2A2F3A] bg-[#171A22] text-[#E6E6E6] hover:bg-[#20242d]",
                solid: "border-[#4B91F7] bg-[#4B91F7] text-white hover:opacity-85",
                ghost: "border-[#2A2F3A] bg-transparent text-[#E6E6E6] hover:bg-[#171A22]",
            },
            size: {
                default: "px-6 py-2.5 text-sm",
                sm: "px-4 py-2 text-sm",
                lg: "px-6 py-2.5 text-base",
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
    VariantProps<typeof buttonVariants> { }

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, size, variant, children, ...props }, ref) => {
        return (
            <button
                className={cn(buttonVariants({ variant, size }), className)}
                ref={ref}
                {...props}
            >
                {children}
            </button>
        );
    }
)

Button.displayName = 'Button';

export { Button, buttonVariants };

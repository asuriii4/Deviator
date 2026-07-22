import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-cyan-500 text-zinc-950 hover:bg-cyan-400 hover:shadow-glow-cyan",
        premium:
          "bg-gradient-to-r from-purple-500 via-fuchsia-500 to-cyan-500 text-white hover:brightness-110 hover:shadow-glow-purple",
        success:
          "bg-emerald-500 text-zinc-950 hover:bg-emerald-400 hover:shadow-glow-emerald",
        destructive:
          "bg-red-500 text-white hover:bg-red-400 hover:shadow-glow-crimson",
        outline:
          "border border-zinc-700 bg-transparent text-zinc-200 hover:border-cyan-500/60 hover:bg-cyan-500/10 hover:text-cyan-300",
        ghost: "text-zinc-300 hover:bg-white/[0.06] hover:text-zinc-50",
        link: "text-cyan-400 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-11 rounded-lg px-6 text-base",
        icon: "h-9 w-9",
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
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

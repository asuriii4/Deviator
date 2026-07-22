import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide transition-colors",
  {
    variants: {
      variant: {
        default: "border-zinc-700 bg-zinc-800/80 text-zinc-300",
        cyan: "border-cyan-500/40 bg-cyan-500/10 text-cyan-300",
        purple: "border-purple-500/40 bg-purple-500/10 text-purple-300",
        emerald: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
        crimson: "border-red-500/40 bg-red-500/10 text-red-300",
        amber: "border-amber-500/40 bg-amber-500/10 text-amber-300",
        premium:
          "border-transparent bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-glow-purple",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

import { HTMLMotionProps } from "framer-motion";

interface NeonButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "outline";
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const NeonButton = React.forwardRef<HTMLButtonElement, NeonButtonProps>(
  ({ className, variant = "primary", children, icon, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "relative inline-flex items-center justify-center gap-2 px-8 py-3 text-sm font-medium tracking-wider uppercase transition-all duration-300 rounded-full group overflow-hidden",
          variant === "primary" && "bg-white text-black hover:shadow-[0_0_20px_rgba(255,255,255,0.5)]",
          variant === "secondary" && "bg-transparent text-[var(--color-neon-cyan)] border border-[var(--color-neon-cyan)] hover:bg-[var(--color-neon-cyan)] hover:text-black hover:shadow-[0_0_20px_rgba(0,255,255,0.4)]",
          className
        )}
        {...props}
      >
        <span className="relative z-10 font-outfit font-bold">{children}</span>
        {icon && <span className="relative z-10">{icon}</span>}
        {variant === "primary" && (
          <div className="absolute inset-0 z-0 bg-gradient-to-r from-[var(--color-neon-cyan)] via-[var(--color-neon-purple)] to-[var(--color-neon-pink)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        )}
      </motion.button>
    );
  }
);
NeonButton.displayName = "NeonButton";

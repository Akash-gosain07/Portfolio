"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface GlitchTextProps {
  text: string;
  className?: string;
}

export const GlitchText: React.FC<GlitchTextProps> = ({ text, className }) => {
  return (
    <div className={cn("relative inline-block font-outfit uppercase font-black tracking-tighter", className)}>
      <motion.span
        className="absolute top-0 left-0 -ml-[2px] text-[var(--color-neon-cyan)] opacity-70 animate-[glitch_2s_infinite]"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 45%, 0 45%)" }}
        aria-hidden="true"
      >
        {text}
      </motion.span>
      <motion.span
        className="absolute top-0 left-0 ml-[2px] text-[var(--color-neon-pink)] opacity-70 animate-[glitch_3s_infinite_reverse]"
        style={{ clipPath: "polygon(0 80%, 100% 20%, 100% 100%, 0 100%)" }}
        aria-hidden="true"
      >
        {text}
      </motion.span>
      <span className="relative text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-500 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
        {text}
      </span>
    </div>
  );
};

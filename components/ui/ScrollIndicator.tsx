"use client";

import React from "react";
import { motion } from "framer-motion";

export const ScrollIndicator = () => {
  return (
    <motion.div 
      className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5, duration: 1 }}
    >
      <span className="text-xs uppercase tracking-widest text-gray-400 font-outfit">Scroll</span>
      <div className="w-[30px] h-[50px] border-2 border-white/20 rounded-full flex justify-center p-1">
        <motion.div
          animate={{
            y: [0, 24, 0],
            opacity: [1, 0, 1]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-1.5 h-1.5 bg-[var(--color-neon-cyan)] rounded-full shadow-[0_0_8px_var(--color-neon-cyan)]"
        />
      </div>
    </motion.div>
  );
};

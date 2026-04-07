"use client";

import React from "react";
import { motion } from "framer-motion";
import { HeroScene } from "@/components/3d/HeroScene";
import { GlitchText } from "@/components/ui/GlitchText";
import { NeonButton } from "@/components/ui/NeonButton";
import { ScrollIndicator } from "@/components/ui/ScrollIndicator";
import { ArrowRight, Download } from "lucide-react";

export const Hero = () => {
  return (
    <section id="home" className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* 3D Background */}
      <HeroScene />

      {/* Foreground Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col items-center justify-center text-center mt-20">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-4"
        >
          <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-[var(--color-neon-cyan)] tracking-wide backdrop-blur-md inline-block mb-6 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
            Open to Full-Time Opportunities 2027
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl mb-6">
            <GlitchText text="AKASH KUMAR GOSAIN" />
          </h1>
        </motion.div>

        <motion.p 
          className="text-lg md:text-xl text-gray-300 max-w-3xl leading-relaxed font-inter mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          Pre-final year CS Engineer | Frontend Developer Intern @ Springer Capital | AI Researcher building HFME 2.0
        </motion.p>

        <motion.div 
          className="flex flex-col sm:flex-row items-center gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <a href="#projects">
            <NeonButton variant="primary" icon={<ArrowRight size={18} />}>
              Explore Projects
            </NeonButton>
          </a>
          <a href="/resume.pdf" target="_blank">
            <NeonButton variant="secondary" icon={<Download size={18} />}>
              Download Resume
            </NeonButton>
          </a>
        </motion.div>
      </div>

      {/* Floating Elements / Accents */}
      <div className="absolute top-1/4 left-10 w-32 h-32 bg-[var(--color-neon-cyan)] opacity-20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-40 h-40 bg-[var(--color-neon-purple)] opacity-30 rounded-full blur-[120px] pointer-events-none" />

      <ScrollIndicator />
    </section>
  );
};

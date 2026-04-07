"use client";

import React from "react";
import { motion } from "framer-motion";
import { SectionWrapper } from "@/components/ui/SectionWrapper";

export const About = () => {
  return (
    <SectionWrapper id="about">
      <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24 relative">
        {/* Holographic Avatar/Orb */}
        <div className="w-64 h-64 md:w-80 md:h-80 relative shrink-0">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border border-dashed border-[var(--color-neon-cyan)]/30"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute inset-4 rounded-full border border-[var(--color-neon-purple)]/20"
          />
          <motion.div
            className="absolute inset-8 rounded-full bg-gradient-to-br from-[var(--color-neon-cyan)]/20 to-[var(--color-neon-purple)]/20 backdrop-blur-md border border-white/10 flex items-center justify-center overflow-hidden"
            animate={{
              y: [0, -15, 0],
              boxShadow: [
                "0 0 20px rgba(0, 255, 255, 0.2)",
                "0 0 40px rgba(176, 38, 255, 0.4)",
                "0 0 20px rgba(0, 255, 255, 0.2)",
              ]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="text-6xl text-white font-outfit font-bold opacity-80 mix-blend-overlay">AKG</span>
          </motion.div>
        </div>

        {/* Bio Text */}
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-4xl md:text-5xl font-outfit font-bold text-white tracking-tight">
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-neon-cyan)] to-[var(--color-neon-purple)]">Me</span>
            </h2>
            <div className="h-[2px] flex-1 bg-gradient-to-r from-[var(--color-neon-cyan)]/50 to-transparent" />
          </div>

          <div className="space-y-6 text-lg text-gray-300 font-inter leading-relaxed">
            <p>
              I am a pre-final year Computer Science Engineering student obsessed with crafting high-performance, visually stunning web experiences. Currently working as a <strong className="text-white">Frontend Developer Intern at Springer Capital</strong>, I thrive at the intersection of design and engineering.
            </p>
            <p>
              My expertise lies in building cinematic single-page applications using modern frameworks like <strong className="text-[var(--color-neon-cyan)]">Next.js 14</strong>, complemented by complex animations via <strong className="text-[var(--color-neon-purple)]">Framer Motion</strong> and 3D rendering with <strong className="text-[var(--color-neon-pink)]">Three.js</strong>.
            </p>
            <p>
              Beyond traditional web development, I am deeply involved in AI research. I am currently architecting <strong className="text-white">HFME 2.0 (Human Friction Mapping Engine)</strong>, researching ways to seamlessly map and reduce UX friction using intelligent node networks.
            </p>
          </div>
          
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Experience", value: "2+ Yrs" },
              { label: "Projects", value: "10+" },
              { label: "Availability", value: "2027 FTE" },
              { label: "Location", value: "Remote/India" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-[var(--color-neon-cyan)]/30 transition-colors">
                <span className="text-3xl font-outfit font-bold text-white">{stat.value}</span>
                <span className="text-xs uppercase tracking-wider text-gray-400">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

"use client";

import React from "react";
import { motion } from "framer-motion";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { Trophy, Award, Star, Code2 } from "lucide-react";

const achievements = [
  {
    title: "1st Runner up at Ideathon (Vaidsys)",
    description: "Secured runner-up position demonstrating innovative problem-solving and rapid prototyping.",
    icon: <Trophy className="text-[var(--color-neon-cyan)] w-8 h-8" />,
    delay: 0.1
  },
  {
    title: "Global Rank 520 - Leetcode Biweekly 131",
    description: "Achieved top 1% global ranking in competitive programming contest.",
    icon: <Code2 className="text-[var(--color-neon-purple)] w-8 h-8" />,
    delay: 0.2
  },
  {
    title: "TCS iON Career Edge Certification",
    description: "Completed comprehensive master course focusing on IT foundations and soft skills.",
    icon: <Award className="text-[var(--color-neon-pink)] w-8 h-8" />,
    delay: 0.3
  },
  {
    title: "300+ DSA Questions Secured",
    description: "Consistently solved complex algorithmic challenges across Leetcode and GeeksforGeeks.",
    icon: <Star className="text-[var(--color-neon-cyan)] w-8 h-8" />,
    delay: 0.4
  }
];

export const Achievements = () => {
  return (
    <SectionWrapper id="achievements">
      <div className="flex flex-col mb-16 items-center text-center">
        <h2 className="text-4xl md:text-5xl font-outfit font-bold text-white tracking-tight mb-4">
          Achievements & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-neon-cyan)] to-[var(--color-neon-pink)]">Certifications</span>
        </h2>
        <div className="h-[2px] w-48 bg-gradient-to-r from-[var(--color-neon-cyan)] to-[var(--color-neon-pink)] opacity-50" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {achievements.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: item.delay }}
            className="p-6 rounded-2xl glass hover:bg-white/5 transition-colors border-t border-l border-white/10 flex flex-col items-center text-center group"
          >
            <div className="mb-6 p-4 rounded-full bg-black/50 border border-white/5 group-hover:scale-110 transition-transform duration-300">
              {item.icon}
            </div>
            <h3 className="text-xl font-bold font-outfit text-white mb-3">
              {item.title}
            </h3>
            <p className="text-gray-400 text-sm font-inter leading-relaxed">
              {item.description}
            </p>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
};

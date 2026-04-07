"use client";

import React, { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "About", href: "#about" },
  { name: "Experience", href: "#experience" },
  { name: "Projects", href: "#projects" },
  { name: "Skills", href: "#skills" },
  { name: "Contact", href: "#contact" },
];

export const Navbar = () => {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
    setScrolled(latest > 50);
  });

  return (
    <motion.header
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300 px-6 py-4 flex items-center justify-between",
        scrolled ? "glass shadow-lg" : "bg-transparent"
      )}
    >
      <a href="#" className="text-2xl font-outfit font-bold tracking-tighter text-white drop-shadow-[0_0_8px_var(--color-neon-cyan)]">
        AKG.
      </a>
      
      <nav className="hidden md:flex items-center gap-8 bg-black/50 px-6 py-2 rounded-full border border-white/10 backdrop-blur-md">
        {navItems.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className="text-sm font-medium text-gray-300 hover:text-[var(--color-neon-cyan)] transition-colors relative group"
          >
            {item.name}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--color-neon-cyan)] transition-all group-hover:w-full" />
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        <a href="https://github.com/Akash-gosain07" target="_blank" rel="noreferrer" className="text-gray-300 hover:text-white transition-colors">
          GitHub
        </a>
      </div>
    </motion.header>
  );
};

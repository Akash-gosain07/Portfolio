"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { NeonButton } from "@/components/ui/NeonButton";
import { Send, Mail } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export const Contact = () => {
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setTimeout(() => {
      setStatus("sent");
      setFormState({ name: "", email: "", message: "" });
    }, 1500);
  };

  return (
    <SectionWrapper id="contact" className="pb-10 pt-24">
      <div className="flex flex-col md:flex-row gap-16 w-full relative z-10">
        
        {/* Contact Info */}
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-6xl font-outfit font-black text-white tracking-tighter mb-6">
              Let&apos;s Build Something <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-neon-cyan)] to-[var(--color-neon-purple)]">
                Extraordinary
              </span>
            </h2>
            <p className="text-gray-400 font-inter text-lg max-w-md mb-10 leading-relaxed">
              Whether you have a question, a project idea, or just want to connect — I&apos;m always open to new opportunities. Let&apos;s chat!
            </p>

            <div className="flex gap-6 mb-12">
              <a 
                href="https://github.com/Akash-gosain07" 
                target="_blank" 
                rel="noreferrer"
                className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[var(--color-neon-cyan)] hover:text-black transition-all duration-300 hover:shadow-[0_0_20px_var(--color-neon-cyan)]"
              >
                <FaGithub size={24} />
              </a>
              <a 
                href="https://www.linkedin.com/in/akash-kumar-gosain-389989293" 
                target="_blank" 
                rel="noreferrer"
                className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[var(--color-neon-purple)] hover:text-white transition-all duration-300 hover:shadow-[0_0_20px_var(--color-neon-purple)]"
              >
                <FaLinkedin size={24} />
              </a>
              <a 
                href="mailto:akash@example.com" 
                className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[var(--color-neon-pink)] hover:text-white transition-all duration-300 hover:shadow-[0_0_20px_var(--color-neon-pink)]"
              >
                <Mail size={24} />
              </a>
            </div>
          </motion.div>
        </div>

        {/* Contact Form */}
        <div className="w-full md:w-1/2">
          <motion.form 
            onSubmit={handleSubmit}
            className="p-8 rounded-3xl glass flex flex-col gap-6 relative overflow-hidden"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Form glowing edge */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--color-neon-cyan)] via-[var(--color-neon-purple)] to-[var(--color-neon-pink)] opacity-50" />
            
            <h3 className="text-2xl font-bold font-outfit text-white mb-2">Send a Message</h3>
            
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-widest font-bold text-gray-500">Name</label>
              <input 
                type="text" 
                required
                value={formState.name}
                onChange={e => setFormState({...formState, name: e.target.value})}
                className="w-full bg-black/50 border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:border-[var(--color-neon-cyan)] transition-colors font-inter"
                placeholder="John Doe"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-widest font-bold text-gray-500">Email</label>
              <input 
                type="email" 
                required
                value={formState.email}
                onChange={e => setFormState({...formState, email: e.target.value})}
                className="w-full bg-black/50 border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:border-[var(--color-neon-purple)] transition-colors font-inter"
                placeholder="john@example.com"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-widest font-bold text-gray-500">Message</label>
              <textarea 
                required
                rows={4}
                value={formState.message}
                onChange={e => setFormState({...formState, message: e.target.value})}
                className="w-full bg-black/50 border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:border-[var(--color-neon-pink)] transition-colors font-inter resize-none"
                placeholder="Hello Akash..."
              />
            </div>

            <NeonButton 
              type="submit" 
              variant="primary" 
              disabled={status === "sending" || status === "sent"}
              className="mt-4"
              icon={status === "sent" ? undefined : <Send size={18} />}
            >
              {status === "idle" ? "Send Message" : status === "sending" ? "Sending..." : "Message Sent!"}
            </NeonButton>
          </motion.form>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-32 pt-8 border-t border-white/10 flex flex-col items-center text-center">
        <p className="text-sm text-gray-500 font-inter">
          Made with <span className="text-red-500">❤️</span> and a lot of Three.js + Framer Motion
        </p>
        <p className="text-xs text-gray-600 mt-2 font-inter">
          © {new Date().getFullYear()} Akash Kumar Gosain. All rights reserved.
        </p>
      </div>
    </SectionWrapper>
  );
};

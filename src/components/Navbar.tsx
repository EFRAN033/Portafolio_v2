'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CONFIG } from '@/config';
import { Magnetic } from './ui/Magnetic';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { nav } = CONFIG;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);

    const sections = ['home', ...nav.links.map(l => l.href.substring(1))];
    sections.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        ScrollTrigger.create({
          trigger: `#${id}`,
          start: "top center",
          end: "bottom center",
          onToggle: (self) => self.isActive && setActiveSection(id)
        });
      }
    });

    return () => window.removeEventListener('scroll', handleScroll);
  }, [nav.links]);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={clsx(
        "fixed w-full top-0 z-50 transition-all duration-300",
        isScrolled 
          ? 'bg-neutral-950/80 backdrop-blur-lg border-b border-neutral-800' 
          : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
        <Magnetic>
          <a href="#home" className="text-xl font-mono font-bold tracking-wider" aria-label={nav.logo.ariaLabel}>
            <span className="text-teal-400">&lt;</span>
            <span className="text-neutral-200">{nav.logo.text}</span>
            <span className="text-teal-400">/&gt;</span>
          </a>
        </Magnetic>
        <nav className="hidden md:flex items-center gap-8" aria-label="Navegación principal">
          {nav.links.map((link) => (
            <a key={link.name} href={link.href} className="relative text-sm font-medium uppercase tracking-wider text-neutral-300 hover:text-white transition-colors">
              {link.name}
              {activeSection === link.href.substring(1) && (
                <motion.div
                  className="absolute bottom-[-6px] left-0 right-0 h-0.5 bg-teal-400"
                  layoutId="active-link-indicator"
                />
              )}
            </a>
          ))}
          <motion.a
            href={CONFIG.user.resumeUrl}
            download
            className="flex items-center gap-2 bg-teal-500 text-white font-medium py-2 px-4 rounded-md hover:bg-teal-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <nav.cta.Icon size={16} />
            {nav.cta.text}
          </motion.a>
        </nav>
      </div>
    </motion.header>
  );
};
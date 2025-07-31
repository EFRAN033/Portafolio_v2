'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import clsx from 'clsx';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// Nota: El config se simula aquí, asegúrate de tenerlo en tu proyecto.
const CONFIG = {
  nav: {
    logo: { text: 'Efran', ariaLabel: 'Ir al inicio' },
    links: [
      { name: 'Sobre mí', href: '#about' },
      { name: 'Proyectos', href: '#projects' },
      { name: 'Contacto', href: '#contact' },
    ],
    cta: { 
        text: 'Descargar CV', 
        Icon: ({ size }: { size: number }) => (
            <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        ) 
    },
  },
  user: {
    resumeUrl: '/ruta/al/cv.pdf', // Reemplaza con la ruta real
  },
};
// Asumiendo que este componente está en ui/Magnetic
const Magnetic = ({ children }: { children: React.ReactNode }) => {
    // Implementación del componente Magnetic...
    return <div className="inline-block">{children}</div>;
};
import { Menu, X } from 'lucide-react';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { nav } = CONFIG;

  useEffect(() => {
    // Lógica de scroll y ScrollTrigger...
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
      if (isMobileMenuOpen && window.scrollY > 100) {
        setIsMobileMenuOpen(false);
      }
    };
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
  }, [nav.links, isMobileMenuOpen]);

  const mobileMenuVariants: Variants = {
    hidden: { x: "100%", opacity: 0 },
    visible: { x: "0%", opacity: 1, transition: { type: "spring", stiffness: 100, damping: 20 } },
    exit: { x: "100%", opacity: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
  };

  const linkVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={clsx(
        "fixed w-full top-0 z-50 transition-all duration-300",
        isScrolled 
          ? 'bg-blue-950/80 backdrop-blur-lg border-b border-blue-900 shadow-xl'
          : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
        <Magnetic>
          <a href="#home" className="text-xl font-mono font-bold tracking-wider" aria-label={nav.logo.ariaLabel}>
            <span className="text-sky-400">&lt;</span>
            <span className="text-slate-200">{nav.logo.text}</span>
            <span className="text-sky-400">/&gt;</span>
          </a>
        </Magnetic>

        <div className="md:hidden">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-slate-300 hover:text-sky-400 transition-colors p-2 focus:outline-none"
            aria-label="Toggle navigation"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        <nav className="hidden md:flex items-center gap-8" aria-label="Navegación principal">
          {nav.links.map((link, index) => (
            <motion.a 
              key={link.name} 
              href={link.href} 
              className="relative text-sm font-medium uppercase tracking-wider text-slate-300 hover:text-white transition-colors"
              initial="hidden"
              animate="visible"
              variants={linkVariants}
              transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
            >
              {link.name}
              {activeSection === link.href.substring(1) && (
                <motion.div
                  className="absolute bottom-[-6px] left-0 right-0 h-0.5 bg-sky-400"
                  layoutId="active-link-indicator"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
            </motion.a>
          ))}
          <motion.a
            href={CONFIG.user.resumeUrl}
            download
            className="group inline-flex items-center gap-2 rounded-md py-2 px-4 text-sm font-medium relative
                       border-2 border-sky-500 text-sky-500
                       transition-colors duration-300 ease-out
                       hover:bg-sky-500 hover:text-white"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + nav.links.length * 0.05, duration: 0.3 }}
          >
            <nav.cta.Icon size={16} />
            {nav.cta.text}
          </motion.a>
        </nav>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.nav
            key="mobile-menu"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="md:hidden fixed inset-0 bg-blue-950/95 backdrop-blur-lg z-40 flex flex-col items-center justify-center space-y-8"
          >
            {nav.links.map((link, index) => (
              <motion.a
                key={link.name}
                href={link.href}
                className="text-3xl font-bold text-slate-200 hover:text-sky-400 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </motion.a>
            ))}
            <motion.a
              href={CONFIG.user.resumeUrl}
              download
              className="group inline-flex items-center gap-2 rounded-md py-3 px-6 text-lg font-medium relative
                         border-2 border-sky-500 text-sky-500
                         transition-colors duration-300 ease-out
                         hover:bg-sky-500 hover:text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + nav.links.length * 0.1 }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <nav.cta.Icon size={20} />
              {nav.cta.text}
            </motion.a>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

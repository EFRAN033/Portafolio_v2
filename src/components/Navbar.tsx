// 'use client' directive is typically used in frameworks like Next.js for client components.

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import clsx from 'clsx';
import { Download } from 'lucide-react';

// --- CONFIGURACIÓN SIMULADA ---
const CONFIG = {
  nav: {
    logo: { text: 'Jeferson', ariaLabel: 'Ir al inicio' },
    links: [
      { name: 'Sobre mí', href: '#about' },
      { name: 'Proyectos', href: '#projects' },
      { name: 'Contacto', href: '#contact' },
    ],
    cta: { 
        text: 'Descargar CV', 
        Icon: ({ size }: { size: number }) => <Download size={size} />
    },
  },
  user: {
    resumeUrl: '#', // Reemplaza con la ruta real a tu CV
  },
};

// --- COMPONENTES AUXILIARES ---

const Magnetic = ({ children }: { children: React.ReactNode }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouse = (e: React.MouseEvent) => {
        if (!ref.current) return;
        const { clientX, clientY } = e;
        const { height, width, left, top } = ref.current.getBoundingClientRect();
        const x = clientX - (left + width / 2);
        const y = clientY - (top + height / 2);
        setPosition({ x, y });
    };

    const reset = () => {
        setPosition({ x: 0, y: 0 });
    };

    const { x, y } = position;
    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouse}
            onMouseLeave={reset}
            animate={{ x: x * 0.1, y: y * 0.1 }}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
        >
            {children}
        </motion.div>
    );
};

// ✅ BOTÓN MEJORADO: Más pequeño, con fondo transparente y ajustes en la animación.
const AnimatedHamburgerButton = ({ isOpen, toggle }: { isOpen: boolean; toggle: () => void; }) => {
    const Line = ({ variants }: { variants: Variants }) => (
        <motion.div
            className="h-0.5 w-5 bg-slate-200 rounded-full" // Líneas más cortas
            variants={variants}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
        />
    );

    return (
        <motion.button
            onClick={toggle}
            className="z-50 flex h-10 w-10 items-center justify-center rounded-full bg-transparent" // Botón más pequeño y transparente
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            animate={isOpen ? "open" : "closed"}
            aria-label="Toggle navigation"
        >
            <div className="flex flex-col items-center justify-center gap-y-1"> {/* Espaciado reducido */}
                <Line variants={{ open: { rotate: 45, y: 5 }, closed: { rotate: 0, y: 0 } }} />
                <Line variants={{ open: { opacity: 0, transition: {duration: 0.1} }, closed: { opacity: 1 } }} />
                <Line variants={{ open: { rotate: -45, y: -5 }, closed: { rotate: 0, y: 0 } }} />
            </div>
        </motion.button>
    );
};


// --- COMPONENTE PRINCIPAL: NAVBAR ---

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { nav } = CONFIG;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const sections = ['home', ...nav.links.map(l => l.href.substring(1))];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );

    sections.forEach(id => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      sections.forEach(id => {
        const element = document.getElementById(id);
        if (element) observer.unobserve(element);
      });
    };
  }, [nav.links]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const mobileMenuPanelVariants: Variants = {
    hidden: { x: "100%", opacity: 0 },
    visible: { x: "0%", opacity: 1, transition: { type: "tween", ease: "circOut", duration: 0.5 } },
    exit: { x: "100%", opacity: 0, transition: { type: "tween", ease: "circIn", duration: 0.3 } }
  };

  const mobileLinkContainerVariants: Variants = {
    visible: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const mobileLinkVariants: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={clsx(
          "fixed w-full top-0 z-40 transition-all duration-300",
          isScrolled 
            ? 'bg-blue-950/80 backdrop-blur-lg border-b border-blue-900 shadow-xl'
            : 'bg-transparent'
        )}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
          <Magnetic>
            <a href="#home" className="text-xl font-mono font-bold tracking-wider" aria-label={nav.logo.ariaLabel}>
              <span className="text-sky-400">&lt;</span>
              <span className="text-slate-200">{nav.logo.text}</span>
              <span className="text-sky-400">/&gt;</span>
            </a>
          </Magnetic>

          <nav className="hidden md:flex items-center gap-8" aria-label="Navegación principal">
            {nav.links.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className="relative text-sm font-medium uppercase tracking-wider text-slate-300 hover:text-white transition-colors"
              >
                {link.name}
                {activeSection === link.href.substring(1) && (
                  <motion.div
                    className="absolute -bottom-2 left-0 right-0 h-0.5 bg-sky-400"
                    layoutId="active-link-indicator"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
              </a>
            ))}
            <motion.a
              href={CONFIG.user.resumeUrl}
              download
              className="group inline-flex items-center gap-2 rounded-md py-2 px-4 text-sm font-medium relative
                         border-2 border-sky-500 text-sky-500
                         transition-colors duration-300 ease-out
                         hover:bg-sky-500 hover:text-white"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <nav.cta.Icon size={16} />
              {nav.cta.text}
            </motion.a>
          </nav>
        </div>
      </motion.header>

      <div className="md:hidden fixed top-5 right-4 z-50">
          <AnimatedHamburgerButton
              isOpen={isMobileMenuOpen}
              toggle={toggleMobileMenu}
          />
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            key="mobile-menu-panel"
            variants={mobileMenuPanelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="md:hidden fixed inset-0 bg-blue-950/90 backdrop-blur-xl z-30 overflow-hidden"
          >
            <motion.div className="absolute -top-20 -left-40 w-80 h-80 bg-sky-500/20 rounded-full blur-3xl" initial={{opacity: 0, x: -100}} animate={{opacity: 1, x: 0}} transition={{delay: 0.3, duration: 0.8}}/>
            <motion.div className="absolute -bottom-20 -right-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl" initial={{opacity: 0, x: 100}} animate={{opacity: 1, x: 0}} transition={{delay: 0.4, duration: 0.8}}/>
            
            <motion.nav
              variants={mobileLinkContainerVariants}
              initial="hidden"
              animate="visible"
              className="h-full flex flex-col items-center justify-center space-y-10"
            >
              {nav.links.map((link) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  className="text-3xl font-bold text-slate-200 hover:text-sky-400 transition-colors"
                  variants={mobileLinkVariants}
                  onClick={toggleMobileMenu}
                >
                  {link.name}
                </motion.a>
              ))}
              <motion.a
                href={CONFIG.user.resumeUrl}
                download
                className="group inline-flex items-center gap-3 rounded-lg py-3 px-6 text-xl font-medium relative
                           border-2 border-sky-500 text-sky-500
                           transition-colors duration-300 ease-out
                           hover:bg-sky-500 hover:text-white"
                variants={mobileLinkVariants}
                onClick={toggleMobileMenu}
              >
                <nav.cta.Icon size={22} />
                {nav.cta.text}
              </motion.a>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// --- COMPONENTE PRINCIPAL DE LA APLICACIÓN ---
export default function App() {
    const Section = ({ id, title }: { id: string, title: string }) => (
        <section id={id} className="h-screen flex items-center justify-center flex-col text-center px-4">
            <h1 className="text-4xl md:text-6xl font-bold text-white">{title}</h1>
            <p className="text-slate-400 mt-4 max-w-2xl">
                Contenido de la sección. Desplázate para ver cómo la barra de navegación resalta el enlace activo.
            </p>
        </section>
    );

    return (
        <div className="min-h-screen bg-blue-950 text-white font-sans">
            <Navbar />
            <main>
                <Section id="home" title="Inicio" />
                <Section id="about" title="Sobre Mí" />
                <Section id="projects" title="Proyectos" />
                <Section id="contact" title="Contacto" />
            </main>
        </div>
    );
}

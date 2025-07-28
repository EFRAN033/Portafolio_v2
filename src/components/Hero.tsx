'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { ArrowRight } from 'lucide-react';
import { CONFIG } from '@/config';
import { Magnetic } from './ui/Magnetic';

// Componente para el fondo de parrilla y foco de luz
const GridPatternBackground = () => {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const element = document.getElementById('spotlight');
      if (element) {
        element.style.background = `radial-gradient(circle at ${clientX}px ${clientY}px, rgba(0, 190, 190, 0.1) 0%, transparent 10%)`;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="absolute inset-0 z-0">
      {/* Parrilla de puntos */}
      <div className="absolute inset-0 bg-[radial-gradient(#222_1px,transparent_1px)] [background-size:2rem_2rem]"></div>
      {/* Foco de luz interactivo */}
      <div id="spotlight" className="absolute inset-0"></div>
    </div>
  );
};


export const Hero = () => {
  const { hero } = CONFIG;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section id="home" className="relative h-screen w-full overflow-hidden">
      <GridPatternBackground />
      <div className="relative z-10 flex h-full flex-col justify-center container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-3xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.p
            className="font-mono text-teal-400"
            variants={itemVariants}
          >
            {hero.greeting}
          </motion.p>
          <motion.h1
            className="text-5xl sm:text-6xl lg:text-8xl font-extrabold tracking-tighter text-neutral-100"
            variants={itemVariants}
          >
            {hero.title}
          </motion.h1>
          <motion.h2
            className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-400"
            variants={itemVariants}
          >
            <TypeAnimation
                sequence={[...hero.roles]} 
                wrapper="span"
                speed={50}
                className="text-xl font-medium text-neutral-500"
                repeat={Infinity}
              />
          </motion.h2>
          <motion.p
            className="mt-6 max-w-xl text-lg leading-relaxed text-neutral-400"
            variants={itemVariants}
          >
            {hero.description}
          </motion.p>
          <motion.div className="mt-12" variants={itemVariants}>
            <Magnetic>
              <a
                href="#contact"
                className="group inline-flex items-center gap-2 rounded-full bg-teal-500 px-8 py-4 text-lg font-bold text-white transition-all duration-300 hover:bg-teal-600 hover:ring-4 hover:ring-teal-500/30"
              >
                {hero.cta}
                <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </Magnetic>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
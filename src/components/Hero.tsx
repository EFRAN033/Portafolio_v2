'use client';

import React, { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import { motion, useAnimation, useMotionValue, useTransform, type MotionValue, type Variants } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { ArrowRight, Github, Linkedin, Twitter, Mail } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// ============================================================================
// --- CONSTANTES Y TIPOS ---
// ============================================================================

const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
};

const TRANSITIONS = {
  fast: '0.15s ease-in-out',
  medium: '0.3s ease-in-out',
  slow: '0.5s ease-in-out',
};

const KEYBOARD_COLORS = {
  keycap: {
    base: '#27272a',
    hover: '#3f3f46',
    active: '#18181b',
    text: '#f4f4f5',
    accent: '#a78bfa',
    specialAccent: '#0ea5e9', // ⭐ NUEVO: Color celeste para la tecla Shift
    shadow: '#18181b',
    border: '#52525b',
    highlight: 'hsla(0,0%,100%,0.1)',
  },
  keyboard: {
    base: '#1f2937',
    border: '#374151',
    shadow: '#111827',
    glow: 'hsla(271, 91%, 65%, 0.2)',
  },
  ripple: {
    base: 'hsla(271, 91%, 65%, 0.8)',
    glow: 'hsla(271, 91%, 75%, 0.6)',
  },
  spotlight: 'hsla(271, 91%, 65%, 0.15)',
};

interface SocialLink {
  name: string;
  url: string;
  Icon: LucideIcon;
  ariaLabel: string;
}

interface KeyConfig {
  char: string;
  subChar?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  accent?: boolean;
}

const CONFIG = {
  hero: {
    greeting: "Hola, soy",
    name: "Jeferson",
    description: "Apasionado por construir soluciones innovadoras y escalables que resuelvan problemas reales.",
    cta: "Contáctame",
    ctaAriaLabel: "Ir a la sección de contacto",
  },
  user: {
    socials: [
      { name: "GitHub", url: "https://github.com/yourusername", Icon: Github, ariaLabel: "Visitar mi perfil de GitHub" },
      { name: "LinkedIn", url: "https://linkedin.com/in/yourusername", Icon: Linkedin, ariaLabel: "Visitar mi perfil de LinkedIn" },
      { name: "Twitter", url: "https://twitter.com/yourusername", Icon: Twitter, ariaLabel: "Visitar mi perfil de Twitter" },
      { name: "Email", url: "mailto:your.email@example.com", Icon: Mail, ariaLabel: "Enviarme un correo electrónico" },
    ] as SocialLink[],
  },
  keyboard: {
    layout: [
      [{ char: 'ESC', size: 'sm' }, { char: 'R' }, { char: 'E' }, { char: 'A' }, { char: 'C' }, { char: 'T' }],
      [{ char: 'Tab', subChar: 'fn', size: 'md' }, { char: 'N' }, { char: 'O' }, { char: 'D' }, { char: 'E' }, { char: 'J' }, { char: 'S' }],
      [{ char: 'Caps', subChar: 'CSS', size: 'lg' }, { char: 'H' }, { char: 'T' }, { char: 'M' }, { char: 'L' }],
      [{ char: 'Shift', size: 'xl', accent: true }, { char: 'S' }, { char: 'Q' }, { char: 'L' }, { char: '<' }, { char: '>' }],
    ] as KeyConfig[][],
    keySizes: {
      sm: '4rem',
      md: '5rem',
      lg: '6rem',
      xl: '7.5rem',
      standard: '3.5rem',
    },
    keyHeight: '3.5rem',
    typingSequence: [
      'Desarrollador Full Stack', 2000,
      'Arquitecto de Software', 2000,
      'Entusiasta de la Nube', 2000,
    ],
  },
};

// ============================================================================
// --- COMPONENTES REUTILIZABLES ---
// ============================================================================

const Magnetic: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    setPosition({ x: x * 0.1, y: y * 0.1 });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={position}
      transition={{ type: 'spring', stiffness: 350, damping: 15, mass: 0.5 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const AnimatedCharacters: React.FC<{
  text: string;
  className?: string;
  delay?: number;
  as?: 'h1' | 'h2' | 'p' | 'span';
}> = ({ text, className = '', delay = 0, as: Tag = 'h1' }) => {
  const letters = useMemo(() => text.split("").map(l => (l === " " ? "\u00A0" : l)), [text]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: delay } },
  };

  const childVariants: Variants = {
    hidden: { y: 20, opacity: 0, filter: 'blur(4px)' },
    visible: { y: 0, opacity: 1, filter: 'blur(0px)', transition: { type: "spring", damping: 12, stiffness: 200 } },
  };

  const MotionTag = motion[Tag];

  return (
    <MotionTag
      className={className}
      style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }} // Removed lg: { justifyContent: 'flex-start' }
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      aria-label={text}
    >
      {letters.map((letter, index) => (
        <motion.span key={index} variants={childVariants} aria-hidden="true">
          {letter}
        </motion.span>
      ))}
    </MotionTag>
  );
};


// ============================================================================
// --- COMPONENTES DEL TECLADO 3D MEJORADO ---
// ============================================================================

type RippleOrigin = { row: number; col: number } | null;

interface KeycapProps extends KeyConfig {
  isPressed: boolean;
  row: number;
  col: number;
  rippleOrigin: RippleOrigin;
  onKeyPress?: (char: string) => void;
}

const Keycap: React.FC<KeycapProps> = ({
  char,
  subChar,
  size = 'standard',
  accent = false,
  isPressed,
  row,
  col,
  rippleOrigin,
  onKeyPress,
}) => {
  const controls = useAnimation();
  const distance = useMemo(() => {
    if (!rippleOrigin) return Infinity;
    return Math.sqrt(Math.pow(col - rippleOrigin.col, 2) + Math.pow(row - rippleOrigin.row, 2));
  }, [row, col, rippleOrigin]);

  useEffect(() => {
    if (distance !== Infinity) {
      controls.start({
        scale: [1, 1.8, 1],
        opacity: [0, 0.8, 0],
        transition: { duration: 0.6, delay: distance * 0.05, ease: 'circOut' },
      });
    }
  }, [distance, controls]);

  const handleInteraction = () => onKeyPress?.(char);
  
  const keyDepth = 8;
  const keyBaseBg = `linear-gradient(to bottom, ${KEYBOARD_COLORS.keycap.hover} 0%, ${KEYBOARD_COLORS.keycap.base} 100%)`;

  const initialShadow = `
    inset 0 1px 0 ${KEYBOARD_COLORS.keycap.highlight}, 
    0 ${keyDepth}px 0 ${KEYBOARD_COLORS.keycap.shadow}, 
    0 ${keyDepth + 2}px 10px rgba(0,0,0,0.5)`;
  const hoverShadow = `
    inset 0 1.5px 0 ${KEYBOARD_COLORS.keycap.highlight}, 
    0 ${keyDepth + 2}px 0 ${KEYBOARD_COLORS.keycap.shadow}, 
    0 ${keyDepth + 6}px 15px rgba(0,0,0,0.4)`;
  const pressedShadow = `
    inset 0 2px 2px rgba(0,0,0,0.3), 
    0 2px 0 ${KEYBOARD_COLORS.keycap.shadow}`;

  // ⭐ CAMBIO: Se usa el color especial si la tecla es de acento
  const keyColor = accent ? KEYBOARD_COLORS.keycap.specialAccent : KEYBOARD_COLORS.keycap.text;
  
  return (
    <motion.button
      onClick={handleInteraction}
      onKeyDown={(e) => ['Enter', ' '].includes(e.key) && handleInteraction()}
      aria-label={`Tecla ${char}`}
      initial={false}
      animate={{
        y: isPressed ? 2 : 0,
        boxShadow: isPressed ? pressedShadow : initialShadow,
        background: isPressed ? KEYBOARD_COLORS.keycap.active : keyBaseBg,
        color: keyColor,
      }}
      whileHover={{
        y: -4,
        scale: 1.02,
        boxShadow: hoverShadow,
      }}
      whileTap={{
        y: 2,
        scale: 0.98,
        boxShadow: pressedShadow,
      }}
      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
      style={{
        width: CONFIG.keyboard.keySizes[size],
        height: CONFIG.keyboard.keyHeight,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '8px',
        border: `1px solid ${KEYBOARD_COLORS.keycap.border}`,
        fontFamily: '"Inter", sans-serif',
        fontWeight: 600,
        textTransform: 'uppercase',
        cursor: 'pointer',
        userSelect: 'none',
        outline: 'none',
        overflow: 'visible',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <motion.div
        className="ripple-effect"
        initial={{ scale: 1, opacity: 0 }}
        animate={controls}
        style={{
          position: 'absolute',
          inset: '0',
          borderRadius: 'inherit',
          backgroundColor: KEYBOARD_COLORS.ripple.base,
          pointerEvents: 'none',
        }}
      />
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {subChar && (
            <span style={{ fontSize: '0.65rem', color: KEYBOARD_COLORS.keycap.accent, textTransform: 'none' }}>
              {subChar}
            </span>
          )}
          <span style={{ fontSize: '1.1rem' }}>{char}</span>
      </div>
    </motion.button>
  );
};

interface KeyboardDisplayProps {
  activeKeys: Set<string>;
  rippleOrigin: RippleOrigin;
  onKeyPress?: (char: string) => void;
  mouseX: MotionValue<number>; // ⭐ FIXED: Explicitly type mouseX as MotionValue<number>
}

const KeyboardDisplay: React.FC<KeyboardDisplayProps> = ({ activeKeys, rippleOrigin, onKeyPress, mouseX }) => {
  const baseHeight = 16;
  
  // ⭐ NUEVO: Lógica para el efecto parallax de inclinación
  const rotateY = useTransform(mouseX, [0, typeof window !== 'undefined' ? window.innerWidth : 0], [-10, 10]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateX: 20 }}
      animate={{ opacity: 1, y: 0, rotateX: 15 }}
      transition={{ delay: 0.5, type: 'spring' }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        padding: '1.5rem',
        borderRadius: '1.5rem',
        backgroundColor: KEYBOARD_COLORS.keyboard.base,
        border: `1px solid ${KEYBOARD_COLORS.keyboard.border}`,
        boxShadow: `
          0 ${baseHeight}px 0 ${KEYBOARD_COLORS.keyboard.shadow},
          0 ${baseHeight + 15}px 45px -10px rgba(0, 0, 0, 0.5),
          inset 0 1px 1px hsla(0, 0%, 100%, 0.1),
          0 0 0 1px ${KEYBOARD_COLORS.keyboard.border}
        `,
        transformStyle: 'preserve-3d',
        transform: 'perspective(1500px) rotateZ(-10deg)',
        rotateY, // ⭐ NUEVO: Se aplica la rotación del parallax
      }}
    >
      {CONFIG.keyboard.layout.map((row, rowIndex) => (
        <div key={`row-${rowIndex}`} style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
          {row.map((key, colIndex) => (
            <Keycap
              key={`key-${rowIndex}-${colIndex}`}
              {...key}
              row={rowIndex}
              col={colIndex}
              isPressed={activeKeys.has(key.char.toUpperCase())}
              rippleOrigin={rippleOrigin}
              onKeyPress={onKeyPress}
            />
          ))}
        </div>
      ))}
    </motion.div>
  );
};

// ============================================================================
// --- COMPONENTE PRINCIPAL HERO ---
// ============================================================================

export const Hero: React.FC = () => {
  const { hero, user, keyboard } = CONFIG;
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
  const [rippleOrigin, setRippleOrigin] = useState<RippleOrigin>(null);
  const [isMobile, setIsMobile] = useState(false);

  // ⭐ FIXED: Explicitly type mouseX as MotionValue<number>
  const ref = useRef<HTMLElement>(null);
  const mouseX = useMotionValue<number>(typeof window !== 'undefined' ? window.innerWidth / 2 : 0);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (ref.current) {
        const { clientX, clientY } = e;
        mouseX.set(clientX); // Actualiza el valor para el parallax
        ref.current.style.setProperty("--x", `${clientX}px`);
        ref.current.style.setProperty("--y", `${clientY}px`);
    }
  };
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < BREAKPOINTS.lg);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const findKeyLocation = useCallback((char: string): RippleOrigin => {
    const upperChar = char.toUpperCase();
    for (let r = 0; r < keyboard.layout.length; r++) {
      for (let c = 0; c < keyboard.layout[r].length; c++) {
        if (keyboard.layout[r][c].char.toUpperCase() === upperChar) {
          return { row: r, col: c };
        }
      }
    }
    return null;
  }, [keyboard.layout]);

  const handleKeyPress = (char: string) => {
    const upperChar = char.toUpperCase();
    setRippleOrigin(findKeyLocation(upperChar));
    setActiveKeys(prev => new Set(prev).add(upperChar));
    setTimeout(() => {
      setActiveKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(upperChar);
        return newSet;
      });
      setRippleOrigin(null);
    }, 200);
  };
  
  return (
    <section 
      id="home"
      ref={ref}
      onMouseMove={handleMouseMove}
      className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-slate-900"
    >
       {/* ⭐ FIXED: Replaced style jsx global with a standard style tag */}
       <style>{`
        .social-link {
          transition: transform ${TRANSITIONS.medium}, 
                     box-shadow ${TRANSITIONS.medium};
        }
        
        .social-link:hover {
          transform: translateY(-0.25rem);
          box-shadow: 0 4px 20px rgba(14, 165, 233, 0.3);
        }
       `}</style>
       
      {/* ⭐ NUEVO: Capa para la luz de seguimiento (spotlight) */}
      <div 
          className="pointer-events-none absolute -inset-px z-20 transition-all duration-300"
          style={{
              background: `radial-gradient(600px circle at var(--x) var(--y), ${KEYBOARD_COLORS.spotlight}, transparent 80%)`,
          }}
      />
      
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />

      <div className="relative z-10 container mx-auto px-4 grid lg:grid-cols-2 items-center gap-16">
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
           <motion.p 
            className="font-mono text-sky-400 text-lg mb-4" 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.2 }}
          >
            {hero.greeting}
          </motion.p>
          
          <AnimatedCharacters
             as="h1"
             text={hero.name}
             className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tighter text-white leading-tight"
             delay={0.4}
          />

          <div className="h-8 mt-4 min-h-[2rem]">
            <TypeAnimation 
              sequence={keyboard.typingSequence}
              wrapper="span" 
              cursor={true} 
              repeat={Infinity} 
              className="text-lg sm:text-xl font-medium text-indigo-400"
            />
          </div>
          
          <motion.p 
            className="mt-6 max-w-xl mx-auto lg:mx-0 text-lg leading-relaxed text-slate-400" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 1.8 }}
          >
            {hero.description}
          </motion.p>
          
          <motion.div 
            className="mt-12 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2 }}
          >
            <Magnetic>
              <motion.a 
                href="#contact" 
                className="group inline-flex items-center gap-2 rounded-full px-8 py-4 text-lg font-bold bg-sky-500 text-white shadow-lg shadow-sky-500/30 transition-all duration-300 hover:bg-sky-600 hover:shadow-xl hover:shadow-sky-500/50"
                whileTap={{ scale: 0.95 }}
                aria-label={hero.ctaAriaLabel}
              >
                {hero.cta}
                <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </motion.a>
            </Magnetic>
            
            <div className="flex items-center gap-4">
              <svg width="0" height="0" style={{ position: 'absolute' }}>
                <defs>
                  <filter id="goo">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                    <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -7" result="goo" />
                    <feBlend in="SourceGraphic" in2="goo" />
                  </filter>
                </defs>
              </svg>
              
              <div className="flex gap-2" style={{ filter: 'url(#goo)' }}>
                {user.socials.map(({ name, url, Icon, ariaLabel }) => (
                  <Magnetic key={name} className="inline-block">
                    <motion.a 
                      href={url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="social-link bg-slate-800 p-3 rounded-full block text-sky-400 hover:text-white"
                      whileTap={{ y: 2 }}
                      aria-label={ariaLabel}
                    >
                      <Icon size={24} />
                    </motion.a>
                  </Magnetic>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
        
        {!isMobile && (
          <div className="hidden lg:flex justify-center items-center">
            <KeyboardDisplay 
              activeKeys={activeKeys} 
              rippleOrigin={rippleOrigin} 
              onKeyPress={handleKeyPress}
              mouseX={mouseX}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
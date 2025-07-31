// 'use client' directive is typically used in frameworks like Next.js for client components.

import React, { useRef, useMemo, Suspense, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { ArrowRight, Github, Linkedin, Twitter, Mail } from 'lucide-react'; // Import necessary Lucide icons
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, PerspectiveCamera, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three'; // Import THREE for type definitions
import { inSphere } from 'maath/random/dist/maath-random.esm';

// Mock CONFIG object
const CONFIG = {
    hero: {
        greeting: "Hola, soy",
        title: "Jeferson",
        subtitle: "Desarrollador Full Stack & Arquitecto de Software",
        description: "Apasionado por construir soluciones innovadoras y escalables que resuelvan problemas reales.",
        cta: "Contáctame",
    },
    user: {
        socials: [
            { name: "GitHub", url: "https://github.com/yourusername", Icon: Github },
            { name: "LinkedIn", url: "https://linkedin.com/in/yourusername", Icon: Linkedin },
            { name: "Twitter", url: "https://twitter.com/yourusername", Icon: Twitter },
            { name: "Email", url: "mailto:your.email@example.com", Icon: Mail },
        ],
    },
};

// Magnetic component implementation
interface MagneticProps {
    children: React.ReactNode;
}

const Magnetic = ({ children }: MagneticProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouse = (e: React.MouseEvent) => {
        if (!ref.current) return;
        const { clientX, clientY } = e;
        const { height, width, left, top } = ref.current.getBoundingClientRect();
        const middleX = clientX - (left + width / 2);
        const middleY = clientY - (top + height / 2);
        setPosition({ x: middleX * 0.1, y: middleY * 0.1 });
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
            animate={{ x, y }}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
            className="inline-block"
        >
            {children}
        </motion.div>
    );
};

// Componente para una línea de código en el fondo 3D
interface CodeLineProps {
    text: string;
    position: [number, number, number];
    color: string;
    showCursor?: boolean;
}

const CodeLine = ({ text, position, color, showCursor = false }: CodeLineProps) => {
    const [cursorVisible, setCursorVisible] = useState(true);

    useEffect(() => {
        if (showCursor) {
            const interval = setInterval(() => {
                setCursorVisible(v => !v);
            }, 500);
            return () => clearInterval(interval);
        }
    }, [showCursor]);

    const displayText = showCursor && cursorVisible ? `${text}_` : text;

    return (
        // Se aplica color dinámico y opacidad para transparencia.
        <Text position={position} fontSize={0.18} anchorX="left" color={color} material-opacity={0.5}>
            {displayText}
        </Text>
    );
};

// COMPONENTE MEJORADO: Ahora simula la escritura en tiempo real con sintaxis de Python.
const LivingCodebaseBackground = () => {
    const cameraRef = useRef<THREE.PerspectiveCamera>(null);
    const particlesRef = useRef<THREE.Points>(null);

    // Snippets de código cambiados a Python/CV2
    const codeSnippets = useMemo(() => [
        "import cv2",
        "import numpy as np",
        "",
        "# Cargar una imagen desde archivo",
        "image = cv2.imread('image.jpg')",
        "if image is None:",
        "    print('Error: No se pudo cargar la imagen.')",
        "",
        "# Convertir la imagen a escala de grises",
        "gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)",
        "",
        "# Aplicar un desenfoque Gaussiano",
        "blurred = cv2.GaussianBlur(gray_image, (5, 5), 0)",
        "",
        "# Detectar bordes con Canny",
        "edges = cv2.Canny(blurred, 50, 150)",
        "",
        "cv2.imshow('Original', image)",
        "cv2.imshow('Edges', edges)",
        "",
        "cv2.waitKey(0)",
        "cv2.destroyAllWindows()",
    ], []);
    
    const [lines, setLines] = useState<string[]>(['']);
    const [lineIndex, setLineIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);

    // Función para colorear la sintaxis
    const getLineColor = (line: string) => {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('#')) return '#6a9955'; // Verde para comentarios
        if (trimmedLine.startsWith('import')) return '#569cd6'; // Azul para import
        if (trimmedLine.startsWith('if') || trimmedLine.startsWith('print')) return '#c586c0'; // Rosa/Púrpura para keywords
        if (trimmedLine.includes('cv2.')) return '#4ec9b0'; // Turquesa para funciones de cv2
        if (trimmedLine.includes("'")) return '#ce9178'; // Naranja para strings
        return '#d4d4d4'; // Blanco/Gris por defecto
    };

    useEffect(() => {
        const typeChar = () => {
            if (lineIndex >= codeSnippets.length) return;
            const currentLine = codeSnippets[lineIndex];
            if (charIndex < currentLine.length) {
                setLines(prev => {
                    const newLines = [...prev];
                    newLines[newLines.length - 1] = currentLine.substring(0, charIndex + 1);
                    return newLines;
                });
                setCharIndex(charIndex + 1);
            } else {
                if (lineIndex < codeSnippets.length - 1) {
                    setLineIndex(lineIndex + 1);
                    setCharIndex(0);
                    setLines(prev => [...prev, '']);
                } else {
                    setTimeout(() => {
                        setLines(['']);
                        setLineIndex(0);
                        setCharIndex(0);
                    }, 3000);
                }
            }
        };

        const typingSpeed = Math.random() * 15 + 5;
        const timeoutId = setTimeout(typeChar, typingSpeed);
        return () => clearTimeout(timeoutId);
    }, [charIndex, lineIndex, codeSnippets]);


    const particlesCount = 5000;
    const particlesPositions = useMemo(() => {
        return inSphere(new Float32Array(particlesCount * 3), { radius: 10 });
    }, [particlesCount]);

    useFrame((state, delta) => {
        if (cameraRef.current) {
            cameraRef.current.position.x += (state.mouse.x * 2 - cameraRef.current.position.x) * 0.05;
            cameraRef.current.position.y += (state.mouse.y * 2 - cameraRef.current.position.y) * 0.05;
            cameraRef.current.lookAt(0, 0, 0);
        }
        if (particlesRef.current) {
            particlesRef.current.rotation.x += delta * 0.005;
            particlesRef.current.rotation.y += delta * 0.007;
        }
    });

    return (
        <>
            <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 10]} fov={75} />
            <group position={[-8, 4, 0]} rotation={[0, Math.PI / 6, 0]}>
                {lines.map((line, i) => (
                    <CodeLine 
                        key={i} 
                        text={line} 
                        position={[0, -i * 0.3, 0]}
                        showCursor={i === lines.length - 1}
                        color={getLineColor(codeSnippets[i] || '')}
                    />
                ))}
            </group>
            
            <Points ref={particlesRef} positions={particlesPositions} stride={3} frustumCulled>
                <PointMaterial transparent color="#475569" size={0.03} sizeAttenuation={true} depthWrite={false} />
            </Points>

            <ambientLight intensity={0.8} />
            <pointLight color="#c4b5fd" position={[0, 0, 5]} intensity={50} />
        </>
    );
};

// Componente para animación por caracteres
interface AnimatedCharactersProps {
    text: string;
    className?: string;
    delay?: number;
}
const AnimatedCharacters = ({ text, className, delay = 0 }: AnimatedCharactersProps) => {
    const letters = Array.from(text);

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.05, delayChildren: i * delay },
        }),
    };

    const childVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 200,
            },
        },
    };

    return (
        <motion.h1
            className={className}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}
        >
            {letters.map((letter, index) => (
                <motion.span key={index} variants={childVariants}>
                    {letter === " " ? "\u00A0" : letter}
                </motion.span>
            ))}
        </motion.h1>
    );
};


// Componente para animación por palabras
interface AnimatedWordsProps {
    text: string;
    className?: string;
    delay?: number;
}
const AnimatedWords = ({ text, className, delay = 0 }: AnimatedWordsProps) => {
    const words = text.split(" ");
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { delayChildren: delay, staggerChildren: 0.08 } },
    };
    const wordVariants: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: { 
            opacity: 1, 
            y: 0, 
            transition: { duration: 0.6, ease: "circOut" } 
        },
    };

    return (
        <motion.h2 className={className} variants={containerVariants} initial="hidden" animate="visible">
            {words.map((word, i) => (
                <motion.span key={i} variants={wordVariants} style={{ display: "inline-block", marginRight: "0.25em" }}>
                    {word}
                </motion.span>
            ))}
        </motion.h2>
    );
};

export const Hero = () => {
    const { hero, user } = CONFIG;

    return (
        <section id="home" className="relative h-screen w-full overflow-hidden flex flex-col justify-center items-center text-center bg-blue-950">
            <div className="absolute inset-0 z-0">
                <Canvas>
                    <Suspense fallback={null}><LivingCodebaseBackground /></Suspense>
                </Canvas>
            </div>

            {/* ✅ CORRECCIÓN: Clases responsivas aplicadas para un diseño adaptable */}
            <div className="relative z-10 flex flex-col justify-center items-center container mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <motion.p
                    className="font-mono text-sky-400 text-base sm:text-lg mb-2 sm:mb-4"
                    initial={{ opacity: 0, y: -20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
                >
                    {hero.greeting}
                </motion.p>
                
                <AnimatedCharacters 
                    text={hero.title} 
                    className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tighter text-white leading-tight" 
                    delay={0.4} 
                />
                
                <AnimatedWords 
                    text={hero.subtitle} 
                    className="mt-2 text-xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-300" 
                    delay={1.0} 
                />
                
                <motion.div className="h-8 mt-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}>
                    <TypeAnimation
                        sequence={['Desarrollador Full Stack', 4000, 'Arquitecto de Software', 2000, 'Entusiasta de la Nube', 2000]}
                        wrapper="span" speed={50} className="text-lg sm:text-xl font-medium text-indigo-400" repeat={Infinity}
                    />
                </motion.div>

                <motion.p
                    className="mt-6 max-w-xs sm:max-w-xl mx-auto text-base sm:text-lg leading-relaxed text-slate-400"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.2, duration: 0.8, ease: "easeOut" }}
                >
                    {hero.description}
                </motion.p>

                <motion.div
                    className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.6, duration: 0.8, ease: "easeOut" }}
                >
                    <Magnetic>
                        <motion.a
                            href="#contact"
                            className="group inline-flex items-center gap-2 rounded-full px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-bold relative
                                       border-2 border-sky-500 text-sky-500
                                       transition-colors duration-300 ease-out
                                       hover:bg-sky-500 hover:text-white"
                            whileTap={{ scale: 0.95 }}
                        >
                            {hero.cta}
                            <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                        </motion.a>
                    </Magnetic>
                    <div className="flex items-center gap-4 mt-4 sm:mt-0">
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
                            {user.socials.map(({ name, url, Icon }) => (
                                <Magnetic key={name}>
                                    <motion.a
                                        href={url} target="_blank" rel="noopener noreferrer" aria-label={name}
                                        className="bg-blue-900 p-3 rounded-full block text-sky-400 hover:text-white transition-colors"
                                        whileTap={{ y: 2 }}
                                    >
                                        <Icon size={24} />
                                    </motion.a>
                                </Magnetic>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

// Main App component
export default function App() {
    return (
        <div className="min-h-screen bg-blue-950 text-white font-sans">
            <style>
                {`
                body { 
                    font-family: 'Inter', sans-serif; 
                    margin: 0; 
                }
                html, body, #root { 
                    height: 100%; 
                    width: 100%; 
                    background-color: #0c143d;
                }
                `}
            </style>
            <Hero />
        </div>
    );
}

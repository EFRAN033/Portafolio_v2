import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import clsx from 'clsx';
import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Canvas, useFrame } from '@react-three/fiber';
// 👇 1. IMPORTAMOS 'PerspectiveCamera' (CON MAYÚSCULA) DE DREI
import { Text, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// --- CONFIGURACIÓN DEL PORTAFOLIO ---
const portfolioConfig = {
    user: {
        name: "Efran",
        fullName: "Jeferson Efran",
        email: "efran.quispe13@gmail.com",
        tagline: "Transformo ideas en soluciones de software robustas y escalables, con un enfoque en la experiencia de usuario y el código de calidad.",
        githubUrl: "https://github.com/tu_usuario",
        linkedinUrl: "https://linkedin.com/in/tu_usuario",
        resumeUrl: "/cv-jeferson-efran.pdf",
    },
    navLinks: [
        { name: "Sobre Mí", href: "#about" },
        { name: "Proyectos", href: "#projects" },
        { name: "Contacto", href: "#contact" },
    ],
};

gsap.registerPlugin(ScrollTrigger);

// --- HOOK PARA SCROLL SUAVE ---
const useSmoothScroll = () => {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((_time) => {
            lenis.raf(_time * 1000);
        });
        gsap.ticker.lagSmoothing(0);

        return () => {
            lenis.destroy();
        };
    }, []);
};

// --- COMPONENTES DE UI AVANZADOS ---
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

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 });
    };

    const { x, y } = position;
    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouse}
            onMouseLeave={handleMouseLeave}
            animate={{ x, y }}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
        >
            {children}
        </motion.div>
    );
};

interface AnimatedTextProps {
    text: string;
    className?: string;
    once?: boolean;
}
const AnimatedText = ({ text, className, once = true }: AnimatedTextProps) => {
    const container: Variants = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.04, delayChildren: 0.1 * i },
        }),
    };
    const child: Variants = {
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", damping: 12, stiffness: 100 },
        },
        hidden: { opacity: 0, y: 20 },
    };

    return (
        <motion.div
            className={className}
            style={{ display: 'flex', flexWrap: 'wrap' }}
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once }}
        >
            {text.split("").map((char, index) => (
                <motion.span key={index} variants={child} style={{ display: 'inline-block' }}>
                    {char === " " ? "\u00A0" : char}
                </motion.span>
            ))}
        </motion.div>
    );
};

// --- COMPONENTES 3D (REACT THREE FIBER) ---

// 👇 NUEVO: Componente para el fondo de "Universo de Código Vivo"
const CodeLine = ({ text, position }: { text: string, position: [number, number, number] }) => (
    <Text position={position} fontSize={0.2} anchorX="left" color="#00ffff" font="/fonts/fira-code.woff">
        {text}
    </Text>
);

const LivingCodebaseBackground = () => {
    const groupRef = useRef<THREE.Group>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera>(null);

    const codeSnippets = useMemo(() => [
        "const app = express();",
        "app.use(cors());",
        "app.use(express.json());",
        "const PORT = process.env.PORT || 3001;",
        "const userRoutes = require('./routes/users');",
        "app.use('/api/users', userRoutes);",
        "db.connect().then(() => {",
        "  console.log('Database connected...');",
        "  app.listen(PORT, () => {",
        "    console.log(`Server running on port ${PORT}`);",
        "  });",
        "});",
        "function* fibonacci() {",
        "  let [prev, curr] = [0, 1];",
        "  while (true) {",
        "    [prev, curr] = [curr, prev + curr];",
        "    yield curr;",
        "  }",
        "}",
    ], []);

    useFrame((state) => {
        if (!cameraRef.current) return;
        // Mueve la cámara sutilmente para que el usuario pueda "mirar alrededor"
        const targetX = state.mouse.x * 2;
        const targetY = state.mouse.y * 2;
        cameraRef.current.position.x = gsap.utils.interpolate(cameraRef.current.position.x, targetX, 0.1);
        cameraRef.current.position.y = gsap.utils.interpolate(cameraRef.current.position.y, targetY, 0.1);
        cameraRef.current.lookAt(0, 0, 0);
    });

    return (
        <>
            {/* 👇 2. USAMOS EL COMPONENTE DE DREI EN LUGAR DEL PRIMITIVO */}
            <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 10]} fov={75} />
            <group ref={groupRef}>
                {/* Pared de código a la izquierda */}
                <group position={[-8, 0, 0]} rotation={[0, Math.PI / 4, 0]}>
                    {codeSnippets.map((line, i) => (
                        <CodeLine key={`left-${i}`} text={line} position={[0, (codeSnippets.length / 2 - i) * 0.3, 0]} />
                    ))}
                </group>
                {/* Pared de código a la derecha */}
                <group position={[8, 0, 0]} rotation={[0, -Math.PI / 4, 0]}>
                    {codeSnippets.slice().reverse().map((line, i) => (
                        <CodeLine key={`right-${i}`} text={line} position={[0, (codeSnippets.length / 2 - i) * 0.3, 0]} />
                    ))}
                </group>
                 {/* Suelo de código */}
                <group position={[0, -5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    {codeSnippets.map((line, i) => (
                        <CodeLine key={`floor-${i}`} text={line} position={[-5, (codeSnippets.length / 2 - i) * 0.4, 0]} />
                    ))}
                </group>
            </group>
        </>
    );
};


// --- COMPONENTES DE LAYOUT Y SECCIONES ---
const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('home');

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);

        const sections = ['home', ...portfolioConfig.navLinks.map(l => l.href.substring(1))];
        sections.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                ScrollTrigger.create({
                    trigger: `#${id}`,
                    start: "top center",
                    end: "bottom center",
                    onToggle: (self: ScrollTrigger) => self.isActive && setActiveSection(id)
                });
            }
        });

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={clsx(
                "fixed w-full top-0 z-50 transition-colors duration-300",
                isScrolled ? 'bg-black/80 backdrop-blur-lg border-b border-neutral-800' : 'bg-transparent'
            )}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
                <Magnetic>
                    <a href="#home" className="group text-xl font-mono font-bold tracking-wider" aria-label="Volver al inicio">
                        <span className="text-teal-400">&lt;</span>
                        <span className="text-neutral-200">EFRAN</span>
                        <span className="text-teal-400">&gt;</span>
                    </a>
                </Magnetic>
                <nav className="hidden md:flex items-center gap-8" aria-label="Navegación principal">
                    {portfolioConfig.navLinks.map((link) => (
                        <a key={link.name} href={link.href} className="relative text-sm font-medium uppercase tracking-wider text-neutral-300 hover:text-white transition-colors">
                            {link.name}
                            {activeSection === link.href.substring(1) && (
                                <motion.div
                                    className="absolute bottom-[-6px] left-0 right-0 h-0.5 bg-teal-400"
                                    layoutId="active-link-indicator"
                                    initial={false}
                                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                                />
                            )}
                        </a>
                    ))}
                    <motion.a
                        href={portfolioConfig.user.resumeUrl}
                        download
                        className="bg-teal-500 text-white font-medium py-2 px-4 rounded-md hover:bg-teal-600 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Descargar CV
                    </motion.a>
                </nav>
            </div>
        </motion.header>
    );
};

const HeroSection = () => {
    const { user } = portfolioConfig;
    return (
        <section id="home" className="min-h-screen w-full relative flex flex-col justify-center items-center overflow-hidden">
            {/* 👇 El Canvas 3D ahora renderiza el entorno de código */}
            <div className="absolute inset-0 z-0">
                <Canvas>
                     <ambientLight intensity={1} />
                     <pointLight color="#00ffff" position={[0, 0, 5]} intensity={50} />
                    <Suspense fallback={null}>
                       <LivingCodebaseBackground />
                    </Suspense>
                </Canvas>
            </div>

            {/* Contenido de texto superpuesto */}
            <div className="relative z-10 flex flex-col items-center text-center px-4">
                <div className="max-w-4xl mx-auto">
                    <motion.p
                        className="text-teal-400 font-mono text-lg mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, ease: "easeOut" }}
                    >
                        Hola, mi nombre es
                    </motion.p>
                    <AnimatedText text={user.fullName} className="text-5xl sm:text-6xl lg:text-8xl font-extrabold text-white leading-tight justify-center" />
                    <motion.h2
                        className="mt-4 text-xl md:text-2xl font-semibold text-neutral-300 h-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, ease: "easeOut" }}
                    >
                        <TypeAnimation
                            sequence={[
                                'Desarrollador Full Stack', 2000,
                                'Arquitecto de Software', 2000,
                                'Especialista en UX/UI', 2000,
                            ]}
                            wrapper="span" speed={50} repeat={Infinity}
                        />
                    </motion.h2>
                    <motion.p
                        className="mt-8 max-w-2xl mx-auto text-neutral-400 text-lg leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, ease: "easeOut" }}
                    >
                        {user.tagline}
                    </motion.p>
                    <motion.div
                        className="mt-12 flex items-center justify-center gap-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2, ease: "easeOut" }}
                    >
                        <Magnetic>
                            <motion.a
                                href="#contact"
                                className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-bold py-3 px-8 rounded-full"
                                whileHover={{ scale: 1.1, transition: { type: 'spring', stiffness: 300 } }}
                            >
                                Contáctame
                            </motion.a>
                        </Magnetic>
                        {/* 👇 Tus botones de redes sociales, conservados tal cual */}
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
                                <Magnetic>
                                    <a href={user.githubUrl} target="_blank" rel="noopener noreferrer" className="bg-neutral-800 p-3 rounded-full block" aria-label="GitHub">
                                        <img src="https://img.icons8.com/ios-filled/50/4dd0e1/github.png" alt="GitHub" className="w-6 h-6" />
                                    </a>
                                </Magnetic>
                                <Magnetic>
                                    <a href={user.linkedinUrl} target="_blank" rel="noopener noreferrer" className="bg-neutral-800 p-3 rounded-full block" aria-label="LinkedIn">
                                        <img src="https://img.icons8.com/ios-filled/50/4dd0e1/linkedin.png" alt="LinkedIn" className="w-6 h-6" />
                                    </a>
                                </Magnetic>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

// --- COMPONENTE PRINCIPAL DE LA PÁGINA ---
const HomePage = () => {
    useSmoothScroll();
    return (
        <div className="bg-black text-white selection:bg-teal-400/30">
            <Navbar />
            <main>
                <HeroSection />
                <section id="about" className="h-screen flex items-center justify-center">
                    <AnimatedText text="SOBRE MÍ" className="text-6xl font-bold" />
                </section>
                <section id="projects" className="h-screen flex items-center justify-center">
                    <AnimatedText text="PROYECTOS" className="text-6xl font-bold" />
                </section>
                <section id="contact" className="h-screen flex items-center justify-center">
                    <AnimatedText text="CONTACTO" className="text-6xl font-bold" />
                </section>
            </main>
        </div>
    );
};

export default HomePage;
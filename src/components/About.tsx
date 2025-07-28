'use client';

import { motion } from 'framer-motion';
import { CONFIG } from '@/config';

const SectionTitle = ({ number, title }: { number: string; title: string }) => (
    <motion.div 
        className="flex items-center gap-4 mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
    >
        <span className="text-teal-400 font-mono text-2xl">{number}.</span>
        <h2 className="text-3xl sm:text-4xl font-bold text-neutral-100">{title}</h2>
        <div className="flex-grow h-px bg-neutral-800"></div>
    </motion.div>
);

export const About = () => {
    const { about } = CONFIG;

    const skillVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: (i: number) => ({
            opacity: 1,
            x: 0,
            transition: {
                delay: i * 0.05,
            },
        }),
    };

    return (
        <section id="about" className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
            <SectionTitle number="01" title={about.title} />
            <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-start">
                {/* Columna de texto */}
                <motion.div 
                    className="space-y-4 text-neutral-400 text-lg leading-relaxed"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <p>{about.description}</p>
                    <ul className="grid grid-cols-2 gap-x-6 gap-y-2 pt-4">
                        {about.skills.map((skill, i) => (
                            <motion.li 
                                key={skill} 
                                className="flex items-center gap-2 text-neutral-300 font-mono text-sm"
                                custom={i}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.5 }}
                                variants={skillVariants}
                            >
                                <span className="text-teal-400">▹</span>{skill}
                            </motion.li>
                        ))}
                    </ul>
                </motion.div>
                
                {/* Columna de imagen */}
                <motion.div 
                    className="relative group w-full max-w-sm mx-auto"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ type: "spring", stiffness: 100, delay: 0.4 }}
                >
                    <div className="absolute -inset-1.5 bg-gradient-to-r from-teal-500 to-blue-500 rounded-lg blur opacity-50 group-hover:opacity-75 transition duration-500"></div>
                    <div className="relative w-full h-auto bg-neutral-900 rounded-lg overflow-hidden">
                        <img
                            src={about.imageUrl}
                            alt="Foto de Jeferson Efran"
                            width={400}
                            height={400}
                            className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition duration-500"
                        />
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
'use client';

import { motion } from 'framer-motion';
import { CONFIG } from '@/config';
// ✨ SOLUCIÓN 1: Añadimos Github y ExternalLink a la importación
import { Github, ExternalLink } from 'lucide-react';

// ✨ SOLUCIÓN 2: Definimos el tipo como CUALQUIER elemento del array, no solo el primero
type ProjectType = typeof CONFIG.projects[number];

// ✨ SOLUCIÓN 3: Aplicamos el tipo 'ProjectType' a las props del componente
const ProjectCard = ({ project, index }: { project: ProjectType; index: number }) => {
    return (
        <motion.div
            className="group relative flex flex-col bg-neutral-900/50 border border-neutral-800 rounded-lg p-6 transition-all duration-300 hover:border-teal-400/50 hover:-translate-y-2"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
        >
            <div className="flex-grow">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-neutral-100 group-hover:text-teal-400 transition-colors">{project.title}</h3>
                    <div className="flex items-center gap-4 text-neutral-400">
                        {project.githubUrl && (
                            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" aria-label="Código fuente" className="hover:text-teal-400 transition-colors"><Github size={20} /></a>
                        )}
                        {project.liveUrl && (
                            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" aria-label="Ver en vivo" className="hover:text-teal-400 transition-colors"><ExternalLink size={20} /></a>
                        )}
                    </div>
                </div>
                <p className="text-neutral-400 mb-4 text-sm leading-relaxed">{project.description}</p>
            </div>
            <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-neutral-800/50">
                {project.tags.map((tag: string) => (
                    <div key={tag} className="text-xs text-teal-300 bg-teal-900/50 py-1 px-3 rounded-full font-mono">{tag}</div>
                ))}
            </div>
        </motion.div>
    );
};

export const Projects = () => {
    return (
        <section id="projects" className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
             <motion.div 
                className="flex items-center gap-4 mb-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5 }}
            >
                <span className="text-teal-400 font-mono text-2xl">02.</span>
                <h2 className="text-3xl sm:text-4xl font-bold text-neutral-100">Proyectos</h2>
                <div className="flex-grow h-px bg-neutral-800"></div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {CONFIG.projects.map((project, index) => (
                    <ProjectCard key={project.title} project={project} index={index} />
                ))}
            </div>
        </section>
    );
};
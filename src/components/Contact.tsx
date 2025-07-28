'use client';

import { motion } from 'framer-motion';
import { CONFIG } from '@/config';
import { Magnetic } from './ui/Magnetic';

export const Contact = () => {
    const { contact, user } = CONFIG;
    return (
        <section id="contact" className="container mx-auto px-4 sm:px-6 lg:px-8 py-32 sm:py-48 text-center">
             <motion.div 
                className="flex items-center justify-center gap-4 mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5 }}
            >
                <span className="text-teal-400 font-mono text-2xl">03.</span>
                <h2 className="text-3xl sm:text-4xl font-bold text-neutral-100">Contacto</h2>
            </motion.div>

            <motion.div
                className="max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7 }}
            >
                <h3 className="text-4xl lg:text-5xl font-bold text-neutral-100 mb-4 tracking-tight">{contact.title}</h3>
                <p className="text-neutral-400 text-lg mb-8">{contact.description}</p>
                <Magnetic>
                    <a 
                        href={`mailto:${user.email}`}
                        className="group inline-block bg-teal-500 text-white font-mono text-lg py-4 px-8 rounded-md hover:bg-teal-600 transition-colors"
                    >
                       {contact.cta}
                    </a>
                </Magnetic>
            </motion.div>
        </section>
    );
};
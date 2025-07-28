'use client';

import { CONFIG } from "@/config";

export const Footer = () => {
    const { user } = CONFIG;
    return (
        <footer className="text-center py-8 border-t border-neutral-800">
            <div className="flex items-center justify-center gap-6 mb-4">
                {user.socials.map(({ name, url, Icon }) => (
                    <a key={name} href={url} target="_blank" rel="noopener noreferrer" aria-label={name} className="text-neutral-500 hover:text-teal-400 transition-colors">
                        <Icon size={24} />
                    </a>
                ))}
            </div>
            <p className="text-neutral-500 font-mono text-sm">
                Diseñado y construido por {user.name}.
            </p>
        </footer>
    );
};
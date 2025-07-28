'use client';

import { Hero } from '@/components/Hero';
import { Navbar } from '@/components/Navbar';
import { About } from '@/components/About';
import { Projects } from '@/components/Projects';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';

export default function HomePage() {
  useSmoothScroll();

  return (
    <div className="bg-neutral-950 text-white selection:bg-teal-400/30">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
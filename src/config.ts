import { Github, Linkedin, FileDown } from 'lucide-react';

export const CONFIG = {
  user: {
    name: "Jeferson Efran",
    email: "efran.quispe13@gmail.com",
    resumeUrl: "/cv-jeferson-efran.pdf",
    socials: [
      { name: 'GitHub', url: 'https://github.com/tu_usuario', Icon: Github },
      { name: 'LinkedIn', url: 'https://linkedin.com/in/tu_usuario', Icon: Linkedin },
    ],
  },
  nav: {
    logo: {
      text: "EFRAN",
      ariaLabel: "Volver al inicio",
    },
    links: [
      { name: "Sobre Mí", href: "#about" },
      { name: "Proyectos", href: "#projects" },
      { name: "Contacto", href: "#contact" },
    ],
    cta: {
      text: "Descargar CV",
      Icon: FileDown,
    },
  },
  hero: {
    greeting: "Hola, mi nombre es",
    title: "Jeferson Efran.",
    subtitle: "Construyo soluciones de software de punta a punta.",
    roles: [
      'Desarrollador Full Stack', 2000,
      'Arquitecto de Software', 2000,
      'Entusiasta de la Nube', 2000,
    ],
    description: "Convierto conceptos complejos en aplicaciones web robustas, escalables y centradas en el usuario. Mi pasión es crear software que no solo funcione, sino que resuelva problemas reales y ofrezca experiencias memorables.",
    cta: "Hablemos de tu proyecto",
  },
  about: {
    title: "Sobre Mí",
    description: "Soy un desarrollador de software con una misión: construir aplicaciones que no solo funcionen a la perfección, sino que también ofrezcan experiencias de usuario memorables. Mi enfoque se centra en escribir código limpio, mantenible y escalable, utilizando las mejores prácticas de la industria. Me encanta enfrentar desafíos complejos y colaborar en equipo para llevar las ideas del concepto a la producción.",
    imageUrl: "https://via.placeholder.com/400", // Reemplaza con una URL a tu foto
    skills: ["React", "Node.js", "TypeScript", "Next.js", "PostgreSQL", "GraphQL", "Docker", "AWS", "Terraform", "Kubernetes"]
  },
  projects: [
    {
      title: "Plataforma E-commerce de Alto Rendimiento",
      description: "Arquitectura de microservicios para una tienda online con +10,000 productos, optimizando la velocidad de carga en un 200% y mejorando la tasa de conversión.",
      tags: ["Next.js", "TypeScript", "GraphQL", "Kubernetes", "Stripe"],
      liveUrl: "#",
      githubUrl: "#",
    },
    {
      title: "Dashboard de Analíticas en Tiempo Real",
      description: "Aplicación web interactiva que visualiza datos complejos a través de WebSockets, permitiendo a los usuarios tomar decisiones basadas en información al instante.",
      tags: ["React", "D3.js", "Node.js", "WebSocket", "Redis"],
      liveUrl: "#",
      githubUrl: "#",
    },
    {
      title: "Infraestructura como Código para Startup",
      description: "Despliegue de una arquitectura serverless en AWS usando Terraform, reduciendo los costos operativos en un 40% y automatizando el 95% del proceso de despliegue.",
      tags: ["AWS", "Terraform", "CI/CD", "Docker", "Lambda"],
      liveUrl: null, // No hay link en vivo para este
      githubUrl: "#",
    },
  ],
  contact: {
    title: "¿Tienes una idea? Hagámosla realidad.",
    description: "Actualmente estoy abierto a nuevas oportunidades y colaboraciones. Si tienes un proyecto en mente, una pregunta o simplemente quieres conectar, no dudes en escribirme. ¡Construyamos algo increíble juntos!",
    cta: "Envíame un correo",
  }
} as const;
export const personalData = {
  name: "Enoch Chukwudi",
  tagline: "BACKEND FULLSTACK DEVELOPER // OPERATIONAL SYSTEMS",
  introduction:
    "I'm a backend-leaning fullstack developer focused on building real-world operational systems using modern web technologies.",
  location: "Owerri, Nigeria",
  timezone: "WAT (UTC+1)",
  email: "enochchukwudi@gmail.com",
  linkedin: "https://linkedin.com/in/enoch-chukwudi",
  github: "https://github.com/enoch-systems",
  twitter: "https://x.com/enoch_systems",
  bio: "I enjoy designing APIs, business workflows, transaction systems, authentication flows, and scalable backend architectures while also building clean frontend experiences. My current focus includes fintech-style systems, logistics operations, fraud-aware workflows, and fullstack applications with structured architecture.",
};

export const skills = {
  backend: [
    { name: "Node.js", level: 92 },
    { name: "Express", level: 90 },
    { name: "TypeScript", level: 90 },
    { name: "PostgreSQL", level: 88 },
  ],
  framework: [
    { name: "Next.js", level: 90 },
    { name: "Prisma", level: 88 },
    { name: "REST APIs", level: 92 },
    { name: "Authentication", level: 85 },
  ],
  systems: [
    { name: "Workflow Design", level: 88 },
    { name: "Transaction Systems", level: 85 },
    { name: "Fraud Detection Logic", level: 80 },
    { name: "API Architecture", level: 90 },
  ],
  tools: [
    { name: "Git", level: 90 },
    { name: "Docker", level: 80 },
    { name: "CI/CD", level: 85 },
    { name: "Testing", level: 82 },
  ],
};

export interface CaseStudy {
  id: number;
  title: string;
  problem: string;
  solution: string;
  technologies: string[];
  results: string[];
}

export const projects: any[] = [];

export const caseStudies: CaseStudy[] = [];

export const testimonials = [
  {
    id: 1,
    quote: "Enoch delivered exceptional work on our e-commerce platform. His attention to detail and technical expertise exceeded our expectations. The platform has been running smoothly since launch.",
    name: "Sarah Johnson",
    company: "TechStart Inc.",
    role: "CEO",
  },
  {
    id: 2,
    quote: "Working with Enoch was a pleasure. He understood our requirements perfectly and delivered a solution that transformed how our team collaborates. Highly recommended!",
    name: "Michael Chen",
    company: "Digital Solutions",
    role: "CTO",
  },
  {
    id: 3,
    quote: "Enoch's ability to combine design and development skills is rare. He created a beautiful healthcare dashboard that our staff loves using. Professional and efficient.",
    name: "Dr. Amanda Williams",
    company: "MedCare Clinic",
    role: "Medical Director",
  },
];
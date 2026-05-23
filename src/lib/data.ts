export const personalData = {
  name: "Enoch Chukwudi",
  tagline: "BACKEND SYSTEMS ENGINEER // OPERATIONAL INFRASTRUCTURE",
  introduction:
    "Designing scalable backend systems, workflows, and operational platforms built for reliability, visibility, and coordination.",
  location: "Owerri, Nigeria",
  timezone: "WAT (UTC+1)",
  email: "enoch@example.com",
  linkedin: "https://linkedin.com/in/enochchukwudi",
  github: "https://github.com/enochchukwudi",
  twitter: "https://twitter.com/enochchukwudi",
  bio: "Systems-focused backend engineer building workflow-heavy platforms, APIs, and operational infrastructure around real-time visibility, integrations, business logic, and scalable architecture.",
};

export const skills = {
  frontend: [
    { name: "React", level: 95 },
    { name: "Next.js", level: 90 },
    { name: "TypeScript", level: 88 },
    { name: "Tailwind CSS", level: 92 },
    { name: "Vue.js", level: 80 },
  ],
  backend: [
    { name: "Node.js", level: 85 },
    { name: "Python", level: 82 },
    { name: "Go", level: 75 },
    { name: "GraphQL", level: 80 },
  ],
  database: [
    { name: "PostgreSQL", level: 85 },
    { name: "MongoDB", level: 82 },
    { name: "Redis", level: 78 },
    { name: "Prisma", level: 85 },
  ],
  tools: [
    { name: "Git", level: 90 },
    { name: "Docker", level: 80 },
    { name: "AWS", level: 75 },
    { name: "Figma", level: 85 },
    { name: "VS Code", level: 95 },
  ],
  others: [
    { name: "REST APIs", level: 90 },
    { name: "CI/CD", level: 82 },
    { name: "Testing", level: 80 },
    { name: "Agile", level: 85 },
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
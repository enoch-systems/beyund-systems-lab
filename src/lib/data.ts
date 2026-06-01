export const personalData = {
  name: "Enoch Chukwudi",
  tagline: "ACQUIRE BUILDING SKILLS // BEYUND LABS ACADEMY",
  introduction:
    "Acquire real-world building skills in software fullstack development at Beyund Labs Academy, a structured program focused on mastering frontend, backend, APIs, databases, and system architecture through hands-on projects.",
  location: "Owerri, Nigeria",
  timezone: "WAT (UTC+1)",
  email: "enochc.official@gmail.com",
  linkedin: "https://www.linkedin.com/in/enochchukwudi?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
  github: "https://github.com/enoch-systems",
  twitter: "https://x.com/_enochsystems?s=21",
  bio: [
    "Acquire building skills in software fullstack development at Beyund Labs Academy. We teach how to build real-world operational systems using modern web technologies, from APIs and backend logic to complete fullstack applications.",
    "You'll learn to design APIs, business workflows, transaction systems, authentication flows, and scalable backend architectures while also building clean frontend experiences.",
    "Our curriculum covers fintech systems, logistics operations, fraud aware workflows, and fullstack applications with structured architecture, everything you need to ship production grade software.",
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

export const skills = {
  backend: [
    { name: "Node.js", level: 90 },
    { name: "Python", level: 80 },
    { name: "PostgreSQL", level: 85 },
    { name: "REST APIs", level: 88 },
    { name: "MongoDB", level: 75 },
  ],
  framework: [
    { name: "Next.js", level: 92 },
    { name: "React", level: 90 },
    { name: "Express.js", level: 85 },
    { name: "Tailwind CSS", level: 88 },
    { name: "TypeScript", level: 82 },
  ],
  systems: [
    { name: "Authentication", level: 85 },
    { name: "Transaction Systems", level: 80 },
    { name: "Fintech Workflows", level: 78 },
    { name: "Fraud Detection", level: 72 },
    { name: "Logistics Ops", level: 75 },
  ],
  tools: [
    { name: "Git", level: 90 },
    { name: "Docker", level: 75 },
    { name: "Vercel", level: 85 },
    { name: "Supabase", level: 80 },
    { name: "Linux", level: 78 },
  ],
};


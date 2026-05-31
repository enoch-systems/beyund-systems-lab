export const personalData = {
  name: "Enoch Chukwudi",
  tagline: "LEARN FULLSTACK DEVELOPMENT // BEYUND SYSTEMS LABS",
  introduction:
    "Learn fullstack development with us at Beyund systems labs, a structured learning program focused on building real world operational systems using modern web technologies.",
  location: "Owerri, Nigeria",
  timezone: "WAT (UTC+1)",
  email: "enochc.official@gmail.com",
  linkedin: "https://www.linkedin.com/in/enochchukwudi?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
  github: "https://github.com/enoch-systems",
  twitter: "https://x.com/_enochsystems?s=21",
  bio: [
    "Learn fullstack development with us at Beyund systems labs. We teach how to build real world operational systems using modern web technologies, from APIs and backend logic to complete fullstack applications.",
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


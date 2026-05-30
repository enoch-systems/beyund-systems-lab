export const personalData = {
  name: "Enoch Chukwudi",
  tagline: "BACKEND FULLSTACK DEVELOPER // OPERATIONAL SYSTEMS",
  introduction:
    "I'm a backend-leaning fullstack developer focused on building real-world operational systems using modern web technologies.",
  location: "Nigeria (Remote)",
  timezone: "WAT (UTC+1)",
  email: "enochchukwudi@gmail.com",
  linkedin: "https://linkedin.com/in/enoch-chukwudi",
  github: "https://github.com/enoch-systems",
  twitter: "https://x.com/enoch_systems",
  bio: [
    "I'm a backend-leaning fullstack developer focused on building real-world operational systems using modern web technologies.",
    "I enjoy designing APIs, business workflows, transaction systems, authentication flows, and scalable backend architectures while also building clean frontend experiences.",
    "My current focus includes fintech-style systems, logistics operations, fraud-aware workflows, and fullstack applications with structured architecture.",
  ],
};

export interface Project {
  name: string;
  category: string;
  platforms: string;
  description: string;
}

export const africanProjects: Project[] = [
  {
    name: "National Logistics Visibility Platform",
    category: "B2B",
    platforms: "Web Dashboard + Mobile App + API Platform",
    description: "Interstate shipment visibility",
  },
  {
    name: "Distributed Fraud Intelligence Network",
    category: "B2B",
    platforms: "Web Dashboard + API Platform",
    description: "Shared fraud detection across institutions",
  },
  {
    name: "SME Credit Intelligence Platform",
    category: "B2B",
    platforms: "Web Dashboard + API",
    description: "Alternative credit scoring",
  },
  {
    name: "Merchant Operating System",
    category: "B2B",
    platforms: "Web Dashboard + Mobile App + POS",
    description: "Inventory, sales, accounting",
  },
  {
    name: "Digital Cooperative Banking System",
    category: "B2B2C",
    platforms: "Web Dashboard + Mobile App",
    description: "Savings, loans, contributions",
  },
  {
    name: "Agricultural Commodity Exchange",
    category: "B2B",
    platforms: "Web App + Mobile App",
    description: "Farm produce marketplace",
  },
  {
    name: "Informal Market Supply Chain Network",
    category: "B2B Marketplace",
    platforms: "Web App + Mobile App",
    description: "Retailer-wholesaler distribution",
  },
  {
    name: "Healthcare Referral Network",
    category: "B2B2C",
    platforms: "Web App + Mobile App",
    description: "Hospital referral ecosystem",
  },
  {
    name: "Cross-Border African Payment Network",
    category: "B2B",
    platforms: "Web Dashboard + API Platform",
    description: "African settlement network",
  },
  {
    name: "Digital Government Service Platform",
    category: "B2G",
    platforms: "Web Dashboard + Mobile App",
    description: "Government workflow automation",
  },
];

export const globalProjects: Project[] = [
  {
    name: "Multi-Tenant SaaS ERP",
    category: "B2B",
    platforms: "Web App",
    description: "Business operations suite",
  },
  {
    name: "Workflow Automation Platform",
    category: "B2B",
    platforms: "Web App + API",
    description: "Business process automation",
  },
  {
    name: "Identity & Access Management Platform",
    category: "B2B",
    platforms: "Web App + SDK + API",
    description: "Authentication & authorization",
  },
  {
    name: "Compliance & AML Platform",
    category: "B2B",
    platforms: "Web Dashboard + API",
    description: "KYC, AML, sanctions monitoring",
  },
  {
    name: "API Management Platform",
    category: "B2B",
    platforms: "Web Dashboard + API Gateway",
    description: "API governance",
  },
  {
    name: "Real-Time Observability Platform",
    category: "B2B",
    platforms: "Web Dashboard + Agents",
    description: "Logs, metrics, traces",
  },
  {
    name: "Developer Platform as a Service",
    category: "B2B",
    platforms: "Web Dashboard + Infrastructure",
    description: "Application deployment",
  },
  {
    name: "Enterprise Workflow Engine",
    category: "B2B",
    platforms: "Web Dashboard + Builder + API",
    description: "Workflow orchestration",
  },
  {
    name: "Vendor Risk Management Platform",
    category: "B2B",
    platforms: "Web Dashboard",
    description: "Third-party risk assessment",
  },
  {
    name: "Contract Lifecycle Management Platform",
    category: "B2B",
    platforms: "Web App",
    description: "Contract workflows",
  },
  {
    name: "AI Knowledge Operating System",
    category: "B2B",
    platforms: "Web App + Desktop App",
    description: "Organizational knowledge search",
  },
  {
    name: "Banking Core Platform",
    category: "B2B",
    platforms: "Web Dashboard + API Platform",
    description: "Core banking infrastructure",
  },
  {
    name: "Healthcare Information Exchange",
    category: "B2B2C",
    platforms: "Web Dashboard + Mobile App + API",
    description: "Medical data interoperability",
  },
  {
    name: "Distributed Identity Network",
    category: "B2B2C",
    platforms: "Web App + Mobile App + API",
    description: "Cross-platform identity verification",
  },
];

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
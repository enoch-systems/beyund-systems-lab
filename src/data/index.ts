export const caseStudies = [
  {
    id: 1,
    title: "AI Flashcard App",
    description: "An AI-powered flashcard application that generates quizzes from any text input.",
    problem: "Students struggle to create effective study materials. Manual flashcard creation is time-consuming and often doesn't target knowledge gaps effectively.",
    solution: "Built an AI-powered flashcard generator that takes any text input and automatically creates optimized quiz questions, targeting weak areas with spaced repetition.",
    technologies: ["Next.js", "Firebase Auth", "Firestore", "OpenAI API"],
    results: [
      "Reduced study prep time by 80%",
      "Over 10,000 flashcards generated in first month",
      "92% user satisfaction rate",
    ],
  },
  {
    id: 2,
    title: "Recipe Social Platform",
    description: "A social platform for sharing and discovering recipes with real-time updates.",
    problem: "Recipe sharing is fragmented across blogs and social media. There's no dedicated platform for structured recipe discovery and community interaction.",
    solution: "Created a social platform where users can share, discover, and save recipes with step-by-step instructions, ingredient lists, and community ratings.",
    technologies: ["Next.js", "Supabase", "Tailwind CSS"],
    results: [
      "500+ recipes shared in beta",
      "Active community of 200+ home cooks",
      "4.8/5 average rating for shared recipes",
    ],
  },
  {
    id: 3,
    title: "SaaS Dashboard Starter",
    description: "A production-ready SaaS dashboard starter with authentication, charts, and user management.",
    problem: "Building a SaaS dashboard from scratch is repetitive. Founders waste weeks on auth, charts, and admin panels instead of their core product.",
    solution: "Developed a comprehensive SaaS starter kit with authentication, role-based access, interactive charts, user management, and billing integration.",
    technologies: ["Next.js", "TypeScript", "Recharts", "Auth"],
    results: [
      "Shipped to production in 3 days instead of 3 weeks",
      "Used by 50+ SaaS founders",
      "Open-source with 1,200+ GitHub stars",
    ],
  },
  {
    id: 4,
    title: "Community Job Board",
    description: "A job board where anyone can post and apply. Real world utility that people actually use.",
    problem: "Local job markets lack centralized platforms. Job seekers miss opportunities and employers struggle to find local talent efficiently.",
    solution: "Built a community-driven job board with search and filters, email notifications, admin panel, and real-time posting updates.",
    technologies: ["Supabase", "Fullstack", "Search", "Notifications"],
    results: [
      "200+ jobs posted in first quarter",
      "35% placement rate within 2 weeks",
      "Expanded to 3 cities",
    ],
  },
];

export const skills = {
  backend: ["Node.js", "Python", "PostgreSQL", "REST APIs", "GraphQL", "Firebase"],
  framework: ["Next.js", "React", "TypeScript", "Tailwind CSS", "NestJS", "Express"],
  systems: ["Docker", "CI/CD", "Git", "Linux", "Cloud (Vercel/AWS)", "System Design"],
  tools: ["VS Code", "Figma", "Postman", "Notion", "Slack", "Linear"],
};
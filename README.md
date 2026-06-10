# Beyund Systems Labs

A structured fullstack development program landing page that teaches participants how to design APIs, build business workflows, implement transaction systems, manage authentication flows, construct scalable backend architectures, and craft clean frontend experiences.

Built with Next.js 16, TypeScript, and Tailwind CSS v4.

---

## The Problem

80 out of 100 beginners who try to learn development alone never finish their first real project. They get stuck after the tutorial ends. Traditional learning paths teach syntax in isolation, leaving students without the practical knowledge required to ship production-grade software. This program bridges that gap with direct mentorship and a curriculum built around real-world systems.

---

## The Approach

Beyund Systems Labs is a 12-week cohort-based program that moves beyond tutorials. Participants build real applications from day one, progressing through 9 architectural layers that mirror how professional software is actually constructed. Each layer builds on the last, covering fintech systems, logistics operations, fraud-aware workflows, and fullstack applications with structured architecture. The program costs ₦60,000 (₦5,000 per week) for the full 12 weeks with direct mentorship.

---

## What Participants Build

By the end of the program, participants have shipped multiple production-ready projects including:

- An AI Flashcard App with AI-generated quizzes using Next.js, Firebase Auth, and Firestore
- A Recipe Social Platform with Supabase for storage and real-time updates
- A SaaS Dashboard Starter with authentication, charts, and user management
- A Community Job Board with search, filters, email notifications, and an admin panel

---

## Tech Stack

### Frontend
- Next.js 16
- React 19
- TypeScript 5

### Styling
- Tailwind CSS v4
- PostCSS

### Tooling
- ESLint
- Git
- Node.js
- Vercel (deployment)

---

## Project Structure

```bash
beyund-systems-lab/
├── public/
│   ├── icons/
│   ├── images/
│   └── myimage/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── client/
│   │   └── components/
│   │       ├── common/
│   │       │   ├── BeyundLogo.tsx
│   │       │   ├── FloatingBadge.tsx
│   │       │   ├── Footer.tsx
│   │       │   ├── Navbar.tsx
│   │       │   ├── ScrollToTop.tsx
│   │       │   ├── SectionHeader.tsx
│   │       │   ├── SocialSidebar.tsx
│   │       │   └── WhatsAppButton.tsx
│   │       └── landing/
│   │           ├── CaseStudies.tsx
│   │           ├── Contact.tsx
│   │           ├── Layers.tsx
│   │           ├── MeetTheMentor.tsx
│   │           ├── PricingBadge.tsx
│   │           ├── ProblemHook.tsx
│   │           ├── ProjectCard.tsx
│   │           ├── SkillCard.tsx
│   │           ├── Skills.tsx
│   │           ├── VisionOutcome.tsx
│   │           └── WhatYouBecome.tsx
│   ├── config/
│   ├── contexts/
│   ├── server/
│   └── shared/
├── scripts/
│   ├── maintenance/
│   ├── migration/
│   └── seed/
├── database/
│   ├── migrations/
│   └── patches/
├── package.json
├── tsconfig.json
├── next.config.ts
├── eslint.config.mjs
├── postcss.config.mjs
└── README.md
```

---

## Sections

| Section | Description |
|---------|-------------|
| **ProblemHook** | Hero section identifying the core problem and value proposition |
| **VisionOutcome** | Showcase of real projects built by Cohort 1 participants |
| **Layers** | Interactive accordion-based curriculum covering all 9 architectural layers |
| **WhatYouBecome** | Identities and capabilities participants gain after completing the program |
| **MeetTheMentor** | Profile and teaching philosophy of Enoch Chukwudi |
| **Contact** | Full application form with dynamic country and state dropdowns fetched via external APIs |
| **PricingBadge** | Floating pricing indicator with program cost |
| **CaseStudies** | Detailed case studies of participant projects |
| **Skills** | Technologies and skills taught in the program |
| **Navbar** | Fixed top navigation with the Beyund Systems Labs logo |
| **Footer** | Navigation links, social links, and contact information |
| **SocialSidebar** | Fixed social links (LinkedIn, GitHub, X, Email) |
| **WhatsAppButton** | Floating WhatsApp chat button |

---

## Key Features

- Outcome-first user flow guiding visitors from problem awareness through proof, curriculum exploration, identity transformation, mentorship, and registration
- Interactive accordion curriculum interface covering 9 architectural layers
- Scroll-triggered entrance animations using Intersection Observer
- Dark glassmorphism UI design with backdrop blur effects and gradient overlays
- Dynamic form with country and state dropdowns populated via the REST Countries API and CountriesNow API
- Responsive design across mobile, tablet, and desktop breakpoints
- Search engine optimization with OpenGraph and Twitter card metadata

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
git clone https://github.com/enoch-systems/beyund-systems-lab.git
cd beyund-systems-lab
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

### Production Build

```bash
npm run build
npm start
```

---

## API Integrations

- **Countries**: Fetched from REST Countries API
- **States and Provinces**: Fetched from CountriesNow API

---

## Deployment

Live at [beyund-systems-lab.vercel.app](https://beyund-systems-lab.vercel.app). The project is deployed on Vercel with automatic deployments triggered from the GitHub repository.

---

## Contact

- Email: enochc.official@gmail.com
- GitHub: @enoch-systems
- X: @_enochsystems
- LinkedIn: Enoch Chukwudi
- Location: Nigeria
# Beyund systems labs - Learn Fullstack Development

A modern, responsive landing page for **Beyund systems labs**, a structured learning program focused on building real-world operational systems using modern web technologies. Built with Next.js 16, TypeScript, and Tailwind CSS.

---

## About

Beyund systems labs is a fullstack development program that teaches participants how to design APIs, business workflows, transaction systems, authentication flows, and scalable backend architectures while also building clean frontend experiences.

The curriculum covers fintech systems, logistics operations, fraud-aware workflows, and fullstack applications with structured architecture — everything needed to ship production-grade software.

---

## Features

- Meet Your Mentor section with profile and teaching philosophy
- Interactive accordion-based curriculum (Layers section) covering 9 architectural layers
- About Us section with program details and benefits overview
- Full application/registration form with dynamic country/state dropdowns (fetched via API)
- Social links: LinkedIn, GitHub, X, and Email
- WhatsApp floating chat button
- Responsive design across all devices (mobile, tablet, desktop)
- Scroll-triggered animations with Intersection Observer
- Dark glassmorphism UI with backdrop blur effects
- SEO optimized with OpenGraph and Twitter card metadata

---

## Tech Stack

### Frontend
- Next.js 16
- React 19
- TypeScript 5

### Styling
- Tailwind CSS v4
- PostCSS

### Tools
- ESLint
- Git
- Node.js

---

## Project Structure

```bash
beyund-systems-lab/
├── public/
│   └── myimage/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── About.tsx
│   │   ├── CaseStudies.tsx
│   │   ├── Contact.tsx
│   │   ├── FloatingBadge.tsx
│   │   ├── Footer.tsx
│   │   ├── Layers.tsx
│   │   ├── MeetTheMentor.tsx
│   │   ├── Navbar.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── ScrollToTop.tsx
│   │   ├── SectionHeader.tsx
│   │   ├── SkillCard.tsx
│   │   ├── Skills.tsx
│   │   ├── SocialSidebar.tsx
│   │   └── WhatsAppButton.tsx
│   └── lib/
│       └── data.ts
├── public/
├── package.json
├── tsconfig.json
├── next.config.ts
├── eslint.config.mjs
├── postcss.config.mjs
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/enoch-systems/beyund-systems-lab.git
cd beyund-systems-lab

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

---

## Sections / Pages

| Section | Description |
|---------|-------------|
| **Navbar** | Fixed top navigation with logo (eyund systems labs) |
| **Meet The Mentor** | Profile and bio of Enoch Chukwudi, engineering mentor |
| **Layers** | Accordion-based curriculum overview of 9 architectural layers |
| **About Us** | Program details, cohort info, and benefits overview |
| **Contact / Registration** | Full application form with dynamic country/state dropdowns |
| **Footer** | Navigation links, logo, and social links |

---

## API Integrations

- **Countries**: Fetched from [REST Countries API](https://restcountries.com)
- **States/Provinces**: Fetched from [CountriesNow API](https://countriesnow.space)

---

## Deployment

Live Demo: [Beyund systems labs](https://beyund-systems-lab.vercel.app)

This project is deployed on **Vercel** with automatic deployment from the GitHub repository.

---

## Contact

- Email: [enochc.official@gmail.com](mailto:enochc.official@gmail.com)
- GitHub: [@enoch-systems](https://github.com/enoch-systems)
- X: [@_enochsystems](https://x.com/_enochsystems)
- LinkedIn: [Enoch Chukwudi](https://www.linkedin.com/in/enochchukwudi)
- Location: Nigeria
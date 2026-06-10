# Beyund Systems Labs Landing Page + Admin Dashboard

A fullstack application that serves as both the public-facing landing page for Beyund Labs Academy and an administrative dashboard for managing student registrations, courses, payments, and notifications. The system is built around a seamless registration flow that feeds directly into a real-time admin management interface.

Built with Next.js 16, TypeScript, Tailwind CSS v4, and Supabase.

![Beyund Systems Labs Landing Page](https://res.cloudinary.com/djdbcoyot/image/upload/v1781079555/pg6ij6cfhp7hrcknp9iw.jpg)

![Beyund Systems Labs Admin Dashboard](https://res.cloudinary.com/djdbcoyot/image/upload/v1781079555/boobsiawkgm045tg9fud.jpg)

## The Problem

80 out of 100 beginners who try to learn development alone never finish their first real project. They get stuck after the tutorial ends. Traditional learning paths teach syntax in isolation, leaving students without the practical knowledge required to ship production-grade software. This program bridges that gap with direct mentorship and a curriculum built around real-world systems.

On the operational side, managing student applications manually, tracking registration statuses, handling payment records, and communicating with applicants becomes chaotic without a centralized management interface. The admin dashboard solves this.

## The Approach

Beyund Systems Labs is a 12-week cohort-based program that moves beyond tutorials. Participants build real applications from day one, progressing through 9 architectural layers that mirror how professional software is actually constructed. Each layer builds on the last, covering fintech systems, logistics operations, fraud-aware workflows, and fullstack applications with structured architecture. The program costs ₦60,000 (₦5,000 per week) for the full 12 weeks with direct mentorship.

![Beyund Systems Labs Wizard Registration Form](https://res.cloudinary.com/djdbcoyot/image/upload/v1781079557/qtsrgsil6uurmodrnvaz.jpg)

## Seamless Registration Flow

The landing page features a wizard-style registration form that collects applicant information in 3 progressive steps:

- Step 1 collects the applicant's name
- Step 2 gathers contact details, sex, course preference, country and state via dynamic dropdowns, employment status, and laptop availability. Includes real-time email duplicate checking against existing records.
- Step 3 captures the applicant's learning reason (optional) and presents a review before submission.

Once submitted, the registration data is stored in Supabase and becomes immediately visible in the admin dashboard. The admin can then update the applicant's status through a pipeline: pending, contacted, enrolled, or rejected. This creates a closed loop from public signup to internal management, all within the same application.

![Beyund Systems Labs Registration Success](https://res.cloudinary.com/djdbcoyot/image/upload/v1781079555/x16jazhjcwu5gaw08jyn.jpg)

## What Participants Build

By the end of the program, participants have shipped multiple production-ready projects including:

- An AI Flashcard App with AI-generated quizzes using Next.js, Firebase Auth, and Firestore
- A Recipe Social Platform with Supabase for storage and real-time updates
- A SaaS Dashboard Starter with authentication, charts, and user management
- A Community Job Board with search, filters, email notifications, and an admin panel

## Landing Page Overview

The public landing page presents the program's value proposition through an outcome-first user flow. Visitors are guided from problem awareness through proof, curriculum exploration, identity transformation, mentorship, and finally registration. Key sections include:

- **ProblemHook** identifies the core problem of tutorial purgatory and presents the program as the solution
- **VisionOutcome** showcases real projects built by Cohort 1 participants as social proof
- **Layers** presents the 9 architectural layers of the curriculum in an interactive accordion interface
- **WhatYouBecome** describes the identities and capabilities participants gain after completing the program
- **MeetTheMentor** introduces Enoch Chukwudi, the engineering mentor, along with his teaching philosophy
- **Contact** contains the wizard-style registration form with dynamic country and state dropdowns

The design uses a dark glassmorphism aesthetic with backdrop blur effects, gradient overlays, and scroll-triggered animations via Intersection Observer. The page is fully responsive across mobile, tablet, and desktop breakpoints.

![Beyund Systems Labs Curriculum Layers](https://res.cloudinary.com/djdbcoyot/image/upload/v1781079556/yb6lw13x0yl2mt16iebu.jpg)

## Admin Dashboard Overview

The admin dashboard is a full-featured management interface for program administrators, secured by Supabase authentication. It provides:

### Dashboard Analytics
- KPI cards showing total students, active courses, revenue collected, and unread notifications. Revenue display supports toggle for privacy.
- A 14-day registration trend chart showing daily signups.
- A registration status pie chart breaking down applicants by status (enrolled, pending, contacted, rejected).
- Enrollment by region with country flags and state-level breakdowns, with a dedicated deep dive view for Nigeria, United States, Canada, and Ghana.
- Payment analytics showing collected revenue, outstanding balances, and daily payment trends with transaction history.

![Beyund Systems Labs Dashboard Analytics](https://res.cloudinary.com/djdbcoyot/image/upload/v1781079555/ekp3wgzbgiwqxwsd49ut.jpg)

### Student Management
- A full list of all registered students with search and filtering capabilities.
- A detail drawer for each student showing personal information, academic profile, application context, and registration metadata.
- Status management allowing admins to move students through the pipeline (pending, contacted, enrolled, rejected).
- Copy-to-clipboard for email and phone numbers.
- Student record deletion capability.
- CSV and PDF export with a dedicated export modal that generates downloadable reports.

![Beyund Systems Labs Student Detail Drawer](https://res.cloudinary.com/djdbcoyot/image/upload/v1781079556/irigqquum341dx8veviu.jpg)

### Course Management
- Course creation through a modal interface with title validation.
- Course detail view showing curriculum broken down by weeks.
- Inline editing for course title, week titles, scheme of work, and resources.
- Week status toggling (not started, in progress, completed) with visual status indicators.
- Configurable course duration in weeks with automatic curriculum generation.
- Course deletion with confirmation.

### Payment Management
- Payment records linked to student profiles.
- Payment profile tracking showing total fee, amount paid, and outstanding balance.
- Payment method tracking and transaction date logging.

### Global Search
- A command palette search interface (triggered by Ctrl+K) that searches across students, courses, payments, and notifications simultaneously.
- Real-time search as the user types with debounced queries to Supabase.
- Keyboard navigation through search results with arrow keys.
- Category badges for each result type.

![Beyund Systems Labs Global Search](https://res.cloudinary.com/djdbcoyot/image/upload/v1781079556/fw62x3oaf9zkyockx3vd.jpg)

### Notifications
- Notification creation and management with category tagging.
- Read and unread status tracking.
- Displayed in the dashboard header with alert count.

### System Features
- Dark mode and light mode with theme persistence.
- Collapsible sidebar navigation with grouped menu items.
- Session-based authentication via Supabase Auth.
- Admin profile display with personalized greeting.
- Real-time clock display in the dashboard header.

## Tech Stack

### Frontend
- Next.js 16
- React 19
- TypeScript 5
- Recharts (dashboard charts)

### Styling
- Tailwind CSS v4
- PostCSS

### Backend and Database
- Supabase (PostgreSQL, Auth, Realtime)
- REST Countries API (country dropdown data)
- CountriesNow API (state/province dropdown data)

### Tooling
- ESLint
- Git
- Node.js
- Vercel (deployment)

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
│   │   ├── page.tsx
│   │   ├── admin/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── analytics/
│   │   │   ├── certificates/
│   │   │   ├── courses/
│   │   │   ├── login/
│   │   │   ├── notifications/
│   │   │   ├── payments/
│   │   │   ├── settings/
│   │   │   └── students/
│   │   └── api/
│   │       ├── admin/
│   │       ├── check-email/
│   │       ├── registrations/
│   │       └── verify-email/
│   ├── client/
│   │   └── components/
│   │       ├── admin/
│   │       │   ├── CourseDetailView.tsx
│   │       │   ├── CreateCourseModal.tsx
│   │       │   ├── ExportReportModal.tsx
│   │       │   ├── GlobalSearch.tsx
│   │       │   ├── StatCard.tsx
│   │       │   └── StudentDetailDrawer.tsx
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
│   │   └── theme-colors.ts
│   ├── contexts/
│   │   ├── profile-context.tsx
│   │   ├── search-overlay-context.tsx
│   │   └── theme-context.tsx
│   ├── server/
│   │   └── integration/
│   │       └── supabase.client.ts
│   └── shared/
│       ├── types.ts
│       └── utils/
│           └── pdf-generator.ts
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

## Landing Page Sections

| Section | Description |
|---------|-------------|
| **ProblemHook** | Hero section identifying the core problem and value proposition |
| **VisionOutcome** | Showcase of real projects built by Cohort 1 participants |
| **Layers** | Interactive accordion-based curriculum covering all 9 architectural layers |
| **WhatYouBecome** | Identities and capabilities participants gain after completing the program |
| **MeetTheMentor** | Profile and teaching philosophy of Enoch Chukwudi |
| **Contact** | Wizard-style registration form with dynamic country and state dropdowns, real-time email duplicate checking, and auto-save draft support |
| **PricingBadge** | Floating pricing indicator with program cost |
| **CaseStudies** | Detailed case studies of participant projects |
| **Skills** | Technologies and skills taught in the program |
| **Navbar** | Fixed top navigation with the Beyund Systems Labs logo |
| **Footer** | Navigation links, social links, and contact information |
| **SocialSidebar** | Fixed social links (LinkedIn, GitHub, X, Email) |
| **WhatsAppButton** | Floating WhatsApp chat button |

## Admin Dashboard Pages

| Page | Description |
|------|-------------|
| **Dashboard** | Analytics overview with KPI cards, registration trends, status breakdown, enrollment by region, and payment analytics |
| **Students** | Full student list with detail drawer, status management, email/phone copy, and PDF/CSV export |
| **Courses** | Course management with week-by-week curriculum builder, inline editing, and status tracking |
| **Payments** | Payment records linked to student profiles showing fee totals, amounts paid, and outstanding balances |
| **Notifications** | Notification creation and management with read/unread tracking |
| **Settings** | Admin configuration including name, theme preferences, and system settings |
| **Analytics** | Extended analytics and reporting (coming soon) |
| **Certificates** | Certificate generation and management |
| **Login** | Supabase-authenticated admin login page |

## Key Features

- Seamless registration pipeline from public wizard form to admin management interface with real-time data synchronization via Supabase
- Wizard-style multi-step registration form with progressive disclosure, real-time email duplicate checking, and local storage draft auto-save
- Outcome-first landing page user flow guiding visitors from problem awareness through proof, curriculum exploration, identity transformation, mentorship, and registration
- Interactive accordion curriculum interface covering 9 architectural layers
- Scroll-triggered entrance animations using Intersection Observer
- Dark glassmorphism UI design with backdrop blur effects and gradient overlays
- Dynamic form with country and state dropdowns populated via the REST Countries API and CountriesNow API
- Full admin dashboard with KPI analytics, registration trend charts, enrollment region mapping, and payment tracking
- Global command palette search across students, courses, payments, and notifications with keyboard navigation
- Student detail management with status pipeline, copy-to-clipboard, and PDF report export
- Responsive design across mobile, tablet, and desktop breakpoints
- Dark mode and light mode with persistent theme selection
- Search engine optimization with OpenGraph and Twitter card metadata

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A Supabase project (for backend database and authentication)

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

### Environment Variables

Create a `.env.local` file in the project root with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## API Integrations

- **Countries**: Fetched from REST Countries API
- **States and Provinces**: Fetched from CountriesNow API
- **Database and Auth**: Supabase for PostgreSQL storage, real-time subscriptions, and authentication

## Deployment

Live at [beyund-systems-lab.vercel.app](https://beyund-systems-lab.vercel.app). The project is deployed on Vercel with automatic deployments triggered from the GitHub repository.

## Contact

- Email: enochc.official@gmail.com
- GitHub: @enoch-systems
- X: @_enochsystems
- LinkedIn: Enoch Chukwudi
- Location: Nigeria
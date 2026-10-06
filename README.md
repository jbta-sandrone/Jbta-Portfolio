# Jonel Bryan Ablog — Software Engineer Portfolio

I’m a Software Engineer and Full-Stack Developer with hands-on experience building web applications and practical AI-powered features. This repository contains my personal portfolio website and presents selected applications developed across full-stack, AI, and production-oriented engineering work.

## Portfolio

The portfolio presents selected projects, technical skills, services and capabilities, professional background, and contact information. It also includes NELI, an assistant for questions about my portfolio. The site is a responsive, custom-built professional web experience.

## Featured Projects

Selected Work order: **01 Nemissive · 02 I-Nelory · 03 IntelliCLIQ · 04 Nelume**

### 01 — Nemissive — Flagship

Nemissive is a full-stack real-time messaging application with direct and group conversations, private media, voice and video calling, Notes, Reminders, Gallery, premium entitlements, moderation, and account lifecycle features.

Its React frontend uses Supabase for Auth, PostgreSQL, Row Level Security (RLS), protected RPCs, Realtime, and private Storage. Supabase Edge Functions use TypeScript on Deno for server-side and provider integrations. LiveKit handles voice/video media transport; Supabase remains authoritative for relevant authorization, lifecycle, and persistence. The deployed frontend does not depend on a separate Express/Node application server.

Billing uses Lemon Squeezy Test Mode. The Ask AI workspace integrates the OpenAI Responses API, but live generation depends on provider configuration and available API credit. Nemissive does not claim end-to-end encryption.

**Stack:** React 19 · TypeScript · Vite · Tailwind CSS · Supabase · LiveKit · Cloudflare Turnstile · Lemon Squeezy · OpenAI Responses API · Vercel

[Live Demo](https://nemissive.vercel.app) · [GitHub](https://github.com/jbta-sandrone/Nemissive)

### 02 — I-Nelory

A full-stack personal memory platform for preserving, organizing, and rediscovering meaningful moments.

- AI-powered natural-language memory search using Google Gemini
- JWT authentication, protected routes, and a server-enforced daily AI Search quota
- Memory and folder organization with media uploads through Cloudinary
- Responsive interface with cloud deployment

**Stack:** React · TypeScript · Tailwind CSS · Node.js · Express.js · Prisma · PostgreSQL · Google Gemini · Cloudinary · JWT · Vercel · Render

[Live Demo](https://i-neloryapp.vercel.app/) · [GitHub](https://github.com/jbta-sandrone/I-Nelory)

### 03 — IntelliCLIQ

An intelligent café ordering platform with AI-powered recommendations based on customer preferences.

- Google Gemini Smart Search recommendations
- Ordering and cart management
- Firebase Authentication, order tracking, and order history
- Administrative dashboard, sales analytics, and reports
- Responsive design

**Stack:** HTML · CSS · JavaScript · Node.js · Express.js · Firebase · Google Gemini · GitHub Pages · Render

[Live Demo](https://jbta-sandrone.github.io/IntelliCLIQ/) · [GitHub](https://github.com/jbta-sandrone/IntelliCLIQ)

### 04 — Nelume

A full-stack AI-powered career assistant for students, fresh graduates, and job seekers.

- AI résumé analysis with ATS scoring, résumé rewriting, and an interactive résumé chat
- Cover-letter generation and AI mock interviews
- Skill matching, résumé insights, a learning hub, and a quiz
- Server-side AI rate limiting with Upstash Redis
- Vercel frontend and Render backend

**Stack:** React · TypeScript · CSS3 · Python · FastAPI · REST API · Upstash Redis · Google Gemini · Vercel · Render

[Live Demo](https://nelume.vercel.app/) · [GitHub](https://github.com/jbta-sandrone/Nelume)

## Technical Focus

Work across these projects demonstrates:

- Full-stack web, React, and TypeScript development
- Backend and API development
- PostgreSQL and relational data
- Authentication and authorization, including Row Level Security
- Real-time application architecture
- Private media and storage systems
- AI/LLM integrations
- Server-side rate limiting and abuse controls
- Cloud deployment and responsive interface development

Technologies and architecture vary by project; each stack is listed with its project above.

## Repository Structure

```text
.
├── public/                 # Static public assets
├── src/
│   ├── App.tsx             # Application entry and portfolio sections
│   ├── main.tsx            # React entry point
│   ├── assets/             # Images and project videos
│   ├── components/         # Shared interface components
│   ├── data/               # Portfolio and project content
│   ├── scenes/             # Portfolio sections
│   └── styles/             # Global and section styles
├── portfolio-print/        # Separate print-ready portfolio document
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Installation

```bash
git clone https://github.com/jbta-sandrone/Jbta-Portfolio.git
cd Jbta-Portfolio
npm install
npm run dev
```

## Notes

This repository contains the portfolio website and its separate print-ready document. Individual project repositories contain their own implementations and additional project details. Nemissive is maintained in its [own repository](https://github.com/jbta-sandrone/Nemissive).

<div align="center">

⭐ Thanks for visiting my portfolio.

</div>

import type { IconType } from "react-icons";
import { FaBrain, FaCss3Alt, FaNetworkWired } from "react-icons/fa";
import {
  SiExpress,
  SiFastapi,
  SiFirebase,
  SiFramer,
  SiGithub,
  SiGooglegemini,
  SiHtml5,
  SiJavascript,
  SiNodedotjs,
  SiOpenapiinitiative,
  SiPostgresql,
  SiPrisma,
  SiPython,
  SiReact,
  SiRender,
  SiTailwindcss,
  SiTypescript,
  SiUpstash,
  SiVercel,
} from "react-icons/si";

export type TechnologyOrbitSettings = {
  radius: number;
  angleOffset: number;
  duration: number;
};

export type Technology = {
  id: string;
  name: string;
  icon: IconType;
  brandColor: string;
  brandColorSecondary?: string;
  lightTile?: boolean;
  description: string;
  projects: readonly string[];
  orbit: TechnologyOrbitSettings;
};

export type TechGroup = {
  id: "frontend" | "backend" | "database" | "ai" | "deployment";
  label: string;
  eyebrow: string;
  technologies: readonly Technology[];
};

export const techGroups: readonly TechGroup[] = [
  {
    id: "frontend",
    label: "Frontend",
    eyebrow: "Interface systems",
    technologies: [
      {
        id: "html",
        name: "HTML5",
        icon: SiHtml5,
        brandColor: "#e34f26",
        orbit: { radius: 30, angleOffset: -11, duration: 25 },
        description: "Semantic foundations that keep interfaces structured and accessible.",
        projects: ["CLIQ"],
      },
      {
        id: "css",
        name: "CSS3",
        icon: FaCss3Alt,
        brandColor: "#1572b6",
        orbit: { radius: 34, angleOffset: 5, duration: 28 },
        description: "Responsive presentation, layout, and visual polish across screen sizes.",
        projects: ["CLIQ", "this portfolio"],
      },
      {
        id: "javascript",
        name: "JavaScript",
        icon: SiJavascript,
        brandColor: "#f7df1e",
        orbit: { radius: 50, angleOffset: -3, duration: 19 },
        description: "Interactive browser behavior and application logic for the modern web.",
        projects: ["CLIQ", "this portfolio"],
      },
      {
        id: "react",
        name: "React",
        icon: SiReact,
        brandColor: "#61dafb",
        orbit: { radius: 29, angleOffset: 10, duration: 22 },
        description: "Component-driven interfaces that stay responsive, reusable, and clear.",
        projects: ["I-Nelory", "Nelume", "this portfolio"],
      },
      {
        id: "typescript",
        name: "TypeScript",
        icon: SiTypescript,
        brandColor: "#3178c6",
        orbit: { radius: 41, angleOffset: -7, duration: 25 },
        description: "Typed application foundations that make complex features safer to evolve.",
        projects: ["I-Nelory", "Nelume", "this portfolio"],
      },
      {
        id: "tailwind",
        name: "Tailwind CSS",
        icon: SiTailwindcss,
        brandColor: "#06b6d4",
        orbit: { radius: 37, angleOffset: 7, duration: 28 },
        description: "A scalable styling system for precise, responsive visual interfaces.",
        projects: ["Nelume", "this portfolio"],
      },
      {
        id: "motion",
        name: "Motion",
        icon: SiFramer,
        brandColor: "#0055ff",
        orbit: { radius: 46, angleOffset: 14, duration: 19 },
        description: "Purposeful transitions that guide attention without distracting from content.",
        projects: ["this portfolio"],
      },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    eyebrow: "Application services",
    technologies: [
      {
        id: "node",
        name: "Node.js",
        icon: SiNodedotjs,
        brandColor: "#5fa04e",
        orbit: { radius: 30, angleOffset: -10, duration: 23 },
        description: "JavaScript services for application logic, integrations, and real-time data.",
        projects: ["I-Nelory", "CLIQ"],
      },
      {
        id: "express",
        name: "Express",
        icon: SiExpress,
        brandColor: "#ffffff",
        orbit: { radius: 34, angleOffset: 6, duration: 26 },
        description: "Focused API layers that connect interfaces to secure application services.",
        projects: ["I-Nelory", "CLIQ"],
      },
      {
        id: "python",
        name: "Python",
        icon: SiPython,
        brandColor: "#3776ab",
        brandColorSecondary: "#ffd43b",
        orbit: { radius: 46, angleOffset: -4, duration: 29 },
        description: "Readable service logic for document extraction and intelligent analysis.",
        projects: ["Nelume"],
      },
      {
        id: "fastapi",
        name: "FastAPI",
        icon: SiFastapi,
        brandColor: "#009688",
        orbit: { radius: 29, angleOffset: 12, duration: 20 },
        description: "Typed Python APIs designed for fast analysis and dependable responses.",
        projects: ["Nelume"],
      },
      {
        id: "rest",
        name: "REST APIs",
        icon: SiOpenapiinitiative,
        brandColor: "#6ba539",
        orbit: { radius: 40, angleOffset: 1, duration: 23 },
        description: "Clear service contracts that keep frontend, backend, and AI systems connected.",
        projects: ["I-Nelory", "CLIQ", "Nelume"],
      },
    ],
  },
  {
    id: "database",
    label: "Database",
    eyebrow: "Persistent memory",
    technologies: [
      {
        id: "postgresql",
        name: "PostgreSQL",
        icon: SiPostgresql,
        brandColor: "#4169e1",
        orbit: { radius: 30, angleOffset: -8, duration: 21 },
        description: "Relational data storage for structured, dependable application records.",
        projects: ["I-Nelory"],
      },
      {
        id: "prisma",
        name: "Prisma",
        icon: SiPrisma,
        brandColor: "#2d3748",
        lightTile: true,
        orbit: { radius: 35, angleOffset: 7, duration: 24 },
        description: "A type-safe data layer for expressive queries and maintainable schemas.",
        projects: ["I-Nelory"],
      },
      {
        id: "firebase",
        name: "Firebase",
        icon: SiFirebase,
        brandColor: "#ffca28",
        brandColorSecondary: "#f57c00",
        orbit: { radius: 46, angleOffset: 15, duration: 27 },
        description: "Cloud-backed data and authentication for responsive application workflows.",
        projects: ["CLIQ"],
      },
      {
        id: "upstash",
        name: "Upstash",
        icon: SiUpstash,
        brandColor: "#00e9a3",
        orbit: { radius: 40, angleOffset: -4, duration: 25 },
        description:
          "Upstash serves as the cloud database, securely storing memories, folders, user information, and AI Search quota usage while providing fast, scalable data access.",
        projects: ["Nelume"],
      },
    ],
  },
  {
    id: "ai",
    label: "AI Systems",
    eyebrow: "Intelligent systems",
    technologies: [
      {
        id: "gemini",
        name: "Google Gemini",
        icon: SiGooglegemini,
        brandColor: "#4285f4",
        brandColorSecondary: "#a142f4",
        orbit: { radius: 34, angleOffset: -10, duration: 20 },
        description: "The multimodal language model powering AI features across my applications.",
        projects: ["I-Nelory", "CLIQ", "Nelume"],
      },
      {
        id: "llm-integration",
        name: "LLM Integration",
        icon: FaNetworkWired,
        brandColor: "#fde68a",
        orbit: { radius: 40, angleOffset: 2, duration: 26 },
        description:
          "Integrating large language models into real-world applications through APIs, structured prompts, and intelligent workflows.",
        projects: ["I-Nelory", "CLIQ", "Nelume"],
      },
      {
        id: "prompt-engineering",
        name: "Prompt Engineering",
        icon: FaBrain,
        brandColor: "#fcd34d",
        orbit: { radius: 46, angleOffset: 13, duration: 23 },
        description: "Designing prompts that produce reliable, context-aware, and useful AI responses.",
        projects: ["I-Nelory", "CLIQ", "Nelume"],
      },
    ],
  },
  {
    id: "deployment",
    label: "Deployment",
    eyebrow: "Delivery systems",
    technologies: [
      {
        id: "github",
        name: "GitHub",
        icon: SiGithub,
        brandColor: "#f0f6fc",
        orbit: { radius: 30, angleOffset: -8, duration: 21 },
        description: "Versioned collaboration and a reliable path from source to deployment.",
        projects: ["all projects"],
      },
      {
        id: "vercel",
        name: "Vercel",
        icon: SiVercel,
        brandColor: "#ffffff",
        orbit: { radius: 35, angleOffset: 7, duration: 24 },
        description: "Fast frontend delivery with preview deployments and production-ready hosting.",
        projects: ["Nelume", "this portfolio"],
      },
      {
        id: "render",
        name: "Render",
        icon: SiRender,
        brandColor: "#46e3b7",
        orbit: { radius: 46, angleOffset: 15, duration: 27 },
        description: "Managed backend hosting for APIs, services, and dependable releases.",
        projects: ["Nelume"],
      },
    ],
  },
] as const;

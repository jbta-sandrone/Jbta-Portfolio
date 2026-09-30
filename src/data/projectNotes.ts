export type ProjectNoteId = "i-nelory" | "cliq" | "nelume";

type TextSection = {
  id: string;
  title: string;
  kind: "text";
  paragraphs: readonly string[];
};

type ListSection = {
  id: string;
  title: string;
  kind: "list";
  intro?: string;
  items: readonly string[];
};

type GroupsSection = {
  id: string;
  title: string;
  kind: "groups";
  intro?: string;
  groups: readonly { title: string; detail: string }[];
};

type ArchitectureSection = {
  id: string;
  title: string;
  kind: "architecture";
  steps: readonly string[];
  note: string;
};

type TechnologySection = {
  id: string;
  title: string;
  kind: "technology";
  groups: readonly { label: string; items: readonly string[] }[];
};

export type ProjectNoteSection =
  | TextSection
  | ListSection
  | GroupsSection
  | ArchitectureSection
  | TechnologySection;

export type ProjectNote = {
  id: ProjectNoteId;
  title: string;
  descriptor: string;
  sections: readonly ProjectNoteSection[];
};

export const projectNotes: Record<ProjectNoteId, ProjectNote> = {
  "i-nelory": {
    id: "i-nelory",
    title: "I-Nelory",
    descriptor: "Personal Memory Journal",
    sections: [
      {
        id: "overview",
        title: "Overview",
        kind: "text",
        paragraphs: [
          "I-Nelory is a full-stack private digital memory journal focused on preserving personal memories rather than sharing content publicly. Users can upload photos and videos, organize memories into albums, rediscover them through AI-powered search, manage storage usage, customize the experience, and manage their personal archive.",
        ],
      },
      {
        id: "purpose",
        title: "Purpose",
        kind: "text",
        paragraphs: [
          "The project creates a private space for meaningful memories without the distractions of traditional social media. Its focus is personal storytelling, organization, preservation, and rediscovery.",
        ],
      },
      {
        id: "key-systems",
        title: "Key Systems",
        kind: "list",
        items: [
          "Photo and video memories with metadata, albums, and favorites",
          "Archive and restore controls for a personal collection",
          "Natural-language memory search powered by Google Gemini AI",
          "Storage usage and quota management",
          "Notifications and appearance preferences",
          "Account data export and account deletion controls",
        ],
      },
      {
        id: "ai-search",
        title: "AI Search",
        kind: "text",
        paragraphs: [
          "Google Gemini AI supports natural-language memory search. Users can look for memories by context, such as beach moments, a particular year, travel videos, or a mood associated with a memory.",
        ],
      },
      {
        id: "architecture",
        title: "Architecture",
        kind: "architecture",
        steps: ["React / TypeScript client", "Node / Express REST API", "Prisma ORM", "PostgreSQL / Neon"],
        note: "Cloudinary handles media storage, while Gemini supports AI-powered memory search.",
      },
      {
        id: "technology",
        title: "Technology",
        kind: "technology",
        groups: [
          { label: "Frontend", items: ["React 19", "TypeScript", "Vite", "Tailwind CSS", "Framer Motion", "React Router DOM"] },
          { label: "Backend", items: ["Node.js", "Express.js", "RESTful API", "Prisma ORM"] },
          { label: "Database", items: ["PostgreSQL / Neon"] },
          { label: "Storage", items: ["Cloudinary"] },
          { label: "Authentication", items: ["JWT authentication", "bcrypt password hashing"] },
          { label: "AI", items: ["Google Gemini AI"] },
          { label: "Deployment", items: ["Vercel frontend", "Render backend"] },
        ],
      },
    ],
  },
  cliq: {
    id: "cliq",
    title: "IntelliCLIQ",
    descriptor: "AI-Powered Café Ordering Application",
    sections: [
      {
        id: "overview",
        title: "Overview",
        kind: "text",
        paragraphs: [
          "IntelliCLIQ is an AI-powered café ordering web application where customers browse the menu, customize orders, receive personalized recommendations, and place orders through an ordering interface. It began as a capstone project and was developed into a portfolio-quality full-stack application.",
        ],
      },
      {
        id: "customer-systems",
        title: "Customer Systems",
        kind: "list",
        items: [
          "Authentication, menu browsing, and order customization",
          "Smart Search AI recommendations",
          "Shopping cart, checkout, and order receipt",
          "Order history, tracking, and notifications",
          "Customer feedback submission",
        ],
      },
      {
        id: "admin-systems",
        title: "Admin Systems",
        kind: "list",
        items: [
          "Dashboard overview, revenue analytics, and sales reports",
          "Weekly and yearly reporting with best-seller analytics",
          "Menu item and order management",
          "Customer feedback management",
        ],
      },
      {
        id: "smart-search",
        title: "Smart Search AI",
        kind: "text",
        paragraphs: [
          "Smart Search is a guided recommendation system, not a traditional chatbot. Customers choose a category, taste preference, temperature, and budget range. Gemini analyzes the available café menu and returns approximately 2–3 personalized recommendations with a match score, item, price, reasoning, tags, and an Add to Cart action.",
        ],
      },
      {
        id: "architecture",
        title: "Architecture",
        kind: "architecture",
        steps: ["HTML / CSS / JavaScript", "Firebase Authentication + Realtime Database", "Node.js / Express backend", "Google Gemini"],
        note: "The backend returns personalized recommendations to the ordering interface.",
      },
      {
        id: "technology",
        title: "Technology",
        kind: "technology",
        groups: [
          { label: "Frontend", items: ["HTML5", "CSS3", "JavaScript"] },
          { label: "Backend", items: ["Node.js", "Express.js"] },
          { label: "Database", items: ["Firebase Realtime Database"] },
          { label: "Authentication", items: ["Firebase Authentication"] },
          { label: "AI", items: ["Google Gemini API", "Gemini 2.5 Flash"] },
          { label: "Deployment", items: ["GitHub Pages frontend", "Render backend"] },
        ],
      },
      {
        id: "security",
        title: "Security Note",
        kind: "text",
        paragraphs: [
          "The Gemini API key is stored server-side. AI requests pass through the Express backend so the key is not exposed to the client, and Firebase Authentication protects authenticated operations.",
        ],
      },
    ],
  },
  nelume: {
    id: "nelume",
    title: "Nelume",
    descriptor: "AI-Powered Career Assistant",
    sections: [
      {
        id: "overview",
        title: "Overview",
        kind: "text",
        paragraphs: [
          "Nelume is an AI-powered career platform combining resume analysis, resume rewriting, cover-letter generation, interview preparation, interactive learning resources, and career guidance. It is designed for students, fresh graduates, job seekers, and professionals improving application materials and preparing for interviews.",
          "The project demonstrates full-stack web development, REST API development, AI integration, and prompt engineering.",
        ],
      },
      {
        id: "career-systems",
        title: "Career Systems",
        kind: "groups",
        groups: [
          { title: "AI Resume Chat + Analyzer", detail: "Resume-aware career conversations and ATS guidance alongside compatibility, match, strengths, improvement areas, missing skills, keyword, grammar, and summary analysis." },
          { title: "Writing Tools", detail: "ATS-friendly resume rewriting and position-specific cover letters with PDF export." },
          { title: "Interview Preparation", detail: "AI-generated technical, behavioral, HR, project, and problem-solving questions with sample answers; question-by-question mock interviews with evaluation and summary." },
          { title: "Learning Resources", detail: "Resume Quiz and Resume Learning Hub for interactive practice and guidance." },
        ],
      },
      {
        id: "architecture",
        title: "Architecture",
        kind: "architecture",
        steps: ["React / TypeScript frontend", "FastAPI / Python backend", "Resume and PDF processing", "Gemini-powered AI features"],
        note: "Upstash Redis supports AI usage enforcement.",
      },
      {
        id: "technology",
        title: "Technology",
        kind: "technology",
        groups: [
          { label: "Frontend", items: ["React", "TypeScript", "Vite", "CSS3"] },
          { label: "Backend", items: ["Python", "FastAPI"] },
          { label: "AI", items: ["Google Gemini API", "Prompt Engineering"] },
          { label: "Supporting libraries", items: ["pdfplumber", "google-genai", "python-dotenv"] },
          { label: "Usage enforcement", items: ["Upstash Redis"] },
        ],
      },
      {
        id: "privacy",
        title: "AI Usage + Privacy",
        kind: "text",
        paragraphs: [
          "Several Gemini-powered features share an AI request allowance. Client IPs are normalized, salted, and SHA-256 hashed before use as Redis keys; raw IP addresses are not used as Redis keys.",
        ],
      },
    ],
  },
};

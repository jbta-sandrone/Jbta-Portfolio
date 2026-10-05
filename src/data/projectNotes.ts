export type ProjectNoteId = "nemissive" | "i-nelory" | "cliq" | "nelume";

type TextSection = {
  id: string;
  title: string;
  kind: "text";
  paragraphs: readonly string[];
  links?: readonly { label: string; href: string }[];
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
  nemissive: {
    id: "nemissive",
    title: "Nemissive",
    descriptor: "Full-Stack Real-Time Messaging Application",
    sections: [
      {
        id: "overview", title: "Overview", kind: "text",
        paragraphs: [
          "Nemissive is a full-stack real-time messaging application for responsive desktop and mobile use. Shared direct and group conversations connect private media, voice/video calls, personal workspaces, and server-authorized account lifecycles.",
          "The engineering focus is a canonical data model that separates authorization, ephemeral state, durable history, and external-provider lifecycles. This is a portfolio/demo application: billing uses Lemon Squeezy Test Mode, and live Ask AI generation depends on provider configuration and API credit.",
        ],
      },
      {
        id: "architecture", title: "System Architecture", kind: "architecture",
        steps: ["React / TypeScript / Vite client", "Supabase Auth + authorized RPCs", "PostgreSQL + Row Level Security", "Realtime + private Storage", "TypeScript / Deno Edge Functions + external providers"],
        note: "Supabase is the backend platform; there is no separate Express/Node application server in the current deployment. Edge Functions handle server integrations with LiveKit, Cloudflare Turnstile, Lemon Squeezy, and the OpenAI Responses API. PostgreSQL jobs use pg_cron, pg_net, Supabase Vault, and protected worker functions for scheduled processing. Vercel hosts the frontend.",
      },
      {
        id: "messaging", title: "Messaging Model", kind: "groups",
        groups: [
          { title: "Shared conversations", detail: "Direct and group conversations use canonical messages and participants, with message requests and shared nicknames/themes." },
          { title: "Message operations", detail: "Replies, reactions, editing, soft deletion, pins, forwarding, and scheduled delivery support ongoing conversation workflows." },
          { title: "Conversation context", detail: "Delivery/read state, group Seen By, Activity Center, archive/mute, and search that opens the exact message keep context accessible." },
        ],
      },
      {
        id: "authorization", title: "Authorization & Security", kind: "list",
        intro: "Access is enforced on the server rather than by hiding interface controls. These are implemented authorization patterns, not a claim of perfect security, independent certification, or end-to-end encryption.",
        items: [
          "Authenticated caller identity and relationship/current-membership checks",
          "Row Level Security, narrow protected RPCs, and hardened search paths",
          "Private Storage and signed media URLs for authorized attachment delivery",
          "Server-side provider credentials and verified external webhooks",
          "Privacy controls, blocking, password recovery, and server-authorized account deletion",
        ],
      },
      {
        id: "groups", title: "Group Lifecycle", kind: "text",
        paragraphs: ["Owner, admin, and member roles define group responsibilities. Configurable admin permissions, membership management, ownership transfer, and group name/avatar updates are part of the lifecycle. Former members retain a read-only history boundary rather than ongoing membership access."],
      },
      {
        id: "realtime", title: "Realtime State", kind: "groups",
        groups: [
          { title: "Durable changes", detail: "Supabase Postgres Changes reconciles authoritative database state with the interface." },
          { title: "Typing & presence", detail: "Private conversation-scoped signals, protected authoritative typing state, and group typing reconciliation separate transient activity from message history. Authenticated presence heartbeats are resolved through relationship authorization, not a globally public presence feed." },
          { title: "Reconciliation", detail: "Reconnect and document-visibility reconciliation help restore current conversation state after interruptions." },
        ],
      },
      {
        id: "media", title: "Media & Personal Storage", kind: "list",
        items: [
          "Private images, videos, files, and recorded voice messages with media browsing",
          "Rich-text Notes with media, personal and conversation reminders",
          "Gallery, albums, and visibility controls",
          "Scheduled multimedia delivery and Personal Storage usage/quota presentation",
        ],
      },
      {
        id: "calls", title: "Voice & Video", kind: "groups",
        groups: [
          { title: "LiveKit transport", detail: "Direct and group voice/video calls use LiveKit for audio/video transport, track publication, microphone/camera state, participant controls, and reconnection." },
          { title: "Supabase authority", detail: "Supabase owns call lifecycle, participant eligibility, conversation association, durable history, and membership revocation. The application does not claim call recording." },
        ],
      },
      {
        id: "billing", title: "Premium & Billing", kind: "groups",
        intro: "Lemon Squeezy intentionally runs in Test Mode in the deployed portfolio/demo; this is not live real-money commercial billing.",
        groups: [
          { title: "Entitlements", detail: "Individually purchased premium items, Elite subscription access, and Personal Storage packs have distinct entitlement lifecycles." },
          { title: "Provider lifecycle", detail: "Server-authorized checkout and verified webhooks use replay/idempotency handling and stale-event protection. Purchase and subscription records remain private." },
          { title: "Renewal controls", detail: "Users can cancel future renewal or resume a valid scheduled cancellation." },
        ],
      },
      {
        id: "moderation", title: "Abuse Controls & Moderation", kind: "text",
        paragraphs: ["Server-side abuse budgets and resource limits complement Cloudflare Turnstile. Contextual reports can include optional verified text-message evidence, keeping evidence limited to the review context. Capability-protected staff review separates moderation access from normal application use. Feedback, Privacy Policy, Terms, and Help & Support complete the support surface."],
      },
      {
        id: "ask-ai", title: "Ask AI Workspace", kind: "text",
        paragraphs: ["Ask AI is a separate text-only workspace with persistent threads, streaming responses, Stop, Retry, Copy, and safe Markdown rendering. Its server-side provider integration uses the OpenAI Responses API.", "The workspace and integration are implemented, but live provider generation is not guaranteed in the deployed demo: it depends on provider configuration and available API credit."],
      },
      {
        id: "highlights", title: "Engineering Highlights", kind: "list",
        items: [
          "Shared direct/group models with server-authorized membership transitions",
          "Explicit separation of transient realtime signals and durable history",
          "Private media delivery governed by authenticated access",
          "Call transport separated from authoritative call eligibility and history",
          "Webhook-driven premium lifecycle with idempotency and stale-event protection",
        ],
      },
      {
        id: "technology", title: "Technology", kind: "technology",
        groups: [
          { label: "Frontend", items: ["React 19", "TypeScript", "Vite", "React Router", "Tailwind CSS"] },
          { label: "UI / Editing", items: ["Motion", "Tiptap", "React Markdown"] },
          { label: "Backend / Data", items: ["Supabase Auth", "PostgreSQL", "Row Level Security", "database RPCs", "Supabase Realtime", "Supabase Storage"] },
          { label: "Server", items: ["Supabase Edge Functions", "TypeScript", "Deno"] },
          { label: "Scheduled Work", items: ["pg_cron", "pg_net", "Supabase Vault"] },
          { label: "Voice / Video", items: ["LiveKit browser SDK", "LiveKit server SDK", "LiveKit Cloud"] },
          { label: "Protection / Billing", items: ["Cloudflare Turnstile", "Lemon Squeezy (Test Mode)"] },
          { label: "AI / Hosting", items: ["OpenAI Responses API (provider-dependent)", "Vercel"] },
        ],
      },
      {
        id: "links", title: "Project Links", kind: "text",
        paragraphs: ["Explore the portfolio/demo or review the source repository."],
        links: [{ label: "Live Demo", href: "https://nemissive.vercel.app" }, { label: "GitHub", href: "https://github.com/jbta-sandrone/Nemissive" }],
      },
    ],
  },
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

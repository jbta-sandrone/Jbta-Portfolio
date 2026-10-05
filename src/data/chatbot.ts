export type ChatbotRule = {
  id: string;
  keywords: readonly string[];
  patterns?: readonly RegExp[];
  answer: string;
};

export const chatbotOpeningMessage =
  "Hi! I’m Jonel’s portfolio assistant. Ask me about his projects, skills, background, or how to contact him.";

export const chatbotFallbackMessage =
  "I can only answer questions about Jonel, his work, skills, projects, and contact information.";

export type ChatbotSuggestionGroup = {
  id: "about" | "skills" | "services" | "projects" | "contact";
  label: string;
  questions: readonly string[];
};

export const chatbotSuggestionGroups: readonly ChatbotSuggestionGroup[] = [
  {
    id: "about",
    label: "About",
    questions: ["Who is Jonel?", "Is Jonel available for work?"],
  },
  {
    id: "skills",
    label: "Skills",
    questions: [
      "What technologies does Jonel use?",
      "What AI experience does Jonel have?",
    ],
  },
  {
    id: "services",
    label: "Services",
    questions: [
      "What can Jonel build?",
      "What services does Jonel offer?",
      "Can Jonel integrate AI?",
      "Tell me about his full-stack skills",
      "How can I work with Jonel?",
    ],
  },
  {
    id: "projects",
    label: "Projects",
    questions: [
      "What projects has Jonel built?",
      "Tell me about Nemissive",
      "Tell me about I-Nelory",
      "Tell me about CLIQ",
      "Tell me about Nelume",
    ],
  },
  {
    id: "contact",
    label: "Contact",
    questions: [
      "How can I contact Jonel?",
      "Where can I view his resume?",
    ],
  },
] as const;

export const chatbotRules: readonly ChatbotRule[] = [
  {
    id: "nemissive",
    keywords: ["nemissive"],
    patterns: [/\bnemissive\b/i],
    answer:
      "Nemissive is Jonel's current flagship portfolio project: a full-stack real-time messaging application with shared direct/group conversations, private media, and voice/video calls. React, TypeScript, and Vite connect to Supabase Auth, PostgreSQL, Row Level Security, protected RPCs, Realtime, and private Storage. TypeScript/Deno Edge Functions handle provider integrations; it does not use a separate Express/Node or FastAPI application backend. LiveKit handles call transport while Supabase governs eligibility, lifecycle, and history. Server-side authorization, signed media URLs, group membership boundaries, and verified webhooks support its engineering design; it does not claim end-to-end encryption or call recording. Premium purchases, Elite subscriptions, and storage packs use Lemon Squeezy Test Mode. Ask AI has an implemented text workspace and OpenAI Responses API integration, but live generation depends on provider configuration and API credit. Demo: https://nemissive.vercel.app — GitHub: https://github.com/jbta-sandrone/Nemissive",
  },
  {
    id: "flagship-project",
    keywords: ["flagship", "best project", "strongest project"],
    patterns: [/\b(flagship|best|strongest)\b.*\bprojects?\b/i, /\bprojects?\b.*\b(flagship|best|strongest)\b/i],
    answer:
      "Nemissive is Jonel's current flagship and strongest portfolio project, and leads Selected Work as Project 01. It brings together direct/group real-time messaging, private media, LiveKit voice/video calls, and Supabase/PostgreSQL authorization and lifecycle management. That is the portfolio's presentation priority, not a claim of objective superiority over other products. It is a portfolio/demo: Lemon Squeezy billing uses Test Mode, and Ask AI generation depends on provider configuration and API credit. You can explore its Project Notes in Selected Work.",
  },
  {
    id: "greeting",
    keywords: ["hello", "hi", "hey"],
    patterns: [/^(hi|hello|hey|good (morning|afternoon|evening))[!.?\s]*$/i],
    answer:
      "Hi! NELI can share information about Jonel’s background, skills, projects, career direction, availability, and portfolio contact options.",
  },
  {
    id: "capabilities",
    keywords: ["help", "ask", "topics", "what can you do"],
    patterns: [
      /what can (you|i) (do|ask)/i,
      /how can you help/i,
      /what do you know/i,
    ],
    answer:
      "NELI can answer questions about Jonel's background, education, development skills, projects, career direction, services, and portfolio contact options.",
  },
  {
    id: "quest-board-overview",
    keywords: [
      "services",
      "quest board",
      "adventurer's guild",
      "what can jonel build",
      "software work",
    ],
    patterns: [
      /what services does (jonel|he) offer/i,
      /what can (jonel|he) build/i,
      /tell me about (the )?quest board/i,
      /explore (the )?quest board/i,
      /adventurer'?s guild/i,
      /software (services|work) (does|can) (jonel|he)/i,
    ],
    answer:
      "Jonel's Services section covers full-stack web development, frontend development, backend and API development, practical AI feature integration, database and authentication systems, and deployment and optimization. His portfolio projects demonstrate hands-on experience across these areas.",
  },
  {
    id: "quest-full-stack",
    keywords: ["full-stack", "full stack", "complete application"],
    patterns: [
      /can (jonel|he) (build|develop|create) (a )?(complete|full[- ]stack) (application|app|website)/i,
      /tell me about (jonel'?s|his) full[- ]stack skills/i,
      /full[- ]stack (service|development|skills)/i,
    ],
    answer:
      "Yes. Jonel's full-stack projects connect React and TypeScript interfaces with application services, authentication, data, media, and deployment. Nemissive uses Supabase/PostgreSQL and TypeScript/Deno Edge Functions for authorized real-time messaging and provider integrations. I-Nelory and IntelliCLIQ use Node.js/Express; Nelume uses Python/FastAPI with Upstash Redis for AI usage enforcement. The exact architecture would depend on the project's requirements.",
  },
  {
    id: "quest-frontend",
    keywords: ["build a frontend", "develop a frontend", "frontend service"],
    patterns: [
      /can (jonel|he) (build|develop|create) (a |an )?(frontend|front-end|interface)/i,
      /frontend (service|development) on the quest board/i,
    ],
    answer:
      "Yes. Jonel can help build responsive and accessible interfaces using HTML, CSS, JavaScript, React, TypeScript, Tailwind CSS, and Motion. His projects demonstrate component-driven development, responsive design, keyboard accessibility, and thoughtful visual interaction.",
  },
  {
    id: "quest-backend-api",
    keywords: ["build APIs", "build an api", "backend service"],
    patterns: [
      /can (jonel|he) (build|develop|create) (an? )?(apis?|backend|back-end)/i,
      /backend (and |& )?api (service|development)/i,
    ],
    answer:
      "Yes. Jonel has hands-on experience with application logic, REST APIs, authentication, and database-connected services using Node.js, Express, Python, FastAPI, Firebase, PostgreSQL, and Prisma. Nemissive adds Supabase authorization, protected database RPCs, and TypeScript/Deno Edge Functions; it does not use a separate Express/Node application server.",
  },
  {
    id: "quest-ai-integration",
    keywords: ["integrate ai", "ai features", "ai integration"],
    patterns: [
      /can (jonel|he) (integrate|add|build) (an? )?ai/i,
      /ai feature integration/i,
      /what ai (features|services) can (jonel|he)/i,
    ],
    answer:
      "Yes. Jonel's projects use Google Gemini for memory search, resume evaluation, product recommendations, structured output, and career guidance. Nemissive also implements an Ask AI text workspace with the OpenAI Responses API; live generation depends on provider configuration and API credit. His focus is practical integration, not foundation-model training.",
  },
  {
    id: "quest-database-auth",
    keywords: ["create authentication", "work with databases", "database and authentication"],
    patterns: [
      /can (jonel|he) (create|build|implement|work with) (an? )?(authentication|databases?|database system|user accounts?)/i,
      /database (and |& )?authentication (service|systems?)/i,
    ],
    answer:
      "Yes. Jonel's projects demonstrate user accounts, permissions, JWT authentication, Firebase Authentication, Firebase Realtime Database, PostgreSQL, and Prisma. Nemissive uses Supabase Auth, Row Level Security, protected RPCs, and private Storage. Nelume uses Upstash Redis for AI usage enforcement. He can help connect application data and authorized access flows to interface and backend requirements.",
  },
  {
    id: "quest-deployment-maintenance",
    keywords: ["deploy a website", "fix a project", "improve a project", "maintenance"],
    patterns: [
      /can (jonel|he) deploy (a |an )?(website|application|app|project)/i,
      /can (jonel|he) (fix|debug|improve|optimi[sz]e|maintain) (an? |my )?(existing )?(project|application|app|website)/i,
      /can (jonel|he) (fix or improve|improve or fix) (an? |my )?(existing )?(project|application|app|website)/i,
      /deployment (and |& )?optimization/i,
    ],
    answer:
      "Jonel has hands-on project experience deploying frontend and backend applications with Vercel and Render, managing code with Git and GitHub, troubleshooting build and runtime issues, improving performance, and maintaining working project builds.",
  },
  {
    id: "quest-opportunities",
    keywords: ["work with jonel", "new opportunities", "interested in"],
    patterns: [
      /how can i work with (jonel|him)/i,
      /what kinds? of projects? (is|would) (jonel|he) (interested in|like)/i,
      /is (jonel|he) open to (new )?(opportunities|projects|collaboration)/i,
    ],
    answer:
      "The Services section shows the kinds of work Jonel can build or contribute to: full-stack applications, polished interfaces, backend and API work, practical AI features, database and authentication systems, and deployment or project improvements. For current availability or a specific project, visit the Contact section.",
  },
  {
    id: "i-nelory",
    keywords: ["i-nelory", "inelory", "memory journal"],
    patterns: [/i[-\s]?nelory/i, /personal memory journal/i],
    answer:
      "I-Nelory is Jonel’s private full-stack memory journal for saving, organizing, and rediscovering meaningful moments through albums, timelines, cloud media storage, and AI-powered memory search. It uses React, TypeScript, Node.js, Express, Prisma, PostgreSQL, Cloudinary, and Gemini AI.",
  },
  {
    id: "cliq",
    keywords: ["cliq", "intellicliq", "café", "cafe ordering"],
    patterns: [/\b(cliq|intellicliq)\b/i, /caf[eé] (mobile )?ordering/i],
    answer:
      "CLIQ, also referred to as IntelliCLIQ, is Jonel’s responsive café ordering platform with customer and administrator experiences, real-time data, order tracking, analytics, and AI-powered recommendations. Its technologies include HTML, CSS, JavaScript, Firebase, Node.js, Express, and Gemini AI.",
  },
  {
    id: "nelume",
    keywords: ["nelume", "resume viewer", "resume analysis"],
    patterns: [/\bnelume\b/i, /ai (resume|résumé) viewer/i],
    answer:
      "Nelume is Jonel's AI-powered career platform for résumé analysis and rewriting, cover letters, interview preparation, and learning resources. It uses React, TypeScript, FastAPI, Python, Google Gemini, and Upstash Redis for AI usage enforcement.",
  },
  {
    id: "availability",
    keywords: ["available", "availability", "hire", "collaborate", "collaboration"],
    patterns: [
      /is (jonel|he) available/i,
      /available for (work|hire|collaboration)/i,
      /(hire|collaborate with) (jonel|him)/i,
    ],
    answer:
      "The Services section describes the work Jonel can build or contribute to. For current availability, collaboration, or a specific project, visit the Contact section and reach out directly.",
  },
  {
    id: "email",
    keywords: ["email", "mail"],
    patterns: [/e-?mail/i, /send (jonel|him) a message/i],
    answer:
      "You can email Jonel at ablogjonelbryan@gmail.com from the Contact section. If your device has no email app configured, you can copy the address there instead.",
  },
  {
    id: "github",
    keywords: ["github", "source code", "repositories"],
    patterns: [/git\s?hub/i, /source code/i, /repositories?/i],
    answer:
      "Jonel’s portfolio links to his GitHub profile at https://github.com/jbta-sandrone, where you can explore his code and projects.",
  },
  {
    id: "linkedin",
    keywords: ["linkedin", "professional profile"],
    patterns: [/linked\s?in/i, /professional profile/i],
    answer:
      "Jonel’s portfolio links to his LinkedIn profile at https://www.linkedin.com/in/jbtablog for professional networking.",
  },
  {
    id: "facebook",
    keywords: ["facebook", "social profile"],
    patterns: [/face\s?book/i, /social profile/i],
    answer:
      "Jonel’s portfolio links to his Facebook profile at https://www.facebook.com/ablogjonel.21/.",
  },
  {
    id: "resume",
    keywords: ["resume", "résumé", "cv"],
    patterns: [/\b(resume|résumé|cv)\b/i],
    answer:
      "You can view or download Jonel's professional résumé from the Contact section of this portfolio. It includes his technical skills, featured projects, education, and contact information.",
  },
  {
    id: "contact",
    keywords: ["contact", "connect", "reach", "message"],
    patterns: [
      /how (can|do) i (contact|reach|connect with) (jonel|him)/i,
      /contact (jonel|information|details)/i,
      /get in touch/i,
    ],
    answer:
      "You can contact Jonel through the Contact section of this portfolio, where you'll find his email, LinkedIn, GitHub, and Facebook. Whether you're reaching out for a job opportunity, collaboration, freelance project, or simply want to connect, feel free to use whichever platform is most convenient for you.",
  },
  {
    id: "education",
    keywords: ["education", "degree", "bsit", "information technology", "study"],
    patterns: [
      /education|degree|college|university/i,
      /what (does|did|is) (jonel|he) stud/i,
      /information technology|\bbsit\b/i,
    ],
    answer:
      "Jonel is a graduate of University of Northern Philippines (2022-2026) with a degree of Bachelor of Science in Information Technology (BSIT) Cum Laude. He has built his development skills and portfolio projects alongside his studies.",
  },
  {
    id: "location",
    keywords: ["location", "philippines", "based", "from"],
    patterns: [
      /where is (jonel|he) (from|based)/i,
      /where does (jonel|he) live/i,
      /location|philippines/i,
    ],
    answer: "Jonel is a web developer from the Philippines.",
  },
  {
    id: "career",
    keywords: ["career", "goal", "software engineer", "aspiring"],
    patterns: [
      /career (goal|direction)/i,
      /software engineer/i,
      /what does (jonel|he) want to (be|become)/i,
    ],
    answer:
      "Jonel’s career goal is to become a software engineer. He is currently expanding his full-stack development skills while building thoughtful digital experiences.",
  },
  {
    id: "frontend",
    keywords: [
      "frontend",
      "front-end",
      "html",
      "css",
      "javascript",
      "react",
      "typescript",
      "tailwind",
      "motion",
    ],
    patterns: [
      /front-?end/i,
      /\b(html5?|css3?|javascript|react|typescript|tailwind css|motion)\b/i,
    ],
    answer:
      "Jonel’s frontend toolkit includes HTML5, CSS3, JavaScript, React, TypeScript, Tailwind CSS, and Motion. He uses them to build responsive, component-driven interfaces with thoughtful interaction and visual polish.",
  },
  {
    id: "backend",
    keywords: ["backend", "back-end", "node", "express", "python", "fastapi", "rest api", "edge functions", "deno", "livekit", "turnstile", "lemon squeezy"],
    patterns: [
      /back-?end/i,
      /\b(node(\.js)?|express|python|fastapi|rest apis?)\b/i,
      /edge functions|\b(deno|livekit|turnstile)\b|lemon squeezy/i,
    ],
    answer:
      "Jonel's backend experience includes Node.js/Express in I-Nelory and IntelliCLIQ, and Python/FastAPI in Nelume. Nemissive instead uses Supabase with protected PostgreSQL RPCs and TypeScript/Deno Edge Functions. Its server integrations include LiveKit, Cloudflare Turnstile, and Lemon Squeezy Test Mode billing; there is no separate Express/Node application server for Nemissive.",
  },
  {
    id: "database",
    keywords: ["database", "postgresql", "postgres", "prisma", "firebase", "upstash", "supabase"],
    patterns: [/databases?/i, /\b(postgresql|postgres|prisma|firebase|upstash|supabase)\b/i],
    answer:
      "Jonel's data experience includes Supabase, PostgreSQL, Prisma, Firebase, and Upstash Redis. Nemissive uses Supabase Auth, Row Level Security, protected RPCs, Realtime, and private Storage. The other projects demonstrate relational modeling, realtime data, authentication workflows, and AI usage enforcement.",
  },
  {
    id: "ai-integration",
    keywords: ["ai", "gemini", "prompt engineering", "llm", "artificial intelligence", "openai"],
    patterns: [
      /\b(ai|llm)\b/i,
      /gemini|openai|prompt engineering|artificial intelligence/i,
    ],
    answer:
      "Jonel has integrated Google Gemini into I-Nelory, IntelliCLIQ, and Nelume for memory search, recommendations, resume evaluation, and career guidance. Nemissive implements a separate Ask AI workspace with streaming threads and the OpenAI Responses API, but live provider generation depends on configuration and API credit. These are practical integrations, not foundation-model training or machine-learning research. NELI itself uses local portfolio answer rules, not an external model/API.",
  },
  {
    id: "portfolio",
    keywords: ["portfolio", "cinematic", "website", "scene"],
    patterns: [
      /^portfolio[?.!\s]*$/i,
      /this portfolio/i,
      /cinematic portfolio/i,
      /portfolio (site|website|project)/i,
    ],
    answer:
      "Jonel's portfolio is a seven-scene software engineering showcase built with React, TypeScript, Tailwind CSS, and Motion. It presents his projects, services, technology, and contact options through a responsive editorial interface.",
  },
  {
    id: "deployment",
    keywords: ["deployment", "deploy", "vercel", "render", "hosting", "debugging", "maintenance"],
    patterns: [
      /deploy(ment|ed|ing)?|hosting/i,
      /\b(vercel|render)\b/i,
    ],
    answer:
      "Jonel's deployment toolkit includes Git, GitHub, Vercel, and Render. His projects demonstrate experience with deployment configuration, build and runtime debugging, performance improvements, and maintaining working frontend and backend builds.",
  },
  {
    id: "projects",
    keywords: ["projects", "project", "work", "built"],
    patterns: [
      /^projects?[?.!\s]*$/i,
      /what (projects|has .* built)/i,
      /tell me about (jonel'?s|his) (projects|work)/i,
      /featured work/i,
    ],
    answer:
      "Jonel's four Selected Work projects are, in order: Nemissive, his flagship full-stack real-time messaging application; I-Nelory, a private personal memory journal; IntelliCLIQ, an AI-powered café ordering application; and Nelume, an AI-powered career platform. Each has a project preview and Project Notes in Selected Work.",
  },
  {
    id: "journey",
    keywords: ["journey", "experience", "background", "started", "begin"],
    patterns: [
      /development journey/i,
      /how did (jonel|he) (start|begin)/i,
      /(jonel'?s|his) experience/i,
      /background in (web|development|software)/i,
    ],
    answer:
      "Jonel’s documented development journey grew alongside his Information Technology studies from 2022–2026. He has built increasingly ambitious projects across frontend, backend, databases, deployment, and AI integration while working toward software engineering.",
  },
  {
    id: "about",
    keywords: ["aspiring", "web developer"],
    patterns: [
      /who is (jonel|he)/i,
      /tell me about (jonel|him)/i,
      /about jonel/i,
      /\b(jonel'?s|his) background\b/i,
      /jonel bryan ablog/i,
    ],
    answer:
      "Jonel Bryan Ablog is an aspiring software engineer from the Philippines who focuses on building thoughtful web applications and continuously improving his full-stack development skills.",
  },
  {
    id: "technologies",
    keywords: ["skills", "technologies", "tech stack", "tools"],
    patterns: [
      /what (skills|technologies|tools)/i,
      /(jonel'?s|his) (skills|tech stack|technologies)/i,
    ],
    answer:
      "Jonel's toolkit includes React, TypeScript, Vite, HTML/CSS/JavaScript, Tailwind CSS, Motion, Node.js/Express, Python/FastAPI, PostgreSQL, Prisma, Firebase, Upstash Redis, Gemini, GitHub, Vercel, and Render. Nemissive adds Supabase Auth/Realtime/Storage, protected RPCs, TypeScript/Deno Edge Functions, LiveKit, Cloudflare Turnstile, Lemon Squeezy Test Mode billing, and a provider-dependent OpenAI Responses API integration.",
  },
] as const;

const explicitOwnerContextPattern =
  /\b(jonel|his|him|he|jbta)\b|\b(this|jonel'?s|his) (portfolio|projects?)\b/i;

const namedProjectPattern = /\b(nemissive|i[-\s]?nelory|cliq|intellicliq|nelume)\b/i;

const directPortfolioTopicPattern =
  /\b(nemissive|i[-\s]?nelory|cliq|intellicliq|nelume|flagship|strongest|quest board|adventurer'?s guild|services?|full[- ]stack|frontend|backend|apis?|authentication|database|upstash|supabase|gemini|openai|livekit|turnstile|lemon squeezy|edge functions|deno|ai integration|github|linkedin|facebook|resume|résumé|education|degree|career|available|availability|opportunities|collaboration|contact|deployment|debugging|maintenance|vercel|render|skills|technologies|experience|background|projects?|portfolio)\b/i;

const unrelatedCodingRequestPattern =
  /\b(how (do|can) i|how to|write|code|program|debug|fix (my|this)|error|tutorial|implement|generate|create (a|an|me)|build (a|an|me)|what is)\b/i;

export function getChatbotAnswer(question: string) {
  const normalizedQuestion = question.trim().replace(/[’]/g, "'");
  if (!normalizedQuestion) return chatbotFallbackMessage;

  const isDirectPortfolioTopic = directPortfolioTopicPattern.test(normalizedQuestion);
  const isExplicitOwnerContext = explicitOwnerContextPattern.test(normalizedQuestion);
  const namesJonelProject = namedProjectPattern.test(normalizedQuestion);

  if (
    unrelatedCodingRequestPattern.test(normalizedQuestion) &&
    !isExplicitOwnerContext &&
    !namesJonelProject
  ) {
    return chatbotFallbackMessage;
  }

  const patternMatch = chatbotRules.find((rule) =>
    rule.patterns?.some((pattern) => pattern.test(normalizedQuestion)),
  );
  if (patternMatch) return patternMatch.answer;

  if (!isDirectPortfolioTopic) {
    return chatbotFallbackMessage;
  }

  const lowerQuestion = normalizedQuestion.toLowerCase();
  const bestKeywordMatch = chatbotRules
    .map((rule) => ({
      rule,
      score: rule.keywords.reduce(
        (total, keyword) => total + (lowerQuestion.includes(keyword.toLowerCase()) ? 1 : 0),
        0,
      ),
    }))
    .sort((first, second) => second.score - first.score)[0];

  if (!bestKeywordMatch || bestKeywordMatch.score <= 0) {
    return chatbotFallbackMessage;
  }

  return bestKeywordMatch.rule.answer;
}

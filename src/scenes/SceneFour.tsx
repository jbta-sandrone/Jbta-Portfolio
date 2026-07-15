import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  type Variants,
} from "motion/react";
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
  SiVercel,
} from "react-icons/si";

type TechnologyOrbitSettings = {
  radius: number;
  angleOffset: number;
  duration: number;
};

type Technology = {
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

type TechGroup = {
  id: "frontend" | "backend" | "database" | "ai" | "deployment";
  label: string;
  eyebrow: string;
  technologies: readonly Technology[];
};

const techGroups: readonly TechGroup[] = [
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

const constellationEase = [0.65, 0, 0.35, 1] as const;

export default function SceneFour() {
  const scrollContainerRef = useRef<HTMLElement>(null);
  const mobileLayoutRef = useRef<HTMLDivElement>(null);
  const activeGroupRef = useRef(0);
  const [activeGroup, setActiveGroup] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [hoveredTechnology, setHoveredTechnology] = useState<string | null>(null);
  const [pinnedTechnology, setPinnedTechnology] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = prefersReducedMotion !== false;
  const { scrollYProgress } = useScroll({ container: scrollContainerRef });

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const nextGroup = Math.min(
      techGroups.length - 1,
      Math.round(progress * (techGroups.length - 1)),
    );
    if (nextGroup === activeGroupRef.current) return;

    setDirection(nextGroup > activeGroupRef.current ? 1 : -1);
    activeGroupRef.current = nextGroup;
    setActiveGroup(nextGroup);
    setHoveredTechnology(null);
    setPinnedTechnology(null);
  });

  const group = techGroups[activeGroup];
  const inspectedId = hoveredTechnology ?? pinnedTechnology ?? group.technologies[0].id;
  const inspectedTechnology =
    group.technologies.find((technology) => technology.id === inspectedId) ??
    group.technologies[0];

  const inspectTechnology = (technologyId: string | null) => {
    setHoveredTechnology(technologyId);
  };

  const pinTechnology = (technologyId: string) => {
    setPinnedTechnology((current) => (current === technologyId ? null : technologyId));
  };

  useEffect(() => {
    mobileLayoutRef.current?.scrollTo({ top: 0, behavior: "auto" });
  }, [activeGroup]);

  return (
    <section
      ref={scrollContainerRef}
      data-cinematic-scene={4}
      data-scene-scroll
      aria-labelledby="craft-title"
      className={`portfolio-scene relative h-full snap-y snap-mandatory overflow-y-auto overflow-x-hidden overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
        reducedMotion ? "" : "scroll-smooth"
      }`}
    >
      <div className="relative">
        <div className="sticky top-0 h-dvh overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.4),rgba(0,0,0,0.14)_46%,rgba(0,0,0,0.5))]"
          />
          <div
            aria-hidden="true"
            className="portfolio-scene-glow pointer-events-none absolute inset-x-[12%] top-[12%] h-[68%] rounded-full opacity-70 blur-3xl"
          />

          <div
            ref={mobileLayoutRef}
            className="relative mx-auto flex h-full w-full max-w-7xl flex-col overflow-y-auto overflow-x-hidden px-5 pb-20 pt-7 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:px-8 sm:pt-8 md:overflow-visible lg:px-12 lg:pb-16 xl:px-16"
          >
            <motion.header
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 14, filter: "blur(5px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: reducedMotion ? 0.15 : 0.7, ease: constellationEase }}
              className="relative z-20 shrink-0"
            >
              <p className="portfolio-eyebrow text-[0.68rem] font-semibold uppercase tracking-[0.3em] sm:text-xs">
                Scene 04 — Craft
              </p>
              <div className="mt-1.5 flex flex-wrap items-end justify-between gap-x-8 gap-y-2">
                <h1
                  id="craft-title"
                  className="portfolio-heading text-3xl font-semibold tracking-tight sm:text-2xl lg:text-4xl"
                >
                  How I build experiences, from interface to infrastructure.
                </h1>
                <p className="portfolio-copy max-w-md text-sm sm:text-base">
                  The tools behind every experience I build.
                </p>
              </div>
            </motion.header>

            <div className="relative min-h-0 flex-none py-2 sm:py-3 md:flex-1">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={group.id}
                  custom={direction}
                  variants={constellationVariants(reducedMotion)}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="relative md:absolute md:inset-0"
                >
                  <DesktopConstellation
                    group={group}
                    inspectedId={inspectedTechnology.id}
                    pinnedId={pinnedTechnology}
                    pausedId={hoveredTechnology ?? pinnedTechnology}
                    reducedMotion={reducedMotion}
                    onInspect={inspectTechnology}
                    onPin={pinTechnology}
                  />
                  <MobileConstellation
                    group={group}
                    inspectedId={inspectedTechnology.id}
                    pinnedId={pinnedTechnology}
                    pausedId={hoveredTechnology ?? pinnedTechnology}
                    reducedMotion={reducedMotion}
                    onInspect={inspectTechnology}
                    onPin={pinTechnology}
                  />
                </motion.div>
              </AnimatePresence>

            </div>

            <CategoryProgress activeGroup={activeGroup} />
          </div>
        </div>

        <div aria-hidden="true" style={{ marginTop: "-100dvh" }}>
          {techGroups.map((item) => (
            <div key={item.id} className="h-dvh snap-start" />
          ))}
        </div>
      </div>
    </section>
  );
}

function constellationVariants(reducedMotion: boolean): Variants {
  return {
    initial: (direction: 1 | -1) =>
      reducedMotion
        ? { opacity: 0 }
        : {
            opacity: 0,
            scale: 0.92,
            rotate: direction * 2.2,
            filter: "blur(7px)",
          },
    animate: reducedMotion
      ? { opacity: 1, transition: { duration: 0.16, staggerChildren: 0.03 } }
      : {
          opacity: 1,
          scale: 1,
          rotate: 0,
          filter: "blur(0px)",
          transition: {
            duration: 0.78,
            ease: constellationEase,
          },
        },
    exit: (direction: 1 | -1) =>
      reducedMotion
        ? { opacity: 0, transition: { duration: 0.12 } }
        : {
            opacity: 0,
            scale: 0.88,
            rotate: direction * -2,
            filter: "blur(6px)",
            transition: { duration: 0.48, ease: constellationEase },
          },
  };
}

const coreVariants: Variants = {
  initial: { opacity: 0, scale: 0.82 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.68, ease: constellationEase },
  },
};

const reducedCoreVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.14 } },
};

const technologyVariants: Variants = {
  initial: { opacity: 0, scale: 0.86, y: 8 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.56, ease: constellationEase },
  },
};

const reducedTechnologyVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.14 } },
};

function staggerContainerVariants(reducedMotion: boolean): Variants {
  return {
    initial: {},
    animate: {
      transition: reducedMotion
        ? { staggerChildren: 0.02 }
        : { delayChildren: 0.18, staggerChildren: 0.1 },
    },
  };
}

type ConstellationProps = {
  group: TechGroup;
  inspectedId: string;
  pinnedId: string | null;
  pausedId: string | null;
  reducedMotion: boolean;
  onInspect: (technologyId: string | null) => void;
  onPin: (technologyId: string) => void;
};

function DesktopConstellation({
  group,
  inspectedId,
  pinnedId,
  pausedId,
  reducedMotion,
  onInspect,
  onPin,
}: ConstellationProps) {
  const inspectedTechnology =
    group.technologies.find((technology) => technology.id === inspectedId) ??
    group.technologies[0];

  return (
    <motion.div
      variants={staggerContainerVariants(reducedMotion)}
      className="hidden h-full min-h-0 gap-5 md:grid md:grid-cols-1 md:grid-rows-[minmax(0,1fr)_auto] lg:grid-cols-[minmax(0,1fr)_17rem] lg:grid-rows-1"
    >
      <div className="craft-constellation-viewport relative min-h-0 overflow-hidden rounded-[2rem]">
        <div className="craft-constellation-plane absolute left-1/2 top-1/2 aspect-square h-auto -translate-x-1/2 -translate-y-1/2">
          <OrbitalField reducedMotion={reducedMotion} />

          <div className="absolute left-1/2 top-1/2 z-10 size-24 -translate-x-1/2 -translate-y-1/2 lg:size-32 xl:size-36">
            <motion.div variants={coreVariants} className="h-full w-full">
              <motion.div
                animate={
                  reducedMotion
                    ? undefined
                    : { scale: [1, 1.018, 1], opacity: [0.94, 1, 0.94] }
                }
                transition={{
                  duration: 5.8,
                  repeat: reducedMotion ? 0 : Infinity,
                  ease: "easeInOut",
                }}
                className="flex h-full w-full flex-col items-center justify-center rounded-full border border-[var(--portfolio-border)] bg-black/60 text-center shadow-[inset_0_0_28px_var(--portfolio-accent-soft),0_0_48px_var(--portfolio-glow)] backdrop-blur-xl"
              >
                <span className="portfolio-eyebrow text-[0.55rem] font-semibold uppercase tracking-[0.22em]">
                  {group.eyebrow}
                </span>
                <h2 className="portfolio-heading mt-1.5 text-xl font-semibold lg:text-2xl">
                  {group.label}
                </h2>
                <span className="mt-2 size-1.5 rounded-full bg-[var(--portfolio-accent)] shadow-[0_0_14px_var(--portfolio-glow)]" />
              </motion.div>
            </motion.div>
          </div>

          {group.technologies.map((technology, index) => (
            <motion.div
              key={technology.id}
              variants={technologyVariants}
              style={{
                zIndex:
                  inspectedId === technology.id || pausedId === technology.id
                    ? 30
                    : index + 1,
              }}
              className="pointer-events-none absolute inset-0"
            >
              <OrbitingTechnology
                technology={technology}
                index={index}
                total={group.technologies.length}
                selected={inspectedId === technology.id}
                pinned={pinnedId === technology.id}
                paused={pausedId === technology.id}
                reducedMotion={reducedMotion}
                onInspect={onInspect}
                onPin={onPin}
              />
            </motion.div>
          ))}
        </div>
      </div>

      <TechnologyDetail
        technology={inspectedTechnology}
        pinned={pinnedId === inspectedTechnology.id}
        compact
      />
    </motion.div>
  );
}

function OrbitalField({ reducedMotion }: { reducedMotion: boolean }) {
  const rings = [1, 14, 21] as const;

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div className="absolute left-1/2 top-1/2 h-px w-[96%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[rgba(253,230,138,0.13)] to-transparent" />
      <div className="craft-orbit-vertical-axis absolute left-1/2 top-1/2 h-[82%] w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-[rgba(253,230,138,0.1)] to-transparent" />
      {rings.map((inset, index) => (
        <div key={inset} className="craft-orbit-ring-plane absolute inset-0">
          <motion.div
            animate={
              reducedMotion
                ? undefined
                : {
                    rotate: [
                      index % 2 === 0 ? -1.2 : 1.1,
                      index % 2 === 0 ? 1.2 : -1.1,
                      index % 2 === 0 ? -1.2 : 1.1,
                    ],
                  }
            }
            transition={{
              duration: 16 + index * 4,
              repeat: reducedMotion ? 0 : Infinity,
              ease: "easeInOut",
            }}
            className="absolute rounded-full border border-[rgba(253,230,138,0.13)]"
            style={{ inset: `${inset}%` }}
          />

          <motion.div
            animate={reducedMotion ? undefined : { rotate: 360 }}
            transition={{
              duration: 24 + index * 5,
              repeat: reducedMotion ? 0 : Infinity,
              ease: "linear",
              delay: index * -4,
            }}
            className="absolute rounded-full"
            style={{ inset: `${inset}%` }}
          >
            <span className="absolute left-1/2 top-0 size-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--portfolio-accent-strong)] opacity-55 shadow-[0_0_8px_var(--portfolio-glow)]" />
          </motion.div>
        </div>
      ))}
      <div className="craft-orbit-wash absolute inset-[8%] rounded-[50%] bg-[radial-gradient(circle,transparent_42%,rgba(245,158,11,0.025)_58%,transparent_72%)]" />
    </div>
  );
}

type TechnologyInteractionProps = {
  technology: Technology;
  selected: boolean;
  pinned: boolean;
  paused: boolean;
  reducedMotion: boolean;
  onInspect: (technologyId: string | null) => void;
  onPin: (technologyId: string) => void;
};

type OrbitingTechnologyProps = TechnologyInteractionProps & {
  index: number;
  total: number;
};

function OrbitingTechnology({
  technology,
  index,
  total,
  selected,
  pinned,
  paused,
  reducedMotion,
  onInspect,
  onPin,
}: OrbitingTechnologyProps) {
  const orbit = {
    angle: -90 + (360 / total) * index + technology.orbit.angleOffset,
    radius: technology.orbit.radius,
    duration: technology.orbit.duration,
  };
  const emphasized = selected || paused;
  const orbitStyle = {
    "--orbit-start": `${orbit.angle}deg`,
    "--orbit-start-negative": `${orbit.angle * -1}deg`,
    "--orbit-duration": `${orbit.duration}s`,
    animationPlayState: paused || reducedMotion ? "paused" : "running",
  } as CSSProperties;

  return (
    <div
      className="portfolio-tech-orbit pointer-events-none absolute inset-0"
      style={orbitStyle}
    >
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-px origin-left bg-[var(--portfolio-accent-strong)] transition-[opacity,filter] duration-300"
        style={{
          width: `${orbit.radius}%`,
          opacity: emphasized ? 0.52 : 0.12,
          filter: emphasized ? "drop-shadow(0 0 5px var(--portfolio-glow))" : "none",
        }}
      />
      <div
        className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${50 + orbit.radius}%` }}
      >
        <div className="portfolio-tech-counter-orbit" style={orbitStyle}>
          <TechnologyButton
            technology={technology}
            selected={selected}
            pinned={pinned}
            paused={paused}
            reducedMotion={reducedMotion}
            detailId="craft-technology-detail"
            variant="orbit"
            onInspect={onInspect}
            onPin={onPin}
          />
        </div>
      </div>
    </div>
  );
}

function BrandIcon({
  technology,
  className,
}: {
  technology: Technology;
  className: string;
}) {
  const Icon = technology.icon;

  if (technology.brandColorSecondary) {
    return (
      <span aria-hidden="true" className={`relative block ${className}`}>
        <Icon
          className="absolute inset-0 h-full w-full [clip-path:inset(0_0_50%_0)]"
          style={{ color: technology.brandColor }}
        />
        <Icon
          className="absolute inset-0 h-full w-full [clip-path:inset(50%_0_0_0)]"
          style={{ color: technology.brandColorSecondary }}
        />
      </span>
    );
  }

  return (
    <Icon
      aria-hidden="true"
      className={className}
      style={{ color: technology.brandColor }}
    />
  );
}

type TechnologyButtonProps = TechnologyInteractionProps & {
  detailId: string;
  variant: "orbit" | "mobile";
};

function TechnologyButton({
  technology,
  selected,
  pinned,
  paused,
  reducedMotion,
  detailId,
  variant,
  onInspect,
  onPin,
}: TechnologyButtonProps) {
  const emphasized = selected || paused || pinned;
  const glow = variant === "orbit" ? 14 : 10;
  const activeFilter = `drop-shadow(0 0 ${glow}px var(--portfolio-glow)) brightness(1.08)`;
  const restingFilter = "drop-shadow(0 0 0 transparent) brightness(1)";
  const animate =
    variant === "orbit"
      ? {
          scale: emphasized && !reducedMotion ? 1.045 : 1,
          filter: emphasized ? activeFilter : restingFilter,
        }
      : reducedMotion
        ? {
            scale: 1,
            filter: emphasized ? activeFilter : restingFilter,
          }
        : {
            scale: emphasized ? 1.025 : 1,
            filter: emphasized ? activeFilter : restingFilter,
          };
  const transition =
    variant === "orbit"
      ? { duration: reducedMotion ? 0.1 : 0.3, ease: "easeInOut" as const }
      : {
          scale: { duration: 0.25, ease: "easeInOut" as const },
          filter: { duration: 0.25, ease: "easeInOut" as const },
        };

  return (
    <motion.button
      type="button"
      aria-label={`${technology.name}. ${technology.description} Used in ${formatUsedIn(technology.projects)}.`}
      aria-pressed={pinned}
      aria-describedby={detailId}
      onPointerEnter={(event) => {
        if (event.pointerType !== "touch") onInspect(technology.id);
      }}
      onPointerLeave={(event) => {
        if (
          event.pointerType !== "touch" &&
          document.activeElement !== event.currentTarget
        ) {
          onInspect(null);
        }
      }}
      onFocus={() => onInspect(technology.id)}
      onBlur={(event) => {
        onInspect(event.currentTarget.matches(":hover") ? technology.id : null);
      }}
      onClick={() => onPin(technology.id)}
      animate={animate}
      transition={transition}
      style={{ zIndex: emphasized ? 30 : 1 }}
      className={
        variant === "orbit"
          ? "portfolio-focus pointer-events-auto relative group flex min-w-24 flex-col items-center gap-1.5 rounded-2xl text-center"
          : `portfolio-surface portfolio-focus pointer-events-auto relative flex min-h-11 w-full items-center gap-2 rounded-xl border bg-black/60 px-2 py-1.5 text-left transition-colors duration-300 ${
              emphasized
                ? "border-[rgba(253,230,138,0.48)] bg-[rgba(35,28,19,0.82)]"
                : "border-[var(--portfolio-border-subtle)]"
            }`
      }
    >
      {variant === "orbit" ? (
        <>
          <span
            className={`portfolio-surface flex size-12 items-center justify-center rounded-2xl border transition-colors group-hover:border-[var(--portfolio-border)] lg:size-14 xl:size-16 ${
              technology.lightTile ? "bg-stone-100" : "bg-black/55"
            }`}
          >
            <BrandIcon technology={technology} className="size-6 lg:size-7 xl:size-8" />
          </span>
          <span className="portfolio-heading max-w-28 rounded-full bg-black/50 px-2.5 py-1 text-[0.62rem] font-medium backdrop-blur-md lg:text-[0.68rem]">
            {technology.name}
          </span>
        </>
      ) : (
        <>
          <span
            className={`flex size-7 shrink-0 items-center justify-center rounded-lg ${
              technology.lightTile ? "bg-stone-100" : "bg-black/35"
            }`}
          >
            <BrandIcon technology={technology} className="size-4" />
          </span>
          <span className="portfolio-heading text-[0.62rem] font-medium leading-tight">
            {technology.name}
          </span>
        </>
      )}
    </motion.button>
  );
}

function MobileConstellation({
  group,
  inspectedId,
  pinnedId,
  pausedId,
  reducedMotion,
  onInspect,
  onPin,
}: ConstellationProps) {
  const inspectedTechnology =
    group.technologies.find((technology) => technology.id === inspectedId) ??
    group.technologies[0];
  const treeTravelDuration = 6.6 + group.technologies.length * 0.45;
  const treeLoopPause = 1.35;
  const treeLoopDuration = treeTravelDuration + treeLoopPause;

  return (
    <motion.div
      variants={staggerContainerVariants(reducedMotion)}
      className="flex h-auto flex-col md:hidden"
    >
      <motion.div
        variants={reducedMotion ? reducedCoreVariants : coreVariants}
        className="relative mx-auto mt-6 flex size-24 shrink-0 items-center justify-center text-center"
      >
        <motion.div
          animate={
            reducedMotion
              ? undefined
              : { scale: [1, 1.015, 1], opacity: [0.95, 1, 0.95] }
          }
          transition={{ duration: 5.8, repeat: reducedMotion ? 0 : Infinity, ease: "easeInOut" }}
          className="relative flex h-full w-full flex-col items-center justify-center rounded-full border border-[rgba(253,230,138,0.18)] bg-black/45 shadow-[inset_0_0_22px_var(--portfolio-accent-soft),0_0_28px_var(--portfolio-glow)] backdrop-blur-lg"
        >
          <p className="portfolio-eyebrow text-[0.5rem] font-semibold uppercase tracking-[0.2em]">
            {group.eyebrow}
          </p>
          <h2 className="portfolio-heading mt-1 text-xl font-semibold">{group.label}</h2>
          <span className="mt-2 size-1.5 rounded-full bg-[var(--portfolio-accent)] shadow-[0_0_12px_var(--portfolio-glow)]" />
          <span
            aria-hidden="true"
            className="absolute -bottom-4 left-1/2 h-4 w-px -translate-x-1/2 bg-gradient-to-b from-[rgba(253,230,138,0.5)] to-[rgba(253,230,138,0.18)]"
          />
        </motion.div>
      </motion.div>

      <div className="relative mx-auto mt-4 w-full max-w-sm shrink-0 py-1">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-7 left-1/2 top-0 z-0 w-px -translate-x-1/2 bg-[rgba(253,230,138,0.24)] shadow-[0_0_7px_var(--portfolio-glow)]"
        />
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-7 left-1/2 top-0 z-[1] w-px origin-top -translate-x-1/2 bg-gradient-to-b from-[rgba(253,230,138,0.42)] via-[rgba(253,230,138,0.26)] to-[rgba(253,230,138,0.08)]"
          initial={reducedMotion ? false : { scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{ duration: reducedMotion ? 0.12 : 0.72, ease: constellationEase }}
        />
        {!reducedMotion && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-7 left-1/2 top-0 z-[2] w-px -translate-x-1/2"
          >
            <motion.span
              className="absolute left-1/2 top-0 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--portfolio-accent-bright)] shadow-[0_0_12px_rgba(252,211,77,0.65)]"
              animate={{ top: ["0%", "100%"], opacity: [0, 0.95, 0.95, 0] }}
              transition={{
                duration: treeTravelDuration,
                repeat: Infinity,
                repeatDelay: treeLoopPause,
                ease: "linear",
                times: [0, 0.06, 0.92, 1],
              }}
            />
          </div>
        )}

        {group.technologies.map((technology, index) => {
          const isLeft = index % 2 === 0;
          const selected = inspectedId === technology.id;
          const pinned = pinnedId === technology.id;
          const paused = pausedId === technology.id;
          const nodeDelay =
            ((index + 0.5) / (group.technologies.length - 0.5)) *
            treeTravelDuration;
          const branchDelay = nodeDelay + 0.12;
          const itemPulseDelay = nodeDelay + 0.45;
          const itemSelected = selected || pinned;

          const technologyControl = (
            <motion.div
              className="relative z-10 min-w-0"
              animate={
                reducedMotion || itemSelected
                  ? {
                      filter: itemSelected
                        ? "drop-shadow(0 0 9px rgba(252,211,77,0.28))"
                        : "drop-shadow(0 0 0 rgba(252,211,77,0))",
                    }
                  : {
                      filter: [
                        "drop-shadow(0 0 0 rgba(252,211,77,0))",
                        "drop-shadow(0 0 7px rgba(252,211,77,0.2))",
                        "drop-shadow(0 0 0 rgba(252,211,77,0))",
                      ],
                    }
              }
              transition={{
                duration: reducedMotion || itemSelected ? 0.18 : 0.9,
                delay: reducedMotion || itemSelected ? 0 : itemPulseDelay,
                repeat: reducedMotion || itemSelected ? 0 : Infinity,
                repeatDelay: reducedMotion || itemSelected ? 0 : treeLoopDuration - 0.9,
                ease: "easeInOut",
              }}
            >
              <TechnologyButton
                technology={technology}
                selected={selected}
                pinned={pinned}
                paused={paused}
                reducedMotion={reducedMotion}
                detailId="craft-technology-detail-mobile"
                variant="mobile"
                onInspect={onInspect}
                onPin={onPin}
              />
            </motion.div>
          );

          return (
            <motion.div
              key={technology.id}
              variants={reducedMotion ? reducedTechnologyVariants : technologyVariants}
              className="relative grid min-h-14 grid-cols-[minmax(0,1fr)_2.75rem_minmax(0,1fr)] items-center"
            >
              <div className="min-w-0">{isLeft ? technologyControl : null}</div>

              <div className="pointer-events-none relative flex h-full items-center justify-center">
                <motion.span
                  aria-hidden="true"
                  className={`absolute top-1/2 h-px -translate-y-1/2 transition-[background-color,box-shadow] duration-300 ${
                    isLeft
                      ? "left-0 right-1/2 origin-right"
                      : "left-1/2 right-0 origin-left"
                  } ${
                    itemSelected
                      ? "bg-[rgba(253,230,138,0.62)] shadow-[0_0_7px_var(--portfolio-glow)]"
                      : "bg-[rgba(253,230,138,0.22)]"
                  }`}
                  initial={reducedMotion ? false : { scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{
                    duration: reducedMotion ? 0.1 : 0.42,
                    delay: reducedMotion ? 0 : 0.18 + index * 0.07,
                    ease: constellationEase,
                  }}
                />

                <motion.span
                  aria-hidden="true"
                  className={`relative z-[3] size-2 rounded-full border transition-colors duration-300 ${
                    itemSelected
                      ? "border-[var(--portfolio-accent-bright)] bg-[var(--portfolio-accent)] shadow-[0_0_11px_rgba(252,211,77,0.52)]"
                      : "border-[rgba(253,230,138,0.4)] bg-[rgba(24,20,15,0.96)]"
                  }`}
                  animate={
                    reducedMotion || itemSelected
                      ? { scale: itemSelected ? 1.16 : 1, opacity: itemSelected ? 1 : 0.72 }
                      : { scale: [1, 1.55, 1], opacity: [0.65, 1, 0.65] }
                  }
                  transition={{
                    duration: reducedMotion || itemSelected ? 0.18 : 0.68,
                    delay: reducedMotion || itemSelected ? 0 : nodeDelay,
                    repeat: reducedMotion || itemSelected ? 0 : Infinity,
                    repeatDelay: reducedMotion || itemSelected ? 0 : treeLoopDuration - 0.68,
                    ease: "easeInOut",
                  }}
                />

                {!reducedMotion && !itemSelected && (
                  <motion.span
                    aria-hidden="true"
                    className="absolute left-1/2 top-1/2 z-[2] size-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--portfolio-accent-bright)] shadow-[0_0_7px_rgba(252,211,77,0.55)]"
                    animate={{
                      x: isLeft ? [0, -20] : [0, 20],
                      opacity: [0, 0.9, 0],
                    }}
                    transition={{
                      duration: 0.58,
                      delay: branchDelay,
                      repeat: Infinity,
                      repeatDelay: treeLoopDuration - 0.58,
                      ease: "easeInOut",
                    }}
                  />
                )}
              </div>

              <div className="min-w-0">{isLeft ? null : technologyControl}</div>
            </motion.div>
          );
        })}
      </div>

      <TechnologyDetail
        technology={inspectedTechnology}
        pinned={pinnedId === inspectedTechnology.id}
        mobile
        reducedMotion={reducedMotion}
      />
    </motion.div>
  );
}

type TechnologyDetailProps = {
  technology: Technology;
  pinned: boolean;
  compact?: boolean;
  mobile?: boolean;
  reducedMotion?: boolean;
};

function TechnologyDetail({
  technology,
  pinned,
  compact = false,
  mobile = false,
  reducedMotion = false,
}: TechnologyDetailProps) {
  const detailId = mobile ? "craft-technology-detail-mobile" : "craft-technology-detail";

  return (
    <aside
      id={detailId}
      aria-live="polite"
      className={`portfolio-surface relative overflow-hidden rounded-2xl border bg-black/45 ${
        mobile
          ? "mx-auto mt-5 w-full max-w-sm shrink-0 px-4 py-4 pb-5"
          : "p-5 pb-6 lg:self-center"
      }`}
    >
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--portfolio-accent-strong)] to-transparent opacity-60" />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={technology.id}
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
          transition={{ duration: reducedMotion ? 0.14 : 0.3, ease: constellationEase }}
        >
          <div className="flex items-center gap-3">
            <span
              className={`flex shrink-0 items-center justify-center rounded-xl ${
                technology.lightTile ? "bg-stone-100" : "bg-black/40"
              } ${mobile ? "size-8" : "size-10"}`}
            >
              <BrandIcon technology={technology} className={mobile ? "size-4" : "size-5"} />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className={`portfolio-heading truncate font-semibold ${mobile ? "text-xs" : "text-sm"}`}>
                  {technology.name}
                </h3>
                {pinned && (
                  <span className="portfolio-eyebrow text-[0.48rem] font-semibold uppercase tracking-[0.16em]">
                    Pinned
                  </span>
                )}
              </div>
              {!mobile && (
                <p className="portfolio-muted mt-0.5 text-[0.58rem] uppercase tracking-[0.14em]">
                  Technology signal
                </p>
              )}
            </div>
          </div>

          <p className={`portfolio-copy ${mobile ? "mt-2.5 text-[0.68rem] leading-[1.1rem]" : "mt-3 text-xs leading-5"}`}>
            {technology.description}
          </p>
          <p className={`mt-2.5 ${compact || mobile ? "text-[0.62rem]" : "text-[0.65rem]"}`}>
            <span className="portfolio-eyebrow font-semibold uppercase tracking-[0.14em]">
              Used in
            </span>{" "}
            <span className="portfolio-muted">{formatUsedIn(technology.projects)}</span>
          </p>
        </motion.div>
      </AnimatePresence>
    </aside>
  );
}

function CategoryProgress({ activeGroup }: { activeGroup: number }) {
  return (
    <div className="pointer-events-none relative z-20 mt-6 flex shrink-0 items-center gap-3 pb-2 md:absolute md:bottom-6 md:left-8 md:mt-0 md:pb-0 lg:left-12 xl:left-16">
      <span className="portfolio-muted text-[0.6rem] font-semibold uppercase tracking-[0.2em] tabular-nums">
        {String(activeGroup + 1).padStart(2, "0")} / {String(techGroups.length).padStart(2, "0")}
      </span>
      <div className="flex items-center gap-1.5" aria-hidden="true">
        {techGroups.map((group, index) => (
          <span
            key={group.id}
            className={`h-1 rounded-full transition-[width,background-color] duration-500 ${
              index === activeGroup
                ? "portfolio-progress-active w-6"
                : "portfolio-progress-idle w-1.5"
            }`}
          />
        ))}
      </div>
      <span className="portfolio-eyebrow hidden text-[0.58rem] font-semibold uppercase tracking-[0.18em] sm:inline">
        {techGroups[activeGroup].label}
      </span>
    </div>
  );
}

function formatUsedIn(projects: readonly string[]) {
  if (projects.length === 1) return projects[0];
  if (projects.length === 2) return `${projects[0]} and ${projects[1]}`;
  return `${projects.slice(0, -1).join(", ")}, and ${projects.at(-1)}`;
}

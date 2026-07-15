import { useRef, useState, type CSSProperties } from "react";
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
        orbit: { radius: 24, angleOffset: -11, duration: 25 },
        description: "Semantic foundations that keep interfaces structured and accessible.",
        projects: ["CLIQ"],
      },
      {
        id: "css",
        name: "CSS3",
        icon: FaCss3Alt,
        brandColor: "#1572b6",
        orbit: { radius: 32, angleOffset: 5, duration: 28 },
        description: "Responsive presentation, layout, and visual polish across screen sizes.",
        projects: ["CLIQ", "this portfolio"],
      },
      {
        id: "javascript",
        name: "JavaScript",
        icon: SiJavascript,
        brandColor: "#f7df1e",
        orbit: { radius: 46, angleOffset: -3, duration: 19 },
        description: "Interactive browser behavior and application logic for the modern web.",
        projects: ["CLIQ", "this portfolio"],
      },
      {
        id: "react",
        name: "React",
        icon: SiReact,
        brandColor: "#61dafb",
        orbit: { radius: 28, angleOffset: 10, duration: 22 },
        description: "Component-driven interfaces that stay responsive, reusable, and clear.",
        projects: ["I-Nelory", "Nelume", "this portfolio"],
      },
      {
        id: "typescript",
        name: "TypeScript",
        icon: SiTypescript,
        brandColor: "#3178c6",
        orbit: { radius: 39, angleOffset: -7, duration: 25 },
        description: "Typed application foundations that make complex features safer to evolve.",
        projects: ["I-Nelory", "Nelume", "this portfolio"],
      },
      {
        id: "tailwind",
        name: "Tailwind CSS",
        icon: SiTailwindcss,
        brandColor: "#06b6d4",
        orbit: { radius: 35, angleOffset: 7, duration: 28 },
        description: "A scalable styling system for precise, responsive visual interfaces.",
        projects: ["Nelume", "this portfolio"],
      },
      {
        id: "motion",
        name: "Motion",
        icon: SiFramer,
        brandColor: "#0055ff",
        orbit: { radius: 43, angleOffset: 14, duration: 19 },
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
        orbit: { radius: 25, angleOffset: -10, duration: 23 },
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
        orbit: { radius: 25, angleOffset: -8, duration: 21 },
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
        orbit: { radius: 25, angleOffset: -8, duration: 21 },
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

          <div className="relative mx-auto flex h-full w-full max-w-7xl flex-col px-5 pb-20 pt-7 sm:px-8 sm:pt-8 lg:px-12 lg:pb-16 xl:px-16">
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

            <div className="relative min-h-0 flex-1 py-2 sm:py-3">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={group.id}
                  custom={direction}
                  variants={constellationVariants(reducedMotion)}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="absolute inset-0"
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

const technologyVariants: Variants = {
  initial: { opacity: 0, scale: 0.86, y: 8 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.56, ease: constellationEase },
  },
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
      className="hidden h-full min-h-0 gap-5 md:grid md:grid-cols-1 md:grid-rows-[minmax(20rem,1fr)_auto] lg:grid-cols-[minmax(0,1fr)_17rem] lg:grid-rows-1"
    >
      <div className="relative min-h-[20rem] overflow-hidden rounded-[2rem]">
        <div className="absolute left-1/2 top-1/2 aspect-square size-[min(96%,34rem)] -translate-x-1/2 -translate-y-1/2 lg:size-[min(96%,34.5rem)] xl:size-[min(98%,38rem)]">
          <OrbitalField reducedMotion={reducedMotion} />

          <div className="absolute left-1/2 top-1/2 z-10 size-32 -translate-x-1/2 -translate-y-1/2 lg:size-36">
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
  const rings = [4, 15, 26] as const;

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div className="absolute left-1/2 top-1/2 h-px w-[82%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[rgba(253,230,138,0.13)] to-transparent" />
      <div className="absolute left-1/2 top-1/2 h-[82%] w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-[rgba(253,230,138,0.1)] to-transparent" />
      {rings.map((inset, index) => (
        <div key={inset} className="absolute inset-0">
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
      <div className="absolute inset-[8%] rounded-[50%] bg-[radial-gradient(circle,transparent_42%,rgba(245,158,11,0.025)_58%,transparent_72%)]" />
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
  driftDirection?: number;
  driftDuration?: number;
};

function TechnologyButton({
  technology,
  selected,
  pinned,
  paused,
  reducedMotion,
  detailId,
  variant,
  driftDirection = 0,
  driftDuration = 18,
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
            x: paused ? 0 : [0, driftDirection, 0],
          };
  const transition =
    variant === "orbit"
      ? { duration: reducedMotion ? 0.1 : 0.3, ease: "easeInOut" as const }
      : {
          scale: { duration: 0.25, ease: "easeInOut" as const },
          filter: { duration: 0.25, ease: "easeInOut" as const },
          x: {
            duration: driftDuration,
            repeat: reducedMotion || paused ? 0 : Infinity,
            ease: "easeInOut" as const,
          },
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
          : "portfolio-surface portfolio-focus pointer-events-auto relative flex min-h-10 w-full items-center gap-2 rounded-xl border bg-black/55 px-2 py-1.5 text-left"
      }
    >
      {variant === "orbit" ? (
        <>
          <span
            className={`portfolio-surface flex size-14 items-center justify-center rounded-2xl border transition-colors group-hover:border-[var(--portfolio-border)] lg:size-16 ${
              technology.lightTile ? "bg-stone-100" : "bg-black/55"
            }`}
          >
            <BrandIcon technology={technology} className="size-7 lg:size-8" />
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
          <span className="portfolio-heading text-[0.58rem] font-medium leading-tight">
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

  return (
    <motion.div
      variants={staggerContainerVariants(reducedMotion)}
      className="flex h-full flex-col md:hidden"
    >
      <motion.div variants={coreVariants} className="relative mx-auto mt-1 shrink-0 text-center">
        <motion.div
          animate={
            reducedMotion
              ? undefined
              : { scale: [1, 1.015, 1], opacity: [0.95, 1, 0.95] }
          }
          transition={{ duration: 5.8, repeat: reducedMotion ? 0 : Infinity, ease: "easeInOut" }}
        >
          <div className="absolute left-1/2 top-1/2 size-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(253,230,138,0.14)] shadow-[0_0_28px_var(--portfolio-glow)]" />
          <p className="portfolio-eyebrow text-[0.5rem] font-semibold uppercase tracking-[0.2em]">
            {group.eyebrow}
          </p>
          <h2 className="portfolio-heading mt-1 text-xl font-semibold">{group.label}</h2>
        </motion.div>
      </motion.div>

      <div className="relative mx-auto mt-4 flex w-full max-w-sm flex-1 flex-col justify-center gap-1.5">
        <div aria-hidden="true" className="absolute bottom-1 left-1/2 top-1 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[rgba(253,230,138,0.25)] to-transparent" />
        {group.technologies.map((technology, index) => {
          const isLeft = index % 2 === 0;
          const selected = inspectedId === technology.id;
          const pinned = pinnedId === technology.id;
          const paused = pausedId === technology.id;

          return (
            <motion.div
              key={technology.id}
              variants={technologyVariants}
              className={`relative flex w-[48%] ${isLeft ? "mr-auto justify-end pr-5" : "ml-auto justify-start pl-5"}`}
            >
              <span
                aria-hidden="true"
                className={`absolute top-1/2 h-px w-5 bg-[rgba(253,230,138,0.28)] ${isLeft ? "right-0" : "left-0"}`}
              />
              <TechnologyButton
                technology={technology}
                selected={selected}
                pinned={pinned}
                paused={paused}
                reducedMotion={reducedMotion}
                detailId="craft-technology-detail-mobile"
                variant="mobile"
                driftDirection={isLeft ? -1.5 : 1.5}
                driftDuration={18 + index * 1.7}
                onInspect={onInspect}
                onPin={onPin}
              />
            </motion.div>
          );
        })}
      </div>

      <TechnologyDetail
        technology={inspectedTechnology}
        pinned={pinnedId === inspectedTechnology.id}
        mobile
      />
    </motion.div>
  );
}

type TechnologyDetailProps = {
  technology: Technology;
  pinned: boolean;
  compact?: boolean;
  mobile?: boolean;
};

function TechnologyDetail({
  technology,
  pinned,
  compact = false,
  mobile = false,
}: TechnologyDetailProps) {
  const detailId = mobile ? "craft-technology-detail-mobile" : "craft-technology-detail";

  return (
    <aside
      id={detailId}
      aria-live="polite"
      className={`portfolio-surface relative overflow-hidden rounded-2xl border bg-black/45 ${
        mobile ? "mx-auto mt-2 w-full max-w-sm px-3.5 py-2.5" : "p-4 lg:self-center lg:p-5"
      }`}
    >
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--portfolio-accent-strong)] to-transparent opacity-60" />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={technology.id}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.3, ease: constellationEase }}
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

          <p className={`portfolio-copy ${mobile ? "mt-1.5 line-clamp-2 text-[0.62rem] leading-4" : "mt-3 text-xs leading-5"}`}>
            {technology.description}
          </p>
          <p className={`mt-2 ${compact || mobile ? "text-[0.58rem]" : "text-[0.65rem]"}`}>
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
    <div className="pointer-events-none absolute bottom-6 left-5 z-20 flex items-center gap-3 sm:left-8 lg:left-12 xl:left-16">
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

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
import { FaBrain, FaCss3Alt } from "react-icons/fa";
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

type Technology = {
  id: string;
  label: string;
  Icon: IconType;
  brandColor: string;
  brandColorSecondary?: string;
  lightTile?: boolean;
  detail: string;
  usedIn: readonly string[];
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
        label: "HTML5",
        Icon: SiHtml5,
        brandColor: "#e34f26",
        detail: "Semantic foundations that keep interfaces structured and accessible.",
        usedIn: ["CLIQ", "this portfolio"],
      },
      {
        id: "css",
        label: "CSS3",
        Icon: FaCss3Alt,
        brandColor: "#1572b6",
        detail: "Responsive presentation, layout, and visual polish across screen sizes.",
        usedIn: ["CLIQ", "this portfolio"],
      },
      {
        id: "javascript",
        label: "JavaScript",
        Icon: SiJavascript,
        brandColor: "#f7df1e",
        detail: "Interactive browser behavior and application logic for the modern web.",
        usedIn: ["CLIQ", "this portfolio"],
      },
      {
        id: "react",
        label: "React",
        Icon: SiReact,
        brandColor: "#61dafb",
        detail: "Component-driven interfaces that stay responsive, reusable, and clear.",
        usedIn: ["I-Nelory", "Nelume", "this portfolio"],
      },
      {
        id: "typescript",
        label: "TypeScript",
        Icon: SiTypescript,
        brandColor: "#3178c6",
        detail: "Typed application foundations that make complex features safer to evolve.",
        usedIn: ["I-Nelory", "Nelume", "this portfolio"],
      },
      {
        id: "tailwind",
        label: "Tailwind CSS",
        Icon: SiTailwindcss,
        brandColor: "#06b6d4",
        detail: "A scalable styling system for precise, responsive visual interfaces.",
        usedIn: ["Nelume", "this portfolio"],
      },
      {
        id: "motion",
        label: "Motion",
        Icon: SiFramer,
        brandColor: "#0055ff",
        detail: "Purposeful transitions that guide attention without distracting from content.",
        usedIn: ["this portfolio"],
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
        label: "Node.js",
        Icon: SiNodedotjs,
        brandColor: "#5fa04e",
        detail: "JavaScript services for application logic, integrations, and real-time data.",
        usedIn: ["I-Nelory", "CLIQ"],
      },
      {
        id: "express",
        label: "Express",
        Icon: SiExpress,
        brandColor: "#ffffff",
        detail: "Focused API layers that connect interfaces to secure application services.",
        usedIn: ["I-Nelory", "CLIQ"],
      },
      {
        id: "python",
        label: "Python",
        Icon: SiPython,
        brandColor: "#3776ab",
        brandColorSecondary: "#ffd43b",
        detail: "Readable service logic for document extraction and intelligent analysis.",
        usedIn: ["Nelume"],
      },
      {
        id: "fastapi",
        label: "FastAPI",
        Icon: SiFastapi,
        brandColor: "#009688",
        detail: "Typed Python APIs designed for fast analysis and dependable responses.",
        usedIn: ["Nelume"],
      },
      {
        id: "rest",
        label: "REST APIs",
        Icon: SiOpenapiinitiative,
        brandColor: "#6ba539",
        detail: "Clear service contracts that keep frontend, backend, and AI systems connected.",
        usedIn: ["I-Nelory", "CLIQ", "Nelume"],
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
        label: "PostgreSQL",
        Icon: SiPostgresql,
        brandColor: "#4169e1",
        detail: "Relational data storage for structured, dependable application records.",
        usedIn: ["I-Nelory"],
      },
      {
        id: "prisma",
        label: "Prisma",
        Icon: SiPrisma,
        brandColor: "#2d3748",
        lightTile: true,
        detail: "A type-safe data layer for expressive queries and maintainable schemas.",
        usedIn: ["I-Nelory"],
      },
      {
        id: "firebase",
        label: "Firebase",
        Icon: SiFirebase,
        brandColor: "#ffca28",
        brandColorSecondary: "#f57c00",
        detail: "Cloud-backed data and authentication for responsive application workflows.",
        usedIn: ["CLIQ"],
      },
    ],
  },
  {
    id: "ai",
    label: "AI",
    eyebrow: "Intelligent systems",
    technologies: [
      {
        id: "gemini",
        label: "Google Gemini",
        Icon: SiGooglegemini,
        brandColor: "#4285f4",
        brandColorSecondary: "#a142f4",
        detail: "Generative intelligence for search, recommendations, and resume evaluation.",
        usedIn: ["I-Nelory", "CLIQ", "Nelume"],
      },
      {
        id: "prompt-engineering",
        label: "Prompt Engineering",
        Icon: FaBrain,
        brandColor: "#fcd34d",
        detail: "Structured instructions that turn model capability into useful product behavior.",
        usedIn: ["I-Nelory", "CLIQ", "Nelume"],
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
        label: "GitHub",
        Icon: SiGithub,
        brandColor: "#f0f6fc",
        detail: "Versioned collaboration and a reliable path from source to deployment.",
        usedIn: ["all projects"],
      },
      {
        id: "vercel",
        label: "Vercel",
        Icon: SiVercel,
        brandColor: "#ffffff",
        detail: "Fast frontend delivery with preview deployments and production-ready hosting.",
        usedIn: ["Nelume", "this portfolio"],
      },
      {
        id: "render",
        label: "Render",
        Icon: SiRender,
        brandColor: "#46e3b7",
        detail: "Managed backend hosting for APIs, services, and dependable releases.",
        usedIn: ["Nelume"],
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
  const inspectedId = pinnedTechnology ?? hoveredTechnology ?? group.technologies[0].id;
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
                  className="portfolio-heading text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl"
                >
                  Craft
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
        <div className="absolute left-1/2 top-1/2 aspect-square size-[min(92%,29rem)] -translate-x-1/2 -translate-y-1/2">
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
              className="absolute inset-0"
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
  const rings = [8, 18, 28] as const;

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
  index: number;
  selected: boolean;
  pinned: boolean;
  reducedMotion: boolean;
  onInspect: (technologyId: string | null) => void;
  onPin: (technologyId: string) => void;
};

type OrbitingTechnologyProps = TechnologyInteractionProps & {
  total: number;
  paused: boolean;
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
  const orbit = getOrbitConfig(total, index);
  const emphasized = selected || paused;
  const orbitStyle = {
    "--orbit-start": `${orbit.angle}deg`,
    "--orbit-start-negative": `${orbit.angle * -1}deg`,
    "--orbit-duration": `${orbit.duration}s`,
    animationPlayState: paused || reducedMotion ? "paused" : "running",
  } as CSSProperties;

  return (
    <div className="portfolio-tech-orbit absolute inset-0" style={orbitStyle}>
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
            selected={emphasized}
            pinned={pinned}
            reducedMotion={reducedMotion}
            onInspect={onInspect}
            onPin={onPin}
          />
        </div>
      </div>
    </div>
  );
}

type OrbitConfig = {
  angle: number;
  radius: number;
  duration: number;
};

function getOrbitConfig(total: number, index: number): OrbitConfig {
  const radiusPatterns: Record<number, readonly number[]> = {
    2: [35, 42],
    3: [34, 42, 38],
    5: [32, 39, 43, 35, 41],
    7: [31, 38, 43, 34, 41, 36, 42],
  };
  const radii = radiusPatterns[total] ?? radiusPatterns[3];

  return {
    angle: -90 + (360 / total) * index + (index % 2 === 0 ? -2.5 : 3.5),
    radius: radii[index % radii.length],
    duration: 18 + ((index * 3 + total) % 12),
  };
}

function TechnologyButton({
  technology,
  selected,
  pinned,
  reducedMotion,
  onInspect,
  onPin,
}: Omit<TechnologyInteractionProps, "index">) {
  return (
    <motion.button
      type="button"
      aria-label={`${technology.label}. ${technology.detail} Used in ${formatUsedIn(technology.usedIn)}.`}
      aria-pressed={pinned}
      aria-describedby="craft-technology-detail"
      onMouseEnter={() => onInspect(technology.id)}
      onMouseLeave={() => onInspect(null)}
      onFocus={() => onInspect(technology.id)}
      onBlur={() => onInspect(null)}
      onClick={() => onPin(technology.id)}
      animate={{
        scale: selected && !reducedMotion ? 1.045 : 1,
        filter: selected
          ? "drop-shadow(0 0 14px var(--portfolio-glow)) brightness(1.08)"
          : "drop-shadow(0 0 0 transparent) brightness(1)",
      }}
      transition={{ duration: reducedMotion ? 0.1 : 0.3, ease: "easeInOut" }}
      className="portfolio-focus group flex min-w-24 flex-col items-center gap-1.5 rounded-2xl text-center"
    >
      <span
        className={`portfolio-surface flex size-14 items-center justify-center rounded-2xl border transition-colors group-hover:border-[var(--portfolio-border)] lg:size-16 ${
          technology.lightTile ? "bg-stone-100" : "bg-black/55"
        }`}
      >
        <BrandIcon technology={technology} className="size-7 lg:size-8" />
      </span>
      <span className="portfolio-heading max-w-28 rounded-full bg-black/50 px-2.5 py-1 text-[0.62rem] font-medium backdrop-blur-md lg:text-[0.68rem]">
        {technology.label}
      </span>
    </motion.button>
  );
}

function BrandIcon({
  technology,
  className,
}: {
  technology: Technology;
  className: string;
}) {
  const Icon = technology.Icon;

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
          const emphasized = selected || paused;

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
              <motion.button
                type="button"
                aria-label={`${technology.label}. ${technology.detail} Used in ${formatUsedIn(technology.usedIn)}.`}
                aria-pressed={pinned}
                aria-describedby="craft-technology-detail-mobile"
                onMouseEnter={() => onInspect(technology.id)}
                onMouseLeave={() => onInspect(null)}
                onFocus={() => onInspect(technology.id)}
                onBlur={() => onInspect(null)}
                onClick={() => onPin(technology.id)}
                animate={
                  reducedMotion
                    ? {
                        scale: 1,
                        filter: emphasized
                          ? "drop-shadow(0 0 10px var(--portfolio-glow)) brightness(1.08)"
                          : "drop-shadow(0 0 0 transparent) brightness(1)",
                      }
                    : {
                        scale: emphasized ? 1.025 : 1,
                        filter: emphasized
                          ? "drop-shadow(0 0 10px var(--portfolio-glow)) brightness(1.08)"
                          : "drop-shadow(0 0 0 transparent) brightness(1)",
                        x: paused ? 0 : [0, isLeft ? -1.5 : 1.5, 0],
                      }
                }
                transition={{
                  scale: { duration: 0.25, ease: "easeInOut" },
                  filter: { duration: 0.25, ease: "easeInOut" },
                  x: {
                    duration: 18 + index * 1.7,
                    repeat: reducedMotion || paused ? 0 : Infinity,
                    ease: "easeInOut",
                  },
                }}
                className="portfolio-surface portfolio-focus flex min-h-10 w-full items-center gap-2 rounded-xl border bg-black/55 px-2 py-1.5 text-left"
              >
                <span
                  className={`flex size-7 shrink-0 items-center justify-center rounded-lg ${
                    technology.lightTile ? "bg-stone-100" : "bg-black/35"
                  }`}
                >
                  <BrandIcon technology={technology} className="size-4" />
                </span>
                <span className="portfolio-heading text-[0.58rem] font-medium leading-tight">
                  {technology.label}
                </span>
              </motion.button>
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
                  {technology.label}
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
            {technology.detail}
          </p>
          <p className={`mt-2 ${compact || mobile ? "text-[0.58rem]" : "text-[0.65rem]"}`}>
            <span className="portfolio-eyebrow font-semibold uppercase tracking-[0.14em]">
              Used in
            </span>{" "}
            <span className="portfolio-muted">{formatUsedIn(technology.usedIn)}</span>
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

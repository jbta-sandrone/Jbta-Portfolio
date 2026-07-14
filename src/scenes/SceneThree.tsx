import { useEffect, useRef, useState, type ReactNode } from "react";
import { ExternalLink, Play } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  type Variants,
} from "motion/react";

type PreviewFrame = {
  eyebrow: string;
  title: string;
  detail: string;
};

type Project = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  technologies: readonly string[];
  liveUrl?: string;
  githubUrl?: string;
  demoVideoUrl?: string;
  preview: {
    theme: "memory" | "cafe" | "future";
    frames: readonly PreviewFrame[];
  };
};

const projects: readonly Project[] = [
  {
    id: "i-nelory",
    title: "I-Nelory",
    subtitle: "Your Personal Memory Journal",
    description:
      "A private full-stack memory journal for saving, organizing, and rediscovering meaningful moments through albums, timelines, cloud media storage, and AI-powered memory search.",
    technologies: [
      "React",
      "TypeScript",
      "Node.js",
      "Express",
      "Prisma",
      "PostgreSQL",
      "Cloudinary",
      "Gemini AI",
    ],
    preview: {
      theme: "memory",
      frames: [
        {
          eyebrow: "Memory library",
          title: "Moments worth returning to",
          detail: "Albums, stories, and meaningful dates in one private space.",
        },
        {
          eyebrow: "Timeline",
          title: "Rediscover every chapter",
          detail: "Browse memories naturally across years, months, and milestones.",
        },
        {
          eyebrow: "AI memory search",
          title: "Find the moment you remember",
          detail: "Search the feeling, place, or story—not only the filename.",
        },
      ],
    },
  },
  {
    id: "cliq",
    title: "CLIQ",
    subtitle: "Café Mobile Ordering System",
    description:
      "A responsive café ordering platform with customer and administrator experiences, real-time data, order tracking, analytics, and AI-powered product recommendations.",
    technologies: [
      "HTML",
      "CSS",
      "JavaScript",
      "Firebase",
      "Node.js",
      "Express",
      "Gemini AI",
    ],
    preview: {
      theme: "cafe",
      frames: [
        {
          eyebrow: "Today's menu",
          title: "Your next favorite, one tap away",
          detail: "A fast, responsive ordering flow designed around the customer.",
        },
        {
          eyebrow: "Live orders",
          title: "From checkout to pickup",
          detail: "Clear status updates keep every order moving confidently.",
        },
        {
          eyebrow: "Smart recommendations",
          title: "A menu that learns",
          detail: "AI-assisted suggestions make discovery feel more personal.",
        },
      ],
    },
  },
  {
    id: "coming-soon",
    title: "Coming Soon",
    subtitle: "The Next Thoughtful Experience",
    description:
      "A new digital product is taking shape—grounded in careful research, purposeful design, and the same attention to useful, human experiences.",
    technologies: ["Research", "Product Design", "In Development"],
    preview: {
      theme: "future",
      frames: [
        {
          eyebrow: "In development",
          title: "The next chapter is taking shape",
          detail: "A new challenge, a new story, and more thoughtful work ahead.",
        },
        {
          eyebrow: "Exploration",
          title: "Built from questions first",
          detail: "Research and experimentation are defining what comes next.",
        },
      ],
    },
  },
] as const;

const cinematicEase = [0.65, 0, 0.35, 1] as const;

export default function SceneThree() {
  const scrollContainerRef = useRef<HTMLElement>(null);
  const activeProjectRef = useRef(0);
  const [activeProject, setActiveProject] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = prefersReducedMotion !== false;
  const { scrollYProgress } = useScroll({ container: scrollContainerRef });

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const nextProject = Math.min(
      projects.length - 1,
      Math.round(progress * (projects.length - 1)),
    );

    if (nextProject === activeProjectRef.current) return;

    setDirection(nextProject > activeProjectRef.current ? 1 : -1);
    activeProjectRef.current = nextProject;
    setActiveProject(nextProject);
  });

  const project = projects[activeProject];

  return (
    <section
      ref={scrollContainerRef}
      data-cinematic-scene={3}
      data-scene-scroll
      aria-labelledby="featured-work-title"
      className={`relative h-full snap-y snap-mandatory overflow-y-auto overflow-x-hidden overscroll-contain text-stone-100 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
        reducedMotion ? "" : "scroll-smooth"
      }`}
    >
      <div className="relative">
        <div className="sticky top-0 z-10 h-dvh overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-[12%] top-[8%] h-[72%] rounded-full bg-[radial-gradient(ellipse,rgba(96,165,250,0.1),rgba(124,58,237,0.035)_48%,transparent_72%)] blur-2xl"
          />

          <div className="relative mx-auto flex h-full w-full max-w-7xl flex-col px-5 pb-24 pt-7 sm:px-8 sm:pt-8 lg:px-12 lg:pb-20 xl:px-16">
            <header className="mx-auto shrink-0 text-center">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-blue-200/70 sm:text-xs">
                Scene 03 — Featured Work
              </p>
              <h1
                id="featured-work-title"
                className="mt-2 text-2xl font-semibold tracking-tight text-stone-50 sm:text-3xl lg:text-4xl"
              >
                Selected projects, built with purpose.
              </h1>
              <p className="mx-auto mt-2 max-w-xl text-xs leading-5 text-stone-400 sm:text-sm">
                Each project represents a challenge, a story, and something I’m proud of.
              </p>
            </header>

            <div className="relative flex min-h-0 flex-1 items-center justify-center">
              <AnimatePresence mode="wait" custom={direction}>
                <ProjectShowcase
                  key={project.id}
                  project={project}
                  projectNumber={activeProject + 1}
                  projectCount={projects.length}
                  direction={direction}
                  reducedMotion={reducedMotion}
                />
              </AnimatePresence>
            </div>

            <div className="pointer-events-none absolute bottom-7 left-5 flex items-center gap-3 sm:left-8 lg:left-12 xl:left-16">
              <span className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-stone-500">
                Scroll to reveal
              </span>
              <div className="flex gap-1.5" aria-hidden="true">
                {projects.map((item, index) => (
                  <span
                    key={item.id}
                    className={`h-1 rounded-full transition-[width,background-color] duration-500 ${
                      index === activeProject
                        ? "w-6 bg-blue-200/75"
                        : "w-1.5 bg-white/20"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div aria-hidden="true" style={{ marginTop: "-100dvh" }}>
          {projects.map((item) => (
            <div key={item.id} className="h-dvh snap-start" />
          ))}
        </div>
      </div>
    </section>
  );
}

type ProjectShowcaseProps = {
  project: Project;
  projectNumber: number;
  projectCount: number;
  direction: 1 | -1;
  reducedMotion: boolean;
};

function ProjectShowcase({
  project,
  projectNumber,
  projectCount,
  direction,
  reducedMotion,
}: ProjectShowcaseProps) {
  const showcaseVariants: Variants = {
    initial: reducedMotion
      ? { opacity: 0 }
      : {
          opacity: 0,
          y: direction * 54,
          scale: 0.95,
          filter: "blur(8px)",
        },
    animate: reducedMotion
      ? { opacity: 1, transition: { duration: 0.18 } }
      : {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          transition: { duration: 0.82, ease: cinematicEase },
        },
    exit: reducedMotion
      ? { opacity: 0, transition: { duration: 0.14 } }
      : {
          opacity: 0,
          y: direction * -28,
          scale: 0.92,
          filter: "blur(7px)",
          transition: { duration: 0.48, ease: cinematicEase },
        },
  };

  return (
    <motion.article
      variants={showcaseVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      aria-label={`${project.title}, project ${projectNumber} of ${projectCount}`}
      className="absolute inset-0 flex flex-col items-center justify-center pt-3 sm:pt-4"
    >
      <span className="sr-only" aria-live="polite">
        Showing {project.title}, project {projectNumber} of {projectCount}
      </span>
      <motion.div
        animate={
          reducedMotion
            ? undefined
            : { y: [0, -5, 0], rotate: [-0.35, 0.45, -0.35] }
        }
        transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
        className="hidden md:block"
      >
        <LaptopMockup project={project} reducedMotion={reducedMotion} />
      </motion.div>

      <motion.div
        animate={
          reducedMotion
            ? undefined
            : { y: [0, -4, 0], rotate: [-0.4, 0.5, -0.4] }
        }
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="md:hidden"
      >
        <PhoneMockup project={project} reducedMotion={reducedMotion} />
      </motion.div>

      <div className="mt-3 w-full max-w-3xl text-center sm:mt-4">
        <div className="flex items-baseline justify-center gap-3">
          <p className="text-[0.62rem] font-semibold tracking-[0.2em] text-blue-200/55 tabular-nums">
            {String(projectNumber).padStart(2, "0")} / {String(projectCount).padStart(2, "0")}
          </p>
          <h2 className="text-xl font-semibold tracking-tight text-stone-50 sm:text-2xl">
            {project.title}
          </h2>
          <span className="hidden text-sm text-stone-400 sm:inline">— {project.subtitle}</span>
        </div>
        <p className="mx-auto mt-2 line-clamp-3 max-w-2xl text-xs leading-5 text-stone-300 sm:text-sm sm:leading-6">
          {project.description}
        </p>

        <ul
          aria-label={`${project.title} technologies`}
          className="mx-auto mt-3 flex max-w-3xl flex-wrap justify-center gap-1.5"
        >
          {project.technologies.map((technology) => (
            <li
              key={technology}
              className="rounded-full border border-white/10 bg-black/25 px-2.5 py-1 text-[0.62rem] text-stone-300 backdrop-blur-sm sm:text-[0.68rem]"
            >
              {technology}
            </li>
          ))}
        </ul>

        <div className="mt-3 flex flex-wrap justify-center gap-2 sm:mt-4">
          <ProjectAction href={project.liveUrl} label="Live Demo" icon={<ExternalLink />} />
          <ProjectAction href={project.githubUrl} label="GitHub" icon={<FaGithub />} />
          <ProjectAction href={project.demoVideoUrl} label="Demo Video" icon={<Play />} />
        </div>
      </div>
    </motion.article>
  );
}

function LaptopMockup({ project, reducedMotion }: DevicePreviewProps) {
  return (
    <motion.div
      whileHover={
        reducedMotion
          ? undefined
          : {
              y: -4,
              filter: "drop-shadow(0 30px 38px rgba(0,0,0,0.52))",
            }
      }
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="w-[min(66vw,43rem)] [filter:drop-shadow(0_24px_32px_rgba(0,0,0,0.42))]"
    >
      <div className="relative rounded-[1.15rem] border border-white/20 bg-[#111318] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_0_55px_rgba(96,165,250,0.1)]">
        <span className="absolute left-1/2 top-1.5 z-20 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-black ring-1 ring-white/10" />
        <div className="aspect-video overflow-hidden rounded-[0.72rem] border border-black bg-[#08090d]">
          <ProjectPreview project={project} reducedMotion={reducedMotion} />
        </div>
      </div>
      <div className="mx-auto h-2.5 w-[106%] -translate-x-[3%] rounded-b-[55%] border-t border-white/20 bg-gradient-to-b from-[#a9adb5] via-[#5f636c] to-[#292c32] shadow-[0_8px_18px_rgba(0,0,0,0.4)]" />
      <div className="mx-auto h-1 w-24 rounded-b-full bg-black/55" />
    </motion.div>
  );
}

function PhoneMockup({ project, reducedMotion }: DevicePreviewProps) {
  return (
    <motion.div
      whileHover={reducedMotion ? undefined : { y: -3 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-[min(29dvh,15rem)] aspect-[9/18.5] rounded-[1.8rem] border border-white/25 bg-[#111318] p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.48),0_0_36px_rgba(96,165,250,0.1)]"
    >
      <div className="relative h-full overflow-hidden rounded-[1.45rem] border border-black bg-[#08090d]">
        <span className="absolute left-1/2 top-1.5 z-20 h-1.5 w-10 -translate-x-1/2 rounded-full bg-black/90" />
        <ProjectPreview project={project} reducedMotion={reducedMotion} />
      </div>
    </motion.div>
  );
}

type DevicePreviewProps = {
  project: Project;
  reducedMotion: boolean;
};

function ProjectPreview({ project, reducedMotion }: DevicePreviewProps) {
  const [activeFrame, setActiveFrame] = useState(0);

  useEffect(() => {
    setActiveFrame(0);
    if (reducedMotion || project.preview.frames.length < 2) return;

    const interval = window.setInterval(() => {
      setActiveFrame((current) => (current + 1) % project.preview.frames.length);
    }, 3200);

    return () => window.clearInterval(interval);
  }, [project, reducedMotion]);

  const frame = project.preview.frames[activeFrame];

  return (
    <div
      aria-hidden="true"
      className={`relative h-full overflow-hidden ${previewThemeClass[project.preview.theme]}`}
    >
      <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] [background-size:28px_28px]" />
      <div className="relative flex h-full flex-col p-4 sm:p-5">
        <div className="flex items-center justify-between text-[0.4rem] font-semibold uppercase tracking-[0.22em] text-white/45 sm:text-[0.55rem]">
          <span>{project.title}</span>
          <div className="flex gap-1">
            <span className="size-1.5 rounded-full bg-white/20" />
            <span className="size-1.5 rounded-full bg-white/20" />
            <span className="size-1.5 rounded-full bg-white/20" />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${project.id}-${activeFrame}`}
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.99 }}
            transition={{ duration: reducedMotion ? 0.15 : 0.6, ease: cinematicEase }}
            className="flex flex-1 flex-col justify-center"
          >
            <p className="text-[0.42rem] font-semibold uppercase tracking-[0.2em] text-white/45 sm:text-[0.62rem]">
              {frame.eyebrow}
            </p>
            <h3 className="mt-1.5 max-w-[75%] text-sm font-semibold leading-tight text-white sm:mt-2 sm:text-2xl">
              {frame.title}
            </h3>
            <p className="mt-1.5 max-w-[72%] text-[0.48rem] leading-relaxed text-white/55 sm:mt-2 sm:text-xs">
              {frame.detail}
            </p>

            <div className="mt-3 grid grid-cols-3 gap-1.5 sm:mt-5 sm:gap-2.5">
              {[0, 1, 2].map((item) => (
                <div
                  key={item}
                  className="h-8 rounded-md border border-white/10 bg-white/[0.055] shadow-inner sm:h-14 sm:rounded-lg"
                >
                  <div className="m-1.5 h-1 w-1/2 rounded-full bg-white/15 sm:m-2" />
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-1" aria-hidden="true">
          {project.preview.frames.map((previewFrame, index) => (
            <span
              key={previewFrame.title}
              className={`h-0.5 rounded-full transition-all duration-500 ${
                index === activeFrame ? "w-5 bg-white/65" : "w-2 bg-white/20"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const previewThemeClass: Record<Project["preview"]["theme"], string> = {
  memory:
    "bg-[radial-gradient(circle_at_72%_25%,rgba(167,139,250,0.25),transparent_32%),linear-gradient(135deg,#151225,#090a12_62%,#111827)]",
  cafe:
    "bg-[radial-gradient(circle_at_75%_22%,rgba(251,191,36,0.24),transparent_30%),linear-gradient(135deg,#28170f,#110d0b_62%,#1c1410)]",
  future:
    "bg-[radial-gradient(circle_at_72%_25%,rgba(56,189,248,0.2),transparent_32%),linear-gradient(135deg,#101b24,#090c12_62%,#101827)]",
};

type ProjectActionProps = {
  href?: string;
  label: string;
  icon: ReactNode;
};

function ProjectAction({ href, label, icon }: ProjectActionProps) {
  const className =
    "inline-flex min-h-9 items-center justify-center gap-1.5 rounded-full border border-white/15 bg-black/30 px-3.5 text-xs font-medium text-stone-200 backdrop-blur-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-blue-200";

  if (!href) {
    return (
      <button
        type="button"
        disabled
        title={`${label} link coming soon`}
        className={`${className} cursor-not-allowed opacity-35`}
      >
        <span className="inline-flex size-3.5 [&>svg]:size-3.5" aria-hidden="true">
          {icon}
        </span>
        {label}
      </button>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`${className} hover:border-blue-200/35 hover:bg-white/10`}
    >
      <span className="inline-flex size-3.5 [&>svg]:size-3.5" aria-hidden="true">
        {icon}
      </span>
      {label}
    </a>
  );
}

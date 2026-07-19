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
import projectVideo from "../assets/videos/Project video.mp4";
import NelumeVideo from "../assets/videos/Nelume video.mp4";
import IntelliCLIQVideo from "../assets/videos/IntelliCLIQ video.mp4";

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
  previewvideo: string;
  technologies: readonly string[];
  presentation: {
    category: string;
    status: string;
    highlight: string;
  };
  preview?: {
    theme: "future";
    frames: readonly PreviewFrame[];
  };
  liveUrl?: string;
  githubUrl?: string;
  demoVideoUrl?: string;
};

const projects: readonly Project[] = [
  {
    id: "i-nelory",
    title: "I-Nelory",
    subtitle: "Your Personal Memory Journal",
    liveUrl: "https://i-neloryapp.vercel.app/",
    githubUrl: "https://github.com/jbta-sandrone/I-Nelory",
    demoVideoUrl: "https://youtu.be/MQJLQmzU1lI",
    previewvideo: projectVideo,
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
    presentation: {
      category: "Memory platform",
      status: "Featured build",
      highlight: "AI-assisted memory discovery",
    },
  },
  {
    id: "cliq",
    title: "IntelliCLIQ",
    subtitle: "B-Hive Café Mobile Ordering Application",
    liveUrl: "https://jbta-sandrone.github.io/IntelliCLIQ/",
    githubUrl: "https://github.com/jbta-sandrone/IntelliCLIQ",
    demoVideoUrl: "https://youtu.be/Wq6UXoMbZos",
    previewvideo: IntelliCLIQVideo,
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
    presentation: {
      category: "Ordering experience",
      status: "Featured build",
      highlight: "Real-time café ordering",
    },
  },
  {
    id: "nelume",
    title: "Nelume",
    subtitle: "AI Resume Viewer",
    liveUrl: "https://nelume.vercel.app/",
    githubUrl: "https://github.com/jbta-sandrone/Nelume",
    demoVideoUrl: "https://www.youtube.com/watch?v=5g0X1k3J6xM",
    previewvideo: NelumeVideo,
    description:
      "An AI-powered resume analysis platform that extracts resume content, presents it in a structured viewer, and uses Google Gemini to provide intelligent evaluation and insights.",
    technologies: [
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Node.js",
      "Express.js",
      "Prisma",
      "Upstash (Database)",
      "Google Gemini AI",
      "JWT Authentication",
      "Cloudinary",
      "Vercel",
      "Render",
    ],
    presentation: {
      category: "Resume viewer",
      status: "AI-powered analysis",
      highlight: "Structured resume insights",
    },
    preview: {
      theme: "future",
      frames: [
        {
          eyebrow: "Resume viewer",
          title: "Understand every resume clearly",
          detail:
            "Uploaded resumes are extracted and organized into a clean, readable digital view.",
        },
        {
          eyebrow: "AI evaluation",
          title: "Turn resume content into useful insights",
          detail:
            "Gemini analyzes the resume and highlights strengths, weaknesses, and areas for improvement.",
        },
        {
          eyebrow: "Structured analysis",
          title: "Review skills and experience faster",
          detail:
            "Important information is presented clearly so users can evaluate a resume without reading an unstructured document.",
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
      className={`portfolio-scene relative h-full snap-y snap-mandatory overflow-y-auto overflow-x-hidden overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
        reducedMotion ? "" : "scroll-smooth"
      }`}
    >
      <div className="relative">
        <div className="sticky top-0 z-10 h-dvh overflow-hidden">
          <div
            aria-hidden="true"
            className="portfolio-scene-glow pointer-events-none absolute inset-x-[12%] top-[8%] h-[72%] rounded-full blur-2xl"
          />

          <div className="scene-three-layout relative mx-auto flex h-full w-full max-w-7xl flex-col px-5 pb-24 pt-7 sm:px-8 sm:pt-8 lg:px-12 lg:pb-20 xl:px-16">
            <header className="mx-auto shrink-0 text-center">
              <p className="portfolio-eyebrow text-[0.68rem] font-semibold uppercase tracking-[0.3em] sm:text-xs">
                Scene 03 — Featured Work
              </p>
              <h1
                id="featured-work-title"
                className="portfolio-heading mt-2 text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl"
              >
                Selected projects, built with purpose.
              </h1>
              <p className="portfolio-muted mx-auto mt-2 max-w-xl text-xs leading-5 sm:text-sm">
                Most projects that are outstanding and something I’m proud of.
              </p>
            </header>

            <div className="scene-three-showcase relative mt-5 flex min-h-0 flex-1 justify-center sm:mt-6 lg:mt-7">
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
              <span className="portfolio-subtle text-[0.62rem] font-semibold uppercase tracking-[0.24em]">
                Scroll to reveal
              </span>
              <div className="flex gap-1.5" aria-hidden="true">
                {projects.map((item, index) => (
                  <span
                    key={item.id}
                    className={`h-1 rounded-full transition-[width,background-color] duration-500 ${
                      index === activeProject
                        ? "portfolio-progress-active w-6"
                        : "portfolio-progress-idle w-1.5"
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
      className="absolute inset-0 flex flex-col items-center justify-start"
    >
      <span className="sr-only" aria-live="polite">
        Showing {project.title}, project {projectNumber} of {projectCount}
      </span>
      <div className="my-auto flex w-full flex-col items-center">
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
              : { y: [0, -4, 0], rotate: [-0.3, 0.35, -0.3] }
          }
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="w-full md:hidden"
        >
          <MobileTabletMockup project={project} reducedMotion={reducedMotion} />
        </motion.div>

        <div className="mt-3 w-full max-w-3xl text-center sm:mt-4">
        <div className="flex items-baseline justify-center gap-3">
          <p className="portfolio-eyebrow text-[0.62rem] font-semibold tracking-[0.2em] tabular-nums">
            {String(projectNumber).padStart(2, "0")} / {String(projectCount).padStart(2, "0")}
          </p>
          <h2 className="portfolio-heading text-xl font-semibold tracking-tight sm:text-2xl">
            {project.title}
          </h2>
          <span className="portfolio-muted hidden text-sm sm:inline">— {project.subtitle}</span>
        </div>
        <p className="portfolio-copy mx-auto mt-2 line-clamp-3 max-w-2xl text-xs leading-5 sm:text-sm sm:leading-6">
          {project.description}
        </p>

        <ul
          aria-label={`${project.title} technologies`}
          className="mx-auto mt-3 flex max-w-3xl flex-wrap justify-center gap-1.5"
        >
          {project.technologies.map((technology) => (
            <li
              key={technology}
              className="portfolio-chip rounded-full border px-2.5 py-1 text-[0.62rem] sm:text-[0.68rem]"
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
      className="scene-three-laptop w-[min(66vw,43rem)] [filter:drop-shadow(0_24px_32px_rgba(0,0,0,0.42))]"
    >
      <div className="portfolio-device-frame relative rounded-[1.15rem] border p-2">
        <span className="absolute left-1/2 top-1.5 z-20 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-black ring-1 ring-white/10" />
        <div className="portfolio-device-screen aspect-video overflow-hidden rounded-[0.72rem] border">
          <ProjectPreview project={project} reducedMotion={reducedMotion} />
        </div>
      </div>
      <div className="mx-auto h-2.5 w-[106%] -translate-x-[3%] rounded-b-[55%] border-t border-white/20 bg-gradient-to-b from-[#a9adb5] via-[#5f636c] to-[#292c32] shadow-[0_8px_18px_rgba(0,0,0,0.4)]" />
      <div className="mx-auto h-1 w-24 rounded-b-full bg-black/55" />
    </motion.div>
  );
}

function MobileTabletMockup({ project, reducedMotion }: DevicePreviewProps) {
  return (
    <motion.div
      whileHover={reducedMotion ? undefined : { y: -3 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="portfolio-device-frame mx-auto w-[min(86vw,24rem)] rounded-[1rem] border p-1.5 [filter:drop-shadow(0_18px_26px_rgba(0,0,0,0.38))]"
    >
      <div className="portfolio-device-screen relative aspect-video overflow-hidden rounded-[0.68rem] border">
        <span className="absolute left-1/2 top-1 z-20 size-1 -translate-x-1/2 rounded-full bg-black ring-1 ring-white/10" />
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
const [activePreviewFrame, setActivePreviewFrame] = useState(0);
  const previewFrames = project.preview?.frames;

  useEffect(() => {
    setActivePreviewFrame(0);
    if (reducedMotion || !previewFrames || previewFrames.length < 2) return;

    const frameTimer = window.setInterval(() => {
      setActivePreviewFrame((current) => (current + 1) % previewFrames.length);
    }, 4200);

    return () => window.clearInterval(frameTimer);
  }, [previewFrames, project.id, reducedMotion]);

  const previewFrame = previewFrames?.[activePreviewFrame];

  const overlayContainerVariants: Variants = {
    hidden: {},
    visible: {
      transition: reducedMotion
        ? { staggerChildren: 0.02 }
        : { delayChildren: 0.22, staggerChildren: 0.1 },
    },
  };

  const overlayItemVariants: Variants = {
    hidden: reducedMotion
      ? { opacity: 0 }
      : { opacity: 0, y: 8, scale: 0.97 },
    visible: reducedMotion
      ? { opacity: 1, transition: { duration: 0.14 } }
      : {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.58, ease: cinematicEase },
        },
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      <video
        src={project.previewvideo}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-label={`${project.title} project demonstration`}
        className="absolute inset-0 h-full w-full select-none object-cover"
      />

      <motion.div
        aria-hidden="true"
        variants={overlayContainerVariants}
        initial="hidden"
        animate="visible"
        className="pointer-events-none absolute inset-0 z-10"
      >
        <PreviewOverlayItem
          variants={overlayItemVariants}
          reducedMotion={reducedMotion}
          drift={-2}
          delay={0}
          className="left-2 top-2 max-w-[72%] md:left-4 md:top-4 md:max-w-[48%]"
        >
          <div className="portfolio-surface rounded-lg border bg-black/60 px-2 py-1.5 md:rounded-xl md:px-3.5 md:py-2.5">
            <p className="portfolio-eyebrow text-[0.38rem] font-semibold uppercase tracking-[0.2em] md:text-[0.58rem]">
              {project.presentation.category}
            </p>
            <p className="portfolio-heading mt-0.5 truncate text-[0.56rem] font-semibold md:mt-1 md:text-sm">
              {project.title}
            </p>
          </div>
        </PreviewOverlayItem>

        <PreviewOverlayItem
          variants={overlayItemVariants}
          reducedMotion={reducedMotion}
          drift={-1.5}
          delay={0.35}
          className="right-2 top-2 md:right-4 md:top-4"
        >
          <div className="portfolio-surface flex items-center gap-1 rounded-full border bg-black/60 p-1.5 md:gap-2 md:px-3 md:py-2">
            <span className="size-1.5 rounded-full bg-[var(--portfolio-accent)] shadow-[0_0_10px_var(--portfolio-glow)] md:size-2" />
            <span className="portfolio-copy hidden text-[0.58rem] font-medium md:inline">
              {project.presentation.status}
            </span>
          </div>
        </PreviewOverlayItem>

        <PreviewOverlayItem
          variants={overlayItemVariants}
          reducedMotion={reducedMotion}
          drift={-2.5}
          delay={0.7}
          className="bottom-4 left-4 hidden max-w-[46%] md:block"
        >
          <div className="portfolio-surface rounded-xl border bg-black/60 px-3.5 py-2.5">
            <span className="mb-2 block h-px w-8 bg-[var(--portfolio-accent-strong)] shadow-[0_0_10px_var(--portfolio-glow)]" />
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={previewFrame?.title ?? project.presentation.highlight}
                initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -3 }}
                transition={{
                  duration: reducedMotion ? 0.14 : 0.42,
                  ease: cinematicEase,
                }}
              >
                <p className="portfolio-muted text-[0.55rem] font-semibold uppercase tracking-[0.18em]">
                  {previewFrame?.eyebrow ?? "Product highlight"}
                </p>
                <p className="portfolio-heading mt-1 text-xs font-medium">
                  {previewFrame?.title ?? project.presentation.highlight}
                </p>
                {previewFrame && (
                  <p className="portfolio-copy mt-1 line-clamp-2 text-[0.55rem] leading-relaxed">
                    {previewFrame.detail}
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </PreviewOverlayItem>

        <motion.div
          variants={overlayItemVariants}
          className="absolute bottom-4 right-4 hidden max-w-[48%] flex-wrap justify-end gap-1.5 md:flex"
        >
          {project.technologies.slice(0, 3).map((technology, index) => (
            <motion.span
              key={technology}
              animate={
                reducedMotion
                  ? undefined
                  : { y: [0, index % 2 === 0 ? -2 : -1, 0] }
              }
              transition={{
                duration: 4.8 + index * 0.45,
                repeat: reducedMotion ? 0 : Infinity,
                ease: "easeInOut",
                delay: index * 0.18,
              }}
              className="pointer-events-auto"
            >
              <motion.span
                whileHover={
                  reducedMotion
                    ? undefined
                    : { y: -2, scale: 1.025, filter: "brightness(1.08)" }
                }
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="bg-black/60 portfolio-chip inline-flex rounded-full border px-2.5 py-1 text-[0.55rem] font-medium shadow-[0_8px_20px_rgba(0,0,0,0.24)]"
              >
                {technology}
              </motion.span>
            </motion.span>
          ))}
        </motion.div>

        <motion.div
          variants={overlayItemVariants}
          className="absolute inset-x-2 bottom-1.5 md:inset-x-4 md:bottom-2"
        >
          <div className="h-px overflow-hidden rounded-full bg-black/45">
            <motion.span
              className="block h-full origin-left bg-[var(--portfolio-accent-strong)] shadow-[0_0_12px_var(--portfolio-glow)]"
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scaleX: 0 }}
              animate={{ opacity: 0.85, scaleX: 1 }}
              transition={{
                duration: reducedMotion ? 0.14 : 1.1,
                delay: reducedMotion ? 0 : 0.65,
                ease: cinematicEase,
              }}
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

type PreviewOverlayItemProps = {
  children: ReactNode;
  className: string;
  variants: Variants;
  reducedMotion: boolean;
  drift: number;
  delay: number;
};

function PreviewOverlayItem({
  children,
  className,
  variants,
  reducedMotion,
  drift,
  delay,
}: PreviewOverlayItemProps) {
  return (
    <motion.div variants={variants} className={`absolute ${className}`}>
      <motion.div
        animate={reducedMotion ? undefined : { y: [0, drift, 0] }}
        transition={{
          duration: 5.2 + Math.abs(drift) * 0.35,
          delay,
          repeat: reducedMotion ? 0 : Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-auto"
      >
        <motion.div
          whileHover={
            reducedMotion
              ? undefined
              : { y: -2, scale: 1.012, filter: "brightness(1.08)" }
          }
          transition={{ duration: 0.32, ease: "easeInOut" }}
        >
          {children}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

type ProjectActionProps = {
  href?: string;
  label: string;
  icon: ReactNode;
};

function ProjectAction({ href, label, icon }: ProjectActionProps) {
  const className =
    "portfolio-button-secondary portfolio-focus inline-flex min-h-9 items-center justify-center gap-1.5 rounded-full border px-3.5 text-xs font-medium transition-colors";

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
      className={className}
    >
      <span className="inline-flex size-3.5 [&>svg]:size-3.5" aria-hidden="true">
        {icon}
      </span>
      {label}
    </a>
  );
}

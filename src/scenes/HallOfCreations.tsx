import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
  type Variants,
} from "motion/react";
import { useSceneNavigation } from "../components/SceneNavigationContext";
import projectVideo from "../assets/videos/Project video.mp4";
import NelumeVideo from "../assets/videos/Nelume video.mp4";
import IntelliCLIQVideo from "../assets/videos/IntelliCLIQ video.mp4";
import "../styles/hall-of-creations.css";

type PreviewFrame = {
  eyebrow: string;
  title: string;
  detail: string;
};

type ExhibitTheme = "archive" | "cafe" | "forge";

type Project = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  previewvideo: string;
  technologies: readonly string[];
  exhibit: {
    theme: ExhibitTheme;
    label: string;
    stationName: string;
  };
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
    exhibit: {
      theme: "archive",
      label: "Master Creation",
      stationName: "The Memory Archive",
    },
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
    exhibit: {
      theme: "cafe",
      label: "Smart Café System",
      stationName: "Guild Café Station",
    },
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
    demoVideoUrl: "https://youtu.be/NWfV9LpZQpg",
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
    exhibit: {
      theme: "forge",
      label: "Career Forge",
      stationName: "Scholar's Forge",
    },
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

const hallEase = [0.22, 1, 0.36, 1] as const;

const dustMotes = Array.from({ length: 12 }, (_, index) => ({
  left: `${7 + ((index * 29) % 87)}%`,
  top: `${12 + ((index * 37) % 70)}%`,
  delay: `${-0.7 * (index % 7)}s`,
  duration: `${7.5 + (index % 5) * 1.1}s`,
}));

const revealVariants: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(3px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.72, ease: hallEase },
  },
};

export default function HallOfCreations() {
  const sceneRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLElement>(null);
  const [activeProject, setActiveProject] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = prefersReducedMotion !== false;
  const { navigateToScene, isTransitioning } = useSceneNavigation();
  const { scrollYProgress } = useScroll({ container: scrollContainerRef });
  const farX = useTransform(scrollYProgress, [0, 1], [-14, 14]);
  const middleX = useTransform(scrollYProgress, [0, 1], [18, -18]);
  const nearX = useTransform(scrollYProgress, [0, 1], [-24, 24]);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const syncVisibility = () => {
      scene.classList.toggle("hall-animation-paused", document.hidden);
    };

    syncVisibility();
    document.addEventListener("visibilitychange", syncVisibility);
    return () => document.removeEventListener("visibilitychange", syncVisibility);
  }, []);

  return (
    <section
      ref={(element) => {
        sceneRef.current = element;
        scrollContainerRef.current = element;
      }}
      data-cinematic-scene={3}
      data-scene-scroll
      aria-labelledby="featured-work-title"
      className={`hall-of-creations portfolio-scene relative h-full overflow-y-auto overflow-x-hidden overscroll-contain ${
        reducedMotion ? "hall-reduced-motion" : "scroll-smooth"
      }`}
    >
      <HallEnvironment
        reducedMotion={reducedMotion}
        farX={farX}
        middleX={middleX}
        nearX={nearX}
      />

      <div className="hall-content relative z-10">
        <HallEntrance reducedMotion={reducedMotion} />

        <div className="hall-exhibits">
          {projects.map((project, index) => (
            <CreationExhibit
              key={project.id}
              project={project}
              index={index}
              projectCount={projects.length}
              reducedMotion={reducedMotion}
              scrollRoot={scrollContainerRef}
              onEnter={() => setActiveProject(index)}
            />
          ))}
        </div>

        <HallExit
          disabled={isTransitioning}
          onContinue={() => navigateToScene(3)}
        />
      </div>

      <ProjectProgress
        activeProject={activeProject}
        projectCount={projects.length}
      />
    </section>
  );
}

type HallEnvironmentProps = {
  reducedMotion: boolean;
  farX: MotionValue<number>;
  middleX: MotionValue<number>;
  nearX: MotionValue<number>;
};

function HallEnvironment({
  reducedMotion,
  farX,
  middleX,
  nearX,
}: HallEnvironmentProps) {
  const depthStyle = (x: MotionValue<number>) =>
    reducedMotion ? undefined : { x };

  return (
    <div aria-hidden="true" className="hall-environment pointer-events-none">
      <motion.div
        className="hall-depth hall-depth--far"
        style={depthStyle(farX)}
      >
        <div className="hall-back-wall" />
        <div className="hall-ceiling-grid" />
        <div className="hall-arch" style={{ left: "11%" }} />
        <div className="hall-arch" style={{ left: "39%" }} />
        <div className="hall-arch" style={{ right: "11%" }} />
        <div className="hall-skyline">
          <span />
          <span />
          <span />
        </div>
      </motion.div>

      <motion.div
        className="hall-depth hall-depth--mid"
        style={depthStyle(middleX)}
      >
        <HallBanner side="left" />
        <HallBanner side="right" />
        <div className="hall-balcony hall-balcony--left" />
        <div className="hall-balcony hall-balcony--right" />
        <HallBookcase side="left" />
        <HallBookcase side="right" />
        <div className="hall-lantern hall-lantern--left"><span /></div>
        <div className="hall-lantern hall-lantern--right"><span /></div>
        <EnergyPipe side="left" />
        <EnergyPipe side="right" />
        <div className="hall-light-beam hall-light-beam--one" />
        <div className="hall-light-beam hall-light-beam--two" />
      </motion.div>

      <motion.div
        className="hall-depth hall-depth--near"
        style={depthStyle(nearX)}
      >
        <div className="hall-support hall-support--left" />
        <div className="hall-support hall-support--right" />
        <div className="hall-floor" />
        <div className="hall-gear hall-gear--left">
          <i />
        </div>
        <div className="hall-gear hall-gear--right is-reverse">
          <i />
        </div>
        <div className="hall-pixel-plant hall-pixel-plant--left">
          <i />
          <i />
          <i />
          <span />
        </div>
        <div className="hall-pixel-plant hall-pixel-plant--right">
          <i />
          <i />
          <i />
          <span />
        </div>
      </motion.div>

      {dustMotes.map((mote, index) => (
        <span
          key={index}
          className="hall-dust"
          style={
            {
              left: mote.left,
              top: mote.top,
              "--dust-delay": mote.delay,
              "--dust-duration": mote.duration,
            } as CSSProperties
          }
        />
      ))}

      <div className="hall-readability-vignette" />
    </div>
  );
}

function HallBookcase({ side }: { side: "left" | "right" }) {
  const colors = ["gold", "green", "blue", "burgundy", "cream"] as const;

  return (
    <div className={`hall-bookcase hall-bookcase--${side}`}>
      {colors.map((color, index) => (
        <span key={`${side}-${color}`} className={`hall-book hall-book--${color}`} style={{ height: `${30 + (index % 3) * 8}px` }} />
      ))}
      <i />
    </div>
  );
}

function EnergyPipe({ side }: { side: "left" | "right" }) {
  return (
    <div className={`hall-energy-pipe hall-energy-pipe--${side}`}>
      <span />
      <i />
      <i />
      <i />
    </div>
  );
}

function HallBanner({ side }: { side: "left" | "right" }) {
  return (
    <div
      className="hall-hanging-banner"
      style={{ [side]: side === "left" ? "17%" : "17%" }}
    >
      <i />
    </div>
  );
}

function HallEntrance({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <div className="hall-entrance">
      <div aria-hidden="true" className="hall-workshop-door">
        <motion.div
          className="hall-door-panel hall-door-panel--left"
          initial={reducedMotion ? { opacity: 1 } : { x: "0%" }}
          animate={reducedMotion ? { opacity: 0.35 } : { x: "-88%" }}
          transition={{ duration: reducedMotion ? 0.15 : 1.15, delay: 0.18, ease: hallEase }}
        />
        <motion.div
          className="hall-door-panel hall-door-panel--right"
          initial={reducedMotion ? { opacity: 1 } : { x: "0%" }}
          animate={reducedMotion ? { opacity: 0.35 } : { x: "88%" }}
          transition={{ duration: reducedMotion ? 0.15 : 1.15, delay: 0.18, ease: hallEase }}
        />
        <div className="hall-door-light" />
      </div>

      <motion.header
        className="hall-chapter-header"
        initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reducedMotion ? 0.16 : 0.7, delay: reducedMotion ? 0 : 0.55, ease: hallEase }}
      >
        <p className="hall-chapter-index">Scene Three</p>
        <div aria-hidden="true" className="hall-chapter-rule">
          <span />
          <ExhibitGlyph type="archive" />
          <span />
        </div>
        <p className="hall-featured-label">Featured Work</p>
        <h1 id="featured-work-title">Hall of Creations</h1>
        <p className="hall-chapter-copy">
          Every creation tells part of the journey. Enter the guild exhibition
          and explore the software built along the way.
        </p>
        <p className="hall-enter-prompt">
          Enter the exhibition <span className="hall-enter-caret" aria-hidden="true" />
        </p>
      </motion.header>
    </div>
  );
}

type CreationExhibitProps = {
  project: Project;
  index: number;
  projectCount: number;
  reducedMotion: boolean;
  scrollRoot: RefObject<HTMLElement | null>;
  onEnter: () => void;
};

function CreationExhibit({
  project,
  index,
  projectCount,
  reducedMotion,
  scrollRoot,
  onEnter,
}: CreationExhibitProps) {
  const flagship = index === 0;
  const reverse = index % 2 === 1;

  return (
    <motion.article
      aria-labelledby={`${project.id}-title`}
      className={`creation-exhibit creation-exhibit--${project.exhibit.theme} ${flagship ? "creation-exhibit--flagship" : ""} ${
        reverse ? "creation-exhibit--reverse" : ""
      }`}
      variants={reducedMotion ? undefined : revealVariants}
      initial={reducedMotion ? { opacity: 0 } : "hidden"}
      whileInView={reducedMotion ? { opacity: 1 } : "visible"}
      viewport={{ root: scrollRoot, amount: 0.28, once: false }}
      transition={reducedMotion ? { duration: 0.15 } : undefined}
      onViewportEnter={onEnter}
    >
      <ExhibitLabel
        label={project.exhibit.label}
        title={project.exhibit.stationName}
        theme={project.exhibit.theme}
      />

      <div className="exhibit-station">
        <div aria-hidden="true" className="exhibit-station-grid" />
        <ExhibitCorners />

        <div className="exhibit-layout">
          <div className="exhibit-display-column">
            <PixelExhibitFrame
              project={project}
              flagship={flagship}
              reducedMotion={reducedMotion}
            />
            <div aria-hidden="true" className="exhibit-pedestal">
              <span />
              <span />
              <span />
            </div>
          </div>

          <div className="exhibit-information">
            <p className="exhibit-label">
              Exhibit {String(index + 1).padStart(2, "0")} /{" "}
              {String(projectCount).padStart(2, "0")}
            </p>
            <p className="exhibit-station-name">{project.exhibit.stationName}</p>
            <h2 id={`${project.id}-title`}>{project.title}</h2>
            <p className="exhibit-subtitle">{project.subtitle}</p>
            <p className="exhibit-description">{project.description}</p>

            <dl className="exhibit-readouts">
              <div>
                <dt>Class</dt>
                <dd>{project.presentation.category}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{project.presentation.status}</dd>
              </div>
              <div>
                <dt>Signal</dt>
                <dd>{project.presentation.highlight}</dd>
              </div>
            </dl>

            <ul
              className="exhibit-technologies"
              aria-label={`${project.title} technologies`}
            >
              {project.technologies.map((technology) => (
                <PixelTechTag key={technology}>{technology}</PixelTechTag>
              ))}
            </ul>

            <div className="exhibit-actions">
              <ProjectActionButton
                href={project.liveUrl}
                label="Live Demo"
                projectTitle={project.title}
                icon={<ActionGlyph type="external" />}
              />
              <ProjectActionButton
                href={project.githubUrl}
                label="GitHub"
                projectTitle={project.title}
                icon={<ActionGlyph type="code" />}
              />
              <ProjectActionButton
                href={project.demoVideoUrl}
                label="Demo Video"
                projectTitle={project.title}
                icon={<ActionGlyph type="play" />}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function ExhibitLabel({
  label,
  title,
  theme,
}: {
  label: string;
  title: string;
  theme: ExhibitTheme;
}) {
  return (
    <div aria-hidden="true" className="exhibit-banner">
      <span className="exhibit-banner-chain" />
      <div className="exhibit-banner-plaque">
        <ExhibitGlyph type={theme} />
        <div>
          <span>{label}</span>
          <strong>{title}</strong>
        </div>
      </div>
      <span className="exhibit-banner-chain" />
    </div>
  );
}

function ExhibitCorners() {
  return (
    <div aria-hidden="true">
      <span className="exhibit-corner exhibit-corner--tl" />
      <span className="exhibit-corner exhibit-corner--tr" />
      <span className="exhibit-corner exhibit-corner--bl" />
      <span className="exhibit-corner exhibit-corner--br" />
    </div>
  );
}

function PixelTechTag({ children }: { children: ReactNode }) {
  return (
    <li className="pixel-tech-tag">
      <span aria-hidden="true" />
      {children}
    </li>
  );
}

function PixelExhibitFrame({
  project,
  flagship,
  reducedMotion,
}: {
  project: Project;
  flagship: boolean;
  reducedMotion: boolean;
}) {
  return (
    <div
      className={`pixel-exhibit-frame ${
        flagship ? "pixel-exhibit-frame--flagship" : ""
      }`}
    >
      <span aria-hidden="true" className="frame-bolt frame-bolt--tl" />
      <span aria-hidden="true" className="frame-bolt frame-bolt--tr" />
      <span aria-hidden="true" className="frame-bolt frame-bolt--bl" />
      <span aria-hidden="true" className="frame-bolt frame-bolt--br" />

      <div className="pixel-exhibit-screen">
        <ProjectExhibitScreen
          project={project}
          reducedMotion={reducedMotion}
        />
      </div>

      <HallDecoration theme={project.exhibit.theme} />
      <span aria-hidden="true" className="frame-energy-trace" />
    </div>
  );
}

function ProjectExhibitScreen({
  project,
  reducedMotion,
}: {
  project: Project;
  reducedMotion: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activePreviewFrame, setActivePreviewFrame] = useState(0);
  const previewFrames = project.preview?.frames;

  useManagedVideoPlayback(videoRef, reducedMotion);

  useEffect(() => {
    if (reducedMotion || !previewFrames || previewFrames.length < 2) return;

    const frameTimer = window.setInterval(() => {
      setActivePreviewFrame((current) => (current + 1) % previewFrames.length);
    }, 4200);

    return () => window.clearInterval(frameTimer);
  }, [previewFrames, project.id, reducedMotion]);

  const previewFrame = previewFrames?.[activePreviewFrame];

  return (
    <div className="project-exhibit-screen">
      <video
        ref={videoRef}
        src={project.previewvideo}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={`${project.title} project demonstration`}
      />

      <div aria-hidden="true" className="project-screen-grid" />
      <div className="project-screen-heading">
        <span>{project.presentation.category}</span>
        <strong>{project.title}</strong>
      </div>
      <div className="project-screen-status">
        <span aria-hidden="true" />
        {project.presentation.status}
      </div>
      <div className="project-screen-insight">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={previewFrame?.title ?? project.presentation.highlight}
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -3 }}
            transition={{ duration: reducedMotion ? 0.1 : 0.34, ease: hallEase }}
          >
            <span>{previewFrame?.eyebrow ?? "Guild readout"}</span>
            <strong>
              {previewFrame?.title ?? project.presentation.highlight}
            </strong>
            {previewFrame && <p>{previewFrame.detail}</p>}
          </motion.div>
        </AnimatePresence>
      </div>

      {previewFrames && (
        <div className="sr-only">
          <p>Additional {project.title} project details:</p>
          <ul>
            {previewFrames.map((frame) => (
              <li key={frame.title}>
                {frame.title}: {frame.detail}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function useManagedVideoPlayback(
  videoRef: RefObject<HTMLVideoElement | null>,
  reducedMotion: boolean,
) {
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let inView = false;

    const syncPlayback = () => {
      if (reducedMotion || document.hidden || !inView) {
        video.pause();
        return;
      }

      void video.play().catch(() => {
        // Autoplay can be blocked by user-agent settings; the external demo link remains available.
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        syncPlayback();
      },
      { rootMargin: "20% 0px", threshold: 0.15 },
    );

    observer.observe(video);
    document.addEventListener("visibilitychange", syncPlayback);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncPlayback);
      video.pause();
    };
  }, [reducedMotion, videoRef]);
}

function HallDecoration({ theme }: { theme: ExhibitTheme }) {
  if (theme === "archive") {
    return (
      <div aria-hidden="true" className="machine-details">
        {[0, 1, 2, 3].map((fragment) => (
          <span
            key={fragment}
            className={`memory-fragment memory-fragment--${fragment}`}
          />
        ))}
        <span className="archive-timeline">
          <i />
        </span>
      </div>
    );
  }

  if (theme === "cafe") {
    return (
      <div aria-hidden="true" className="machine-details">
        <span className="order-ticket order-ticket--one" />
        <span className="order-ticket order-ticket--two" />
        <span className="cafe-cup">
          <i />
          <i />
          <i />
        </span>
      </div>
    );
  }

  return (
    <div aria-hidden="true" className="machine-details">
      <span className="forge-page forge-page--one" />
      <span className="forge-page forge-page--two" />
      <span className="forge-scanner" />
    </div>
  );
}

function ExhibitGlyph({ type }: { type: ExhibitTheme }) {
  if (type === "archive") {
    return (
      <svg
        className="exhibit-glyph"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        shapeRendering="crispEdges"
      >
        <path d="M4 5h16v4H4zM6 9h12v11H6zM9 12h6M9 15h6" />
      </svg>
    );
  }

  if (type === "cafe") {
    return (
      <svg
        className="exhibit-glyph"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        shapeRendering="crispEdges"
      >
        <path d="M5 8h12v9H5zM17 10h3v5h-3M4 20h15M8 5V2M12 5V2M16 5V2" />
      </svg>
    );
  }

  return (
    <svg
      className="exhibit-glyph"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      shapeRendering="crispEdges"
    >
      <path d="M5 3h11l3 3v15H5zM8 9h8M8 13h8M8 17h5M16 3v4h4" />
    </svg>
  );
}

function ActionGlyph({ type }: { type: "external" | "code" | "play" }) {
  if (type === "external") {
    return (
      <svg viewBox="0 0 16 16" aria-hidden="true" shapeRendering="crispEdges">
        <path fill="currentColor" d="M2 3h6v2H4v7h7V8h2v6H2Zm8-1h4v4h-2V5L7 10 6 9l5-5h-1Z" />
      </svg>
    );
  }

  if (type === "code") {
    return (
      <svg viewBox="0 0 16 16" aria-hidden="true" shapeRendering="crispEdges">
        <path fill="currentColor" d="M5 3v2H3v2H1v2h2v2h2v2H3v-1H1v-2H0V6h1V4h2V3Zm6 0h2v1h2v2h1v4h-1v2h-2v1h-2v-2h2V9h2V7h-2V5h-2ZM9 2h2L7 14H5Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" shapeRendering="crispEdges">
      <path fill="currentColor" d="M3 2h4v2h3v2h3v4h-3v2H7v2H3Z" />
    </svg>
  );
}

type ProjectActionButtonProps = {
  href?: string;
  label: string;
  projectTitle: string;
  icon: ReactNode;
};

function ProjectActionButton({
  href,
  label,
  projectTitle,
  icon,
}: ProjectActionButtonProps) {
  const content = (
    <>
      <span className="project-action-icon" aria-hidden="true">
        {icon}
      </span>
      <span>{label}</span>
      <span className="project-action-pixel" aria-hidden="true" />
    </>
  );

  if (!href) {
    return (
      <button
        type="button"
        disabled
        title={`${label} link coming soon`}
        className="project-action-button portfolio-focus"
      >
        {content}
      </button>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={`${label} for ${projectTitle} (opens in a new tab)`}
      data-cursor-label={label}
      className="project-action-button portfolio-focus"
    >
      {content}
    </a>
  );
}

function ProjectProgress({
  activeProject,
  projectCount,
}: {
  activeProject: number;
  projectCount: number;
}) {
  return (
    <div
      className="hall-project-progress"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <span className="hall-progress-count">
        {String(activeProject + 1).padStart(2, "0")} /{" "}
        {String(projectCount).padStart(2, "0")}
      </span>
      <span className="hall-progress-track" aria-hidden="true">
        {projects.map((project, index) => (
          <i key={project.id} className={index === activeProject ? "is-active" : ""} />
        ))}
      </span>
      <span className="hall-progress-name">{projects[activeProject].title}</span>
    </div>
  );
}

function HallExit({
  disabled,
  onContinue,
}: {
  disabled: boolean;
  onContinue: () => void;
}) {
  return (
    <section className="hall-exit" aria-labelledby="hall-exit-title">
      <div aria-hidden="true" className="hall-exit-arch">
        <div className="hall-exit-light" />
        <span className="hall-exit-step hall-exit-step--one" />
        <span className="hall-exit-step hall-exit-step--two" />
        <span className="hall-exit-step hall-exit-step--three" />
      </div>
      <p className="hall-exit-label">The journey continues</p>
      <h2 id="hall-exit-title" className="hall-exit-copy">
        The Adventurer's Guild waits beyond the guild corridor.
      </h2>
      <div className="exhibit-actions">
        <button
          type="button"
          disabled={disabled}
          onClick={onContinue}
          data-cursor-label="Scene Four"
          className="project-action-button portfolio-focus"
        >
          <span>Continue to Scene Four</span>
          <span className="project-action-pixel" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}

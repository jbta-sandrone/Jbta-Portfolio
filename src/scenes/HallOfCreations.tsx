import { useEffect, useRef, useState, type RefObject } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowDownRight, ArrowUpRight, FileText } from "lucide-react";
import { useSceneNavigation } from "../components/SceneNavigationContext";
import ProjectNotesDialog from "../components/ProjectNotesDialog";
import { projectNotes, type ProjectNoteId } from "../data/projectNotes";
import iNeloryVideo from "../assets/videos/Project video.mp4";
import nelumeVideo from "../assets/videos/Nelume video.mp4";
import intelliCliqVideo from "../assets/videos/IntelliCLIQ video.mp4";
import nemissiveVideo from "../assets/videos/Nemissive.mp4";
import "../styles/hall-of-creations.css";

type Project = {
  id: ProjectNoteId;
  title: string;
  descriptor: string;
  description: string;
  category: string;
  video: string;
  capabilities: readonly string[];
  technologies: readonly string[];
  liveUrl?: string;
  githubUrl?: string;
};

const projects: readonly Project[] = [
  {
    id: "nemissive",
    title: "Nemissive",
    descriptor: "Full-Stack Real-Time Messaging Application",
    category: "REALTIME + AUTHORIZED LIFECYCLES",
    video: nemissiveVideo,
    liveUrl: "https://nemissive.vercel.app",
    githubUrl: "https://github.com/jbta-sandrone/Nemissive",
    description: "A full-stack messaging application connecting direct and group conversations, private media, and voice/video calls through server-authorized lifecycles. This portfolio demo includes premium entitlements in Test Mode and a provider-dependent Ask AI workspace.",
    capabilities: ["Shared direct and group messaging", "Private media and LiveKit calls", "Authorization and premium lifecycles"],
    technologies: ["React", "TypeScript", "Supabase", "PostgreSQL", "Edge Functions", "LiveKit", "Lemon Squeezy"],
  },
  {
    id: "i-nelory",
    title: "I-Nelory",
    descriptor: "Personal Memory Journal",
    category: "PRIVATE MEMORY PLATFORM",
    video: iNeloryVideo,
    liveUrl: "https://i-neloryapp.vercel.app/",
    githubUrl: "https://github.com/jbta-sandrone/I-Nelory",
    description: "A private full-stack journal for saving, organizing, and rediscovering meaningful memories through cloud media storage and AI-powered natural-language search.",
    capabilities: ["Photo and video memories", "Albums and personal archive", "AI-powered memory search"],
    technologies: ["React", "TypeScript", "Express", "Prisma", "PostgreSQL", "Cloudinary", "Gemini AI"],
  },
  {
    id: "cliq",
    title: "IntelliCLIQ",
    descriptor: "AI-Powered Café Ordering Application",
    category: "ORDERING + RECOMMENDATIONS",
    video: intelliCliqVideo,
    liveUrl: "https://jbta-sandrone.github.io/IntelliCLIQ/",
    githubUrl: "https://github.com/jbta-sandrone/IntelliCLIQ",
    description: "A full-stack café ordering experience with customer and administrator workflows, order tracking, analytics, and guided AI-powered menu recommendations.",
    capabilities: ["Customer ordering flow", "Guided AI recommendations", "Admin reporting and management"],
    technologies: ["HTML", "CSS", "JavaScript", "Firebase", "Node.js", "Express", "Gemini AI"],
  },
  {
    id: "nelume",
    title: "Nelume",
    descriptor: "AI-Powered Career Assistant",
    category: "CAREER SUPPORT PLATFORM",
    video: nelumeVideo,
    liveUrl: "https://nelume.vercel.app/",
    githubUrl: "https://github.com/jbta-sandrone/Nelume",
    description: "An AI-powered career platform bringing together resume analysis and rewriting, cover-letter generation, interview preparation, and interactive learning resources.",
    capabilities: ["Resume analysis and rewriting", "Cover letters and interview practice", "AI-guided career resources"],
    technologies: ["React", "TypeScript", "Python", "FastAPI", "Gemini API", "Upstash Redis"],
  },
];

function useManagedVideoPlayback(videoRef: RefObject<HTMLVideoElement | null>, source: string, reducedMotion: boolean, paused: boolean) {
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let inView = false;
    const syncPlayback = () => {
      if (reducedMotion || paused || document.hidden || !inView || !video.getAttribute("src")) {
        video.pause();
        return;
      }
      void video.play().catch(() => {
        // Browser autoplay policies may block muted playback until user interaction.
      });
    };

    const loadingObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !video.getAttribute("src")) {
          // Keep off-screen MP4s out of the network queue until their case study approaches.
          video.src = source;
          video.load();
          // Loading and visibility observers can deliver in either order.
          syncPlayback();
        }
        if (video.getAttribute("src")) loadingObserver.unobserve(video);
      },
      { root: null, rootMargin: "200px 0px", threshold: 0 },
    );

    const playbackObserver = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        syncPlayback();
      },
      { root: null, threshold: 0.15 },
    );
    loadingObserver.observe(video);
    playbackObserver.observe(video);
    video.addEventListener("canplay", syncPlayback);
    document.addEventListener("visibilitychange", syncPlayback);
    return () => {
      loadingObserver.disconnect();
      playbackObserver.disconnect();
      video.removeEventListener("canplay", syncPlayback);
      document.removeEventListener("visibilitychange", syncPlayback);
      video.pause();
    };
  }, [videoRef, source, reducedMotion, paused]);
}

function ProjectVideo({ project, number, reducedMotion, notesOpen }: { project: Project; number: number; reducedMotion: boolean; notesOpen: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  useManagedVideoPlayback(videoRef, project.video, reducedMotion, notesOpen);

  return (
    <figure className="work-case__media">
      <div className="work-case__media-heading" aria-hidden="true">
        <span>VISUAL RECORD / {String(number).padStart(2, "0")}</span>
        <span>LOCAL PROJECT PREVIEW</span>
      </div>
      <div className="work-case__video-frame professional-media-frame">
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={`${project.title} project demonstration`}
        />
      </div>
      <figcaption className="work-case__media-caption">
        <span>{project.title.toUpperCase()} / PRODUCT WALKTHROUGH</span>
        <span>VIDEO / MUTED LOOP</span>
      </figcaption>
    </figure>
  );
}

function ProjectCase({ project, index, reducedMotion, notesOpen, onOpenNotes }: {
  project: Project;
  index: number;
  reducedMotion: boolean;
  notesOpen: boolean;
  onOpenNotes: (projectId: ProjectNoteId, button: HTMLButtonElement) => void;
}) {
  const number = index + 1;

  return (
    <motion.article
      aria-labelledby={`${project.id}-title`}
      className={`work-case ${index % 2 === 1 ? "work-case--reverse" : ""}`}
      initial={reducedMotion ? false : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ amount: 0.08, once: true }}
      transition={{ duration: reducedMotion ? 0.01 : 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <header className="work-case__heading">
        <p className="work-case__index professional-mono">PROJECT / {String(number).padStart(2, "0")} <span>—</span> {project.category}</p>
        <h3 id={`${project.id}-title`}>{project.title}</h3>
        <p className="work-case__descriptor">{project.descriptor}</p>
      </header>

      <div className="work-case__body">
        <ProjectVideo project={project} number={number} reducedMotion={reducedMotion} notesOpen={notesOpen} />

        <div className="work-case__information">
          <p className="work-case__description">{project.description}</p>

          <div className="work-case__info-block">
            <h4>KEY CAPABILITIES</h4>
            <ul className="work-case__capabilities">
              {project.capabilities.map((capability) => <li key={capability}>{capability}</li>)}
            </ul>
          </div>

          <div className="work-case__info-block">
            <h4>TECHNOLOGY</h4>
            <ul className="work-case__technologies" aria-label={`${project.title} technologies`}>
              {project.technologies.map((technology) => <li key={technology}>{technology}</li>)}
            </ul>
          </div>

          <div className="work-case__actions">
            {project.liveUrl && (
              <a className="professional-button professional-button--primary" href={project.liveUrl} target="_blank" rel="noopener noreferrer" aria-label={`Live Demo for ${project.title} (opens in a new tab)`}>
                Live Demo <ArrowUpRight size={17} aria-hidden="true" />
              </a>
            )}
            {project.githubUrl && (
              <a className="professional-button professional-button--secondary" href={project.githubUrl} target="_blank" rel="noopener noreferrer" aria-label={`GitHub for ${project.title} (opens in a new tab)`}>
                GitHub <ArrowUpRight size={17} aria-hidden="true" />
              </a>
            )}
            <button
              type="button"
              className="work-case__notes-action professional-link"
              onClick={(event) => onOpenNotes(project.id, event.currentTarget)}
              aria-label={`Project Notes for ${project.title}`}
            >
              <FileText size={17} aria-hidden="true" /> Project Notes
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function HallOfCreations() {
  const notesTriggerRef = useRef<HTMLButtonElement>(null);
  const [activeNotes, setActiveNotes] = useState<ProjectNoteId | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = prefersReducedMotion !== false;
  const { navigateToScene } = useSceneNavigation();

  const openNotes = (projectId: ProjectNoteId, button: HTMLButtonElement) => {
    notesTriggerRef.current = button;
    setActiveNotes(projectId);
  };

  return (
    <section
      id="featured-work"
      data-portfolio-section
      data-cinematic-scene={3}
      aria-labelledby="featured-work-title"
      className="selected-work professional-theme portfolio-section relative"
    >
      <div className="selected-work__guides" aria-hidden="true" />
      <div className="selected-work__layout professional-container professional-container--wide">
        <header className="selected-work__introduction">
          <div className="selected-work__marker professional-label professional-enter">
            <span>03 / SELECTED WORK</span><i aria-hidden="true" /><span>ENGINEERING CASE STUDIES</span>
          </div>
          <div className="selected-work__intro-grid">
            <h2 data-section-heading tabIndex={-1} id="featured-work-title" className="professional-heading professional-enter">Selected systems, <span>built around real needs.</span></h2>
            <p className="professional-body professional-enter">Four projects across real-time messaging, personal memory, café ordering, and career support. Each combines interface work with the systems behind it.</p>
          </div>
          <div className="selected-work__overview-line" aria-hidden="true">{projects.map((project, index) => <span key={project.id}>{String(index + 1).padStart(2, "0")}</span>)}</div>
          <a className="selected-work__explore professional-link" href="#nemissive-case" onClick={(event) => { event.preventDefault(); document.getElementById("nemissive-case")?.scrollIntoView({ behavior: reducedMotion ? "instant" : "smooth", block: "start" }); }}>
            Explore the work <ArrowDownRight size={18} aria-hidden="true" />
          </a>
        </header>

        <div className="selected-work__cases">
          {projects.map((project, index) => (
            <div id={`${project.id}-case`} key={project.id} className="selected-work__case-anchor">
              <ProjectCase
                project={project}
                index={index}
                reducedMotion={reducedMotion}
                notesOpen={activeNotes !== null}
                onOpenNotes={openNotes}
              />
            </div>
          ))}
        </div>

        <footer className="selected-work__exit">
          <div>
            <p className="professional-label">NEXT / WHAT I DO</p>
            <h3>From finished work to the services behind it.</h3>
          </div>
          <button type="button" className="professional-button professional-button--secondary" onClick={(event) => navigateToScene(3, { focus: event.detail === 0 })}>
            Continue to Services <ArrowUpRight size={17} aria-hidden="true" />
          </button>
        </footer>
      </div>

      <ProjectNotesDialog
        note={activeNotes ? projectNotes[activeNotes] : null}
        projectNumber={activeNotes ? projects.findIndex((project) => project.id === activeNotes) + 1 : 0}
        onClose={() => setActiveNotes(null)}
        returnFocusRef={notesTriggerRef}
      />
    </section>
  );
}

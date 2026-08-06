import { useEffect, useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
  type Variants,
} from "motion/react";
import { FaFacebookF, FaGithub, FaLinkedinIn } from "react-icons/fa";
import type { IconType } from "react-icons";
import { useSceneNavigation } from "../components/SceneNavigationContext";
import "../styles/journeys-horizon.css";

const horizonEase = [0.22, 1, 0.36, 1] as const;

const sceneDestinations = [
  { label: "Arrival", sceneIndex: 0 },
  { label: "Behind the Work", sceneIndex: 1 },
  { label: "Featured Work", sceneIndex: 2 },
  { label: "Quest Board", sceneIndex: 3 },
  { label: "Crafts", sceneIndex: 4 },
  { label: "Connections", sceneIndex: 5 },
  { label: "Journey’s Horizon", sceneIndex: 6 },
] as const;

type ConnectionLink = {
  label: string;
  href: string;
  cursorLabel: string;
  accessibleLabel: string;
  external?: boolean;
  icon: IconType;
};

const connectionLinks: readonly ConnectionLink[] = [
  {
    label: "GitHub",
    href: "https://github.com/jbta-sandrone",
    cursorLabel: "GitHub",
    accessibleLabel: "Open Jonel’s GitHub profile in a new tab",
    external: true,
    icon: FaGithub,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/jbtablog",
    cursorLabel: "LinkedIn",
    accessibleLabel: "Open Jonel’s LinkedIn profile in a new tab",
    external: true,
    icon: FaLinkedinIn,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/ablogjonel.21/",
    cursorLabel: "Facebook",
    accessibleLabel: "Open Jonel’s Facebook profile in a new tab",
    external: true,
    icon: FaFacebookF,
  },
] as const;

const stars = [
  [7, 8, 0.7, 0.2],
  [14, 20, 1, 1.4],
  [22, 11, 0.75, 2.6],
  [31, 25, 0.85, 0.8],
  [39, 7, 1, 3.1],
  [47, 19, 0.65, 1.9],
  [55, 10, 0.9, 0.4],
  [64, 24, 0.7, 2.3],
  [72, 6, 1, 1.1],
  [80, 18, 0.78, 3.6],
  [89, 9, 0.92, 2],
  [95, 27, 0.7, 0.7],
  [11, 34, 0.6, 3.8],
  [27, 39, 0.7, 1.6],
  [45, 33, 0.55, 2.9],
  [60, 38, 0.65, 0.3],
  [77, 35, 0.58, 2.1],
  [91, 41, 0.62, 1.2],
] as const;

const motes = [
  [12, 64, "0s"],
  [24, 74, "1.8s"],
  [35, 58, "3.1s"],
  [46, 80, "0.9s"],
  [58, 69, "4.2s"],
  [68, 77, "2.5s"],
  [79, 61, "5s"],
  [88, 72, "1.2s"],
] as const;

const revealVariants = (reducedMotion: boolean): Variants => ({
  hidden: reducedMotion ? { opacity: 0 } : { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: reducedMotion ? 0.12 : 0.62,
      ease: horizonEase,
      staggerChildren: reducedMotion ? 0.02 : 0.1,
    },
  },
});

const childVariants = (reducedMotion: boolean): Variants => ({
  hidden: reducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: reducedMotion ? 0.12 : 0.48,
      ease: horizonEase,
    },
  },
});

export default function JourneysHorizon() {
  const sceneRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = prefersReducedMotion !== false;
  const { navigateToScene, isTransitioning } = useSceneNavigation();
  const { scrollYProgress } = useScroll({ container: sceneRef });
  const skyY = useTransform(scrollYProgress, [0, 1], [0, -34]);
  const mountainY = useTransform(scrollYProgress, [0, 1], [0, -68]);
  const foregroundY = useTransform(scrollYProgress, [0, 1], [0, -104]);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const syncVisibility = () => {
      scene.classList.toggle("horizon-animation-paused", document.hidden);
    };

    syncVisibility();
    document.addEventListener("visibilitychange", syncVisibility);
    return () => document.removeEventListener("visibilitychange", syncVisibility);
  }, []);

  return (
    <section
      ref={sceneRef}
      data-cinematic-scene={6}
      data-scene-scroll
      aria-labelledby="scene-six-title"
      className="journey-horizon portfolio-scene relative h-full overflow-y-auto overflow-x-hidden overscroll-contain"
    >
      <HorizonEnvironment
        reducedMotion={reducedMotion}
        skyY={skyY}
        mountainY={mountainY}
        foregroundY={foregroundY}
      />

      <main className="horizon-content relative z-10">
        <DawnThreshold reducedMotion={reducedMotion} />
        <HorizonOverlook
          reducedMotion={reducedMotion}
          disabled={isTransitioning}
          onReturn={() => navigateToScene(0)}
          onConnect={() => navigateToScene(5)}
        />
      </main>

      <JourneyArchiveFooter
        disabled={isTransitioning}
        onNavigate={navigateToScene}
      />
    </section>
  );
}

type HorizonEnvironmentProps = {
  reducedMotion: boolean;
  skyY: MotionValue<number>;
  mountainY: MotionValue<number>;
  foregroundY: MotionValue<number>;
};

function HorizonEnvironment({
  reducedMotion,
  skyY,
  mountainY,
  foregroundY,
}: HorizonEnvironmentProps) {
  const depthStyle = (y: MotionValue<number>) =>
    reducedMotion ? undefined : { y };

  return (
    <div aria-hidden="true" className="horizon-environment pointer-events-none">
      <motion.div
        className="horizon-depth horizon-depth--sky"
        style={depthStyle(skyY)}
      >
        <div className="horizon-dawn-sky" />
        <div className="horizon-stars">
          {stars.map(([left, top, scale, delay], index) => (
            <span
              key={`${left}-${top}`}
              className={`horizon-star horizon-star--${(index % 3) + 1}`}
              style={{
                left: `${left}%`,
                top: `${top}%`,
                scale,
                animationDelay: `${delay}s`,
              }}
            />
          ))}
        </div>
        <div className="horizon-sun"><span /></div>
        <div className="horizon-cloud horizon-cloud--one"><i /></div>
        <div className="horizon-cloud horizon-cloud--two"><i /></div>
        <div className="horizon-cloud horizon-cloud--three"><i /></div>
        <div className="horizon-birds">
          <span /><span /><span />
        </div>
        <div className="horizon-airship">
          <i className="horizon-airship__balloon" />
          <i className="horizon-airship__basket" />
        </div>
      </motion.div>

      <motion.div
        className="horizon-depth horizon-depth--mountains"
        style={depthStyle(mountainY)}
      >
        <div className="horizon-mountain horizon-mountain--far" />
        <div className="horizon-mountain horizon-mountain--middle" />
        <div className="horizon-valley" />
        <WorldLandmarks />
        <div className="horizon-forest horizon-forest--far" />
        <div className="horizon-forest horizon-forest--near" />
        <div className="horizon-road horizon-road--distant" />
      </motion.div>

      <motion.div
        className="horizon-depth horizon-depth--foreground"
        style={depthStyle(foregroundY)}
      >
        <div className="horizon-cliff" />
        <div className="horizon-road horizon-road--near" />
        <PixelTree />
        <div className="horizon-resting-place">
          <span className="horizon-bench" />
          <span className="horizon-marker" />
        </div>
        <div className="horizon-grass horizon-grass--left" />
        <div className="horizon-grass horizon-grass--right" />
        <div className="horizon-flowers horizon-flowers--left">
          <i /><i /><i />
        </div>
        <div className="horizon-flowers horizon-flowers--right">
          <i /><i /><i />
        </div>
        <div className="horizon-motes">
          {motes.map(([left, top, delay]) => (
            <span
              key={`${left}-${top}`}
              style={{
                left: `${left}%`,
                top: `${top}%`,
                animationDelay: delay,
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function WorldLandmarks() {
  return (
    <div className="horizon-landmarks">
      <div className="horizon-landmark horizon-landmark--workshop">
        <span className="landmark-roof" />
        <span className="landmark-house" />
        <span className="landmark-chimney" />
        <i />
      </div>
      <div className="horizon-landmark horizon-landmark--hall">
        <span className="landmark-hall-tower" />
        <span className="landmark-hall-banner" />
      </div>
      <div className="horizon-landmark horizon-landmark--foundry">
        <span className="landmark-foundry-stack" />
        <span className="landmark-foundry-gear" />
      </div>
      <div className="horizon-landmark horizon-landmark--observatory">
        <span className="landmark-observatory-tower" />
        <span className="landmark-observatory-dish" />
        <i />
      </div>
    </div>
  );
}

function PixelTree() {
  return (
    <div className="horizon-tree">
      <span className="horizon-tree__trunk" />
      <span className="horizon-tree__branch horizon-tree__branch--one" />
      <span className="horizon-tree__branch horizon-tree__branch--two" />
      <span className="horizon-tree__crown horizon-tree__crown--one" />
      <span className="horizon-tree__crown horizon-tree__crown--two" />
      <span className="horizon-tree__crown horizon-tree__crown--three" />
      <span className="horizon-tree__crown horizon-tree__crown--four" />
    </div>
  );
}

function DawnThreshold({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <section className="horizon-threshold" aria-label="Arrival at the horizon">
      <div aria-hidden="true" className="horizon-observatory-exit">
        <span className="horizon-observatory-exit__tower" />
        <span className="horizon-observatory-exit__dish" />
        <span className="horizon-observatory-exit__light" />
        <span className="horizon-observatory-exit__steps" />
      </div>

      <motion.header
        variants={revealVariants(reducedMotion)}
        initial="hidden"
        whileInView="visible"
        viewport={{ amount: 0.5, once: true }}
        className="horizon-chapter"
      >
        <motion.div variants={childVariants(reducedMotion)} className="horizon-chapter__eyebrow">
          <span>Scene Seven</span>
          <i aria-hidden="true" />
          <span>End</span>
        </motion.div>
        <motion.h1
          id="scene-six-title"
          variants={childVariants(reducedMotion)}
          className="horizon-chapter__title"
        >
          The Journey’s Horizon
        </motion.h1>
        <motion.p
          variants={childVariants(reducedMotion)}
          className="horizon-chapter__subtitle"
        >
          Dawn reveals the road beyond this chapter.
        </motion.p>
        <motion.div
          variants={childVariants(reducedMotion)}
          className="horizon-threshold__direction"
          aria-hidden="true"
        >
          <span />
          <p>Follow the mountain path</p>
        </motion.div>
      </motion.header>
    </section>
  );
}

type HorizonOverlookProps = {
  reducedMotion: boolean;
  disabled: boolean;
  onReturn: () => void;
  onConnect: () => void;
};

function HorizonOverlook({
  reducedMotion,
  disabled,
  onReturn,
  onConnect,
}: HorizonOverlookProps) {
  return (
    <section className="horizon-overlook" aria-labelledby="journey-continues-title">
      <div className="horizon-overlook__stage" aria-hidden="true">
        <div className="horizon-viewpoint-rail"><i /><i /><i /></div>
        <PixelAdventurer />
        <div className="horizon-path-light"><span /></div>
      </div>

      <motion.article
        variants={revealVariants(reducedMotion)}
        initial="hidden"
        whileInView="visible"
        viewport={{ amount: 0.35, once: true }}
        className="horizon-ending-panel"
      >
        <PixelPanelCorners />
        <motion.div variants={childVariants(reducedMotion)} className="horizon-ending-panel__label">
          <JourneyGlyph type="compass" />
          <span>Traveler’s Journal</span>
        </motion.div>
        <motion.p variants={childVariants(reducedMotion)} className="horizon-ending-panel__location">
          The Journey’s Horizon
        </motion.p>
        <motion.h2
          id="journey-continues-title"
          variants={childVariants(reducedMotion)}
          className="horizon-ending-panel__title"
        >
          The Journey Continues
        </motion.h2>
        <motion.div variants={childVariants(reducedMotion)} className="horizon-ending-panel__copy">
          <p>Thank you for exploring my universe.</p>
          <p>
            I’m always learning, building, and preparing for the next adventure.
          </p>
        </motion.div>

        <motion.div variants={childVariants(reducedMotion)} className="horizon-actions">
          <button
            type="button"
            disabled={disabled}
            onClick={onReturn}
            data-cursor-label="Arrival"
            className="horizon-button horizon-button--primary"
          >
            <JourneyGlyph type="up" />
            <span>Return to Arrival</span>
          </button>
          <a
            href="/Jonel_Ablog_Resume.pdf"
            target="_blank"
            rel="noreferrer"
            aria-label="View Jonel Bryan Ablog’s résumé in a new tab"
            data-cursor-label="Resume"
            className="horizon-button horizon-button--secondary"
          >
            <JourneyGlyph type="scroll" />
            <span>View My Résumé</span>
          </a>
          <button
            type="button"
            disabled={disabled}
            onClick={onConnect}
            data-cursor-label="Connect"
            className="horizon-button horizon-button--secondary"
          >
            <JourneyGlyph type="signal" />
            <span>Let's Build Together</span>
          </button>
        </motion.div>
      </motion.article>
    </section>
  );
}

function PixelAdventurer() {
  return (
    <div className="pixel-adventurer">
      <span className="pixel-adventurer__sunline" />
      <span className="pixel-adventurer__head">
        <i className="pixel-adventurer__hair" />
      </span>
      <span className="pixel-adventurer__body" />
      <span className="pixel-adventurer__cloak" />
      <span className="pixel-adventurer__backpack" />
      <span className="pixel-adventurer__arm" />
      <span className="pixel-adventurer__book"><i /></span>
      <span className="pixel-adventurer__leg pixel-adventurer__leg--left" />
      <span className="pixel-adventurer__leg pixel-adventurer__leg--right" />
    </div>
  );
}

type JourneyArchiveFooterProps = {
  disabled: boolean;
  onNavigate: (sceneIndex: number) => void;
};

function JourneyArchiveFooter({
  disabled,
  onNavigate,
}: JourneyArchiveFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      id="journey-archive"
      aria-labelledby="journey-archive-title"
      className="journey-archive relative z-10"
    >
      <div aria-hidden="true" className="journey-archive__approach">
        <span className="journey-archive__path" />
        <span className="journey-archive__lantern journey-archive__lantern--left" />
        <span className="journey-archive__lantern journey-archive__lantern--right" />
      </div>

      <div className="journey-archive__board">
        <span aria-hidden="true" className="journey-archive__post journey-archive__post--left" />
        <span aria-hidden="true" className="journey-archive__post journey-archive__post--right" />
        <PixelPanelCorners />

        <div className="journey-archive__heading">
          <JourneyGlyph type="map" />
          <div>
            <p>Adventurer’s Record</p>
            <h2 id="journey-archive-title">Journey Archive</h2>
          </div>
          <span aria-hidden="true" className="journey-archive__seal">JB</span>
        </div>

        <div className="journey-archive__grid">
          <section className="journey-archive__identity" aria-labelledby="archive-identity-title">
            <p className="journey-archive__section-label">Traveler</p>
            <h3 id="archive-identity-title">Jonel Bryan Ablog</h3>
            <p>Software Developer building toward Software Engineering</p>
            <span className="journey-archive__stamp">The next chapter is being built.</span>
          </section>

          <nav className="journey-archive__navigation" aria-label="Journey navigation">
            <p className="journey-archive__section-label">World Map</p>
            <ul>
              {sceneDestinations.map((destination) => (
                <li key={destination.label}>
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => onNavigate(destination.sceneIndex)}
                    data-cursor-label={destination.label}
                    aria-label={`Go to ${destination.label}`}
                  >
                    <span aria-hidden="true" />
                    {destination.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="journey-archive__connections" aria-label="Connection links">
            <p className="journey-archive__section-label">Signal Routes</p>
            <ul>
              <li>
                <a
                  href="mailto:ablogjonelbryan@gmail.com"
                  data-cursor-label="Email"
                  aria-label="Email Jonel Bryan Ablog"
                >
                  <JourneyGlyph type="mail" />
                  <span>Email</span>
                </a>
              </li>
              {connectionLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noreferrer" : undefined}
                      data-cursor-label={link.cursorLabel}
                      aria-label={link.accessibleLabel}
                    >
                      <Icon aria-hidden="true" className="journey-archive__brand-icon" />
                      <span>{link.label}</span>
                    </a>
                  </li>
                );
              })}
              <li>
                <a
                  href="/Jonel_Ablog_Resume.pdf"
                  target="_blank"
                  rel="noreferrer"
                  data-cursor-label="Resume"
                  aria-label="View Jonel Bryan Ablog’s résumé in a new tab"
                >
                  <JourneyGlyph type="scroll" />
                  <span>Résumé</span>
                </a>
              </li>
            </ul>
          </nav>

          <section className="journey-archive__record" aria-labelledby="archive-record-title">
            <p className="journey-archive__section-label">Build Record</p>
            <h3 id="archive-record-title">Crafted with purpose</h3>
            <p>Designed and developed by Jonel Bryan Ablog.</p>
            <p>Built with React and TypeScript.</p>
            <button
              type="button"
              disabled={disabled}
              onClick={() => onNavigate(0)}
              data-cursor-label="Arrival"
              aria-label="Return to Arrival"
              className="journey-archive__return"
            >
              <JourneyGlyph type="up" />
              <span>Back to the Beginning</span>
            </button>
          </section>
        </div>

        <div className="journey-archive__legal">
          <span aria-hidden="true" />
          <p>© {currentYear} Jonel Bryan Ablog. All rights reserved.</p>
          <span aria-hidden="true" />
        </div>
      </div>

      <div aria-hidden="true" className="journey-archive__ground">
        <span /><span /><span /><span /><span />
      </div>
    </footer>
  );
}

function PixelPanelCorners() {
  return (
    <>
      <span aria-hidden="true" className="horizon-panel-corner horizon-panel-corner--tl" />
      <span aria-hidden="true" className="horizon-panel-corner horizon-panel-corner--tr" />
      <span aria-hidden="true" className="horizon-panel-corner horizon-panel-corner--bl" />
      <span aria-hidden="true" className="horizon-panel-corner horizon-panel-corner--br" />
    </>
  );
}

type JourneyGlyphType =
  | "compass"
  | "mail"
  | "map"
  | "scroll"
  | "signal"
  | "up";

function JourneyGlyph({ type }: { type: JourneyGlyphType }) {
  if (type === "compass") {
    return (
      <svg aria-hidden="true" className="journey-glyph" viewBox="0 0 24 24">
        <rect x="5" y="3" width="14" height="2" />
        <rect x="3" y="5" width="2" height="14" />
        <rect x="19" y="5" width="2" height="14" />
        <rect x="5" y="19" width="14" height="2" />
        <path d="M14 7l-1 5-5 4 1-5 5-4Z" />
      </svg>
    );
  }

  if (type === "mail") {
    return (
      <svg aria-hidden="true" className="journey-glyph" viewBox="0 0 24 24">
        <rect x="3" y="5" width="18" height="14" />
        <path className="journey-glyph__cut" d="M5 8l7 5 7-5v2l-7 5-7-5V8Z" />
      </svg>
    );
  }

  if (type === "map") {
    return (
      <svg aria-hidden="true" className="journey-glyph" viewBox="0 0 24 24">
        <path d="M3 5l6-2 6 2 6-2v16l-6 2-6-2-6 2V5Z" />
        <path className="journey-glyph__cut" d="M8 5h2v12H8V5Zm6 2h2v12h-2V7Z" />
      </svg>
    );
  }

  if (type === "scroll") {
    return (
      <svg aria-hidden="true" className="journey-glyph" viewBox="0 0 24 24">
        <path d="M5 3h13v3h2v15H7v-3H4V5h1V3Zm3 4v10h9V7H8Z" />
        <rect className="journey-glyph__cut" x="10" y="10" width="5" height="2" />
        <rect className="journey-glyph__cut" x="10" y="14" width="4" height="2" />
      </svg>
    );
  }

  if (type === "signal") {
    return (
      <svg aria-hidden="true" className="journey-glyph" viewBox="0 0 24 24">
        <rect x="10" y="16" width="4" height="5" />
        <rect x="8" y="20" width="8" height="2" />
        <rect x="11" y="10" width="2" height="4" />
        <path d="M7 7h2v2H7V7Zm8 0h2v2h-2V7ZM4 4h2v2H4V4Zm14 0h2v2h-2V4Z" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className="journey-glyph" viewBox="0 0 24 24">
      <path d="M11 3h2v3h3v2h3v2h-6v11h-2V10H5V8h3V6h3V3Z" />
    </svg>
  );
}

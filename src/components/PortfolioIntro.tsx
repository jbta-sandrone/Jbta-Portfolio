import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import chatbotAvatar from "../assets/images/aichatbot.webp";
import firstProjectPreview from "../assets/images/ineloryss.webp";
import { markPortfolioIntroSeen } from "./portfolioIntroSession";
import "../styles/portfolio-intro.css";

const criticalImages = [chatbotAvatar, firstProjectPreview] as const;
const readinessLabels = [
  "Application mounted",
  "Essential styles ready",
  "Document ready",
  "Fonts ready",
  "Critical assets ready",
  "Portfolio ready",
] as const;
const normalTiming = {
  // Readiness still gates reveal; this floor gives first-session visitors time to read.
  minimum: 3100,
  readyHold: 550,
  exit: 320,
  skipReveal: 4500,
} as const;
const reducedTiming = {
  minimum: 180,
  readyHold: 90,
  exit: 160,
  skipReveal: 700,
} as const;

type IntroPhase = "building" | "ready" | "exiting";
type PortfolioIntroProps = {
  onRevealStart: () => void;
  onComplete: () => void;
};

function preloadImage(source: string) {
  return new Promise<void>((resolve) => {
    const image = new Image();
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      image.onload = null;
      image.onerror = null;
      resolve();
    };
    image.onload = finish;
    image.onerror = finish;
    image.src = source;
    if (image.complete) finish();
  });
}
function waitForDocumentReady() {
  if (document.readyState === "complete") return Promise.resolve();
  return new Promise<void>((resolve) => {
    window.addEventListener("load", () => resolve(), { once: true });
  });
}
function waitForFontsReady() {
  return "fonts" in document
    ? document.fonts.ready.then(() => undefined)
    : Promise.resolve();
}
function waitForStylesReady() {
  return new Promise<void>((resolve) => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => resolve());
    });
  });
}
function waitForDuration(duration: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, duration);
  });
}

export default function PortfolioIntro({ onRevealStart, onComplete }: PortfolioIntroProps) {
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = prefersReducedMotion !== false;
  const timing = reducedMotion ? reducedTiming : normalTiming;
  const [phase, setPhase] = useState<IntroPhase>("building");
  const [completedMilestones, setCompletedMilestones] = useState(1);
  const [showSkip, setShowSkip] = useState(false);
  const phaseRef = useRef<IntroPhase>("building");
  const completedRef = useRef(false);
  const revealStartedRef = useRef(false);
  const essentialReadyRef = useRef(false);
  const skipRequestedRef = useRef(false);
  const timersRef = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  }, []);
  const schedule = useCallback((callback: () => void, delay: number) => {
    const timer = window.setTimeout(callback, delay);
    timersRef.current.push(timer);
    return timer;
  }, []);
  const revealArrival = useCallback(() => {
    if (revealStartedRef.current) return;
    revealStartedRef.current = true;
    onRevealStart();
  }, [onRevealStart]);
  const beginExit = useCallback(() => {
    if (phaseRef.current === "exiting") return;
    clearTimers();
    revealArrival();
    markPortfolioIntroSeen();
    phaseRef.current = "exiting";
    setCompletedMilestones(readinessLabels.length);
    setShowSkip(false);
    setPhase("exiting");
  }, [clearTimers, revealArrival]);
  const beginReady = useCallback(() => {
    if (phaseRef.current !== "building") return;
    revealArrival();
    phaseRef.current = "ready";
    setCompletedMilestones(readinessLabels.length);
    setShowSkip(false);
    setPhase("ready");
    schedule(beginExit, timing.readyHold);
  }, [beginExit, revealArrival, schedule, timing.readyHold]);

  const skipIntro = () => {
    skipRequestedRef.current = true;
    if (essentialReadyRef.current) beginExit();
  };

  useEffect(() => {
    let cancelled = false;
    const essentialTasks = [waitForStylesReady(), waitForDocumentReady()];
    const readinessTasks = [
      ...essentialTasks,
      waitForFontsReady(),
      Promise.all(criticalImages.map(preloadImage)).then(() => undefined),
    ];
    Promise.allSettled(essentialTasks).then(() => {
      if (cancelled) return;
      essentialReadyRef.current = true;
      if (skipRequestedRef.current) beginExit();
    });
    readinessTasks.forEach((task, index) => {
      task.then(() => {
        if (!cancelled) {
          setCompletedMilestones((current) =>
            Math.max(current, Math.min(index + 2, readinessLabels.length - 1)),
          );
        }
      });
    });
    Promise.all([
      Promise.allSettled(readinessTasks),
      waitForDuration(timing.minimum),
    ]).then(() => {
      if (!cancelled) beginReady();
    });
    if (!reducedMotion) schedule(() => setShowSkip(true), timing.skipReveal);
    return () => {
      cancelled = true;
      clearTimers();
    };
  }, [beginExit, beginReady, clearTimers, reducedMotion, schedule, timing.minimum, timing.skipReveal]);

  const finish = () => {
    if (phaseRef.current !== "exiting" || completedRef.current) return;
    completedRef.current = true;
    onComplete();
  };
  const status = phase === "building" ? "Preparing portfolio" : "Portfolio ready";

  return (
    <motion.section
      aria-label="Loading Jonel's portfolio"
      aria-busy={phase !== "exiting"}
      className={`portfolio-intro portfolio-intro--${phase}`}
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === "exiting" ? 0 : 1 }}
      transition={{ duration: phase === "exiting" ? timing.exit / 1000 : 0, ease: "linear" }}
      onAnimationComplete={finish}
    >
      <div className="portfolio-intro__grid" aria-hidden="true" />
      <div className="portfolio-intro__frame">
        <div className="portfolio-intro__topline">
          <span>JBA / PORTFOLIO</span>
          <span>SOFTWARE ENGINEERING</span>
        </div>
        <div className="portfolio-intro__content">
          <span className="portfolio-intro__index">PORTFOLIO / {new Date().getFullYear()}</span>
          <h1>Jonel Bryan Ablog</h1>
          <p>Software engineering portfolio</p>
        </div>
        <div className="portfolio-intro__readiness">
          <div className="portfolio-intro__status">
            <span aria-live="polite" aria-atomic="true">{status}</span>
            <span aria-hidden="true">{String(completedMilestones).padStart(2, "0")} / {String(readinessLabels.length).padStart(2, "0")}</span>
          </div>
          <div
            className="portfolio-intro__progress"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={readinessLabels.length}
            aria-valuenow={completedMilestones}
            aria-valuetext={readinessLabels[Math.max(0, completedMilestones - 1)]}
            aria-label="Portfolio readiness"
          >
            <span style={{ width: `${completedMilestones / readinessLabels.length * 100}%` }} />
          </div>
        </div>
      </div>
      {showSkip && phase === "building" && (
        <button
          type="button"
          aria-label="Skip portfolio introduction"
          data-cursor-label="Skip intro"
          onClick={skipIntro}
          className="portfolio-intro__skip"
        >Skip intro <span aria-hidden="true">→</span></button>
      )}
    </motion.section>
  );
}

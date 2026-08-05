import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
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
  "Scene One and application ready",
] as const;

const stageMessages = [
  "Preparing the journey...",
  "Mapping the world...",
  "Raising the mountains...",
  "Opening the path...",
  "Adventure ready.",
] as const;

const normalTiming = {
  minimum: 4_000,   // Intro plays for at least 4 seconds
  maximum: 7_000,   // Force completion after 7 seconds
  readyHold: 1500,   // Hold “The Journey Begins” before exiting
  exit: 700,        // Fade-out duration
  skipReveal: 4_500, 
} as const;

const reducedTiming = {
  minimum: 180,
  maximum: 900,
  readyHold: 90,
  exit: 160,
  skipReveal: 700,
} as const;

type IntroPhase = "building" | "ready" | "exiting";

type PortfolioIntroProps = {
  onRevealStart: () => void;
  onComplete: () => void;
};

const flowers = [
  { left: "8%", color: "#ffe08a", delay: "0.82s" },
  { left: "17%", color: "#f9a8d4", delay: "0.94s" },
  { left: "29%", color: "#c4b5fd", delay: "1.02s" },
  { left: "68%", color: "#fde68a", delay: "1.08s" },
  { left: "81%", color: "#f9a8d4", delay: "1.17s" },
  { left: "92%", color: "#c4b5fd", delay: "1.25s" },
] as const;

const motes = [
  ["11%", "28%", "-0.8s"],
  ["23%", "43%", "-2.1s"],
  ["36%", "25%", "-3.4s"],
  ["52%", "35%", "-1.5s"],
  ["65%", "23%", "-4.3s"],
  ["77%", "42%", "-2.7s"],
  ["89%", "30%", "-0.3s"],
] as const;

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

function getStageMessage(completedMilestones: number, phase: IntroPhase) {
  if (phase !== "building" || completedMilestones >= readinessLabels.length) {
    return stageMessages[4];
  }
  if (completedMilestones <= 1) return stageMessages[0];
  if (completedMilestones <= 3) return stageMessages[1];
  if (completedMilestones === 4) return stageMessages[2];
  return stageMessages[3];
}

export default function PortfolioIntro({
  onRevealStart,
  onComplete,
}: PortfolioIntroProps) {
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = prefersReducedMotion !== false;
  const timing = reducedMotion ? reducedTiming : normalTiming;
  const [phase, setPhase] = useState<IntroPhase>("building");
  const [completedMilestones, setCompletedMilestones] = useState(1);
  const [showSkip, setShowSkip] = useState(false);
  const phaseRef = useRef<IntroPhase>("building");
  const completedRef = useRef(false);
  const revealStartedRef = useRef(false);
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

  useEffect(() => {
    let cancelled = false;

    const readinessTasks = [
      waitForStylesReady(),
      waitForDocumentReady(),
      waitForFontsReady(),
      Promise.all(criticalImages.map(preloadImage)).then(() => undefined),
    ];

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

    schedule(beginReady, timing.maximum);

    if (!reducedMotion) {
      schedule(() => setShowSkip(true), timing.skipReveal);
    }

    return () => {
      cancelled = true;
      clearTimers();
    };
  }, [
    beginReady,
    clearTimers,
    reducedMotion,
    schedule,
    timing.maximum,
    timing.minimum,
    timing.skipReveal,
  ]);

  const finish = () => {
    if (phaseRef.current !== "exiting" || completedRef.current) return;
    completedRef.current = true;
    onComplete();
  };

  const statusMessage = getStageMessage(completedMilestones, phase);

  return (
    <motion.section
      aria-label="Loading Jonel’s portfolio"
      aria-busy={phase !== "exiting"}
      className={`pixel-intro pixel-intro--${phase} ${
        reducedMotion ? "pixel-intro--reduced" : ""
      }`}
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === "exiting" ? 0 : 1 }}
      transition={{
        duration: phase === "exiting" ? timing.exit / 1_000 : 0,
        ease: "linear",
      }}
      onAnimationComplete={finish}
    >
      <PixelWorldBuild />

      <div className="pixel-intro__story">
        <div className="pixel-intro__title-wrap" aria-hidden={phase === "building"}>
          <p className="pixel-intro__chapter">Opening Chapter</p>
          <h1>The Journey Begins</h1>
          <p>Entering Jonel’s World...</p>
          <span className="pixel-intro__completion-sparkle" aria-hidden="true" />
        </div>

        <div className="pixel-intro__status">
          <p aria-live="polite" aria-atomic="true">
            {statusMessage}
          </p>
          <PixelLoadingPath completedMilestones={completedMilestones} />
        </div>
      </div>

      <PixelWalkingAdventurer ready={phase !== "building"} />

      <div aria-hidden="true" className="pixel-intro__sunrise-wash" />

      {showSkip && phase === "building" && (
        <button
          type="button"
          aria-label="Skip portfolio introduction"
          data-cursor-label="Skip Intro"
          onClick={beginExit}
          className="pixel-intro__skip"
        >
          Skip Intro
        </button>
      )}
    </motion.section>
  );
}

function PixelWorldBuild() {
  return (
    <div aria-hidden="true" className="pixel-intro__world">
      <div className="pixel-intro__predawn" />
      <div className="pixel-intro__sky-tiles">
        <span /><span /><span /><span /><span /><span />
      </div>
      <span className="pixel-intro__last-star" />
      <div className="pixel-intro__sun"><span /></div>

      <div className="pixel-intro__cloud pixel-intro__cloud--one">
        <span /><span /><span />
      </div>
      <div className="pixel-intro__cloud pixel-intro__cloud--two">
        <span /><span /><span />
      </div>

      <svg
        className="pixel-intro__mountains"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        shapeRendering="crispEdges"
      >
        <path
          className="pixel-intro__mountain pixel-intro__mountain--far"
          d="M0 520 120 420l68 45 138-153 89 99 114-170 121 170 95-110 126 143 100-98 154 164 115-74 120 99v365H0Z"
        />
        <path
          className="pixel-intro__mountain pixel-intro__mountain--near"
          d="M0 588c142-57 236-71 354-18 114 51 204-19 326-23 134-4 202 68 338 38 167-37 274-16 422 50v265H0Z"
        />
        <path
          className="pixel-intro__hill"
          d="M0 653c151-63 273-22 391-5 137 21 219-54 361-31 155 26 240 70 388 25 109-33 207-10 300 31v227H0Z"
        />
      </svg>

      <div className="pixel-intro__ground">
        <span className="pixel-intro__grass pixel-intro__grass--back" />
        <span className="pixel-intro__grass pixel-intro__grass--front" />
        {flowers.map((flower) => (
          <i
            key={flower.left}
            className="pixel-intro__flower"
            style={{
              left: flower.left,
              "--intro-flower": flower.color,
              animationDelay: flower.delay,
            } as CSSProperties}
          />
        ))}
      </div>

      <div className="pixel-intro__birds"><span /><span /><span /></div>
      <div className="pixel-intro__motes">
        {motes.map(([left, top, delay]) => (
          <span
            key={`${left}-${top}`}
            style={{ left, top, animationDelay: delay }}
          />
        ))}
      </div>
    </div>
  );
}

function PixelLoadingPath({
  completedMilestones,
}: {
  completedMilestones: number;
}) {
  return (
    <div
      className="pixel-intro__route"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={readinessLabels.length}
      aria-valuenow={completedMilestones}
      aria-valuetext={readinessLabels[Math.max(0, completedMilestones - 1)]}
      aria-label="Journey preparation"
    >
      {readinessLabels.map((label, index) => (
        <span
          key={label}
          className={index < completedMilestones ? "is-ready" : ""}
          title={label}
        />
      ))}
    </div>
  );
}

function PixelWalkingAdventurer({ ready }: { ready: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={`pixel-intro-traveler-track ${ready ? "is-ready" : ""}`}
    >
      <div className="pixel-intro-adventurer">
        <span className="pixel-intro-adventurer__head">
          <i className="pixel-intro-adventurer__hair" />
        </span>
        <span className="pixel-intro-adventurer__body" />
        <span className="pixel-intro-adventurer__cloak" />
        <span className="pixel-intro-adventurer__backpack" />
        <span className="pixel-intro-adventurer__arm" />
        <span className="pixel-intro-adventurer__tool"><i /></span>
        <span className="pixel-intro-adventurer__leg pixel-intro-adventurer__leg--front" />
        <span className="pixel-intro-adventurer__leg pixel-intro-adventurer__leg--back" />
      </div>
      <div className="pixel-intro-footsteps">
        <span /><span /><span /><span />
      </div>
    </div>
  );
}

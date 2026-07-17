import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import chatbotAvatar from "../assets/images/aichatbot.webp";
import eclipseBackground from "../assets/images/animebg.webp";
import firstProjectPreview from "../assets/images/ineloryss.webp";

export const PORTFOLIO_INTRO_SESSION_KEY = "jbta-portfolio-intro-seen";

const introMessages = [
  "Initializing flight systems...",
  "Charting the creative route...",
  "Entering Jonel’s universe...",
] as const;

const normalTiming = {
  minimum: 5000,
  maximum: 6000,
  arrival: 700,
  exit: 900,
  messages: [0, 1800, 3800],
};

const reducedTiming = {
  minimum: 650,
  maximum: 800,
  arrival: 100,
  exit: 250,
  messages: [0, 280, 520],
} as const;

const criticalImages = [
  eclipseBackground,
  chatbotAvatar,
  firstProjectPreview,
] as const;

const introEase = [0.65, 0, 0.35, 1] as const;

type IntroPhase = "loading" | "arriving" | "exiting";

type PortfolioIntroProps = {
  onRevealStart: () => void;
  onComplete: () => void;
};

type IntroStar = {
  left: number;
  top: number;
  size: number;
  x: number;
  y: number;
  duration: number;
  delay: number;
};

const introStars: readonly IntroStar[] = Array.from(
  { length: 32 },
  (_, index) => {
    const angle = (((index * 137.5 + 18) % 360) * Math.PI) / 180;
    const distance = 13 + ((index * 17) % 34);
    const travel = 12 + (index % 6) * 4;

    return {
      left: 50 + Math.cos(angle) * distance,
      top: 50 + Math.sin(angle) * distance * 0.72,
      size: 1 + (index % 3) * 0.55,
      x: Math.cos(angle) * travel,
      y: Math.sin(angle) * travel * 0.72,
      duration: 4.8 + (index % 7) * 0.42,
      delay: (index % 9) * -0.58,
    };
  },
);

export function shouldShowPortfolioIntro() {
  try {
    return window.sessionStorage.getItem(PORTFOLIO_INTRO_SESSION_KEY) !== "true";
  } catch {
    return true;
  }
}

function markPortfolioIntroSeen() {
  try {
    window.sessionStorage.setItem(PORTFOLIO_INTRO_SESSION_KEY, "true");
  } catch {
    // If storage is unavailable, the intro still exits normally.
  }
}

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

export default function PortfolioIntro({
  onRevealStart,
  onComplete,
}: PortfolioIntroProps) {
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = Boolean(prefersReducedMotion);
  const timing = reducedMotion ? reducedTiming : normalTiming;
  const [phase, setPhase] = useState<IntroPhase>("loading");
  const [messageIndex, setMessageIndex] = useState(0);
  const phaseRef = useRef<IntroPhase>("loading");
  const timersRef = useRef<number[]>([]);
  const completedRef = useRef(false);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  }, []);

  const schedule = useCallback((callback: () => void, delay: number) => {
    const timer = window.setTimeout(callback, delay);
    timersRef.current.push(timer);
    return timer;
  }, []);

  const beginExit = useCallback(() => {
    if (phaseRef.current === "exiting") return;

    clearTimers();
    phaseRef.current = "exiting";
    setMessageIndex(introMessages.length - 1);
    setPhase("exiting");
    markPortfolioIntroSeen();
    onRevealStart();
  }, [clearTimers, onRevealStart]);

  const beginArrival = useCallback(() => {
    if (phaseRef.current !== "loading") return;

    clearTimers();
    phaseRef.current = "arriving";
    setMessageIndex(introMessages.length - 1);
    setPhase("arriving");
    schedule(beginExit, timing.arrival);
  }, [beginExit, clearTimers, schedule, timing.arrival]);

  useEffect(() => {
    let cancelled = false;

    const readiness = Promise.all([
      waitForDocumentReady(),
      ...criticalImages.map(preloadImage),
    ]);
    const minimumDuration = new Promise<void>((resolve) => {
      schedule(resolve, timing.minimum);
    });

    timing.messages.slice(1).forEach((delay, index) => {
      schedule(() => setMessageIndex(index + 1), delay);
    });

    Promise.all([readiness, minimumDuration]).then(() => {
      if (!cancelled) beginArrival();
    });

    schedule(beginArrival, timing.maximum);

    return () => {
      cancelled = true;
      clearTimers();
    };
  }, [beginArrival, clearTimers, schedule, timing.maximum, timing.messages, timing.minimum]);

  const finish = () => {
    if (phaseRef.current !== "exiting" || completedRef.current) return;
    completedRef.current = true;
    onComplete();
  };

  const statusMotion = reducedMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        initial: { opacity: 0, y: 8, filter: "blur(3px)" },
        animate: { opacity: 1, y: 0, filter: "blur(0px)" },
        exit: { opacity: 0, y: -6, filter: "blur(2px)" },
      };

  return (
    <motion.section
      aria-label="Loading Jonel’s portfolio"
      className="fixed inset-0 z-[90] h-[100dvh] min-h-[100svh] overflow-hidden bg-[#020205] text-[var(--portfolio-text-soft)]"
      initial={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      animate={
        phase === "exiting"
          ? {
              opacity: 0,
              scale: reducedMotion ? 1 : 1.012,
              filter: reducedMotion ? "blur(0px)" : "blur(8px)",
            }
          : { opacity: 1, scale: 1, filter: "blur(0px)" }
      }
      transition={{
        duration: phase === "exiting" ? timing.exit / 1_000 : 0.3,
        ease: introEase,
      }}
      onAnimationComplete={finish}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_44%,rgba(30,26,34,0.72),rgba(4,5,11,0.94)_48%,#020205_78%)] md:bg-[radial-gradient(circle_at_50%_52%,rgba(30,26,34,0.72),rgba(4,5,11,0.94)_48%,#020205_78%)]"
      />

      {!reducedMotion && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          {introStars.map((star, index) => (
            <motion.span
              key={index}
              className={`absolute rounded-full bg-stone-100 shadow-[0_0_5px_rgba(253,230,138,0.32)] ${
                index >= 26
                  ? "hidden lg:block"
                  : index >= 18
                    ? "hidden sm:block"
                    : "block"
              }`}
              style={{
                left: `${star.left}%`,
                top: `${star.top}%`,
                width: star.size,
                height: star.size,
              }}
              animate={{
                x: [0, star.x],
                y: [0, star.y],
                scale: [0.72, 1.15],
                opacity: [0.12, 0.62, 0.08],
              }}
              transition={{
                duration: star.duration,
                delay: star.delay,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </div>
      )}

      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute left-1/2 top-[18%] size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--portfolio-accent-bright)] md:top-[48%]"
          animate={
            reducedMotion
              ? { opacity: 0.72 }
              : phase === "arriving"
                ? {
                    scale: 16,
                    opacity: 0.9,
                    boxShadow: "0 0 38px 18px rgba(252,211,77,0.42)",
                  }
                : {
                    scale: [0.82, 1.08, 0.82],
                    opacity: [0.55, 0.9, 0.55],
                    boxShadow: "0 0 24px 8px rgba(252,211,77,0.24)",
                  }
          }
          transition={
            phase === "arriving"
              ? { duration: timing.arrival / 1_000, ease: introEase }
              : { duration: 3.8, repeat: reducedMotion ? 0 : Infinity, ease: "easeInOut" }
          }
        />
        <motion.div
          className="absolute left-1/2 top-[18%] size-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(253,230,138,0.13)] md:top-[48%] md:size-32"
          animate={
            reducedMotion
              ? { opacity: 0.34 }
              : { rotate: 360, scale: [0.94, 1.04, 0.94], opacity: [0.22, 0.45, 0.22] }
          }
          transition={{ duration: 12, repeat: reducedMotion ? 0 : Infinity, ease: "linear" }}
        >
          <span className="absolute left-1/2 top-0 h-2 w-px -translate-x-1/2 bg-[rgba(253,230,138,0.5)]" />
          <span className="absolute bottom-0 left-1/2 h-2 w-px -translate-x-1/2 bg-[rgba(253,230,138,0.3)]" />
        </motion.div>

        <div className="absolute left-[10%] right-[10%] top-[18%] h-px bg-gradient-to-r from-transparent via-[rgba(253,230,138,0.14)] to-transparent md:left-[15%] md:right-[15%] md:top-[48%]" />
        <div className="absolute inset-x-[5%] top-[6%] h-[72%] rounded-[44%] border border-[rgba(254,243,199,0.1)] shadow-[inset_0_0_70px_rgba(0,0,0,0.48)] md:inset-x-[4%] md:h-[82%]" />
        <div className="absolute inset-x-0 top-0 h-[19%] bg-gradient-to-b from-black/85 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-[20%] bg-gradient-to-t from-black/90 to-transparent" />
        <div className="absolute bottom-[8%] left-[7%] hidden items-center gap-2 sm:flex">
          {[0, 1, 2].map((item) => (
            <span
              key={item}
              className={`size-1 rounded-full ${
                item === 0
                  ? "bg-[var(--portfolio-accent)] shadow-[0_0_9px_var(--portfolio-glow)]"
                  : "bg-stone-500/45"
              }`}
            />
          ))}
        </div>
      </div>

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[18%] aspect-square w-[min(125vw,48rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(254,243,199,0.7)_0%,rgba(252,211,77,0.23)_18%,rgba(245,158,11,0.06)_45%,transparent_70%)] md:top-[48%]"
        animate={
          phase === "arriving"
            ? { opacity: 0.72, scale: 1.12 }
            : phase === "exiting"
              ? { opacity: 0.34, scale: 1.18 }
              : { opacity: 0, scale: 0.72 }
        }
        transition={{ duration: reducedMotion ? 0.16 : timing.arrival / 1_000, ease: introEase }}
      />

      <div className="absolute inset-x-5 top-[54%] mx-auto flex max-w-md -translate-y-1/2 flex-col items-center text-center sm:inset-x-8 md:top-[69%]">
        <div className="mb-5 flex items-center gap-2 rounded-full border border-[var(--portfolio-border-subtle)] bg-black/30 px-3 py-1.5 backdrop-blur-md">
          <motion.span
            aria-hidden="true"
            className="size-1.5 rounded-full bg-[var(--portfolio-accent)] shadow-[0_0_10px_var(--portfolio-glow)]"
            animate={reducedMotion ? undefined : { opacity: [0.48, 1, 0.48] }}
            transition={{ duration: 2.2, repeat: reducedMotion ? 0 : Infinity, ease: "easeInOut" }}
          />
          <span className="text-[0.58rem] font-semibold uppercase tracking-[0.24em] text-stone-300">
            Flight path 01
          </span>
        </div>

        <div aria-live="polite" aria-atomic="true" className="min-h-12 w-full">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={messageIndex}
              className="text-sm font-medium tracking-[0.08em] text-stone-100 sm:text-base"
              initial={statusMotion.initial}
              animate={statusMotion.animate}
              exit={statusMotion.exit}
              transition={{ duration: reducedMotion ? 0.12 : 0.38, ease: introEase }}
            >
              {introMessages[messageIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="mt-3 w-full max-w-xs">
          <div className="h-px overflow-hidden bg-stone-700/55">
            <motion.div
              className="h-full origin-left bg-gradient-to-r from-amber-700/70 via-[var(--portfolio-accent)] to-[var(--portfolio-accent-bright)] shadow-[0_0_10px_var(--portfolio-glow)]"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: phase === "loading" ? 0.86 : 1 }}
              transition={{
                duration:
                  phase === "loading"
                    ? reducedMotion
                      ? 0.58
                      : 3.1
                    : reducedMotion
                      ? 0.1
                      : 0.36,
                ease: phase === "loading" ? "linear" : introEase,
              }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-[0.52rem] font-semibold uppercase tracking-[0.18em] text-stone-500">
            <span>Departure</span>
            <span className={phase === "loading" ? "text-stone-500" : "text-amber-200/80"}>
              Arrival
            </span>
          </div>
        </div>
      </div>

      <button
        type="button"
        aria-label="Skip portfolio introduction"
        data-cursor-label="Skip Intro"
        onClick={beginExit}
        className="portfolio-focus absolute min-h-11 rounded-full border border-[var(--portfolio-border-subtle)] bg-black/35 px-4 py-2 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-stone-300 backdrop-blur-md transition-[border-color,color,background-color,transform] duration-[250ms] hover:-translate-y-0.5 hover:border-[var(--portfolio-border)] hover:bg-black/50 hover:text-[var(--portfolio-accent-bright)] active:translate-y-0 active:scale-[0.98]"
        style={{
          right: "max(1rem, calc(env(safe-area-inset-right) + 0.75rem))",
          bottom: "max(1rem, calc(env(safe-area-inset-bottom) + 0.75rem))",
        }}
      >
        Skip intro
      </button>
    </motion.section>
  );
}

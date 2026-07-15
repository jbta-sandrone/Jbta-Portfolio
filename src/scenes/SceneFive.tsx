import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FocusEvent as ReactFocusEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowUpRight,
  Check,
  Copy,
  FileText,
  Mail,
} from "lucide-react";
import {
  AnimatePresence,
  animate,
  motion,
  useIsPresent,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
  type Variants,
} from "motion/react";
import type { IconType } from "react-icons";
import { FaFacebookF, FaGithub, FaLinkedinIn } from "react-icons/fa";

type ConnectionType = "email" | "profile" | "resume";
type ConnectionIcon = LucideIcon | IconType;
type CopyStatus = "copied" | "failed";

type ConnectionItem = {
  id: string;
  label: string;
  shortLabel: string;
  value: string;
  href: string;
  icon: ConnectionIcon;
  type: ConnectionType;
  external: boolean;
  copyValue?: string;
  description: string;
  actionLabel: string;
  brandColor: string;
};

// Replace these placeholder values with verified destinations before publishing.
const connectionItems: readonly ConnectionItem[] = [
  {
    id: "email",
    label: "Start a Conversation",
    shortLabel: "Email",
    value: "hello@example.com",
    href: "mailto:hello@example.com",
    icon: Mail,
    type: "email",
    external: false,
    copyValue: "hello@example.com",
    description: "Share what you are building, exploring, or imagining, and let us begin there.",
    actionLabel: "Send Email",
    brandColor: "#fcd34d",
  },
  {
    id: "github",
    label: "Explore My Code",
    shortLabel: "GitHub",
    value: "https://github.com/your-username",
    href: "https://github.com/your-username",
    icon: FaGithub,
    type: "profile",
    external: true,
    copyValue: "https://github.com/your-username",
    description: "Browse the systems, experiments, and product work behind this portfolio.",
    actionLabel: "Open GitHub",
    brandColor: "#f5f5f5",
  },
  {
    id: "linkedin",
    label: "Let's Connect",
    shortLabel: "LinkedIn",
    value: "https://www.linkedin.com/in/your-profile",
    href: "https://www.linkedin.com/in/your-profile",
    icon: FaLinkedinIn,
    type: "profile",
    external: true,
    copyValue: "https://www.linkedin.com/in/your-profile",
    description: "Connect professionally and follow the next chapter of my work and growth.",
    actionLabel: "Open LinkedIn",
    brandColor: "#0a66c2",
  },
  {
    id: "facebook",
    label: "Find Me on Facebook",
    shortLabel: "Facebook",
    value: "https://www.facebook.com/your-profile",
    href: "https://www.facebook.com/your-profile",
    icon: FaFacebookF,
    type: "profile",
    external: true,
    copyValue: "https://www.facebook.com/your-profile",
    description: "A more personal place to stay connected beyond projects and professional updates.",
    actionLabel: "Open Facebook",
    brandColor: "#1877f2",
  },
  {
    id: "resume",
    label: "Professional Resume",
    shortLabel: "Resume",
    value: "jonel-bryan-ablog-resume.pdf",
    href: "/jonel-bryan-ablog-resume.pdf",
    icon: FileText,
    type: "resume",
    external: true,
    description: "View my experience, education, projects, and technical background.",
    actionLabel: "View Resume",
    brandColor: "#fde68a",
  },
] as const;

const cinematicEase = [0.65, 0, 0.35, 1] as const;
const revealEase = [0.22, 1, 0.36, 1] as const;
const towerCycleEase = [0.45, 0.05, 0.55, 0.95] as const;
const TABLET_LOADING_MS = 340;
const TOWER_CYCLE_SECONDS = 5.2;
const TOWER_ENTRANCE_DELAY_MS = 900;
const INTERACTION_GRACE_MS = 450;

const towerFloors = [
  { top: "16%", width: "18%", rotate: -2.4 },
  { top: "25%", width: "26%", rotate: 2.1 },
  { top: "35%", width: "36%", rotate: -2.8 },
  { top: "46%", width: "47%", rotate: 2.4 },
  { top: "57%", width: "58%", rotate: -2.2 },
  { top: "68%", width: "68%", rotate: 2.7 },
  { top: "79%", width: "78%", rotate: -2.1 },
  { top: "89%", width: "88%", rotate: 1.8 },
] as const;

const towerBraces = [
  { top: "29%", width: "32%", rotate: 21 },
  { top: "40%", width: "42%", rotate: -19 },
  { top: "52%", width: "54%", rotate: 18 },
  { top: "64%", width: "66%", rotate: -16 },
  { top: "76%", width: "76%", rotate: 14 },
  { top: "86%", width: "84%", rotate: -12 },
] as const;

const towerTravelLights = [
  { delay: 0.4, duration: 7.4, x: -2 },
  { delay: 3.1, duration: 8.2, x: 2 },
] as const;

const revealVariants: Variants = {
  hidden: { opacity: 0, y: 14, filter: "blur(7px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.68, ease: revealEase },
  },
};

const reducedRevealVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.18 } },
};

const towerRevealVariants: Variants = {
  hidden: {},
  visible: {
    transition: { delayChildren: 0.48, staggerChildren: 0.07 },
  },
};

const towerItemRevealVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.48, ease: revealEase },
  },
};

function getWrappedIndex(index: number) {
  const total = connectionItems.length;
  return ((index % total) + total) % total;
}

function getContinuousRelativeIndex(index: number, towerPosition: number) {
  const total = connectionItems.length;
  const rawRelativeIndex = index - towerPosition;

  return (
    ((rawRelativeIndex + total / 2) % total + total) % total - total / 2
  );
}

function getNearestVirtualPosition(currentPosition: number, targetIndex: number) {
  const total = connectionItems.length;
  const normalizedPosition = ((currentPosition % total) + total) % total;
  let distance = targetIndex - normalizedPosition;

  if (distance > total / 2) distance -= total;
  if (distance < -total / 2) distance += total;
  return currentPosition + distance;
}

export default function SceneFive() {
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = Boolean(prefersReducedMotion);
  const isPresent = useIsPresent();
  const sectionRef = useRef<HTMLElement>(null);
  const tabletRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [loading, setLoading] = useState(false);
  const [copyResult, setCopyResult] = useState<{ id: string; status: CopyStatus } | null>(null);
  const [tabletPressed, setTabletPressed] = useState(false);
  const [sceneIntersecting, setSceneIntersecting] = useState(true);
  const [documentVisible, setDocumentVisible] = useState(true);
  const [rotationReady, setRotationReady] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [rotationCycle, setRotationCycle] = useState(0);
  const activeIndexRef = useRef(0);
  const centerPositionRef = useRef(0);
  const pauseReasonsRef = useRef(new Set<string>());
  const inputModalityRef = useRef<"keyboard" | "pointer">("pointer");
  const sceneCanAnimateRef = useRef(true);
  const loadTimerRef = useRef<number | null>(null);
  const copyTimerRef = useRef<number | null>(null);
  const interactionGraceTimerRef = useRef<number | null>(null);
  const entranceTimerRef = useRef<number | null>(null);
  const autoAnimationRef = useRef<ReturnType<typeof animate> | null>(null);
  const manualAnimationRef = useRef<ReturnType<typeof animate> | null>(null);
  const manualTargetRef = useRef<{
    position: number;
    index: number;
    direction: 1 | -1;
  } | null>(null);
  const towerPosition = useMotionValue(0);

  const activeItem = connectionItems[activeIndex];

  const setPauseReason = useCallback((reason: string, paused: boolean) => {
    const reasons = pauseReasonsRef.current;
    const wasPaused = reasons.size > 0;

    if (paused) reasons.add(reason);
    else reasons.delete(reason);

    const nextPaused = reasons.size > 0;
    if (nextPaused !== wasPaused) setIsPaused(nextPaused);
  }, []);

  const clearInteractionGrace = useCallback(() => {
    if (interactionGraceTimerRef.current !== null) {
      window.clearTimeout(interactionGraceTimerRef.current);
      interactionGraceTimerRef.current = null;
    }
    setPauseReason("grace", false);
  }, [setPauseReason]);

  const scheduleInteractionResume = useCallback(() => {
    clearInteractionGrace();
    setPauseReason("grace", true);
    interactionGraceTimerRef.current = window.setTimeout(() => {
      setPauseReason("grace", false);
      interactionGraceTimerRef.current = null;
    }, INTERACTION_GRACE_MS);
  }, [clearInteractionGrace, setPauseReason]);

  const commitActiveIndex = useCallback(
    (nextIndex: number, travelDirection: 1 | -1) => {
      const wrappedIndex = getWrappedIndex(nextIndex);
      if (wrappedIndex === activeIndexRef.current) return;

      activeIndexRef.current = wrappedIndex;
      setDirection(travelDirection);
      setCopyResult(null);
      setLoading(true);
      setActiveIndex(wrappedIndex);

      if (loadTimerRef.current !== null) window.clearTimeout(loadTimerRef.current);
      loadTimerRef.current = window.setTimeout(
        () => setLoading(false),
        reducedMotion ? 120 : TABLET_LOADING_MS,
      );
    },
    [reducedMotion],
  );

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setSceneIntersecting(Boolean(entry?.isIntersecting && entry.intersectionRatio >= 0.2));
      },
      { threshold: [0, 0.2, 0.6] },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const syncDocumentVisibility = () => {
      setDocumentVisible(document.visibilityState === "visible");
    };

    syncDocumentVisibility();
    document.addEventListener("visibilitychange", syncDocumentVisibility);
    return () => document.removeEventListener("visibilitychange", syncDocumentVisibility);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setRotationReady(false);
      return;
    }

    entranceTimerRef.current = window.setTimeout(
      () => setRotationReady(true),
      TOWER_ENTRANCE_DELAY_MS,
    );

    return () => {
      if (entranceTimerRef.current !== null) window.clearTimeout(entranceTimerRef.current);
    };
  }, [reducedMotion]);

  useEffect(() => {
    const markKeyboardInput = () => {
      inputModalityRef.current = "keyboard";
    };
    const markPointerInput = () => {
      inputModalityRef.current = "pointer";
    };

    window.addEventListener("keydown", markKeyboardInput, true);
    window.addEventListener("pointerdown", markPointerInput, true);
    return () => {
      window.removeEventListener("keydown", markKeyboardInput, true);
      window.removeEventListener("pointerdown", markPointerInput, true);
    };
  }, []);

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = document.getSelection();
      const anchorNode = selection?.anchorNode;
      const selectionInsideTablet = Boolean(
        selection &&
          !selection.isCollapsed &&
          anchorNode &&
          tabletRef.current?.contains(anchorNode),
      );

      setPauseReason("selection", selectionInsideTablet);
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    return () => document.removeEventListener("selectionchange", handleSelectionChange);
  }, [setPauseReason]);

  useEffect(
    () => () => {
      autoAnimationRef.current?.stop();
      manualAnimationRef.current?.stop();
      if (loadTimerRef.current !== null) window.clearTimeout(loadTimerRef.current);
      if (copyTimerRef.current !== null) window.clearTimeout(copyTimerRef.current);
      if (interactionGraceTimerRef.current !== null) {
        window.clearTimeout(interactionGraceTimerRef.current);
      }
      if (entranceTimerRef.current !== null) window.clearTimeout(entranceTimerRef.current);
    },
    [],
  );

  const sceneCanAnimate = isPresent && sceneIntersecting && documentVisible;
  const ambientMotionEnabled = sceneCanAnimate && !reducedMotion;

  const runManualTarget = useCallback(
    (target: { position: number; index: number; direction: 1 | -1 }) => {
      if (!sceneCanAnimateRef.current && !reducedMotion) return;

      manualAnimationRef.current?.stop();
      const currentPosition = towerPosition.get();
      const distance = Math.abs(target.position - currentPosition);

      const completeTarget = () => {
        if (manualTargetRef.current?.position !== target.position) return;

        centerPositionRef.current = target.position;
        manualTargetRef.current = null;
        manualAnimationRef.current = null;
        commitActiveIndex(target.index, target.direction);
        setPauseReason("navigation", false);
        scheduleInteractionResume();
        setRotationCycle((cycle) => cycle + 1);
      };

      if (distance < 0.001) {
        towerPosition.set(target.position);
        completeTarget();
        return;
      }

      if (reducedMotion) {
        const controls = animate(towerPosition, target.position, {
          duration: 0.18,
          ease: "easeOut",
          onComplete: completeTarget,
        });
        manualAnimationRef.current = controls;
        return;
      }

      const controls = animate(towerPosition, target.position, {
        duration: Math.min(1.65, Math.max(0.48, distance * 0.72)),
        ease: cinematicEase,
        onComplete: completeTarget,
      });
      manualAnimationRef.current = controls;
    },
    [commitActiveIndex, reducedMotion, scheduleInteractionResume, setPauseReason, towerPosition],
  );

  useEffect(() => {
    sceneCanAnimateRef.current = sceneCanAnimate;

    if (!sceneCanAnimate) {
      autoAnimationRef.current?.stop();
      autoAnimationRef.current = null;
      manualAnimationRef.current?.stop();
      manualAnimationRef.current = null;
      return;
    }

    if (manualTargetRef.current) runManualTarget(manualTargetRef.current);
  }, [runManualTarget, sceneCanAnimate]);

  const navigateToIndex = useCallback(
    (nextIndex: number) => {
      const wrappedIndex = getWrappedIndex(nextIndex);
      const currentPosition = towerPosition.get();
      const targetPosition = getNearestVirtualPosition(currentPosition, wrappedIndex);
      const travelDirection: 1 | -1 = targetPosition >= currentPosition ? 1 : -1;
      const target = {
        position: targetPosition,
        index: wrappedIndex,
        direction: travelDirection,
      };

      clearInteractionGrace();
      setPauseReason("navigation", true);
      setCopyResult(null);
      autoAnimationRef.current?.stop();
      autoAnimationRef.current = null;
      manualAnimationRef.current?.stop();
      manualTargetRef.current = target;
      runManualTarget(target);
    },
    [clearInteractionGrace, runManualTarget, setPauseReason, towerPosition],
  );

  const autoRotationEnabled =
    rotationReady &&
    sceneCanAnimate &&
    !isPaused &&
    !reducedMotion &&
    manualTargetRef.current === null;

  useEffect(() => {
    if (!autoRotationEnabled) {
      autoAnimationRef.current?.stop();
      autoAnimationRef.current = null;
      return;
    }

    const currentPosition = towerPosition.get();
    const targetPosition = centerPositionRef.current + 1;
    const distance = Math.max(0.001, targetPosition - currentPosition);
    const controls = animate(towerPosition, targetPosition, {
      duration: distance * TOWER_CYCLE_SECONDS,
      ease: towerCycleEase,
      onComplete: () => {
        if (autoAnimationRef.current !== controls) return;

        centerPositionRef.current = targetPosition;
        autoAnimationRef.current = null;
        commitActiveIndex(Math.round(targetPosition), 1);
      },
    });

    autoAnimationRef.current = controls;
    return () => {
      controls.stop();
      if (autoAnimationRef.current === controls) autoAnimationRef.current = null;
    };
  }, [activeIndex, autoRotationEnabled, commitActiveIndex, rotationCycle, towerPosition]);

  const copyConnectionValue = async (item: ConnectionItem) => {
    if (!item.copyValue) return;

    clearInteractionGrace();
    setPauseReason("copy", true);
    if (copyTimerRef.current !== null) window.clearTimeout(copyTimerRef.current);

    try {
      if (!navigator.clipboard) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(item.copyValue);
      setCopyResult({ id: item.id, status: "copied" });
    } catch {
      setCopyResult({ id: item.id, status: "failed" });
    } finally {
      setPauseReason("copy", false);
      scheduleInteractionResume();
    }

    copyTimerRef.current = window.setTimeout(() => setCopyResult(null), 1800);
  };

  const handleTabletPointerEnter = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    clearInteractionGrace();
    setPauseReason("hover", true);
  };

  const handleTabletPointerLeave = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    setPauseReason("hover", false);
    scheduleInteractionResume();
  };

  const handleTabletPointerDown = () => {
    inputModalityRef.current = "pointer";
    clearInteractionGrace();
    setPauseReason("pointer", true);
    setTabletPressed(true);
  };

  const handleTabletPointerEnd = () => {
    setPauseReason("pointer", false);
    setTabletPressed(false);
    scheduleInteractionResume();
  };

  const handleTabletFocus = () => {
    if (inputModalityRef.current !== "keyboard") return;
    clearInteractionGrace();
    setPauseReason("focus", true);
  };

  const handleTowerItemFocus = () => {
    if (inputModalityRef.current !== "keyboard") return;
    clearInteractionGrace();
    setPauseReason("tower-focus", true);
  };

  const handleTowerItemBlur = () => {
    setPauseReason("tower-focus", false);
    scheduleInteractionResume();
  };

  const handleTabletBlur = (event: ReactFocusEvent<HTMLDivElement>) => {
    if (
      event.relatedTarget instanceof Node &&
      event.currentTarget.contains(event.relatedTarget)
    ) {
      return;
    }
    setPauseReason("focus", false);
    scheduleInteractionResume();
  };

  const handleTabletKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    inputModalityRef.current = "keyboard";
    if (event.key === "Enter" || event.key === " ") setTabletPressed(true);
  };

  const handleTabletKeyUp = () => {
    setTabletPressed(false);
  };

  const headingSequence: Variants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: reducedMotion ? 0.04 : 0.16,
        staggerChildren: reducedMotion ? 0.03 : 0.09,
      },
    },
  };

  return (
    <section
      ref={sectionRef}
      data-cinematic-scene="5"
      data-scene-scroll
      aria-labelledby="scene-five-title"
      className="portfolio-scene relative h-full overflow-x-hidden overflow-y-auto overscroll-contain"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="portfolio-scene-glow absolute inset-0 opacity-65" />
        <div className="absolute inset-x-[8%] top-[30%] h-px bg-gradient-to-r from-transparent via-[rgba(252,211,77,0.18)] to-transparent" />
        <motion.span
          className="absolute left-1/2 top-[24%] size-1.5 rounded-full bg-[var(--portfolio-accent-bright)] shadow-[0_0_18px_rgba(252,211,77,0.78)] md:left-[23%]"
          initial={{ opacity: 0, x: -3, y: reducedMotion ? 0 : -42 }}
          animate={{ opacity: reducedMotion ? 0.2 : [0, 0.9, 0], y: reducedMotion ? 0 : [-42, 38, 58] }}
          transition={{ duration: reducedMotion ? 0.18 : 1, delay: 0.08, ease: cinematicEase }}
        />
        <motion.span
          className="absolute left-1/2 top-[37%] size-2 rounded-full bg-[var(--portfolio-accent)] shadow-[0_0_22px_rgba(252,211,77,0.72)]"
          animate={
            isPresent
              ? { opacity: 0, x: -4, scale: 1, y: 0 }
              : reducedMotion
                ? { opacity: 0, x: -4 }
                : { opacity: [0, 0.9, 0], x: -4, scale: [0.4, 1, 0.2], y: [0, -22, -48] }
          }
          transition={{ duration: reducedMotion ? 0.14 : 0.34, ease: "easeOut" }}
        />
      </div>

      <div className="relative mx-auto flex min-h-full w-full max-w-7xl flex-col px-5 pb-28 pt-9 sm:px-8 sm:pb-24 sm:pt-11 lg:px-10 lg:pb-20 lg:pt-12">
        <motion.header
          className="mx-auto w-full max-w-3xl text-center"
          variants={headingSequence}
          initial="hidden"
          animate="visible"
        >
          <motion.p className="portfolio-eyebrow portfolio-eyebrow text-[0.68rem] font-semibold uppercase tracking-[0.3em] sm:text-xs" variants={reducedMotion ? reducedRevealVariants : revealVariants}>
            Scene 05 - Connection
          </motion.p>
          <motion.h1 id="scene-five-title" className="portfolio-heading mt-2.5 text-3xl font-semibold tracking-tight sm:text-2xl lg:text-4xl" variants={reducedMotion ? reducedRevealVariants : revealVariants}>
            Beyond This Journey
          </motion.h1>
          
          <motion.p className="portfolio-copy mx-auto mt-3.5 max-w-2xl" variants={reducedMotion ? reducedRevealVariants : revealVariants}>
            Every meaningful project begins with a conversation.
          </motion.p>
        </motion.header>

        <div className="mt-6 grid flex-1 items-center gap-7 md:grid-cols-[minmax(17rem,0.78fr)_minmax(0,1.22fr)] md:gap-8 lg:mt-7 lg:grid-cols-[minmax(21rem,0.76fr)_minmax(0,1.24fr)] lg:gap-10">
          <div className="relative mx-auto h-[31rem] w-full max-w-[25rem] md:h-[36rem] lg:h-[39rem]">
            <motion.div
              aria-hidden="true"
              className="absolute left-[58%] right-[-2.5rem] top-1/2 z-0 hidden h-px bg-gradient-to-r from-[rgba(252,211,77,0.5)] via-[rgba(252,211,77,0.2)] to-transparent md:block"
              animate={
                !ambientMotionEnabled
                  ? { opacity: 0.35 }
                  : { opacity: [0.24, 0.55, 0.24], scaleX: [0.96, 1, 0.96] }
              }
              transition={{ duration: 4.8, repeat: ambientMotionEnabled ? Number.POSITIVE_INFINITY : 0, ease: "easeInOut" }}
            >
              <span className="absolute right-0 top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-[var(--portfolio-accent)] shadow-[0_0_12px_var(--portfolio-glow)]" />
            </motion.div>

            <div
              role="group"
              aria-label="Continuously rotating connection tower"
              className="portfolio-focus relative z-10 h-full overflow-hidden"
            >
              <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                <motion.div
                  className="absolute inset-x-[12%] bottom-[5%] top-[7%] bg-[radial-gradient(ellipse_at_center,rgba(252,211,77,0.13),transparent_67%)] blur-xl"
                  animate={!ambientMotionEnabled ? { opacity: 0.55 } : { opacity: [0.42, 0.68, 0.42] }}
                  transition={{ duration: 6.8, repeat: ambientMotionEnabled ? Number.POSITIVE_INFINITY : 0, ease: "easeInOut" }}
                />

                <div className="absolute inset-x-[7%] bottom-[7%] top-[8%] overflow-hidden bg-[linear-gradient(105deg,rgba(255,255,255,0.015),rgba(252,211,77,0.075),rgba(255,255,255,0.02))] [clip-path:polygon(48%_0%,52%_0%,59%_18%,68%_42%,79%_70%,94%_100%,6%_100%,21%_70%,32%_42%,41%_18%)]">
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,7,6,0.72),rgba(53,43,29,0.2)_46%,rgba(12,11,9,0.64))]" />
                  <motion.div
                    className="absolute inset-y-0 w-[22%] -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.055] to-transparent"
                    animate={
                      !ambientMotionEnabled
                        ? { opacity: 0, x: "-140%" }
                        : { opacity: [0, 0.75, 0], x: ["-140%", "520%", "520%"] }
                    }
                    transition={{ duration: 9, repeat: ambientMotionEnabled ? Number.POSITIVE_INFINITY : 0, repeatDelay: 4.5, ease: "easeInOut" }}
                  />
                </div>

                <div className="absolute left-1/2 top-[1.5%] h-[13%] w-px -translate-x-1/2 bg-gradient-to-t from-[rgba(253,230,138,0.72)] to-transparent shadow-[0_0_8px_rgba(252,211,77,0.28)]" />
                <span className="absolute left-1/2 top-[1.5%] size-1 -translate-x-1/2 rounded-full bg-[var(--portfolio-accent-bright)] shadow-[0_0_12px_rgba(252,211,77,0.78)]" />
                <div className="absolute bottom-[7%] left-1/2 top-[9%] w-px -translate-x-1/2 bg-gradient-to-b from-[rgba(253,230,138,0.7)] via-[rgba(252,211,77,0.3)] to-[rgba(253,230,138,0.56)] shadow-[0_0_9px_rgba(252,211,77,0.16)]" />

                <div className="absolute bottom-[8%] left-[18%] h-[68%] w-px origin-bottom rotate-[13deg] bg-gradient-to-t from-[rgba(253,230,138,0.35)] to-transparent" />
                <div className="absolute bottom-[8%] right-[18%] h-[68%] w-px origin-bottom -rotate-[13deg] bg-gradient-to-t from-[rgba(253,230,138,0.35)] to-transparent" />
                <div className="absolute bottom-[8%] left-[31%] h-[80%] w-px origin-bottom rotate-[7deg] bg-gradient-to-t from-[rgba(255,255,255,0.16)] to-transparent" />
                <div className="absolute bottom-[8%] right-[31%] h-[80%] w-px origin-bottom -rotate-[7deg] bg-gradient-to-t from-[rgba(255,255,255,0.16)] to-transparent" />

                {towerFloors.map((floor) => (
                  <span
                    key={floor.top}
                    className="absolute left-1/2 h-px bg-gradient-to-r from-transparent via-[rgba(253,230,138,0.38)] to-transparent"
                    style={{
                      top: floor.top,
                      width: floor.width,
                      transform: `translateX(-50%) rotate(${floor.rotate}deg)`,
                    }}
                  />
                ))}

                {towerBraces.map((brace) => (
                  <motion.span
                    key={brace.top}
                    className="absolute left-1/2 h-px origin-center bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.14)] to-[rgba(252,211,77,0.28)]"
                    style={{
                      top: brace.top,
                      width: brace.width,
                      transform: `translateX(-50%) rotate(${brace.rotate}deg)`,
                    }}
                    animate={!ambientMotionEnabled ? { opacity: 0.45 } : { opacity: [0.28, 0.62, 0.28] }}
                    transition={{
                      duration: 5.6,
                      delay: Number.parseFloat(brace.top) * 0.035,
                      repeat: ambientMotionEnabled ? Number.POSITIVE_INFINITY : 0,
                      ease: "easeInOut",
                    }}
                  />
                ))}

                {towerTravelLights.map((light) => (
                  <motion.span
                    key={light.delay}
                    className="absolute bottom-[10%] size-1 rounded-full bg-[var(--portfolio-accent-bright)] shadow-[0_0_12px_rgba(252,211,77,0.72)]"
                    style={{ left: `calc(50% + ${light.x}px)` }}
                    animate={
                      !ambientMotionEnabled
                        ? { opacity: 0.28 }
                        : { opacity: [0, 0.9, 0], y: [0, -480] }
                    }
                    transition={{
                      duration: light.duration,
                      delay: light.delay,
                      repeat: ambientMotionEnabled ? Number.POSITIVE_INFINITY : 0,
                      ease: "linear",
                    }}
                  />
                ))}

                <div className="absolute bottom-[3.5%] left-1/2 h-[7%] w-[88%] -translate-x-1/2 bg-[linear-gradient(180deg,rgba(253,230,138,0.12),rgba(10,9,7,0.7))] [clip-path:polygon(16%_0%,84%_0%,100%_100%,0%_100%)]" />
                <div className="absolute bottom-[3.5%] left-1/2 h-px w-[88%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[rgba(253,230,138,0.48)] to-transparent" />
              </div>

              <motion.div
                className="absolute inset-x-0 bottom-14 top-14 z-20"
                variants={reducedMotion ? undefined : towerRevealVariants}
                initial={reducedMotion ? undefined : "hidden"}
                animate={reducedMotion ? undefined : "visible"}
                style={{ perspective: 950 }}
              >
                {connectionItems.map((item, index) => (
                  <TowerSocialPlatform
                    key={item.id}
                    item={item}
                    index={index}
                    towerPosition={towerPosition}
                    active={activeIndex === index}
                    reducedMotion={reducedMotion}
                    isPresent={isPresent}
                    onActivate={navigateToIndex}
                    onFocus={handleTowerItemFocus}
                    onBlur={handleTowerItemBlur}
                  />
                ))}
              </motion.div>
            </div>
          </div>

          <div className="sr-only" aria-live="polite" aria-atomic="true">
            {loading
              ? `Loading ${activeItem.shortLabel} connection details.`
              : `${activeItem.shortLabel} is centered. Connection details loaded.`}
          </div>

          <motion.div
            ref={tabletRef}
            id="connection-tablet"
            className="relative z-10 mx-auto h-[25rem] w-full max-w-[52rem] sm:h-auto sm:aspect-[16/10] md:h-[24rem] md:aspect-auto lg:h-auto lg:aspect-[16/10]"
            initial={
              reducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 48, scale: 0.94, filter: "blur(10px)" }
            }
            animate={
              isPresent
                ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
                : reducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: 30, scale: 0.975, filter: "blur(5px)" }
            }
            transition={{ duration: reducedMotion ? 0.18 : isPresent ? 0.72 : 0.32, ease: cinematicEase }}
            onPointerEnter={handleTabletPointerEnter}
            onPointerLeave={handleTabletPointerLeave}
            onPointerDownCapture={handleTabletPointerDown}
            onPointerUpCapture={handleTabletPointerEnd}
            onPointerCancel={handleTabletPointerEnd}
            onFocusCapture={handleTabletFocus}
            onBlurCapture={handleTabletBlur}
            onKeyDownCapture={handleTabletKeyDown}
            onKeyUpCapture={handleTabletKeyUp}
          >
            <motion.div
              className="h-full w-full"
              animate={
                !ambientMotionEnabled || tabletPressed
                  ? { y: 0 }
                  : { y: [0, -3, 0] }
              }
              transition={
                !ambientMotionEnabled || tabletPressed
                  ? { duration: 0.16, ease: "easeOut" }
                  : { duration: 6.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }
              }
            >
              <div className="relative h-full rounded-[1.75rem] border border-[rgba(253,230,138,0.32)] bg-[linear-gradient(145deg,#25201a_0%,#0c0b09_45%,#211b14_100%)] p-2 shadow-[0_28px_80px_rgba(0,0,0,0.5),0_0_34px_rgba(252,211,77,0.13),inset_0_1px_0_rgba(255,255,255,0.12)] sm:p-3">
                <span
                  aria-hidden="true"
                  className="absolute left-1/2 top-1 z-20 size-1.5 -translate-x-1/2 rounded-full border border-white/15 bg-black shadow-[0_0_5px_rgba(255,255,255,0.12)] sm:top-1.5"
                />

                <div
                  role="region"
                  aria-label={`${activeItem.shortLabel} connection screen`}
                  aria-busy={loading}
                  className="relative h-full overflow-hidden rounded-[1.25rem] border border-white/10 bg-[rgba(8,7,6,0.94)]"
                >
                  <motion.div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 z-20 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.035] to-transparent"
                    animate={
                      !ambientMotionEnabled
                        ? { opacity: 0, x: "-150%" }
                        : { opacity: [0, 0.65, 0], x: ["-150%", "320%", "320%"] }
                    }
                    transition={{ duration: 7.5, repeat: ambientMotionEnabled ? Number.POSITIVE_INFINITY : 0, repeatDelay: 4, ease: "easeInOut" }}
                  />

                  <AnimatePresence mode="wait" initial={false} custom={direction}>
                    {loading ? (
                      <motion.div
                        key={`loading-${activeItem.id}`}
                        className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#070605]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: reducedMotion ? 0.1 : 0.14 }}
                      >
                        <motion.span
                          aria-hidden="true"
                          className="size-2 rounded-full bg-[var(--portfolio-accent)] shadow-[0_0_16px_rgba(252,211,77,0.55)]"
                          animate={!ambientMotionEnabled ? undefined : { opacity: [0.35, 1, 0.35], scale: [0.85, 1, 0.85] }}
                          transition={{ duration: 0.9, repeat: ambientMotionEnabled ? Number.POSITIVE_INFINITY : 0, ease: "easeInOut" }}
                        />
                        <motion.span
                          aria-hidden="true"
                          className="h-px w-16 origin-left bg-gradient-to-r from-[var(--portfolio-accent)] to-transparent"
                          initial={{ scaleX: 0.12, opacity: 0.4 }}
                          animate={reducedMotion ? { opacity: 0.6 } : { scaleX: [0.12, 1], opacity: [0.4, 0.9] }}
                          transition={{ duration: reducedMotion ? 0.1 : 0.46, ease: cinematicEase }}
                        />
                      </motion.div>
                    ) : (
                      <TabletScreen
                        key={`content-${activeItem.id}`}
                        item={activeItem}
                        direction={direction}
                        copyResult={copyResult}
                        reducedMotion={reducedMotion}
                        onCopy={copyConnectionValue}
                      />
                    )}
                  </AnimatePresence>

                  <TabletDock
                    activeIndex={activeIndex}
                    reducedMotion={reducedMotion}
                    onSelect={navigateToIndex}
                  />

                  <motion.div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-30 bg-black"
                    animate={{ opacity: isPresent ? 0 : 1 }}
                    transition={{ duration: reducedMotion ? 0.12 : 0.24, ease: "easeOut" }}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <ConnectionProgress
          activeIndex={activeIndex}
          direction={direction}
          reducedMotion={reducedMotion}
        />
      </div>
    </section>
  );
}

type ConnectionProgressProps = {
  activeIndex: number;
  direction: 1 | -1;
  reducedMotion: boolean;
};

function ConnectionProgress({
  activeIndex,
  direction,
  reducedMotion,
}: ConnectionProgressProps) {
  const activeItem = connectionItems[activeIndex];
  const current = String(activeIndex + 1).padStart(2, "0");
  const total = String(connectionItems.length).padStart(2, "0");

  return (
    <div className="pointer-events-none mt-8 flex min-h-4 w-full items-center justify-start gap-3 whitespace-nowrap md:absolute md:bottom-6 md:left-8 md:mt-0 md:w-auto lg:left-12 xl:left-16">
      <span className="portfolio-muted text-[0.6rem] font-semibold uppercase tracking-[0.2em] tabular-nums">
        {current} / {total}
      </span>

      <div className="flex items-center gap-1.5" aria-hidden="true">
        {connectionItems.map((item, index) => {
          const active = index === activeIndex;

          return (
            <motion.span
              key={item.id}
              className={`h-1 rounded-full ${
                active ? "portfolio-progress-active" : "portfolio-progress-idle"
              }`}
              animate={{ width: active ? 24 : 6, opacity: active ? 1 : 0.78 }}
              transition={{
                duration: reducedMotion ? 0.16 : 0.3,
                ease: cinematicEase,
              }}
            />
          );
        })}
      </div>

      <div className="relative hidden h-3.5 min-w-20 overflow-hidden sm:block">
        <AnimatePresence initial={false} custom={direction}>
          <motion.span
            key={activeItem.id}
            custom={direction}
            className="portfolio-eyebrow absolute inset-0 text-[0.58rem] font-semibold uppercase tracking-[0.18em]"
            initial={
              reducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: direction * 5 }
            }
            animate={{ opacity: 1, y: 0 }}
            exit={
              reducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: direction * -5 }
            }
            transition={{
              duration: reducedMotion ? 0.16 : 0.3,
              ease: cinematicEase,
            }}
          >
            {activeItem.shortLabel}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}

type TowerSocialPlatformProps = {
  item: ConnectionItem;
  index: number;
  towerPosition: MotionValue<number>;
  active: boolean;
  reducedMotion: boolean;
  isPresent: boolean;
  onActivate: (index: number) => void;
  onFocus: () => void;
  onBlur: () => void;
};

function TowerSocialPlatform({
  item,
  index,
  towerPosition,
  active,
  reducedMotion,
  isPresent,
  onActivate,
  onFocus,
  onBlur,
}: TowerSocialPlatformProps) {
  const Icon = item.icon;
  const relativePosition = useTransform(towerPosition, (position) =>
    getContinuousRelativeIndex(index, position),
  );
  const depth = useTransform(relativePosition, (relative) => Math.abs(relative));
  const x = useTransform(relativePosition, (relative) => {
    if (reducedMotion) return 0;
    const amplitude = 68 + Math.max(relative, 0) * 4;
    return Math.sin(relative * Math.PI * 0.75) * amplitude;
  });
  const y = useTransform(relativePosition, (relative) => relative * 94);
  const z = useTransform(depth, (value) => (reducedMotion ? 0 : value * -92));
  const scale = useTransform(depth, (value) => Math.max(0.62, 1 - value * 0.15));
  const opacity = useTransform(depth, (value) => {
    if (value <= 2) return 1 - value * 0.3;
    return Math.max(0, 0.4 - (value - 2) * 0.9);
  });
  const rotateY = useTransform(x, (value) =>
    reducedMotion ? 0 : value * -0.23,
  );
  const rotateZ = useTransform(relativePosition, (relative) =>
    reducedMotion ? 0 : relative * 1.1,
  );
  const filter = useTransform(depth, (value) =>
    reducedMotion ? "blur(0px)" : `blur(${(value * 1.6).toFixed(2)}px)`,
  );
  const zIndex = useTransform(depth, (value) => Math.round(50 - value * 10));
  const borderColor = useTransform(depth, (value) => {
    const frontness = Math.max(0, 1 - value);
    return `rgba(253,230,138,${(0.14 + frontness * 0.54).toFixed(3)})`;
  });
  const boxShadow = useTransform(depth, (value) => {
    const frontness = Math.max(0, 1 - value);
    return `0 14px 38px rgba(0,0,0,${(0.24 + frontness * 0.14).toFixed(3)}), 0 0 ${(
      10 + frontness * 22
    ).toFixed(1)}px rgba(252,211,77,${(frontness * 0.24).toFixed(3)})`;
  });

  return (
    <motion.div
      variants={reducedMotion ? undefined : towerItemRevealVariants}
      className="pointer-events-none absolute inset-0"
      style={{ zIndex }}
    >
      <div className="absolute left-1/2 top-1/2 h-[4.25rem] w-[9.5rem] -translate-x-1/2 -translate-y-1/2">
        <motion.button
          type="button"
          aria-label={`${item.shortLabel}: ${item.label}${active ? ", currently active" : ""}`}
          aria-pressed={active}
          aria-controls="connection-tablet"
          data-cursor-label={active ? undefined : "Select"}
          onClick={() => onActivate(index)}
          onFocus={onFocus}
          onBlur={onBlur}
          className={`portfolio-focus pointer-events-auto group relative flex h-full w-full items-center gap-2.5 rounded-md border px-3 text-left backdrop-blur-md transition-colors duration-300 ${
            active
              ? "bg-[linear-gradient(100deg,rgba(47,37,24,0.94),rgba(20,17,13,0.9))]"
              : "bg-[rgba(16,15,12,0.76)] hover:bg-[rgba(31,26,19,0.86)]"
          }`}
          style={{
            x,
            y,
            z,
            scale,
            opacity,
            rotateY,
            rotateZ,
            filter,
            borderColor,
            boxShadow,
            transformStyle: "preserve-3d",
            willChange: "transform, opacity, filter",
          }}
        >
          <span
            className="flex size-9 shrink-0 items-center justify-center rounded-md border border-white/10 bg-black/25"
            style={{ color: item.brandColor }}
          >
            <Icon aria-hidden="true" className="size-4.5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-xs font-semibold text-[var(--portfolio-text-primary)]">
              {item.shortLabel}
            </span>
            <span className="mt-0.5 block truncate text-[0.55rem] text-[var(--portfolio-text-muted)]">
              {active ? "Active floor" : item.label}
            </span>
          </span>

          <AnimatePresence>
            {active ? (
              <motion.span
                aria-hidden="true"
                className="flex size-4 shrink-0 items-center justify-center rounded-full bg-[var(--portfolio-accent)] text-[var(--portfolio-bg)]"
                initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.4 }}
                animate={
                  isPresent
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: reducedMotion ? 1 : 0.15 }
                }
                exit={{ opacity: 0, scale: reducedMotion ? 1 : 0.4 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <Check className="size-2.5" strokeWidth={3} />
              </motion.span>
            ) : null}
          </AnimatePresence>

          <span
            aria-hidden="true"
            className={`absolute -bottom-1.5 left-1/2 h-px -translate-x-1/2 bg-gradient-to-r from-transparent to-transparent transition-all duration-300 ${
              active
                ? "w-[118%] via-[rgba(253,230,138,0.72)] shadow-[0_0_10px_rgba(252,211,77,0.38)]"
                : "w-[104%] via-[rgba(255,255,255,0.18)]"
            }`}
          />
        </motion.button>
      </div>
    </motion.div>
  );
}

type TabletDockProps = {
  activeIndex: number;
  reducedMotion: boolean;
  onSelect: (index: number) => void;
};

function TabletDock({ activeIndex, reducedMotion, onSelect }: TabletDockProps) {
  return (
    <div
      role="group"
      aria-label="Connection destinations"
      className="absolute bottom-2 left-1/2 z-30 flex -translate-x-1/2 items-center gap-1 rounded-xl border border-[rgba(253,230,138,0.2)] bg-[rgba(20,17,13,0.82)] p-1.5 shadow-[0_12px_34px_rgba(0,0,0,0.38),0_0_20px_rgba(252,211,77,0.1)] backdrop-blur-xl sm:bottom-3 sm:gap-1.5 sm:p-2"
    >
      {connectionItems.map((item, index) => {
        const Icon = item.icon;
        const active = activeIndex === index;

        return (
          <motion.button
            key={item.id}
            type="button"
            aria-label={`Show ${item.shortLabel}`}
            aria-pressed={active}
            data-cursor-label="Select"
            onClick={() => onSelect(index)}
            whileHover={reducedMotion ? undefined : { y: -2 }}
            whileTap={reducedMotion ? undefined : { scale: 0.94 }}
            className={`portfolio-focus group relative flex size-11 items-center justify-center rounded-lg border transition-colors duration-200 ${
              active
                ? "border-[rgba(253,230,138,0.58)] bg-[rgba(252,211,77,0.14)] shadow-[0_0_18px_rgba(252,211,77,0.18)]"
                : "border-transparent bg-black/20 hover:border-[rgba(253,230,138,0.3)] hover:bg-[rgba(252,211,77,0.08)]"
            }`}
            style={{ color: item.brandColor }}
          >
            <Icon aria-hidden="true" className="size-4.5 sm:size-5" />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -top-8 left-1/2 hidden w-max -translate-x-1/2 rounded-md border border-[var(--portfolio-border-subtle)] bg-[rgba(23,19,15,0.94)] px-2 py-1 text-[0.55rem] text-[var(--portfolio-text-secondary)] opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100 sm:block"
            >
              {item.shortLabel}
            </span>
            {active ? (
              <span
                aria-hidden="true"
                className="absolute bottom-1 h-0.5 w-3 rounded-full bg-[var(--portfolio-accent)] shadow-[0_0_8px_var(--portfolio-glow)]"
              />
            ) : null}
          </motion.button>
        );
      })}
    </div>
  );
}

type TabletScreenProps = {
  item: ConnectionItem;
  direction: 1 | -1;
  copyResult: { id: string; status: CopyStatus } | null;
  reducedMotion: boolean;
  onCopy: (item: ConnectionItem) => void;
};

function TabletScreen({
  item,
  direction,
  copyResult,
  reducedMotion,
  onCopy,
}: TabletScreenProps) {
  const Icon = item.icon;
  const itemCopyResult = copyResult?.id === item.id ? copyResult.status : null;
  const copyLabel =
    itemCopyResult === "copied"
      ? "Copied"
      : itemCopyResult === "failed"
        ? "Copy unavailable"
        : item.type === "email"
          ? "Copy Email"
          : "Copy Link";

  return (
    <motion.div
      className="absolute inset-0 flex flex-col bg-[radial-gradient(circle_at_50%_28%,rgba(252,211,77,0.08),transparent_48%),linear-gradient(160deg,rgba(30,25,19,0.94),rgba(8,7,6,0.98))]"
      initial={{ opacity: 0, x: reducedMotion ? 0 : direction * 8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: reducedMotion ? 0 : direction * -6 }}
      transition={{ duration: reducedMotion ? 0.16 : 0.32, ease: cinematicEase }}
    >
      <div className="flex h-9 shrink-0 items-center justify-between border-b border-white/[0.07] px-4 sm:h-11 sm:px-6">
        <span className="text-[0.55rem] font-semibold uppercase tracking-[0.18em] text-[var(--portfolio-text-muted)] sm:text-[0.62rem]">
          Connection Tablet
        </span>
        <span className="flex items-center gap-2 text-[0.55rem] text-[var(--portfolio-text-secondary)] sm:text-[0.62rem]">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-[var(--portfolio-accent)] shadow-[0_0_8px_var(--portfolio-glow)]" />
          {item.shortLabel}
        </span>
      </div>

      <div className="mx-auto flex min-h-0 w-full max-w-2xl flex-1 flex-col items-center justify-center px-5 pb-20 pt-4 text-center sm:px-10 sm:pb-24 sm:pt-6">
        <div
          className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-[rgba(253,230,138,0.22)] bg-[rgba(30,25,19,0.72)] shadow-[0_10px_24px_rgba(0,0,0,0.3)] sm:size-14"
          style={{ color: item.brandColor }}
        >
          <Icon aria-hidden="true" className="size-5 sm:size-6" />
        </div>

        <p className="portfolio-eyebrow mt-3 text-[0.52rem] uppercase tracking-[0.18em] sm:mt-4 sm:text-[0.6rem]">
          {item.type === "resume" ? "Document" : item.type === "email" ? "Direct message" : "External profile"}
        </p>
        <h2 className="portfolio-heading mt-1.5 text-xl font-semibold sm:text-2xl">{item.label}</h2>
        <p className="portfolio-copy mt-2 max-w-xl text-xs leading-5 sm:mt-3 sm:text-sm sm:leading-6">
          {item.description}
        </p>
        <p className="portfolio-muted mt-3 max-w-full break-words text-[0.65rem] [overflow-wrap:anywhere] sm:mt-4 sm:text-xs">
          {item.value}
        </p>

        <div className="mt-4 flex w-full max-w-md flex-col justify-center gap-2 min-[420px]:flex-row sm:mt-5 sm:gap-3">
          {item.copyValue ? (
            <button
              type="button"
              onClick={() => onCopy(item)}
              aria-live="polite"
              data-cursor-label="Copy"
              className="portfolio-button-secondary portfolio-focus inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-2 text-xs font-semibold transition duration-200 hover:-translate-y-0.5 hover:border-[rgba(253,230,138,0.45)] focus-visible:-translate-y-0.5 sm:text-sm"
            >
              {itemCopyResult === "copied" ? (
                <Check aria-hidden="true" className="size-4" />
              ) : (
                <Copy aria-hidden="true" className="size-4" />
              )}
              {copyLabel}
            </button>
          ) : null}

          <a
            href={item.href}
            target={item.external ? "_blank" : undefined}
            rel={item.external ? "noreferrer" : undefined}
            data-cursor-label={item.type === "resume" ? "View" : item.type === "email" ? "Send" : "Open"}
            className="portfolio-button-primary portfolio-focus inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-2 text-xs font-semibold transition duration-200 hover:-translate-y-0.5 focus-visible:-translate-y-0.5 sm:text-sm"
          >
            {item.actionLabel}
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

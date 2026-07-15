import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  FileText,
  Mail,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
  useIsPresent,
  useReducedMotion,
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
const TABLET_LOADING_MS = 560;

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
  return (index + connectionItems.length) % connectionItems.length;
}

function getRelativeIndex(index: number, activeIndex: number) {
  const total = connectionItems.length;
  let relativeIndex = (index - activeIndex + total) % total;

  if (relativeIndex > total / 2) relativeIndex -= total;
  return relativeIndex;
}

export default function SceneFive() {
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = Boolean(prefersReducedMotion);
  const isPresent = useIsPresent();
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [loading, setLoading] = useState(true);
  const [copyResult, setCopyResult] = useState<{ id: string; status: CopyStatus } | null>(null);
  const [tabletPressed, setTabletPressed] = useState(false);
  const loadTimerRef = useRef<number | null>(null);
  const copyTimerRef = useRef<number | null>(null);

  const activeItem = connectionItems[activeIndex];

  useEffect(() => {
    if (loadTimerRef.current !== null) window.clearTimeout(loadTimerRef.current);

    loadTimerRef.current = window.setTimeout(
      () => setLoading(false),
      reducedMotion ? 120 : TABLET_LOADING_MS,
    );

    return () => {
      if (loadTimerRef.current !== null) window.clearTimeout(loadTimerRef.current);
    };
  }, [activeIndex, reducedMotion]);

  useEffect(
    () => () => {
      if (copyTimerRef.current !== null) window.clearTimeout(copyTimerRef.current);
    },
    [],
  );

  const activateIndex = (nextIndex: number, travelDirection: 1 | -1) => {
    const wrappedIndex = getWrappedIndex(nextIndex);
    if (wrappedIndex === activeIndex) return;

    setDirection(travelDirection);
    setLoading(true);
    setCopyResult(null);
    setActiveIndex(wrappedIndex);
  };

  const moveTower = (amount: 1 | -1) => {
    activateIndex(activeIndex + amount, amount);
  };

  const activateVisibleItem = (index: number) => {
    const relativeIndex = getRelativeIndex(index, activeIndex);
    if (relativeIndex === 0) return;

    activateIndex(index, relativeIndex > 0 ? 1 : -1);
  };

  const copyConnectionValue = async (item: ConnectionItem) => {
    if (!item.copyValue) return;

    if (copyTimerRef.current !== null) window.clearTimeout(copyTimerRef.current);

    try {
      if (!navigator.clipboard) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(item.copyValue);
      setCopyResult({ id: item.id, status: "copied" });
    } catch {
      setCopyResult({ id: item.id, status: "failed" });
    }

    copyTimerRef.current = window.setTimeout(() => setCopyResult(null), 1800);
  };

  const handleTowerKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      moveTower(-1);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      moveTower(1);
    }
  };

  const handleTabletKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") setTabletPressed(true);
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
          <motion.p className="portfolio-eyebrow" variants={reducedMotion ? reducedRevealVariants : revealVariants}>
            Scene 05 / Connection
          </motion.p>
          <motion.h1 id="scene-five-title" className="portfolio-heading mt-2.5" variants={reducedMotion ? reducedRevealVariants : revealVariants}>
            Beyond This Journey
          </motion.h1>
          <motion.div
            aria-hidden="true"
            className="mx-auto mt-3.5 h-px w-16 bg-[var(--portfolio-accent)] shadow-[0_0_14px_var(--portfolio-glow)]"
            variants={reducedMotion ? reducedRevealVariants : revealVariants}
          />
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
                reducedMotion
                  ? { opacity: 0.35 }
                  : { opacity: [0.24, 0.55, 0.24], scaleX: [0.96, 1, 0.96] }
              }
              transition={{ duration: 4.8, repeat: reducedMotion ? 0 : Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            >
              <span className="absolute right-0 top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-[var(--portfolio-accent)] shadow-[0_0_12px_var(--portfolio-glow)]" />
            </motion.div>

            <div
              role="group"
              aria-label="Connection tower. Use Up and Down Arrow keys to change the active destination."
              tabIndex={0}
              onKeyDown={handleTowerKeyDown}
              className="portfolio-focus relative z-10 h-full overflow-hidden rounded-xl border border-white/[0.09] bg-[linear-gradient(180deg,rgba(8,8,7,0.25),rgba(20,17,13,0.48))] shadow-[0_24px_64px_rgba(0,0,0,0.32)] backdrop-blur-[3px]"
            >
              <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                <motion.div
                  className="absolute inset-x-[12%] bottom-[5%] top-[7%] bg-[radial-gradient(ellipse_at_center,rgba(252,211,77,0.13),transparent_67%)] blur-xl"
                  animate={reducedMotion ? { opacity: 0.55 } : { opacity: [0.42, 0.68, 0.42] }}
                  transition={{ duration: 6.8, repeat: reducedMotion ? 0 : Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                />

                <div className="absolute inset-x-[7%] bottom-[7%] top-[8%] overflow-hidden bg-[linear-gradient(105deg,rgba(255,255,255,0.015),rgba(252,211,77,0.075),rgba(255,255,255,0.02))] [clip-path:polygon(48%_0%,52%_0%,59%_18%,68%_42%,79%_70%,94%_100%,6%_100%,21%_70%,32%_42%,41%_18%)]">
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,7,6,0.72),rgba(53,43,29,0.2)_46%,rgba(12,11,9,0.64))]" />
                  <motion.div
                    className="absolute inset-y-0 w-[22%] -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.055] to-transparent"
                    animate={
                      reducedMotion
                        ? { opacity: 0, x: "-140%" }
                        : { opacity: [0, 0.75, 0], x: ["-140%", "520%", "520%"] }
                    }
                    transition={{ duration: 9, repeat: Number.POSITIVE_INFINITY, repeatDelay: 4.5, ease: "easeInOut" }}
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
                    animate={reducedMotion ? { opacity: 0.45 } : { opacity: [0.28, 0.62, 0.28] }}
                    transition={{
                      duration: 5.6,
                      delay: Number.parseFloat(brace.top) * 0.035,
                      repeat: reducedMotion ? 0 : Number.POSITIVE_INFINITY,
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
                      reducedMotion
                        ? { opacity: 0.28 }
                        : { opacity: [0, 0.9, 0], y: [0, -480] }
                    }
                    transition={{
                      duration: light.duration,
                      delay: light.delay,
                      repeat: reducedMotion ? 0 : Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  />
                ))}

                <div className="absolute bottom-[3.5%] left-1/2 h-[7%] w-[88%] -translate-x-1/2 bg-[linear-gradient(180deg,rgba(253,230,138,0.12),rgba(10,9,7,0.7))] [clip-path:polygon(16%_0%,84%_0%,100%_100%,0%_100%)]" />
                <div className="absolute bottom-[3.5%] left-1/2 h-px w-[88%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[rgba(253,230,138,0.48)] to-transparent" />
              </div>

              <button
                type="button"
                aria-label="Previous connection"
                data-cursor-label="Previous"
                onClick={() => moveTower(-1)}
                className="portfolio-focus absolute right-3 top-3 z-50 flex size-10 items-center justify-center rounded-full border border-[var(--portfolio-border-subtle)] bg-[rgba(23,19,15,0.78)] text-[var(--portfolio-text-secondary)] shadow-[0_8px_24px_rgba(0,0,0,0.24)] backdrop-blur-md transition duration-200 hover:-translate-y-0.5 hover:border-[var(--portfolio-border)] hover:text-[var(--portfolio-accent-bright)] focus-visible:-translate-y-0.5"
              >
                <ChevronUp aria-hidden="true" className="size-5" />
              </button>

              <motion.div
                className="absolute inset-x-0 bottom-14 top-14 z-20"
                variants={reducedMotion ? undefined : towerRevealVariants}
                initial={reducedMotion ? undefined : "hidden"}
                animate={reducedMotion ? undefined : "visible"}
                style={{ perspective: 950 }}
              >
                {connectionItems.map((item, index) => {
                  const Icon = item.icon;
                  const relativeIndex = getRelativeIndex(index, activeIndex);
                  const depth = Math.abs(relativeIndex);
                  const active = relativeIndex === 0;
                  const x = reducedMotion
                    ? 0
                    : relativeIndex === -2
                      ? 34
                      : relativeIndex === -1
                        ? -52
                        : relativeIndex === 1
                          ? 58
                          : relativeIndex === 2
                            ? -72
                            : 0;
                  const y = relativeIndex * 94;
                  const scale = active ? 1 : depth === 1 ? 0.84 : 0.69;
                  const opacity = active ? 1 : depth === 1 ? 0.68 : 0.4;
                  const blur = reducedMotion ? 0 : depth === 0 ? 0 : depth === 1 ? 1.3 : 3.2;

                  return (
                    <motion.div
                      key={item.id}
                      variants={reducedMotion ? undefined : towerItemRevealVariants}
                      className="pointer-events-none absolute inset-0"
                      style={{ zIndex: 40 - depth }}
                    >
                      <div className="absolute left-1/2 top-1/2 h-[4.25rem] w-[9.5rem] -translate-x-1/2 -translate-y-1/2">
                        <motion.button
                          type="button"
                          aria-label={`${item.shortLabel}: ${item.label}${active ? ", currently active" : ""}`}
                          aria-pressed={active}
                          aria-controls="connection-tablet"
                          data-cursor-label={active ? undefined : "Select"}
                          onClick={() => activateVisibleItem(index)}
                          animate={{
                            x,
                            y,
                            z: reducedMotion ? 0 : -depth * 92,
                            scale,
                            opacity,
                            rotateY: reducedMotion || active ? 0 : x > 0 ? -16 : 16,
                            rotateZ: reducedMotion ? 0 : relativeIndex * 1.1,
                            filter: `blur(${blur}px)`,
                          }}
                          transition={{
                            duration: reducedMotion ? 0.18 : 0.66,
                            ease: cinematicEase,
                          }}
                          className={`portfolio-focus pointer-events-auto group relative flex h-full w-full items-center gap-2.5 rounded-md border px-3 text-left backdrop-blur-md transition-colors duration-300 ${
                            active
                              ? "border-[rgba(253,230,138,0.68)] bg-[linear-gradient(100deg,rgba(47,37,24,0.94),rgba(20,17,13,0.9))] shadow-[0_14px_38px_rgba(0,0,0,0.38),0_0_30px_rgba(252,211,77,0.24)]"
                              : "border-[rgba(255,255,255,0.13)] bg-[rgba(16,15,12,0.76)] shadow-[0_12px_28px_rgba(0,0,0,0.28)] hover:border-[rgba(253,230,138,0.4)] hover:bg-[rgba(31,26,19,0.84)]"
                          }`}
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
                })}
              </motion.div>

              <button
                type="button"
                aria-label="Next connection"
                data-cursor-label="Next"
                onClick={() => moveTower(1)}
                className="portfolio-focus absolute bottom-3 right-3 z-50 flex size-10 items-center justify-center rounded-full border border-[var(--portfolio-border-subtle)] bg-[rgba(23,19,15,0.78)] text-[var(--portfolio-text-secondary)] shadow-[0_8px_24px_rgba(0,0,0,0.24)] backdrop-blur-md transition duration-200 hover:translate-y-0.5 hover:border-[var(--portfolio-border)] hover:text-[var(--portfolio-accent-bright)] focus-visible:translate-y-0.5"
              >
                <ChevronDown aria-hidden="true" className="size-5" />
              </button>
            </div>
          </div>

          <div className="sr-only" aria-live="polite" aria-atomic="true">
            {loading
              ? `Loading ${activeItem.shortLabel} connection details.`
              : `${activeItem.shortLabel} is centered. Connection details loaded.`}
          </div>

          <motion.div
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
            onPointerDownCapture={() => setTabletPressed(true)}
            onPointerUpCapture={() => setTabletPressed(false)}
            onPointerCancel={() => setTabletPressed(false)}
            onKeyDownCapture={handleTabletKeyDown}
            onKeyUpCapture={() => setTabletPressed(false)}
            onBlurCapture={() => setTabletPressed(false)}
          >
            <motion.div
              className="h-full w-full"
              animate={
                reducedMotion || tabletPressed || !isPresent
                  ? { y: 0 }
                  : { y: [0, -3, 0] }
              }
              transition={
                reducedMotion || tabletPressed || !isPresent
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
                      reducedMotion || !isPresent
                        ? { opacity: 0, x: "-150%" }
                        : { opacity: [0, 0.65, 0], x: ["-150%", "320%", "320%"] }
                    }
                    transition={{ duration: 7.5, repeat: Number.POSITIVE_INFINITY, repeatDelay: 4, ease: "easeInOut" }}
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
                          animate={reducedMotion ? undefined : { opacity: [0.35, 1, 0.35], scale: [0.85, 1, 0.85] }}
                          transition={{ duration: 0.9, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
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
      </div>
    </section>
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

      <div className="mx-auto flex min-h-0 w-full max-w-2xl flex-1 flex-col items-center justify-center px-5 py-4 text-center sm:px-10 sm:py-6">
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

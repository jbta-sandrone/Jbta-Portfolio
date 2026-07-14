import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type MotionValue,
  type Variants,
} from "motion/react";
import profilePlaceholder from "../assets/images/my-portrait.jpg";
import { useSceneNavigation } from "../components/SceneNavigationContext";

const easing = [0.22, 1, 0.36, 1] as const;

export default function SceneTwo() {
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = prefersReducedMotion !== false;
  const { navigateToScene, isTransitioning } = useSceneNavigation();
  const portraitX = useMotionValue(0);
  const portraitY = useMotionValue(0);
  const smoothPortraitX = useSpring(portraitX, { stiffness: 115, damping: 24 });
  const smoothPortraitY = useSpring(portraitY, { stiffness: 115, damping: 24 });

  const revealVariants: Variants = {
    hidden: reducedMotion
      ? { opacity: 0 }
      : { opacity: 0, y: 18, filter: "blur(4px)" },
    visible: (delay = 0) =>
      reducedMotion
        ? { opacity: 1, transition: { duration: 0.16, delay: delay * 0.25 } }
        : {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: { duration: 0.58, delay, ease: easing },
          },
  };

  const portraitVariants: Variants = {
    hidden: reducedMotion
      ? { opacity: 0 }
      : { opacity: 0, scale: 0.97 },
    visible: reducedMotion
      ? { opacity: 1, transition: { duration: 0.16 } }
      : {
          opacity: 1,
          scale: 1,
          transition: { duration: 0.7, delay: 0.08, ease: easing },
        },
  };

  const handlePortraitMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (reducedMotion || event.pointerType !== "mouse") return;

    const bounds = event.currentTarget.getBoundingClientRect();
    portraitX.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 6);
    portraitY.set(((event.clientY - bounds.top) / bounds.height - 0.5) * 6);
  };

  const resetPortraitDepth = () => {
    portraitX.set(0);
    portraitY.set(0);
  };

  return (
    <section
      data-cinematic-scene={2}
      data-scene-scroll
      aria-labelledby="behind-the-work-title"
      className="relative h-full overflow-y-auto overscroll-contain text-stone-100"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-full bg-gradient-to-r from-black/50 via-black/20 to-transparent lg:w-4/5"
      />

      <div className="relative mx-auto grid min-h-full w-full max-w-6xl items-center gap-9 px-5 py-12 pb-32 sm:px-8 md:gap-10 lg:grid-cols-[minmax(290px,0.44fr)_minmax(0,0.56fr)] lg:px-12 lg:py-8 xl:gap-16">
        <motion.div
          variants={portraitVariants}
          initial="hidden"
          animate="visible"
          className="mx-auto w-full max-w-[20rem] sm:max-w-[22rem] lg:max-w-[23rem]"
        >
          <NotebookPortrait
            reducedMotion={reducedMotion}
            smoothPortraitX={smoothPortraitX}
            smoothPortraitY={smoothPortraitY}
            onPointerMove={handlePortraitMove}
            onPointerLeave={resetPortraitDepth}
          />
        </motion.div>

        <div className="mx-auto w-full max-w-2xl lg:mx-0">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <motion.header
              custom={0.03}
              variants={revealVariants}
              initial="hidden"
              animate="visible"
            >
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-amber-300/70">
                Scene 02 — Depth
              </p>
              <h1
                id="behind-the-work-title"
                className="mt-1.5 text-xl font-medium tracking-tight text-stone-100 sm:text-2xl"
              >
                Behind the Work
              </h1>
            </motion.header>

            <motion.div
              custom={0.06}
              variants={revealVariants}
              initial="hidden"
              animate="visible"
              className="inline-flex items-center gap-2 rounded-full border border-emerald-200/15 bg-black/30 px-3 py-1.5 text-xs font-medium text-emerald-100/90 shadow-[0_8px_30px_rgba(0,0,0,0.2)] backdrop-blur-md"
            >
              <span className="relative flex size-2" aria-hidden="true">
                {!reducedMotion && (
                  <motion.span
                    className="absolute inset-0 rounded-full bg-emerald-400/60"
                    animate={{ opacity: [0.55, 0, 0.55], scale: [1, 2.1, 1] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}
                <span className="relative size-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
              </span>
              Available for Work
            </motion.div>
          </div>

          <motion.h2
            custom={0.12}
            variants={revealVariants}
            initial="hidden"
            animate="visible"
            className="mt-5 max-w-2xl text-4xl font-semibold leading-[1.08] tracking-tight text-stone-50 sm:text-5xl lg:text-[3.4rem]"
          >
            Get to know me and my story.
          </motion.h2>

          <motion.div
            custom={0.2}
            variants={revealVariants}
            initial="hidden"
            animate="visible"
            className="mt-5 max-w-xl space-y-4 text-sm leading-6 text-stone-300 sm:text-base sm:leading-7"
          >
            <p>
              Hi, my name is Jonel. I’m a web developer from the Philippines who enjoys
              creating modern web applications with thoughtful user experiences. I love
              turning ideas into polished projects that feel intuitive, useful, and
              enjoyable to use.
            </p>
            <p>
              I’m currently expanding my skills in full-stack development while working
              toward a career in software engineering.
            </p>
          </motion.div>

          <motion.div
            custom={0.3}
            variants={revealVariants}
            initial="hidden"
            animate="visible"
            className="mt-7 flex flex-col gap-3 min-[430px]:flex-row"
          >
            <button
              type="button"
              aria-label="Explore My Projects — go to Scene 03"
              disabled={isTransitioning}
              onClick={() => navigateToScene(2)}
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-amber-200/35 bg-amber-200/90 px-6 text-sm font-semibold text-stone-950 shadow-[0_12px_36px_rgba(245,158,11,0.18)] transition-colors hover:bg-amber-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Explore My Projects
            </button>
            <button
              type="button"
              aria-label="Contact Me — go to Scene 05"
              disabled={isTransitioning}
              onClick={() => navigateToScene(4)}
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/20 bg-black/25 px-6 text-sm font-semibold text-stone-100 backdrop-blur-md transition-colors hover:border-amber-100/35 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Contact Me
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

type NotebookPortraitProps = {
  reducedMotion: boolean;
  smoothPortraitX: MotionValue<number>;
  smoothPortraitY: MotionValue<number>;
  onPointerMove: (event: ReactPointerEvent<HTMLDivElement>) => void;
  onPointerLeave: () => void;
};

function NotebookPortrait({
  reducedMotion,
  smoothPortraitX,
  smoothPortraitY,
  onPointerMove,
  onPointerLeave,
}: NotebookPortraitProps) {
  const [currentPage, setCurrentPage] = useState<1 | 2>(1);
  const [turnDirection, setTurnDirection] = useState<
    "forward" | "backward" | null
  >(null);
  const [isCrossfading, setIsCrossfading] = useState(false);
  const portraitButtonRef = useRef<HTMLButtonElement>(null);
  const storyButtonRef = useRef<HTMLButtonElement>(null);
  const hasFlippedRef = useRef(false);
  const crossfadeTimerRef = useRef<number | null>(null);
  const isTurning = turnDirection !== null || isCrossfading;

  useEffect(() => {
    if (!hasFlippedRef.current || isTurning) return;

    const focusTimer = window.setTimeout(() => {
      const target = currentPage === 2
        ? storyButtonRef.current
        : portraitButtonRef.current;
      target?.focus({ preventScroll: true });
    }, 20);

    return () => window.clearTimeout(focusTimer);
  }, [currentPage, isTurning]);

  useEffect(
    () => () => {
      if (crossfadeTimerRef.current !== null) {
        window.clearTimeout(crossfadeTimerRef.current);
      }
    },
    [],
  );

  const beginTurn = (direction: "forward" | "backward") => {
    if (isTurning) return;

    hasFlippedRef.current = true;
    onPointerLeave();

    if (reducedMotion) {
      setIsCrossfading(true);
      setCurrentPage(direction === "forward" ? 2 : 1);
      crossfadeTimerRef.current = window.setTimeout(() => {
        setIsCrossfading(false);
        crossfadeTimerRef.current = null;
      }, 360);
      return;
    }

    setTurnDirection(direction);
  };

  const finishTurn = () => {
    if (!turnDirection) return;

    setCurrentPage(turnDirection === "forward" ? 2 : 1);
    setTurnDirection(null);
  };

  const renderPage = (
    page: 1 | 2,
    options: { active: boolean; buttonRef?: RefObject<HTMLButtonElement | null> },
  ) =>
    page === 1 ? (
      <PortraitPage
        smoothPortraitX={smoothPortraitX}
        smoothPortraitY={smoothPortraitY}
        buttonRef={options.buttonRef}
        isActive={options.active}
        onOpen={() => beginTurn("forward")}
      />
    ) : (
      <StoryPage
        buttonRef={options.buttonRef}
        isActive={options.active}
        onClose={() => beginTurn("backward")}
      />
    );

  const destinationPage: 1 | 2 = turnDirection === "forward" ? 2 : 1;

  return (
    <div
      className="relative aspect-[4/5] w-full [perspective:1400px]"
      onPointerMove={currentPage === 1 && !isTurning ? onPointerMove : undefined}
      onPointerLeave={onPointerLeave}
    >
      <div className="pointer-events-none absolute -inset-2 rounded-[1.8rem] bg-black/25 shadow-[0_28px_90px_rgba(0,0,0,0.48)] backdrop-blur-sm" />
      <div className="absolute inset-0 overflow-hidden rounded-[1.5rem] border border-amber-100/25 bg-[#17130f] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_24px_70px_rgba(0,0,0,0.38)]">
        <div className="pointer-events-none absolute inset-y-4 left-3 z-30 w-px bg-gradient-to-b from-transparent via-amber-200/35 to-transparent" />

        <div className="relative h-full overflow-hidden rounded-[1.15rem] [perspective:1400px]">
          {reducedMotion ? (
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={currentPage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="absolute inset-0"
              >
                {renderPage(currentPage, {
                  active: !isCrossfading,
                  buttonRef:
                    currentPage === 1 ? portraitButtonRef : storyButtonRef,
                })}
              </motion.div>
            </AnimatePresence>
          ) : turnDirection ? (
            <>
              <div className="absolute inset-0 z-0" aria-hidden="true">
                {renderPage(destinationPage, {
                  active: false,
                  buttonRef:
                    destinationPage === 1
                      ? portraitButtonRef
                      : storyButtonRef,
                })}
              </div>

              <motion.div
                aria-hidden="true"
                className="absolute inset-0 z-20 origin-left [backface-visibility:hidden] [transform-style:preserve-3d]"
                initial={{ rotateY: 0 }}
                animate={{
                  rotateY: turnDirection === "forward" ? -178 : 178,
                }}
                transition={{ duration: 4.8, ease: easing }}
                onAnimationComplete={finishTurn}
              >
                {renderPage(currentPage, { active: false })}
                <motion.div
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-0 ${
                    turnDirection === "forward"
                      ? "bg-gradient-to-l from-black/55 via-black/15 to-transparent"
                      : "bg-gradient-to-r from-black/55 via-black/15 to-transparent"
                  }`}
                  animate={{ opacity: [0, 0.7, 0.15] }}
                  transition={{ duration: 4.8, ease: "easeInOut" }}
                />
              </motion.div>

              <motion.div
                aria-hidden="true"
                className={`pointer-events-none absolute inset-0 z-10 ${
                  turnDirection === "forward"
                    ? "bg-gradient-to-r from-black/45 via-black/10 to-transparent"
                    : "bg-gradient-to-l from-black/45 via-black/10 to-transparent"
                }`}
                animate={{ opacity: [0, 0.45, 0] }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />
            </>
          ) : (
            <div className="absolute inset-0">
              {renderPage(currentPage, {
                active: true,
                buttonRef:
                  currentPage === 1 ? portraitButtonRef : storyButtonRef,
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

type PortraitPageProps = {
  smoothPortraitX: MotionValue<number>;
  smoothPortraitY: MotionValue<number>;
  buttonRef?: RefObject<HTMLButtonElement | null>;
  isActive: boolean;
  onOpen: () => void;
};

function PortraitPage({
  smoothPortraitX,
  smoothPortraitY,
  buttonRef,
  isActive,
  onOpen,
}: PortraitPageProps) {
  return (
    <div className="relative h-full overflow-hidden bg-black">
      <motion.img
        src={profilePlaceholder}
        alt="Temporary portrait placeholder for Jonel Bryan Ablog; replace with his graduation portrait"
        draggable={false}
        style={{ x: smoothPortraitX, y: smoothPortraitY }}
        className="h-full w-full scale-[1.025] select-none object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-amber-100/5" />
      <button
        ref={buttonRef}
        type="button"
        aria-label="Turn to the next notebook page"
        tabIndex={isActive ? 0 : -1}
        disabled={!isActive}
        onClick={onOpen}
        className="absolute bottom-4 right-4 z-20 rounded-full border border-white/20 bg-black/65 px-4 py-2 text-xs font-semibold text-stone-100 shadow-lg backdrop-blur-md transition-colors hover:bg-black/85 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-amber-200 disabled:pointer-events-none"
      >
        Next Page →
      </button>
    </div>
  );
}

type StoryPageProps = {
  buttonRef?: RefObject<HTMLButtonElement | null>;
  isActive: boolean;
  onClose: () => void;
};

function StoryPage({ buttonRef, isActive, onClose }: StoryPageProps) {
  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-[#1a1712] p-7 text-stone-100 sm:p-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-20 [background-image:repeating-linear-gradient(180deg,transparent_0_31px,rgba(251,191,36,0.16)_31px_32px)]"
      />
      <div className="pointer-events-none absolute inset-y-5 left-4 w-px bg-gradient-to-b from-transparent via-amber-200/40 to-transparent" />

      <div className="relative flex flex-1 flex-col justify-center gap-8 pl-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-300/75">
            Education
          </p>
          <p className="mt-3 text-lg font-medium leading-6 text-stone-50">
            Bachelor of Science in Information Technology
          </p>
          <p className="mt-2 text-sm text-stone-300">2022–2026</p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-300/75">
            Career Goal
          </p>
          <p className="mt-3 text-lg font-medium text-stone-50">Software Engineer</p>
          <p className="mt-2 text-sm leading-6 text-stone-300">
            Building thoughtful digital experiences.
          </p>
        </div>
      </div>

      <button
        ref={buttonRef}
        type="button"
        aria-label="Turn to the previous notebook page"
        tabIndex={isActive ? 0 : -1}
        disabled={!isActive}
        onClick={onClose}
        className="relative mt-5 self-start rounded-full border border-amber-100/20 bg-black/25 px-4 py-2 text-xs font-semibold text-stone-100 transition-colors hover:bg-black/45 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-amber-200 disabled:pointer-events-none"
      >
        ← Previous Page
      </button>
    </div>
  );
}

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
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
import { useSceneNavigation } from "../components/SceneNavigationContext";
import profilePortrait from "../assets/images/my-portrait.jpg";
import "../styles/scene-two.css";

const easing = [0.22, 1, 0.36, 1] as const;
const pageTurnEase = [0.65, 0, 0.35, 1] as const;

const dustMotes = Array.from({ length: 12 }, (_, index) => ({
  left: `${8 + ((index * 23) % 84)}%`,
  top: `${14 + ((index * 31) % 70)}%`,
  delay: `${(index % 6) * -1.4}s`,
  duration: `${7.5 + (index % 5) * 1.1}s`,
}));

function WorkshopGlyph({ type }: { type: "profile" | "academy" | "compass" | "journal" }) {
  if (type === "profile") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" shapeRendering="crispEdges">
        <path fill="currentColor" d="M8 3h8v2h2v7h-2v3h3v2h2v4H3v-4h2v-2h3v-3H6V5h2Zm2 3v6h4V6Z" />
      </svg>
    );
  }

  if (type === "academy") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" shapeRendering="crispEdges">
        <path fill="currentColor" d="m12 2 10 5v2h-2v9h2v3H2v-3h2V9H2V7Zm-5 8v8h2v-8Zm4 0v8h2v-8Zm4 0v8h2v-8Z" />
      </svg>
    );
  }

  if (type === "compass") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" shapeRendering="crispEdges">
        <path fill="currentColor" d="M9 2h6v2h3v2h2v3h2v6h-2v3h-2v2h-3v2H9v-2H6v-2H4v-3H2V9h2V6h2V4h3Zm1 6-3 9 7-3 3-7Zm2 3 2-1-1 2-2 1Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" shapeRendering="crispEdges">
      <path fill="currentColor" d="M3 3h8v2h2V3h8v17h-7v2h-4v-2H3Zm3 4v2h4V7Zm0 4v2h4v-2Zm8-4v2h4V7Zm0 4v2h4v-2Z" />
    </svg>
  );
}

function WorkshopEnvironment() {
  return (
    <div aria-hidden="true" className="scene-two-environment pointer-events-none absolute inset-0">
      <div className="scene-two-wall absolute inset-0" />
      <div className="scene-two-wall-texture absolute inset-0" />

      <div className="scene-two-outdoor scene-two-window">
        <div className="scene-two-window__sky" />
        <div className="scene-two-window__sun" />
        <div className="scene-two-window__cloud scene-two-window__cloud--one" />
        <div className="scene-two-window__cloud scene-two-window__cloud--two" />
        <div className="scene-two-window__mountain scene-two-window__mountain--far" />
        <div className="scene-two-window__mountain scene-two-window__mountain--near" />
        <div className="scene-two-window__frame scene-two-window__frame--vertical" />
        <div className="scene-two-window__frame scene-two-window__frame--horizontal" />
      </div>

      <div className="scene-two-room-mid">
        <div className="scene-two-ceiling-beam scene-two-ceiling-beam--top" />
        <div className="scene-two-ceiling-beam scene-two-ceiling-beam--left" />
        <div className="scene-two-ceiling-beam scene-two-ceiling-beam--right" />
        <div className="scene-two-sunbeam" />

        <div className="scene-two-shelf scene-two-shelf--left">
          <span className="scene-two-book scene-two-book--burgundy" />
          <span className="scene-two-book scene-two-book--green" />
          <span className="scene-two-book scene-two-book--gold" />
          <span className="scene-two-book scene-two-book--blue" />
          <span className="scene-two-scroll" />
          <span className="scene-two-potion"><i /></span>
        </div>

        <div className="scene-two-shelf scene-two-shelf--right">
          <span className="scene-two-book scene-two-book--gold" />
          <span className="scene-two-book scene-two-book--green" />
          <span className="scene-two-book scene-two-book--burgundy" />
          <span className="scene-two-gear scene-two-gear--small" />
          <span className="scene-two-gear scene-two-gear--large" />
        </div>

        <div className="scene-two-quest-board">
          <span className="scene-two-quest-paper scene-two-quest-paper--one" />
          <span className="scene-two-quest-paper scene-two-quest-paper--two" />
          <span className="scene-two-quest-pin scene-two-quest-pin--one" />
          <span className="scene-two-quest-pin scene-two-quest-pin--two" />
        </div>

        <div className="scene-two-wall-scroll">
          <span />
        </div>
      </div>

      <div className="scene-two-room-foreground">
        <div className="scene-two-desk">
          <div className="scene-two-terminal">
            <span className="scene-two-terminal__line scene-two-terminal__line--one" />
            <span className="scene-two-terminal__line scene-two-terminal__line--two" />
            <span className="scene-two-terminal__cursor" />
          </div>
          <div className="scene-two-keyboard" />
          <div className="scene-two-lantern"><span /></div>
          <div className="scene-two-crystal"><span /></div>
          <div className="scene-two-map-roll" />
        </div>

        <div className="scene-two-plant">
          <span className="scene-two-plant__leaf scene-two-plant__leaf--one" />
          <span className="scene-two-plant__leaf scene-two-plant__leaf--two" />
          <span className="scene-two-plant__leaf scene-two-plant__leaf--three" />
          <span className="scene-two-plant__pot" />
        </div>

        <div className="scene-two-backpack">
          <span />
        </div>
      </div>

      {dustMotes.map((mote, index) => (
        <span
          key={index}
          className={`scene-two-ambient scene-two-dust ${index > 7 ? "scene-two-dust--desktop" : ""}`}
          style={
            {
              left: mote.left,
              top: mote.top,
              animationDelay: mote.delay,
              animationDuration: mote.duration,
            } as CSSProperties
          }
        />
      ))}

      <div className="scene-two-hanging-leaves">
        <span />
        <span />
        <span />
      </div>
      <div className="scene-two-room-shadow absolute inset-0" />
      <div className="scene-two-threshold absolute inset-0" />
    </div>
  );
}

export default function SceneTwo() {
  const sceneRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = prefersReducedMotion !== false;
  const { navigateToScene, isTransitioning } = useSceneNavigation();
  const portraitX = useMotionValue(0);
  const portraitY = useMotionValue(0);
  const smoothPortraitX = useSpring(portraitX, { stiffness: 115, damping: 24 });
  const smoothPortraitY = useSpring(portraitY, { stiffness: 115, damping: 24 });

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const syncVisibility = () => {
      scene.classList.toggle("scene-two-paused", document.hidden);
    };

    syncVisibility();
    document.addEventListener("visibilitychange", syncVisibility);
    return () => document.removeEventListener("visibilitychange", syncVisibility);
  }, []);

  const revealVariants: Variants = {
    hidden: reducedMotion
      ? { opacity: 0 }
      : { opacity: 0, y: 18, filter: "blur(3px)" },
    visible: (delay = 0) =>
      reducedMotion
        ? { opacity: 1, transition: { duration: 0.14, delay: delay * 0.2 } }
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
      : { opacity: 0, x: -18, scale: 0.98 },
    visible: reducedMotion
      ? { opacity: 1, transition: { duration: 0.15 } }
      : {
          opacity: 1,
          x: 0,
          scale: 1,
          transition: { duration: 0.72, delay: 0.14, ease: easing },
        },
  };

  const handleScenePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (reducedMotion || event.pointerType !== "mouse") return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    event.currentTarget.style.setProperty("--workshop-x", `${x * 7}px`);
    event.currentTarget.style.setProperty("--workshop-y", `${y * 5}px`);
  };

  const resetSceneDepth = () => {
    sceneRef.current?.style.setProperty("--workshop-x", "0px");
    sceneRef.current?.style.setProperty("--workshop-y", "0px");
    portraitX.set(0);
    portraitY.set(0);
  };

  const handlePortraitMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (reducedMotion || event.pointerType !== "mouse") return;

    const bounds = event.currentTarget.getBoundingClientRect();
    portraitX.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 5);
    portraitY.set(((event.clientY - bounds.top) / bounds.height - 0.5) * 5);
  };

  return (
    <section
      ref={sceneRef}
      data-cinematic-scene={2}
      data-scene-scroll
      aria-labelledby="behind-the-work-title"
      onPointerMove={handleScenePointerMove}
      onPointerLeave={resetSceneDepth}
      className="scene-two-workshop portfolio-scene relative h-full overflow-y-auto overflow-x-hidden overscroll-contain bg-[#21150f]"
    >
      <WorkshopEnvironment />

      <div className="scene-two-layout relative z-10 mx-auto flex min-h-full w-full max-w-7xl flex-col px-5 pb-32 pt-20 sm:px-8 sm:pt-20 lg:px-12 lg:pb-28 lg:pt-8 xl:px-16">
        <motion.header
          custom={0.02}
          variants={revealVariants}
          initial="hidden"
          animate="visible"
          className="scene-two-chapter mx-auto w-full max-w-4xl text-center lg:mx-0 lg:text-left"
        >
          <div className="scene-two-chapter__eyebrow">
            <span>Scene Two</span>
            <i aria-hidden="true" />
            <span>Workshop Interior</span>
          </div>
          <h1 id="behind-the-work-title" className="scene-two-chapter__title mt-2">
            Behind the Work
          </h1>
          <p className="scene-two-chapter__subtitle mt-1.5">The workshop of the creator</p>
        </motion.header>

        <div className="scene-two-content-grid mt-5 grid flex-1 items-center gap-7 sm:mt-6 lg:mt-4 lg:grid-cols-[minmax(17rem,0.42fr)_minmax(0,0.58fr)] lg:gap-10 xl:gap-14">
          <motion.div
            variants={portraitVariants}
            initial="hidden"
            animate="visible"
            className="mx-auto w-full max-w-[19rem] sm:max-w-[21rem] lg:max-w-[22rem]"
          >
            <div className="scene-two-object-label mb-3">
              <WorkshopGlyph type="profile" />
              <span>Character Folio</span>
            </div>
            <WorkshopProfileBook
              reducedMotion={reducedMotion}
              smoothPortraitX={smoothPortraitX}
              smoothPortraitY={smoothPortraitY}
              onPointerMove={handlePortraitMove}
              onPointerLeave={resetSceneDepth}
            />
          </motion.div>

          <motion.article
            custom={0.12}
            variants={revealVariants}
            initial="hidden"
            animate="visible"
            className="scene-two-journal mx-auto w-full max-w-2xl"
          >
            <span aria-hidden="true" className="scene-two-panel-corner scene-two-panel-corner--tl" />
            <span aria-hidden="true" className="scene-two-panel-corner scene-two-panel-corner--tr" />
            <span aria-hidden="true" className="scene-two-panel-corner scene-two-panel-corner--bl" />
            <span aria-hidden="true" className="scene-two-panel-corner scene-two-panel-corner--br" />

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="scene-two-object-label">
                <WorkshopGlyph type="journal" />
                <span>Creator's Journal</span>
              </div>

              <div className="scene-two-availability inline-flex min-h-9 items-center gap-2 px-3 py-1.5 text-xs font-semibold">
                <span className="relative flex size-2" aria-hidden="true">
                  {!reducedMotion && <span className="scene-two-availability__pulse absolute inset-0" />}
                  <span className="scene-two-availability__dot relative size-2" />
                </span>
                Available for Work
              </div>
            </div>

            <motion.h2
              custom={0.18}
              variants={revealVariants}
              initial="hidden"
              animate="visible"
              className="scene-two-journal__heading mt-5 max-w-xl"
            >
              Get to know me and my story.
            </motion.h2>

            <motion.div
              custom={0.24}
              variants={revealVariants}
              initial="hidden"
              animate="visible"
              className="scene-two-journal__copy mt-5 max-w-xl space-y-4 text-sm leading-6 sm:text-base sm:leading-7"
            >
              <p>
                Hi, my name is Jonel Bryan Ablog. I’m a web developer from the Philippines who enjoys
                creating modern web applications with thoughtful user experiences. I love turning
                ideas into polished projects that feel intuitive, useful, and enjoyable to use.
              </p>
              <p>
                I’m currently expanding my skills in full-stack development while working toward a
                career in software engineering.
              </p>
            </motion.div>

            <motion.div
              custom={0.31}
              variants={revealVariants}
              initial="hidden"
              animate="visible"
              className="mt-7 flex flex-col gap-3 min-[430px]:flex-row"
            >
              <button
                type="button"
                aria-label="Explore My Projects — go to Scene 03"
                data-cursor-label="View Work"
                disabled={isTransitioning}
                onClick={() => navigateToScene(2)}
                className="scene-two-pixel-button scene-two-pixel-button--primary portfolio-focus inline-flex min-h-12 items-center justify-center px-5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span>Explore My Projects</span>
                <i aria-hidden="true">›</i>
              </button>
              <button
                type="button"
                aria-label="Contact Me — go to Scene 05"
                data-cursor-label="Connect"
                disabled={isTransitioning}
                onClick={() => navigateToScene(4)}
                className="scene-two-pixel-button scene-two-pixel-button--secondary portfolio-focus inline-flex min-h-12 items-center justify-center px-5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
              >
                Contact Me
              </button>
            </motion.div>
          </motion.article>
        </div>
      </div>
    </section>
  );
}

type WorkshopProfileBookProps = {
  reducedMotion: boolean;
  smoothPortraitX: MotionValue<number>;
  smoothPortraitY: MotionValue<number>;
  onPointerMove: (event: ReactPointerEvent<HTMLDivElement>) => void;
  onPointerLeave: () => void;
};

function WorkshopProfileBook({
  reducedMotion,
  smoothPortraitX,
  smoothPortraitY,
  onPointerMove,
  onPointerLeave,
}: WorkshopProfileBookProps) {
  const [currentPage, setCurrentPage] = useState<1 | 2>(1);
  const [turnDirection, setTurnDirection] = useState<"forward" | "backward" | null>(null);
  const [isCrossfading, setIsCrossfading] = useState(false);
  const portraitButtonRef = useRef<HTMLButtonElement>(null);
  const storyButtonRef = useRef<HTMLButtonElement>(null);
  const hasFlippedRef = useRef(false);
  const crossfadeTimerRef = useRef<number | null>(null);
  const isTurning = turnDirection !== null || isCrossfading;

  useEffect(() => {
    if (!hasFlippedRef.current || isTurning) return;

    const focusTimer = window.setTimeout(() => {
      const target = currentPage === 2 ? storyButtonRef.current : portraitButtonRef.current;
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
      <CharacterProfilePage
        smoothPortraitX={smoothPortraitX}
        smoothPortraitY={smoothPortraitY}
        buttonRef={options.buttonRef}
        isActive={options.active}
        onOpen={() => beginTurn("forward")}
      />
    ) : (
      <WorkshopRecordPage
        buttonRef={options.buttonRef}
        isActive={options.active}
        onClose={() => beginTurn("backward")}
      />
    );

  const destinationPage: 1 | 2 = turnDirection === "forward" ? 2 : 1;
  const turningForward = turnDirection === "forward";

  return (
    <div
      className="scene-two-profile-book relative aspect-[4/5] w-full"
      onPointerMove={currentPage === 1 && !isTurning ? onPointerMove : undefined}
      onPointerLeave={onPointerLeave}
    >
      <div className="scene-two-profile-book__shadow pointer-events-none absolute inset-0" />
      <div className="scene-two-profile-book__binding" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((ring) => <span key={ring} />)}
      </div>

      <div className="scene-two-profile-book__frame absolute inset-0 overflow-hidden">
        <div className="relative h-full overflow-hidden">
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
                  buttonRef: currentPage === 1 ? portraitButtonRef : storyButtonRef,
                })}
              </motion.div>
            </AnimatePresence>
          ) : turnDirection ? (
            <>
              <div className="absolute inset-0 z-0" aria-hidden="true">
                {renderPage(destinationPage, {
                  active: false,
                  buttonRef: destinationPage === 1 ? portraitButtonRef : storyButtonRef,
                })}
              </div>

              <motion.div
                aria-hidden="true"
                className={`absolute inset-0 z-20 origin-left overflow-hidden ${
                  turningForward ? "scene-two-page-turn--forward" : "scene-two-page-turn--backward"
                }`}
                initial={{ clipPath: "inset(0 0% 0 0%)", x: 0, scaleX: 1 }}
                animate={{
                  clipPath: turningForward ? "inset(0 100% 0 0%)" : "inset(0 0% 0 100%)",
                  x: turningForward ? -9 : 9,
                  scaleX: 0.95,
                }}
                transition={{ duration: 0.86, ease: pageTurnEase }}
                onAnimationComplete={finishTurn}
              >
                {renderPage(currentPage, { active: false })}
                <div className="scene-two-page-turn__shade absolute inset-0" />
              </motion.div>

              <motion.div
                aria-hidden="true"
                className="scene-two-page-fold pointer-events-none absolute inset-y-0 z-30 w-8"
                initial={{ left: turningForward ? "calc(100% - 2rem)" : "0%", opacity: 0 }}
                animate={{ left: turningForward ? "0%" : "calc(100% - 2rem)", opacity: [0, 0.9, 0] }}
                transition={{ duration: 0.86, ease: pageTurnEase }}
              />
            </>
          ) : (
            <div className="absolute inset-0">
              {renderPage(currentPage, {
                active: true,
                buttonRef: currentPage === 1 ? portraitButtonRef : storyButtonRef,
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

type CharacterProfilePageProps = {
  smoothPortraitX: MotionValue<number>;
  smoothPortraitY: MotionValue<number>;
  buttonRef?: RefObject<HTMLButtonElement | null>;
  isActive: boolean;
  onOpen: () => void;
};

function CharacterProfilePage({
  smoothPortraitX,
  smoothPortraitY,
  buttonRef,
  isActive,
  onOpen,
}: CharacterProfilePageProps) {
  return (
    <div className="scene-two-character-page relative h-full overflow-hidden">
      <motion.img
        src={profilePortrait}
        alt="Graduation portrait of Jonel Bryan Ablog"
        draggable={false}
        style={{ x: smoothPortraitX, y: smoothPortraitY }}
        className="h-full w-full scale-[1.025] select-none object-cover"
      />
      <div className="scene-two-character-page__wash pointer-events-none absolute inset-0" />
      <div className="scene-two-character-page__label absolute left-4 top-4">
        <WorkshopGlyph type="profile" />
        <span>Character Profile</span>
      </div>
      <div className="scene-two-character-page__identity absolute inset-x-4 bottom-16">
        <p>Jonel Bryan Ablog</p>
        <span>Web Developer · Philippines</span>
      </div>
      <button
        ref={buttonRef}
        type="button"
        aria-label="Turn to the next character folio page"
        tabIndex={isActive ? 0 : -1}
        disabled={!isActive}
        onClick={onOpen}
        className="scene-two-page-button portfolio-focus absolute bottom-4 right-4 z-20 min-h-10 px-3 text-xs font-semibold disabled:pointer-events-none"
      >
        Next Page <span aria-hidden="true">→</span>
      </button>
    </div>
  );
}

type WorkshopRecordPageProps = {
  buttonRef?: RefObject<HTMLButtonElement | null>;
  isActive: boolean;
  onClose: () => void;
};

function WorkshopRecordPage({ buttonRef, isActive, onClose }: WorkshopRecordPageProps) {
  return (
    <div className="scene-two-record-page relative flex h-full flex-col overflow-hidden p-6 sm:p-7">
      <div aria-hidden="true" className="scene-two-record-page__grid absolute inset-0" />
      <div className="relative flex flex-1 flex-col justify-center gap-6 pl-2 sm:gap-8">
        <section className="scene-two-record-block" aria-labelledby="academy-record-title">
          <div className="scene-two-record-block__label">
            <WorkshopGlyph type="academy" />
            <p id="academy-record-title">Academy Record</p>
          </div>
          <p className="scene-two-record-block__value mt-3">
            Bachelor of Science in Information Technology
          </p>
          <p className="scene-two-record-block__detail mt-2">2022–2026</p>
        </section>

        <div aria-hidden="true" className="scene-two-record-divider" />

        <section className="scene-two-record-block" aria-labelledby="career-destination-title">
          <div className="scene-two-record-block__label">
            <WorkshopGlyph type="compass" />
            <p id="career-destination-title">Destination</p>
          </div>
          <p className="scene-two-record-block__value mt-3">Software Engineer</p>
          <p className="scene-two-record-block__detail mt-2 leading-5">
            Building thoughtful digital experiences.
          </p>
        </section>
      </div>

      <button
        ref={buttonRef}
        type="button"
        aria-label="Turn to the previous character folio page"
        tabIndex={isActive ? 0 : -1}
        disabled={!isActive}
        onClick={onClose}
        className="scene-two-page-button portfolio-focus relative mt-4 min-h-10 self-start px-3 text-xs font-semibold disabled:pointer-events-none"
      >
        <span aria-hidden="true">←</span> Previous Page
      </button>
    </div>
  );
}

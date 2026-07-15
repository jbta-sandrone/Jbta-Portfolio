import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type TouchEvent as ReactTouchEvent,
} from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "motion/react";
import CinematicBackground from "./components/CinematicBackground";
import PortfolioCursor from "./components/PortfolioCursor";
import { SceneNavigationContext } from "./components/SceneNavigationContext";
import SceneOne from "./scenes/SceneOne";
import SceneTwo from "./scenes/SceneTwo";
import SceneThree from "./scenes/SceneThree";
import SceneFour from "./scenes/SceneFour";
import SceneFive from "./scenes/SceneFive";
import SceneSix from "./scenes/SceneSix";

const SCENES = [
  { id: "arrival", label: "Arrival", Component: SceneOne },
  { id: "behind-the-work", label: "Behind the Work", Component: SceneTwo },
  { id: "featured-work", label: "Featured Work", Component: SceneThree },
  { id: "craft", label: "Craft", Component: SceneFour },
  { id: "connect", label: "Let's Connect", Component: SceneFive },
  { id: "ending", label: "Ending", Component: SceneSix },
] as const;

type HistoryMode = "push" | "none";

type TouchStart = {
  x: number;
  y: number;
  scrollElement: HTMLElement | null;
  scrollTop: number;
};

function getSceneIndexFromHash() {
  const hash = window.location.hash.slice(1).toLowerCase();
  const index = SCENES.findIndex((scene) => scene.id === hash);
  return index === -1 ? 0 : index;
}

function getSceneScrollElement(target: EventTarget | null) {
  return target instanceof Element
    ? target.closest<HTMLElement>("[data-scene-scroll]")
    : null;
}

function canScrollInDirection(element: HTMLElement | null, direction: 1 | -1) {
  if (!element || element.scrollHeight <= element.clientHeight + 1) return false;

  return direction === 1
    ? element.scrollTop + element.clientHeight < element.scrollHeight - 1
    : element.scrollTop > 1;
}

function App() {
  const prefersReducedMotion = useReducedMotion();
  const [activeScene, setActiveScene] = useState(getSceneIndexFromHash);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const activeSceneRef = useRef(activeScene);
  const transitionLockedRef = useRef(false);
  const pendingHistorySceneRef = useRef<number | null>(null);
  const wheelDeltaRef = useRef(0);
  const wheelResetTimerRef = useRef<number | null>(null);
  const touchStartRef = useRef<TouchStart | null>(null);

  const commitScene = useCallback((nextScene: number, historyMode: HistoryMode) => {
    const boundedScene = Math.max(0, Math.min(SCENES.length - 1, nextScene));
    const currentScene = activeSceneRef.current;
    if (boundedScene === currentScene) return;

    transitionLockedRef.current = true;
    setIsTransitioning(true);
    setDirection(boundedScene > currentScene ? 1 : -1);
    activeSceneRef.current = boundedScene;
    setActiveScene(boundedScene);

    if (historyMode === "push") {
      window.history.pushState(null, "", `#${SCENES[boundedScene].id}`);
    }
  }, []);

  const requestScene = useCallback(
    (
      nextScene: number,
      historyMode: HistoryMode = "push",
      queueIfLocked = false,
    ) => {
      const boundedScene = Math.max(0, Math.min(SCENES.length - 1, nextScene));
      if (boundedScene === activeSceneRef.current) return;

      if (transitionLockedRef.current) {
        if (queueIfLocked) pendingHistorySceneRef.current = boundedScene;
        return;
      }

      commitScene(boundedScene, historyMode);
    },
    [commitScene],
  );

  const moveBy = useCallback(
    (amount: 1 | -1) => requestScene(activeSceneRef.current + amount),
    [requestScene],
  );

  const finishTransition = useCallback(
    (renderedScene: number) => {
      if (renderedScene !== activeSceneRef.current) return;

      transitionLockedRef.current = false;
      setIsTransitioning(false);

      const pendingScene = pendingHistorySceneRef.current;
      pendingHistorySceneRef.current = null;

      if (pendingScene !== null && pendingScene !== activeSceneRef.current) {
        commitScene(pendingScene, "none");
      }
    },
    [commitScene],
  );

  useEffect(() => {
    const expectedHash = `#${SCENES[activeSceneRef.current].id}`;
    if (window.location.hash !== expectedHash) {
      window.history.replaceState(null, "", expectedHash);
    }

    const syncSceneFromHash = () => {
      const hash = window.location.hash.slice(1).toLowerCase();
      const sceneIndex = SCENES.findIndex((scene) => scene.id === hash);
      if (sceneIndex !== -1) requestScene(sceneIndex, "none", true);
    };

    window.addEventListener("popstate", syncSceneFromHash);
    window.addEventListener("hashchange", syncSceneFromHash);

    return () => {
      window.removeEventListener("popstate", syncSceneFromHash);
      window.removeEventListener("hashchange", syncSceneFromHash);
    };
  }, [requestScene]);

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      if (event.ctrlKey || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;

      const wheelDirection: 1 | -1 = event.deltaY > 0 ? 1 : -1;
      const scrollElement = getSceneScrollElement(event.target);
      if (canScrollInDirection(scrollElement, wheelDirection)) {
        wheelDeltaRef.current = 0;
        return;
      }

      event.preventDefault();
      if (transitionLockedRef.current) return;

      wheelDeltaRef.current += event.deltaY;
      if (wheelResetTimerRef.current !== null) {
        window.clearTimeout(wheelResetTimerRef.current);
      }
      wheelResetTimerRef.current = window.setTimeout(() => {
        wheelDeltaRef.current = 0;
      }, 180);

      if (Math.abs(wheelDeltaRef.current) >= 48) {
        const directionFromWheel: 1 | -1 = wheelDeltaRef.current > 0 ? 1 : -1;
        wheelDeltaRef.current = 0;
        moveBy(directionFromWheel);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;

      const target = event.target as HTMLElement | null;
      if (
        target?.isContentEditable ||
        target?.matches("input, textarea, select")
      ) {
        return;
      }

      if (event.key === "ArrowDown" || event.key === "PageDown") {
        event.preventDefault();
        const scrollElement = document.querySelector<HTMLElement>(
          "[data-active-scene] [data-scene-scroll]",
        );
        if (canScrollInDirection(scrollElement, 1)) {
          scrollElement?.scrollBy({
            top: event.key === "PageDown" ? scrollElement.clientHeight * 0.8 : 48,
            behavior: prefersReducedMotion ? "auto" : "smooth",
          });
          return;
        }
        moveBy(1);
      } else if (event.key === "ArrowUp" || event.key === "PageUp") {
        event.preventDefault();
        const scrollElement = document.querySelector<HTMLElement>(
          "[data-active-scene] [data-scene-scroll]",
        );
        if (canScrollInDirection(scrollElement, -1)) {
          scrollElement?.scrollBy({
            top: event.key === "PageUp" ? scrollElement.clientHeight * -0.8 : -48,
            behavior: prefersReducedMotion ? "auto" : "smooth",
          });
          return;
        }
        moveBy(-1);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      if (wheelResetTimerRef.current !== null) {
        window.clearTimeout(wheelResetTimerRef.current);
      }
    };
  }, [moveBy, prefersReducedMotion]);

  const handleTouchStart = (event: ReactTouchEvent<HTMLDivElement>) => {
    if (event.touches.length !== 1) return;

    const touch = event.touches[0];
    const scrollElement = getSceneScrollElement(event.target);
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      scrollElement,
      scrollTop: scrollElement?.scrollTop ?? 0,
    };
  };

  const handleTouchEnd = (event: ReactTouchEvent<HTMLDivElement>) => {
    const start = touchStartRef.current;
    const touch = event.changedTouches[0];
    touchStartRef.current = null;
    if (!start || !touch || transitionLockedRef.current) return;

    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;
    if (Math.abs(deltaY) < 52 || Math.abs(deltaY) <= Math.abs(deltaX) * 1.2) {
      return;
    }

    const swipeDirection: 1 | -1 = deltaY < 0 ? 1 : -1;
    const scrollElement = start.scrollElement;
    const couldScrollAtStart = scrollElement
      ? swipeDirection === 1
        ? start.scrollTop + scrollElement.clientHeight < scrollElement.scrollHeight - 1
        : start.scrollTop > 1
      : false;

    if (!couldScrollAtStart) moveBy(swipeDirection);
  };

  const CurrentScene = SCENES[activeScene].Component;
  const sceneNavigationValue = useMemo(
    () => ({
      navigateToScene: (sceneIndex: number) => requestScene(sceneIndex),
      isTransitioning,
    }),
    [isTransitioning, requestScene],
  );
  const sceneVariants: Variants = {
    initial: (travelDirection: 1 | -1) =>
      prefersReducedMotion
        ? { opacity: 0 }
        : {
            opacity: 0,
            y: travelDirection * 44,
            scale: 0.985,
            filter: "blur(8px)",
          },
    animate: prefersReducedMotion
      ? { opacity: 1, transition: { duration: 0.18 } }
      : {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          transition: { duration: 0.54, ease: [0.22, 1, 0.36, 1] },
        },
    exit: (travelDirection: 1 | -1) =>
      prefersReducedMotion
        ? { opacity: 0, transition: { duration: 0.14 } }
        : {
            opacity: 0,
            y: travelDirection * -32,
            scale: 0.992,
            filter: "blur(6px)",
            transition: { duration: 0.42, ease: [0.4, 0, 1, 1] },
          },
  };

  return (
    <SceneNavigationContext.Provider value={sceneNavigationValue}>
      <div
        className="portfolio-scene relative isolate h-dvh overflow-hidden bg-[var(--portfolio-bg)]"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={() => {
          touchStartRef.current = null;
        }}
      >
        <CinematicBackground activeScene={activeScene} />
        <PortfolioCursor />

        <main id="portfolio-world" className="relative z-10 h-full overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={SCENES[activeScene].id}
              id={SCENES[activeScene].id}
              data-active-scene
              custom={direction}
              variants={sceneVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              onAnimationComplete={() => finishTransition(activeScene)}
              className="absolute inset-0 h-full overflow-hidden"
            >
              <CurrentScene />
            </motion.div>
          </AnimatePresence>
        </main>

        <nav
          aria-label="Scene navigation"
          className="portfolio-navigation fixed right-4 z-30 flex items-center gap-1 rounded-full border p-1.5 sm:right-8"
          style={{ bottom: "max(1rem, env(safe-area-inset-bottom))" }}
        >
          <button
            type="button"
            aria-label="Previous scene"
            data-cursor-label="Previous"
            onClick={() => moveBy(-1)}
            disabled={activeScene === 0 || isTransitioning}
            className="portfolio-navigation-button portfolio-focus flex size-11 items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-25"
          >
            <ChevronUp aria-hidden="true" className="size-5" />
          </button>

          <div
            aria-live="polite"
            aria-atomic="true"
            className="portfolio-copy min-w-16 px-2 text-center text-xs font-medium tracking-[0.18em] tabular-nums"
          >
            <span className="sr-only">{SCENES[activeScene].label}, scene </span>
            {activeScene + 1} / {SCENES.length}
          </div>

          <button
            type="button"
            aria-label="Next scene"
            data-cursor-label="Next"
            onClick={() => moveBy(1)}
            disabled={activeScene === SCENES.length - 1 || isTransitioning}
            className="portfolio-navigation-button portfolio-focus flex size-11 items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-25"
          >
            <ChevronDown aria-hidden="true" className="size-5" />
          </button>
        </nav>
      </div>
    </SceneNavigationContext.Provider>
  );
}

export default App;

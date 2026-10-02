import { useCallback, useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "motion/react";
import FloatingAIButton from "./components/FloatingAIButton";
import PortfolioIntro from "./components/PortfolioIntro";
import { shouldShowPortfolioIntro } from "./components/portfolioIntroSession";
import PortfolioCursor from "./components/PortfolioCursor";
import SceneNavigationControl from "./components/SceneNavigationControl";
import ThemeToggle from "./components/ThemeToggle";
import {
  SceneNavigationContext,
  type SectionNavigationOptions,
} from "./components/SceneNavigationContext";
import { useDocumentScrollLock } from "./components/useDocumentScrollLock";
import Arrival from "./scenes/Arrival";
import BehindTheWork from "./scenes/BehindTheWork";
import HallOfCreations from "./scenes/HallOfCreations";
import QuestBoard from "./scenes/QuestBoard";
import ArcaneFoundry from "./scenes/ArcaneFoundry";
import SignalObservatory from "./scenes/SignalObservatory";
import JourneysHorizon, { PortfolioFooter } from "./scenes/JourneysHorizon";

const SCENES = [
  { id: "arrival", label: "Introduction", Component: Arrival },
  { id: "behind-the-work", label: "About", Component: BehindTheWork },
  { id: "featured-work", label: "Selected Work", Component: HallOfCreations },
  { id: "quest-board", label: "Services", Component: QuestBoard },
  { id: "craft", label: "Technology", Component: ArcaneFoundry },
  { id: "connect", label: "Contact", Component: SignalObservatory },
  { id: "ending", label: "Closing", Component: JourneysHorizon },
] as const;

const RELOAD_POSITION_KEY = "jbta-portfolio-reload-position";

function getSectionIndexFromHash() {
  const hash = window.location.hash.slice(1).toLowerCase();
  const index = SCENES.findIndex((scene) => scene.id === hash);
  return index === -1 ? 0 : index;
}

function App() {
  const prefersReducedMotion = useReducedMotion();
  const [introActive, setIntroActive] = useState(shouldShowPortfolioIntro);
  const [documentReady, setDocumentReady] = useState(() => !introActive);
  const [activeScene, setActiveScene] = useState(getSectionIndexFromHash);

  useDocumentScrollLock(introActive);

  useEffect(() => {
    const rememberPosition = () => {
      const body = document.body;
      const locked = body.style.position === "fixed";
      try {
        // Save only on document departure, never on every passive scroll.
        sessionStorage.setItem(RELOAD_POSITION_KEY, JSON.stringify({
          url: window.location.href,
          left: locked ? -parseFloat(body.style.left) || 0 : window.scrollX,
          top: locked ? -parseFloat(body.style.top) || 0 : window.scrollY,
        }));
      } catch {
        // Storage restrictions must not interfere with native navigation.
      }
    };
    window.addEventListener("pagehide", rememberPosition);
    return () => window.removeEventListener("pagehide", rememberPosition);
  }, []);

  const navigateToScene = useCallback(
    (sectionIndex: number, options: SectionNavigationOptions = {}) => {
      if (introActive) return;
      const section = SCENES[Math.max(0, Math.min(SCENES.length - 1, sectionIndex))];
      const target = document.getElementById(section.id);
      if (!target) return;

      // Explicit actions own the hash; passive scrolling only updates the navigator.
      if (window.location.hash !== `#${section.id}`) {
        window.history.pushState(null, "", `#${section.id}`);
      }
      target.scrollIntoView({
        block: "start",
        behavior: prefersReducedMotion ? "instant" : "smooth",
      });
      if (options.focus) {
        target.querySelector<HTMLElement>("[data-section-heading]")?.focus({ preventScroll: true });
      }
    },
    [introActive, prefersReducedMotion],
  );

  useEffect(() => {
    if (!documentReady) return;
    const targets = SCENES.map((scene, index) => ({
      element: document.getElementById(scene.id),
      index,
    }));
    // The page-level footer belongs to the final section's navigator state.
    targets.push({ element: document.querySelector("[data-portfolio-footer]"), index: SCENES.length - 1 });
    let observer: IntersectionObserver;
    const observeSections = () => {
      observer?.disconnect();
      const intersecting = new Map<Element, number>();
      const activationY = Math.round(window.innerHeight * 0.28);
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const index = targets.find((target) => target.element === entry.target)?.index;
            if (index === undefined) return;
            if (entry.isIntersecting) intersecting.set(entry.target, index);
            else intersecting.delete(entry.target);
          });
          if (!intersecting.size) return;
          const nextIndex = Math.max(...intersecting.values());
          setActiveScene((current) => current === nextIndex ? current : nextIndex);
        },
        {
          root: null,
          // A one-pixel activation rail works for both short and very tall sections.
          rootMargin: `-${activationY}px 0px -${Math.max(0, window.innerHeight - activationY - 1)}px 0px`,
          threshold: 0,
        },
      );
      targets.forEach(({ element }) => { if (element) observer.observe(element); });
    };
    observeSections();
    window.addEventListener("resize", observeSections, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", observeSections);
    };
  }, [documentReady]);

  useEffect(() => {
    if (!documentReady || introActive) return;
    let firstFrame = 0;
    let secondFrame = 0;
    const positionInitialHash = () => {
      firstFrame = window.requestAnimationFrame(() => {
        secondFrame = window.requestAnimationFrame(() => {
          const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
          if (navigation?.type === "reload") {
            try {
              const saved: unknown = JSON.parse(sessionStorage.getItem(RELOAD_POSITION_KEY) ?? "null");
              if (saved && typeof saved === "object" && "url" in saved && saved.url === window.location.href &&
                  "top" in saved && typeof saved.top === "number" && Number.isFinite(saved.top) && saved.top >= 0 &&
                  "left" in saved && typeof saved.left === "number" && Number.isFinite(saved.left)) {
                // Native restoration can run before React has mounted the tall
                // document. Correct only a demonstrated reload-position miss.
                if (Math.abs(window.scrollY - saved.top) > 1 || Math.abs(window.scrollX - saved.left) > 1) {
                  window.scrollTo({ top: saved.top, left: saved.left, behavior: "instant" });
                }
                return;
              }
            } catch {
              // Invalid/unavailable storage falls back to the native hash.
            }
          }
          // Let the browser restore an exact position on refresh/history first.
          // A first-session intro can delay mounting the native hash destination.
          if (window.scrollY > 1) return;
          const hash = window.location.hash.slice(1).toLowerCase();
          if (!SCENES.some((scene) => scene.id === hash)) return;
          document.getElementById(hash)?.scrollIntoView({ behavior: "instant", block: "start" });
        });
      });
    };
    if (document.readyState === "complete") positionInitialHash();
    else window.addEventListener("load", positionInitialHash, { once: true });
    return () => {
      window.removeEventListener("load", positionInitialHash);
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
    };
  }, [documentReady, introActive]);

  const navigationValue = useMemo(() => ({ navigateToScene }), [navigateToScene]);
  const revealDocument = useCallback(() => setDocumentReady(true), []);
  const completeIntro = useCallback(() => {
    setDocumentReady(true);
    setIntroActive(false);
  }, []);

  return (
    <SceneNavigationContext.Provider value={navigationValue}>
      <div className="portfolio-world-shell relative isolate">
        <PortfolioCursor />
        {documentReady && (
          <div aria-hidden={introActive || undefined} inert={introActive}>
            <FloatingAIButton />
            <ThemeToggle />
            <main id="portfolio-world" className="portfolio-world relative">
              {SCENES.map(({ id, Component }) => <Component key={id} />)}
            </main>
            <PortfolioFooter />
            <SceneNavigationControl
              scenes={SCENES}
              activeScene={activeScene}
              onMove={(amount, options) => navigateToScene(activeScene + amount, options)}
              onSelectScene={navigateToScene}
            />
          </div>
        )}
        {introActive && <PortfolioIntro onRevealStart={revealDocument} onComplete={completeIntro} />}
      </div>
    </SceneNavigationContext.Provider>
  );
}

export default App;

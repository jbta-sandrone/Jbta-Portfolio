import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

type SceneItem = {
  label: string;
};

type SceneNavigationControlProps = {
  scenes: readonly SceneItem[];
  activeScene: number;
  isTransitioning: boolean;
  onMove: (direction: 1 | -1) => void;
  onSelectScene: (sceneIndex: number) => void;
};

const menuEase = [0.65, 0, 0.35, 1] as const;

export default function SceneNavigationControl({
  scenes,
  activeScene,
  isTransitioning,
  onMove,
  onSelectScene,
}: SceneNavigationControlProps) {
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = prefersReducedMotion !== false;
  const [menuOpen, setMenuOpen] = useState(false);
  const navigationRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const closeMenu = useCallback((restoreFocus = true) => {
    setMenuOpen(false);
    if (restoreFocus) {
      window.requestAnimationFrame(() => triggerRef.current?.focus());
    }
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const focusFrame = window.requestAnimationFrame(() => {
      itemRefs.current[activeScene]?.focus();
    });

    const handlePointerDown = (event: PointerEvent) => {
      if (
        navigationRef.current &&
        !navigationRef.current.contains(event.target as Node)
      ) {
        closeMenu();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      closeMenu();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [activeScene, closeMenu, menuOpen]);

  const toggleMenu = () => {
    if (menuOpen) {
      closeMenu();
      return;
    }

    setMenuOpen(true);
  };

  const selectScene = (sceneIndex: number) => {
    closeMenu();
    onSelectScene(sceneIndex);
  };

  const handleMenuKeyDown = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
    itemIndex: number,
  ) => {
    let nextIndex: number | null = null;

    if (event.key === "ArrowDown") {
      nextIndex = (itemIndex + 1) % scenes.length;
    } else if (event.key === "ArrowUp") {
      nextIndex = (itemIndex - 1 + scenes.length) % scenes.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = scenes.length - 1;
    } else if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      closeMenu();
      return;
    }

    if (nextIndex === null) return;
    event.preventDefault();
    event.stopPropagation();
    itemRefs.current[nextIndex]?.focus();
  };

  return (
    <nav
      ref={navigationRef}
      aria-label="Scene navigation"
      className="portfolio-navigation fixed right-4 z-30 flex items-center gap-1 rounded-full border p-1.5 md:right-8"
      style={{ bottom: "max(1rem, env(safe-area-inset-bottom))" }}
    >
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="scene-selection-menu"
            role="menu"
            aria-label="Select a scene"
            onWheel={(event) => event.stopPropagation()}
            onTouchStart={(event) => event.stopPropagation()}
            onTouchMove={(event) => event.stopPropagation()}
            onTouchEnd={(event) => event.stopPropagation()}
            initial={
              reducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 8, scale: 0.96, filter: "blur(4px)" }
            }
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={
              reducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 6, scale: 0.97, filter: "blur(3px)" }
            }
            transition={{
              duration: reducedMotion ? 0.1 : 0.24,
              ease: menuEase,
            }}
            style={{
              maxHeight:
                "calc(100dvh - 7rem - env(safe-area-inset-bottom))",
            }}
            className="portfolio-navigation absolute bottom-full left-1/2 mb-3 w-52 max-w-[calc(100vw-2rem)] -translate-x-1/2 origin-bottom overflow-x-hidden overflow-y-auto rounded-2xl border p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.42),0_0_24px_var(--portfolio-glow)] [scrollbar-width:none] sm:mb-4 [&::-webkit-scrollbar]:hidden"
          >
            <ol className="space-y-1">
              {scenes.map((scene, index) => {
                const active = activeScene === index;

                return (
                  <li key={scene.label}>
                    <motion.button
                      ref={(element) => {
                        itemRefs.current[index] = element;
                      }}
                      type="button"
                      role="menuitem"
                      aria-current={active ? "page" : undefined}
                      data-cursor-label={scene.label}
                      disabled={isTransitioning}
                      onClick={() => selectScene(index)}
                      onKeyDown={(event) => handleMenuKeyDown(event, index)}
                      whileHover={reducedMotion ? undefined : { scale: 1.015 }}
                      whileTap={reducedMotion ? undefined : { scale: 0.98 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className={`portfolio-focus group relative flex min-h-11 w-full items-center rounded-xl border px-4 text-left text-sm transition-[background-color,border-color,color,box-shadow] duration-200 disabled:pointer-events-none disabled:opacity-45 ${
                        active
                          ? "border-[rgba(253,230,138,0.25)] bg-[var(--portfolio-accent-soft)] text-[var(--portfolio-accent-bright)] shadow-[0_0_14px_var(--portfolio-glow)]"
                          : "border-transparent text-[var(--portfolio-text-muted)] hover:border-[var(--portfolio-border-subtle)] hover:bg-white/[0.06] hover:text-[var(--portfolio-text-soft)]"
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="scene-menu-active-indicator"
                          aria-hidden="true"
                          className="absolute left-1 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-[var(--portfolio-accent-strong)] shadow-[0_0_9px_var(--portfolio-glow)]"
                          transition={{
                            duration: reducedMotion ? 0.1 : 0.3,
                            ease: menuEase,
                          }}
                        />
                      )}
                      <span className="font-medium">{scene.label}</span>
                    </motion.button>
                  </li>
                );
              })}
            </ol>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        aria-label="Previous scene"
        data-cursor-label="Previous"
        onClick={() => onMove(-1)}
        disabled={activeScene === 0 || isTransitioning}
        className="portfolio-navigation-button portfolio-focus flex size-11 items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-25"
      >
        <ChevronUp aria-hidden="true" className="size-5" />
      </button>

      <button
        ref={triggerRef}
        type="button"
        aria-label={menuOpen ? "Close scene navigation" : "Open scene navigation"}
        aria-expanded={menuOpen}
        aria-controls="scene-selection-menu"
        aria-haspopup="menu"
        data-cursor-label="Scenes"
        onClick={toggleMenu}
        className={`portfolio-focus min-h-11 min-w-16 rounded-full px-2 text-center text-xs font-medium tracking-[0.18em] tabular-nums transition-[background-color,color,box-shadow] duration-200 ${
          menuOpen
            ? "bg-[var(--portfolio-accent-soft)] text-[var(--portfolio-accent-bright)] shadow-[0_0_14px_var(--portfolio-glow)]"
            : "portfolio-copy hover:bg-white/[0.06] hover:text-[var(--portfolio-text-soft)]"
        }`}
      >
        <span aria-live="polite" aria-atomic="true">
          <span className="sr-only">{scenes[activeScene]?.label}, scene </span>
          {activeScene + 1} / {scenes.length}
        </span>
      </button>

      <button
        type="button"
        aria-label="Next scene"
        data-cursor-label="Next"
        onClick={() => onMove(1)}
        disabled={activeScene === scenes.length - 1 || isTransitioning}
        className="portfolio-navigation-button portfolio-focus flex size-11 items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-25"
      >
        <ChevronDown aria-hidden="true" className="size-5" />
      </button>
    </nav>
  );
}

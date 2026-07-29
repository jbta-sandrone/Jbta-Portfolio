import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import "../styles/scene-navigation.css";

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

function PixelTravelArrow({ direction }: { direction: "previous" | "next" }) {
  return (
    <span
      aria-hidden="true"
      className={`scene-travel-arrow scene-travel-arrow--${direction}`}
    >
      <i />
      <i />
      <i />
    </span>
  );
}

export default function SceneNavigationControl({
  scenes,
  activeScene,
  isTransitioning,
  onMove,
  onSelectScene,
}: SceneNavigationControlProps) {
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = Boolean(prefersReducedMotion);
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
      className="scene-travel-nav"
    >
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="scene-selection-menu"
            role="menu"
            aria-label="Select a journey destination"
            onWheel={(event) => event.stopPropagation()}
            onTouchStart={(event) => event.stopPropagation()}
            onTouchMove={(event) => event.stopPropagation()}
            onTouchEnd={(event) => event.stopPropagation()}
            initial={
              reducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 7, scale: 0.97 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              reducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 5, scale: 0.98 }
            }
            transition={{
              duration: reducedMotion ? 0.08 : 0.22,
              ease: menuEase,
            }}
            style={{
              maxHeight:
                "calc(100dvh - 7.5rem - env(safe-area-inset-bottom))",
            }}
            className="scene-travel-menu"
          >
            <span aria-hidden="true" className="scene-travel-menu__pin scene-travel-menu__pin--left" />
            <span aria-hidden="true" className="scene-travel-menu__pin scene-travel-menu__pin--right" />

            <header className="scene-travel-menu__header">
              <span aria-hidden="true" className="scene-travel-menu__compass">
                <i />
              </span>
              <div>
                <p>Adventurer&apos;s Map</p>
                <span>Choose destination</span>
              </div>
            </header>

            <ol className="scene-travel-menu__route">
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
                      whileTap={reducedMotion ? undefined : { y: 2 }}
                      transition={{ duration: 0.1, ease: "easeOut" }}
                      className={`scene-travel-destination portfolio-focus${active ? " is-active" : ""}`}
                    >
                      <span aria-hidden="true" className="scene-travel-destination__marker">
                        <i />
                      </span>
                      <span className="scene-travel-destination__label">{scene.label}</span>
                      {active && (
                        <motion.span
                          layoutId="scene-travel-active-flag"
                          aria-hidden="true"
                          className="scene-travel-destination__flag"
                          transition={{
                            duration: reducedMotion ? 0.08 : 0.26,
                            ease: menuEase,
                          }}
                        >
                          <i />
                        </motion.span>
                      )}
                      <span aria-hidden="true" className="scene-travel-destination__spark">+</span>
                    </motion.button>
                  </li>
                );
              })}
            </ol>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="scene-travel-controls">
        <span aria-hidden="true" className="scene-travel-controls__corner scene-travel-controls__corner--left" />
        <span aria-hidden="true" className="scene-travel-controls__corner scene-travel-controls__corner--right" />

        <button
          type="button"
          aria-label="Previous scene"
          data-cursor-label="Previous"
          onClick={() => onMove(-1)}
          disabled={activeScene === 0 || isTransitioning}
          className="scene-travel-step portfolio-focus"
        >
          <PixelTravelArrow direction="previous" />
        </button>

        <button
          ref={triggerRef}
          type="button"
          aria-label={menuOpen ? "Close scene navigation" : "Open scene navigation"}
          aria-expanded={menuOpen}
          aria-controls="scene-selection-menu"
          aria-haspopup="menu"
          data-cursor-label="Journey Map"
          onClick={toggleMenu}
          className={`scene-travel-current portfolio-focus${menuOpen ? " is-open" : ""}`}
        >
          <span className="scene-travel-current__eyebrow">Journey Map</span>
          <span aria-live="polite" aria-atomic="true" className="scene-travel-current__label">
            {scenes[activeScene]?.label}
          </span>
          <span aria-hidden="true" className="scene-travel-current__notch" />
        </button>

        <button
          type="button"
          aria-label="Next scene"
          data-cursor-label="Next"
          onClick={() => onMove(1)}
          disabled={activeScene === scenes.length - 1 || isTransitioning}
          className="scene-travel-step portfolio-focus"
        >
          <PixelTravelArrow direction="next" />
        </button>
      </div>
    </nav>
  );
}

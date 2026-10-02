import {
  useCallback, useEffect, useRef, useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, List } from "lucide-react";
import "../styles/scene-navigation.css";
import type { SectionNavigationOptions } from "./SceneNavigationContext";

type SceneItem = { label: string };
type SceneNavigationControlProps = {
  scenes: readonly SceneItem[];
  activeScene: number;
  onMove: (direction: 1 | -1, options?: SectionNavigationOptions) => void;
  onSelectScene: (sceneIndex: number, options?: SectionNavigationOptions) => void;
};

export default function SceneNavigationControl({
  scenes, activeScene, onMove, onSelectScene,
}: SceneNavigationControlProps) {
  const reducedMotion = Boolean(useReducedMotion());
  const [menuOpen, setMenuOpen] = useState(false);
  const navigationRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeSceneRef = useRef(activeScene);
  useEffect(() => { activeSceneRef.current = activeScene; }, [activeScene]);
  const closeMenu = useCallback((restoreFocus = true) => {
    setMenuOpen(false);
    if (restoreFocus) window.requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);
  useEffect(() => {
    if (!menuOpen) return;
    const focusFrame = window.requestAnimationFrame(() => itemRefs.current[activeSceneRef.current]?.focus());
    const handlePointerDown = (event: PointerEvent) => {
      if (navigationRef.current && !navigationRef.current.contains(event.target as Node)) {
        closeMenu(false);
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
  }, [closeMenu, menuOpen]);
  const toggleMenu = () => menuOpen ? closeMenu() : setMenuOpen(true);
  const selectScene = (sceneIndex: number, keyboard: boolean) => {
    closeMenu(!keyboard);
    onSelectScene(sceneIndex, { focus: keyboard });
  };
  const handleMenuKeyDown = (
    event: ReactKeyboardEvent<HTMLButtonElement>, itemIndex: number,
  ) => {
    let nextIndex: number | null = null;
    if (event.key === "ArrowDown") nextIndex = (itemIndex + 1) % scenes.length;
    else if (event.key === "ArrowUp") nextIndex = (itemIndex - 1 + scenes.length) % scenes.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = scenes.length - 1;
    else if (event.key === "Escape") {
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
    <nav ref={navigationRef} aria-label="Portfolio section navigation" className="scene-nav professional-theme">
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="scene-selection-menu"
            role="menu"
            aria-label="Portfolio sections"
            onWheel={(event) => event.stopPropagation()}
            onTouchStart={(event) => event.stopPropagation()}
            onTouchMove={(event) => event.stopPropagation()}
            onTouchEnd={(event) => event.stopPropagation()}
            initial={{ opacity: 0, y: reducedMotion ? 0 : 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reducedMotion ? 0 : 4 }}
            transition={{ duration: reducedMotion ? 0.01 : 0.18 }}
            className="scene-nav__menu"
          >
            <div className="scene-nav__menu-header">
              <span>SECTIONS</span><span>01—07</span>
            </div>
            <ol className="scene-nav__list">
              {scenes.map((scene, index) => {
                const active = activeScene === index;
                return (
                  <li key={scene.label}>
                    <button
                      ref={(element) => { itemRefs.current[index] = element; }}
                      type="button"
                      role="menuitem"
                      aria-current={active ? "page" : undefined}
                      data-cursor-label={scene.label}
                      onClick={(event) => selectScene(index, event.detail === 0)}
                      onKeyDown={(event) => handleMenuKeyDown(event, index)}
                      className={`scene-nav__item${active ? " is-active" : ""}`}
                    >
                      <span className="scene-nav__number">{String(index + 1).padStart(2, "0")}</span>
                      <span>{scene.label}</span>
                      <span className="scene-nav__item-state" aria-hidden="true">{active ? "●" : "↗"}</span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="scene-nav__controls">
        <button
          type="button"
          aria-label="Previous section"
          data-cursor-label="Previous"
          onClick={(event) => onMove(-1, { focus: event.detail === 0 })}
          disabled={activeScene === 0}
          className="scene-nav__step"
        ><ArrowLeft size={17} aria-hidden="true" /></button>
        <button
          ref={triggerRef}
          type="button"
          aria-label={menuOpen ? "Close section navigation" : "Open section navigation"}
          aria-expanded={menuOpen}
          aria-controls="scene-selection-menu"
          aria-haspopup="menu"
          data-cursor-label="Sections"
          onClick={toggleMenu}
          className={`scene-nav__current${menuOpen ? " is-open" : ""}`}
        >
          <span className="scene-nav__current-number">{String(activeScene + 1).padStart(2, "0")} / {String(scenes.length).padStart(2, "0")}</span>
          <span className="scene-nav__current-label">{scenes[activeScene]?.label}</span>
          <List size={15} aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label="Next section"
          data-cursor-label="Next"
          onClick={(event) => onMove(1, { focus: event.detail === 0 })}
          disabled={activeScene === scenes.length - 1}
          className="scene-nav__step"
        ><ArrowRight size={17} aria-hidden="true" /></button>
      </div>
    </nav>
  );
}

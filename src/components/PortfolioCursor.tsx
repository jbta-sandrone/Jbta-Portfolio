import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion } from "motion/react";
import "../styles/portfolio-cursor.css";

type CursorMode = "default" | "pointer" | "text" | "drag" | "disabled";

const interactiveSelector = [
  "a[href]",
  "button:not(:disabled)",
  "select:not(:disabled)",
  "label[for]",
  'input[type="button"]:not(:disabled)',
  'input[type="submit"]:not(:disabled)',
  'input[type="reset"]:not(:disabled)',
  'input[type="checkbox"]:not(:disabled)',
  'input[type="radio"]:not(:disabled)',
  'input[type="range"]:not(:disabled)',
  'input[type="color"]:not(:disabled)',
  'input[type="file"]:not(:disabled)',
  '[role="button"]',
  '[role="link"]',
  "[data-cursor-interactive]",
].join(",");

const disabledSelector = [
  "button:disabled",
  "input:disabled",
  "select:disabled",
  "textarea:disabled",
  '[aria-disabled="true"]',
].join(",");

const textSelector = [
  "input:not([type])",
  'input[type="text"]',
  'input[type="email"]',
  'input[type="password"]',
  'input[type="search"]',
  'input[type="tel"]',
  'input[type="url"]',
  'input[type="number"]',
  "textarea",
  '[contenteditable="true"]',
].join(",");

const dragSelector = [
  '[draggable="true"]',
  "[data-cursor-drag]",
  '[aria-grabbed="true"]',
].join(",");

function PixelCursorGlyph({ mode }: { mode: CursorMode }) {
  if (mode === "pointer") {
    return (
      <svg viewBox="0 0 24 28" className="pixel-cursor__glyph" shapeRendering="crispEdges">
        <path d="M8 1h5v3h3v3h3v3h3v10h-3v5H8v-3H5V10h3V1Z" className="pixel-cursor__outline" />
        <path d="M10 3h2v10h2V7h2v8h2v-4h2v8h-3v4H9v-3H7v-8h2v5h1V3Z" className="pixel-cursor__cream" />
        <rect x="10" y="3" width="2" height="7" className="pixel-cursor__amber" />
      </svg>
    );
  }

  if (mode === "text") {
    return (
      <svg viewBox="0 0 20 28" className="pixel-cursor__glyph" shapeRendering="crispEdges">
        <path d="M4 2h12v4h-4v16h4v4H4v-4h4V6H4V2Z" className="pixel-cursor__outline" />
        <path d="M6 3h8v2h-4v18h4v2H6v-2h3V5H6V3Z" className="pixel-cursor__cream" />
        <rect x="9" y="7" width="2" height="14" className="pixel-cursor__amber" />
      </svg>
    );
  }

  if (mode === "drag") {
    return (
      <svg viewBox="0 0 28 28" className="pixel-cursor__glyph" shapeRendering="crispEdges">
        <path d="M11 1h6v5h4V9h6v6h-6v4h-4v8h-6v-8H7v-4H1V9h6V6h4V1Z" className="pixel-cursor__outline" />
        <path d="M13 4h2v6h5V8l4 4-4 4v-3h-5v7h3l-4 4-4-4h3v-7H8v3l-4-4 4-4v2h5V4Z" className="pixel-cursor__cream" />
        <rect x="12" y="11" width="4" height="4" className="pixel-cursor__amber" />
      </svg>
    );
  }

  if (mode === "disabled") {
    return (
      <svg viewBox="0 0 28 28" className="pixel-cursor__glyph" shapeRendering="crispEdges">
        <path d="M8 2h12v3h4v4h3v11h-3v4h-4v3H8v-3H4v-4H1V9h3V5h4V2Z" className="pixel-cursor__outline" />
        <path d="M9 5h10v3h3v3h2v7h-2v2L8 7l1-2Zm-3 5 12 12H9v-3H6v-3H4v-5l2-1Z" className="pixel-cursor__cream" />
        <path d="M7 6h3l12 12v3h-3L7 9V6Z" className="pixel-cursor__muted-red" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 28" className="pixel-cursor__glyph" shapeRendering="crispEdges">
      <path d="M2 1h5v3h3v3h3v3h3v3h3v5h-5v3h3v5h-6v-3H8v5H3V4H2V1Z" className="pixel-cursor__outline" />
      <path d="M5 4h2v3h3v3h3v3h3v2h-5v3H8v5H5V4Z" className="pixel-cursor__cream" />
      <path d="M6 5h1v3h3v3h3v2H9v3H7v5H6V5Z" className="pixel-cursor__amber" />
    </svg>
  );
}

export default function PortfolioCursor() {
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = Boolean(prefersReducedMotion);
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<CursorMode>("default");
  const [pressed, setPressed] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const cursorStateRef = useRef({
    visible: false,
    mode: "default" as CursorMode,
    label: null as string | null,
  });
  const hoveredTargetRef = useRef<EventTarget | null>(null);
  const pointerX = useMotionValue(-48);
  const pointerY = useMotionValue(-48);

  useEffect(() => {
    const finePointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");

    const syncCapability = () => {
      const nextEnabled = finePointerQuery.matches;
      setEnabled(nextEnabled);
      document.documentElement.classList.toggle("portfolio-cursor-enabled", nextEnabled);

      if (!nextEnabled) {
        cursorStateRef.current = { visible: false, mode: "default", label: null };
        hoveredTargetRef.current = null;
        setVisible(false);
        setMode("default");
        setPressed(false);
        setLabel(null);
      }
    };

    syncCapability();
    finePointerQuery.addEventListener("change", syncCapability);

    return () => {
      finePointerQuery.removeEventListener("change", syncCapability);
      document.documentElement.classList.remove("portfolio-cursor-enabled");
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const commitCursorState = (
      nextVisible: boolean,
      nextMode: CursorMode,
      nextLabel: string | null,
    ) => {
      const current = cursorStateRef.current;

      if (current.visible !== nextVisible) setVisible(nextVisible);
      if (current.mode !== nextMode) setMode(nextMode);
      if (current.label !== nextLabel) setLabel(nextLabel);

      cursorStateRef.current = {
        visible: nextVisible,
        mode: nextMode,
        label: nextLabel,
      };
    };

    const inspectTarget = (target: EventTarget | null) => {
      const element = target instanceof Element ? target : null;
      const disabledTarget = element?.closest<HTMLElement>(disabledSelector) ?? null;
      const textTarget = element?.closest<HTMLElement>(textSelector) ?? null;
      const dragTarget = element?.closest<HTMLElement>(dragSelector) ?? null;
      const interactiveTarget = element?.closest<HTMLElement>(interactiveSelector) ?? null;

      const nextMode: CursorMode = disabledTarget
        ? "disabled"
        : textTarget
          ? "text"
          : dragTarget
            ? "drag"
            : interactiveTarget
              ? "pointer"
              : "default";

      const labelledTarget = disabledTarget ?? dragTarget ?? interactiveTarget;
      const nextLabel = labelledTarget?.dataset.cursorLabel?.trim() || null;

      commitCursorState(true, nextMode, nextLabel);
    };

    const handlePointerMove = (event: PointerEvent) => {
      pointerX.set(event.clientX - 2);
      pointerY.set(event.clientY - 2);
      if (hoveredTargetRef.current !== event.target) {
        hoveredTargetRef.current = event.target;
        inspectTarget(event.target);
      }
    };
    const handlePointerDown = () => setPressed(true);
    const handlePointerUp = () => setPressed(false);
    const handlePointerOut = (event: PointerEvent) => {
      if (!event.relatedTarget) {
        hoveredTargetRef.current = null;
        commitCursorState(false, "default", null);
        setPressed(false);
      }
    };
    const handleWindowBlur = () => {
      hoveredTargetRef.current = null;
      commitCursorState(false, "default", null);
      setPressed(false);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    window.addEventListener("pointercancel", handlePointerUp, { passive: true });
    window.addEventListener("pointerout", handlePointerOut, { passive: true });
    window.addEventListener("blur", handleWindowBlur);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
      window.removeEventListener("pointerout", handlePointerOut);
      window.removeEventListener("blur", handleWindowBlur);
    };
  }, [enabled, pointerX, pointerY]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className={`pixel-cursor pixel-cursor--${mode}${pressed ? " is-pressed" : ""}`}
      style={{ x: pointerX, y: pointerY }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.08, ease: "easeOut" }}
    >
      <PixelCursorGlyph mode={mode} />

      <AnimatePresence>
        {label ? (
          <motion.span
            className="pixel-cursor__label"
            initial={{ opacity: 0, x: reducedMotion ? 0 : -2 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.12, ease: "easeOut" }}
          >
            {label}
          </motion.span>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}

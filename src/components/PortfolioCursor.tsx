import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useMotionValue, useReducedMotion } from "motion/react";
import "../styles/portfolio-cursor.css";

type CursorMode = "default" | "pointer" | "text" | "drag" | "disabled";

const interactiveSelector = [
  "a[href]", "button:not(:disabled)", "select:not(:disabled)", "label[for]",
  'input[type="button"]:not(:disabled)', 'input[type="submit"]:not(:disabled)',
  'input[type="reset"]:not(:disabled)', 'input[type="checkbox"]:not(:disabled)',
  'input[type="radio"]:not(:disabled)', 'input[type="range"]:not(:disabled)',
  'input[type="color"]:not(:disabled)', 'input[type="file"]:not(:disabled)',
  '[role="button"]', '[role="link"]', "[data-cursor-interactive]",
].join(",");
const disabledSelector = [
  "button:disabled", "input:disabled", "select:disabled", "textarea:disabled",
  '[aria-disabled="true"]',
].join(",");
const textSelector = [
  "input:not([type])", 'input[type="text"]', 'input[type="email"]',
  'input[type="password"]', 'input[type="search"]', 'input[type="tel"]',
  'input[type="url"]', 'input[type="number"]', "textarea",
  '[contenteditable="true"]',
].join(",");
const dragSelector = ['[draggable="true"]', "[data-cursor-drag]", '[aria-grabbed="true"]'].join(",");

export default function PortfolioCursor() {
  const reducedMotion = Boolean(useReducedMotion());
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<CursorMode>("default");
  const [pressed, setPressed] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [labelLeft, setLabelLeft] = useState(false);
  const [labelAbove, setLabelAbove] = useState(false);
  const cursorStateRef = useRef({ visible: false, mode: "default" as CursorMode, label: null as string | null });
  const labelPositionRef = useRef({ left: false, above: false });
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
    const commitCursorState = (nextVisible: boolean, nextMode: CursorMode, nextLabel: string | null) => {
      const current = cursorStateRef.current;
      if (current.visible !== nextVisible) setVisible(nextVisible);
      if (current.mode !== nextMode) setMode(nextMode);
      if (current.label !== nextLabel) setLabel(nextLabel);
      cursorStateRef.current = { visible: nextVisible, mode: nextMode, label: nextLabel };
    };
    const inspectTarget = (target: EventTarget | null) => {
      const element = target instanceof Element ? target : null;
      const disabledTarget = element?.closest<HTMLElement>(disabledSelector) ?? null;
      const textTarget = element?.closest<HTMLElement>(textSelector) ?? null;
      const dragTarget = element?.closest<HTMLElement>(dragSelector) ?? null;
      const interactiveTarget = element?.closest<HTMLElement>(interactiveSelector) ?? null;
      const nextMode: CursorMode = disabledTarget ? "disabled" : textTarget ? "text" : dragTarget ? "drag" : interactiveTarget ? "pointer" : "default";
      const labelledTarget = disabledTarget ?? dragTarget ?? interactiveTarget;
      const rawLabel = labelledTarget?.dataset.cursorLabel?.trim() || null;
      commitCursorState(true, nextMode, rawLabel === "Craft" ? "Technology" : rawLabel);
    };
    const handlePointerMove = (event: PointerEvent) => {
      pointerX.set(event.clientX - 12);
      pointerY.set(event.clientY - 12);
      const nextLeft = event.clientX > window.innerWidth - 180;
      const nextAbove = event.clientY > window.innerHeight - 55;
      if (labelPositionRef.current.left !== nextLeft) setLabelLeft(nextLeft);
      if (labelPositionRef.current.above !== nextAbove) setLabelAbove(nextAbove);
      labelPositionRef.current = { left: nextLeft, above: nextAbove };
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

  // Project Notes is portaled to document.body. Keep the decorative cursor in
  // the same top-level stacking context, outside the isolated application root.
  return createPortal(
    <motion.div
      aria-hidden="true"
      className={`portfolio-cursor portfolio-cursor--${mode}${pressed ? " is-pressed" : ""}${labelLeft ? " portfolio-cursor--label-left" : ""}${labelAbove ? " portfolio-cursor--label-above" : ""}`}
      style={{ x: pointerX, y: pointerY }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.08, ease: "easeOut" }}
    >
      <span className="portfolio-cursor__ring" />
      <span className="portfolio-cursor__dot" />
      <AnimatePresence>
        {label ? (
          <motion.span
            className="portfolio-cursor__label"
            initial={{ opacity: 0, x: reducedMotion ? 0 : -2 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.12, ease: "easeOut" }}
          >{label}</motion.span>
        ) : null}
      </AnimatePresence>
    </motion.div>,
    document.body,
  );
}

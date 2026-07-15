import { useEffect, useRef, useState } from "react";
import { MousePointer2 } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";

const interactiveSelector = [
  "a[href]",
  "button:not(:disabled)",
  '[role="button"]',
  '[role="link"]',
  "[data-cursor-interactive]",
].join(",");

const nativeCursorSelector = [
  "input",
  "textarea",
  "select",
  '[contenteditable="true"]',
  "[data-native-cursor]",
].join(",");

export default function PortfolioCursor() {
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = Boolean(prefersReducedMotion);
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [interactive, setInteractive] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const cursorStateRef = useRef({ visible: false, interactive: false, label: null as string | null });
  const hoveredTargetRef = useRef<EventTarget | null>(null);
  const pointerX = useMotionValue(-48);
  const pointerY = useMotionValue(-48);
  const smoothX = useSpring(pointerX, { stiffness: 920, damping: 58, mass: 0.09 });
  const smoothY = useSpring(pointerY, { stiffness: 920, damping: 58, mass: 0.09 });

  useEffect(() => {
    const finePointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");

    const syncCapability = () => {
      const nextEnabled = finePointerQuery.matches;
      setEnabled(nextEnabled);
      document.documentElement.classList.toggle("portfolio-cursor-enabled", nextEnabled);

      if (!nextEnabled) {
        cursorStateRef.current = { visible: false, interactive: false, label: null };
        hoveredTargetRef.current = null;
        setVisible(false);
        setInteractive(false);
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
      nextInteractive: boolean,
      nextLabel: string | null,
    ) => {
      const current = cursorStateRef.current;

      if (current.visible !== nextVisible) setVisible(nextVisible);
      if (current.interactive !== nextInteractive) setInteractive(nextInteractive);
      if (current.label !== nextLabel) setLabel(nextLabel);

      cursorStateRef.current = {
        visible: nextVisible,
        interactive: nextInteractive,
        label: nextLabel,
      };
    };

    const inspectTarget = (target: EventTarget | null) => {
      const element = target instanceof Element ? target : null;
      const nativeCursorTarget = element?.closest(nativeCursorSelector);

      if (nativeCursorTarget) {
        commitCursorState(false, false, null);
        return;
      }

      const interactiveTarget = element?.closest<HTMLElement>(interactiveSelector) ?? null;
      const nextInteractive = Boolean(
        interactiveTarget &&
          interactiveTarget.getAttribute("aria-disabled") !== "true" &&
          !interactiveTarget.hasAttribute("disabled"),
      );

      commitCursorState(
        true,
        nextInteractive,
        nextInteractive
          ? interactiveTarget?.dataset.cursorLabel?.trim() || null
          : null,
      );
    };

    const handlePointerMove = (event: PointerEvent) => {
      pointerX.set(event.clientX - 12);
      pointerY.set(event.clientY - 12);
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
        commitCursorState(false, false, null);
        setPressed(false);
      }
    };
    const handleWindowBlur = () => {
      hoveredTargetRef.current = null;
      commitCursorState(false, false, null);
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
      className="pointer-events-none fixed left-0 top-0 z-[100] flex size-6 items-center justify-center rounded-full border bg-[rgba(23,19,15,0.84)] text-[var(--portfolio-accent-bright)] backdrop-blur-sm will-change-transform"
      style={{
        x: reducedMotion ? pointerX : smoothX,
        y: reducedMotion ? pointerY : smoothY,
      }}
      animate={{
        opacity: visible ? 1 : 0,
        scale: pressed ? 0.82 : interactive ? 1.24 : 1,
        borderColor: interactive
          ? "rgba(253,230,138,0.78)"
          : "rgba(253,230,138,0.42)",
        boxShadow: interactive
          ? "0 0 22px rgba(252,211,77,0.34)"
          : "0 0 12px rgba(252,211,77,0.16)",
      }}
      transition={{ duration: reducedMotion ? 0.06 : 0.13, ease: "easeOut" }}
    >
      <MousePointer2 className="size-3.5" strokeWidth={interactive ? 2.2 : 1.8} />

      <AnimatePresence>
        {interactive && label ? (
          <motion.span
            className="absolute left-7 top-1/2 w-max -translate-y-1/2 rounded-md border border-[var(--portfolio-border-subtle)] bg-[rgba(23,19,15,0.92)] px-2 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-[var(--portfolio-text-secondary)] shadow-lg backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0.06 : 0.14, ease: "easeOut" }}
          >
            {label}
          </motion.span>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}

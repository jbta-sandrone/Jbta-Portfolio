import { useLayoutEffect } from "react";

// Shared by the intro and modal documentation; non-modal NELI stays independent.
export function useDocumentScrollLock(locked: boolean) {
  useLayoutEffect(() => {
    if (!locked) return;
    const body = document.body;
    const root = document.documentElement;
    const position = { left: window.scrollX, top: window.scrollY };
    const savedBody = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      width: body.style.width,
      paddingRight: body.style.paddingRight,
    };
    const savedOverflow = root.style.overflow;
    const scrollbarWidth = window.innerWidth - root.clientWidth;
    if (!CSS.supports("scrollbar-gutter", "stable") && scrollbarWidth > 0) {
      body.style.paddingRight = `${parseFloat(getComputedStyle(body).paddingRight) + scrollbarWidth}px`;
    }
    root.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${position.top}px`;
    body.style.left = `-${position.left}px`;
    body.style.width = "100%";

    return () => {
      Object.assign(body.style, savedBody);
      root.style.overflow = savedOverflow;
      window.scrollTo({ ...position, behavior: "instant" });
    };
  }, [locked]);
}

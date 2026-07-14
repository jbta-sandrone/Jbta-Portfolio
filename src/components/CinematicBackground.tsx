import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { useReducedMotion } from "motion/react";
import eclipseBackground from "../assets/images/traveljourney.webp";

type CinematicBackgroundProps = {
  activeScene: number;
};

type CameraFrame = {
  xPercent: number;
  yPercent: number;
  scale: number;
  rotation: number;
};

const CAMERA_FRAMES = {
  desktop: [
  { xPercent: 0, yPercent: 0, scale: 1.02, rotation: 0 },
  { xPercent: -2, yPercent: -11, scale: 1.04, rotation: -0.3 },
  { xPercent: 2, yPercent: -25, scale: 1.06, rotation: 0.4 },
  { xPercent: -3, yPercent: -39, scale: 1.05, rotation: -0.25 },
  { xPercent: 1, yPercent: -51, scale: 1.04, rotation: 0.15 },
  { xPercent: 0, yPercent: -62, scale: 1.02, rotation: 0 },
],
  tablet: [
    { xPercent: 0, yPercent: 0, scale: 1.05, rotation: 0 },
    { xPercent: -1, yPercent: -10, scale: 1.08, rotation: -0.14 },
    { xPercent: 1, yPercent: -22, scale: 1.11, rotation: 0.18 },
    { xPercent: -1.25, yPercent: -34, scale: 1.09, rotation: -0.12 },
    { xPercent: 0.6, yPercent: -46, scale: 1.06, rotation: 0.08 },
    { xPercent: 0, yPercent: -57, scale: 1.03, rotation: 0 },
  ],
  mobile: [
    { xPercent: 0, yPercent: 0, scale: 1.05, rotation: 0 },
    { xPercent: -0.5, yPercent: -9, scale: 1.07, rotation: -0.06 },
    { xPercent: 0.5, yPercent: -20, scale: 1.1, rotation: 0.08 },
    { xPercent: -0.65, yPercent: -31, scale: 1.08, rotation: -0.06 },
    { xPercent: 0.3, yPercent: -43, scale: 1.05, rotation: 0.04 },
    { xPercent: 0, yPercent: -54, scale: 1.03, rotation: 0 },
  ],
} as const satisfies Record<"desktop" | "tablet" | "mobile", readonly CameraFrame[]>;

export default function CinematicBackground({
  activeScene,
}: CinematicBackgroundProps) {
  const cameraRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const camera = cameraRef.current;
    if (!camera) return;

    let tween: gsap.core.Tween | null = null;

    const moveCamera = () => {
      const frames = window.matchMedia("(max-width: 767.98px)").matches
        ? CAMERA_FRAMES.mobile
        : window.matchMedia("(max-width: 1023.98px)").matches
          ? CAMERA_FRAMES.tablet
          : CAMERA_FRAMES.desktop;
      const frame = frames[Math.min(activeScene, frames.length - 1)];

      tween?.kill();

      if (prefersReducedMotion !== false) {
        gsap.set(camera, frame);
      } else {
        tween = gsap.to(camera, {
          ...frame,
          duration: 1,
          ease: "power2.inOut",
          force3D: true,
          overwrite: "auto",
        });
      }
    };

    moveCamera();
    window.addEventListener("resize", moveCamera);

    return () => {
      window.removeEventListener("resize", moveCamera);
      tween?.kill();
    };
  }, [activeScene, prefersReducedMotion]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-black"
    >
      <div className="cinematic-background__stage">
        <div
          ref={cameraRef}
          className="cinematic-background__camera"
          data-cinematic-camera
        >
          <img
            src={eclipseBackground}
            alt=""
            draggable={false}
            decoding="async"
            fetchPriority="high"
            className="absolute inset-0 h-full w-full max-w-none select-none object-cover object-top"
          />
        </div>
      </div>

      <div className="absolute inset-0 bg-black/50" />
    </div>
  );
}

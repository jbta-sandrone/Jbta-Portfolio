import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { hero } from "../data/hero";

const easeOut = [0.22, 1, 0.36, 1] as const;

export default function SceneOne() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const contentY = useTransform(
    scrollYProgress,
    [0, 0.2, 0.65, 1],
    prefersReducedMotion
      ? ["0px", "0px", "0px", "0px"]
      : [
          "0px",
          "0px",
          "clamp(-112px, -15vw, -64px)",
          "clamp(-140px, -18vw, -80px)",
        ],
  );
  const nameY = useTransform(
    scrollYProgress,
    [0, 0.2, 0.45],
    prefersReducedMotion ? ["0px", "0px", "0px"] : ["0px", "-12px", "-44px"],
  );
  const nameOpacity = useTransform(
    scrollYProgress,
    [0, 0.18, 0.42],
    prefersReducedMotion ? [1, 1, 1] : [1, 0.75, 0],
  );
  const subheadlineY = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7],
    prefersReducedMotion ? ["0px", "0px", "0px"] : ["0px", "-18px", "-64px"],
  );
  const subheadlineOpacity = useTransform(
    scrollYProgress,
    [0, 0.28, 0.72],
    prefersReducedMotion ? [1, 1, 1] : [1, 0.82, 0],
  );
  const headlineScale = useTransform(
    scrollYProgress,
    [0, 0.2, 0.65, 1],
    prefersReducedMotion ? [1, 1, 1, 1] : [1, 1, 0.9, 0.84],
  );
  const headlineOpacity = useTransform(
    scrollYProgress,
    [0, 0.58, 1],
    prefersReducedMotion ? [1, 1, 1] : [1, 0.88, 0],
  );
  const headlineBlur = useTransform(
    scrollYProgress,
    [0, 0.65, 1],
    prefersReducedMotion
      ? ["blur(0px)", "blur(0px)", "blur(0px)"]
      : ["blur(0px)", "blur(0px)", "blur(clamp(6px, 1vw, 10px))"],
  );
  const scrollIndicatorOpacity = useTransform(
    scrollYProgress,
    [0, 0.12],
    prefersReducedMotion ? [1, 1] : [1, 0],
  );
  return (
    <section
      ref={sectionRef}
      data-cinematic-scene={1}
      aria-label="Introduction"
      className="relative min-h-[200vh] overflow-hidden text-white"
    >
      <div className="sticky top-0 flex min-h-screen items-center justify-center overflow-hidden px-6 py-20">
        <motion.div
          style={{
            y: contentY,
            willChange: prefersReducedMotion ? "auto" : "transform",
          }}
          className="relative z-10 mx-auto max-w-5xl text-center"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.14,
                delayChildren: 0.15,
              },
            },
          }}
        >
          <motion.div
            variants={{
              hidden: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 18 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.6, ease: easeOut },
              },
            }}
          >
            <motion.p
              style={{
                y: nameY,
                opacity: nameOpacity,
                willChange: prefersReducedMotion
                  ? "auto"
                  : "transform, opacity",
              }}
              className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-400 sm:text-sm"
            >
              {hero.name}
            </motion.p>
          </motion.div>

          <motion.div
            variants={{
              hidden: prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 36, filter: "blur(8px)" },
              visible: {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                transition: { duration: 0.9, ease: easeOut },
              },
            }}
          >
            <motion.h1
              style={{
                scale: headlineScale,
                opacity: headlineOpacity,
                filter: headlineBlur,
                willChange: prefersReducedMotion
                  ? "auto"
                  : "transform, opacity, filter",
              }}
              className="mx-auto mt-6 max-w-4xl break-words text-4xl font-semibold leading-tight sm:text-7xl lg:text-8xl"
            >
              {hero.headline}
            </motion.h1>
          </motion.div>

          <motion.div
            variants={{
              hidden: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 22 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.7, ease: easeOut },
              },
            }}
          >
            <motion.p
              style={{
                y: subheadlineY,
                opacity: subheadlineOpacity,
                willChange: prefersReducedMotion
                  ? "auto"
                  : "transform, opacity",
              }}
              className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg sm:leading-8"
            >
              {hero.subheadline}
            </motion.p>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { duration: 0.7, ease: easeOut },
              },
            }}
            className="mt-14"
          >
            <motion.div
              style={{ opacity: scrollIndicatorOpacity }}
              className="flex flex-col items-center gap-3"
            >
              <span className="text-sm text-slate-500">{hero.scrollText}</span>

              <motion.span
                aria-hidden="true"
                className="h-8 w-px bg-gradient-to-b from-blue-400 to-transparent"
                animate={
                  prefersReducedMotion
                    ? { opacity: 0.65 }
                    : { y: [0, 8, 0], opacity: [0.35, 1, 0.35] }
                }
                transition={{
                  duration: 1.8,
                  repeat: prefersReducedMotion ? 0 : Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

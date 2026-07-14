import { motion, useReducedMotion } from "motion/react";
import { hero } from "../data/hero";

const easeOut = [0.22, 1, 0.36, 1] as const;

export default function SceneOne() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      data-cinematic-scene={1}
      data-scene-scroll
      aria-label="Introduction"
      className="relative h-full overflow-y-auto overscroll-contain text-white"
    >
      <div className="flex min-h-full items-center justify-center px-6 py-20">
        <motion.div
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
            <motion.div className="flex flex-col items-center gap-3">
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

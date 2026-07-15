import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { useSceneNavigation } from "../components/SceneNavigationContext";

const cinematicEase = [0.65, 0, 0.35, 1] as const;

function closingMessageVariants(reducedMotion: boolean): Variants {
  return {
    hidden: reducedMotion
      ? { opacity: 0 }
      : { opacity: 0, y: 16, filter: "blur(8px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: reducedMotion ? 0.18 : 0.58,
        delay: reducedMotion ? 0.08 : 0.22,
        ease: cinematicEase,
      },
    },
  };
}

function returnActionVariants(reducedMotion: boolean): Variants {
  return {
    hidden: reducedMotion ? { opacity: 0 } : { opacity: 0, y: 9 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reducedMotion ? 0.18 : 0.45,
        delay: reducedMotion ? 0.16 : 0.58,
        ease: cinematicEase,
      },
    },
  };
}

export default function SceneSix() {
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = Boolean(prefersReducedMotion);
  const { navigateToScene, isTransitioning } = useSceneNavigation();

  return (
    <section
      data-cinematic-scene={6}
      aria-labelledby="scene-six-title"
      className="portfolio-scene relative h-full min-h-dvh overflow-hidden"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.42),rgba(8,7,5,0.15)_48%,rgba(17,11,5,0.5))]" />

        <motion.div
          className="absolute inset-x-[-12%] bottom-[-29%] h-[72%]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reducedMotion ? 0.18 : 0.9, ease: cinematicEase }}
        >
          <motion.div
            className="h-full w-full bg-[radial-gradient(ellipse_at_center,rgba(252,211,77,0.2)_0%,rgba(245,158,11,0.09)_31%,rgba(120,53,15,0.035)_52%,transparent_72%)] blur-2xl"
            animate={
              reducedMotion
                ? { opacity: 0.68, scale: 1 }
                : { opacity: [0.56, 0.72, 0.6], scale: [1, 1.025, 1] }
            }
            transition={{
              duration: 7.5,
              repeat: reducedMotion ? 0 : Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {!reducedMotion && (
          <motion.span
            className="absolute left-1/2 top-[70%] z-10 size-1.5 -translate-x-1/2 rounded-full bg-[var(--portfolio-accent-bright)] shadow-[0_0_18px_rgba(252,211,77,0.75)] sm:top-[66%]"
            initial={{ opacity: 0, y: 38, scale: 0.35 }}
            animate={{ opacity: [0, 0.92, 0], y: [38, 5, 0], scale: [0.35, 1, 0.5] }}
            transition={{ duration: 0.62, ease: cinematicEase }}
          />
        )}

        <motion.div
          className="absolute inset-x-[8%] top-[70%] h-px origin-center bg-gradient-to-r from-transparent via-[rgba(253,230,138,0.72)] to-transparent shadow-[0_0_18px_rgba(245,158,11,0.3)] sm:inset-x-[14%] sm:top-[66%] lg:inset-x-[20%]"
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scaleX: 0 }}
          animate={{ opacity: reducedMotion ? 0.48 : 0.72, scaleX: 1 }}
          transition={{
            duration: reducedMotion ? 0.18 : 0.68,
            delay: reducedMotion ? 0 : 0.08,
            ease: cinematicEase,
          }}
        />

        <motion.div
          className="absolute inset-x-[18%] top-[70%] h-16 origin-top bg-[linear-gradient(180deg,rgba(252,211,77,0.055),transparent)] blur-xl sm:inset-x-[25%] sm:top-[66%]"
          initial={{ opacity: 0 }}
          animate={{ opacity: reducedMotion ? 0.35 : [0.2, 0.42, 0.3] }}
          transition={{
            duration: reducedMotion ? 0.18 : 6.5,
            repeat: reducedMotion ? 0 : Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10 flex h-full min-h-dvh items-center justify-center px-5 pb-28 pt-20 text-center sm:px-8 sm:pb-24 sm:pt-24">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center">
          <motion.h1
            id="scene-six-title"
            variants={closingMessageVariants(reducedMotion)}
            initial="hidden"
            animate="visible"
            className="portfolio-heading max-w-4xl text-balance text-4xl font-semibold leading-tight [text-shadow:0_3px_24px_rgba(0,0,0,0.58)] sm:text-5xl lg:text-6xl"
          >
            Thank you for exploring my universe.
          </motion.h1>

          <motion.div
            variants={returnActionVariants(reducedMotion)}
            initial="hidden"
            animate="visible"
            className="mt-10 w-full max-w-56 sm:mt-12 sm:max-w-[14.5rem] lg:max-w-60"
          >
            <motion.button
              type="button"
              aria-label="Return to the beginning"
              disabled={isTransitioning}
              onClick={() => navigateToScene(0)}
              whileHover={reducedMotion ? undefined : { y: -3 }}
              whileTap={reducedMotion ? undefined : { scale: 0.98, y: 0 }}
              transition={{ duration: 0.3, ease: cinematicEase }}
              className="portfolio-focus group inline-flex mb-10 min-h-12 w-full items-center justify-center gap-3 rounded-full border border-[rgba(253,230,138,0.38)] bg-[rgba(255,255,255,0.07)] px-6 text-sm font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14),inset_0_-1px_0_rgba(253,230,138,0.04),0_12px_28px_-18px_rgba(0,0,0,0.72)] backdrop-blur-[16px] transition-[background-color,border-color,box-shadow] duration-300 hover:border-[rgba(253,230,138,0.72)] hover:bg-[rgba(255,205,120,0.14)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(253,230,138,0.12),0_16px_30px_-16px_rgba(245,158,11,0.52),0_0_22px_rgba(245,158,11,0.12)] active:bg-[rgba(92,62,31,0.38)] active:shadow-[inset_0_2px_7px_rgba(0,0,0,0.3),0_8px_18px_-16px_rgba(245,158,11,0.35)] disabled:cursor-not-allowed disabled:opacity-45 sm:min-h-[3.25rem] sm:text-base lg:min-h-14"
            >
              <span>Fly Back Home</span>
              <ArrowRight
                aria-hidden="true"
                className="size-4 shrink-0 text-[var(--portfolio-accent-strong)] transition-transform duration-300 group-hover:translate-x-1.5"
                strokeWidth={1.75}
              />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

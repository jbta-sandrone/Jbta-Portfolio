import type { CSSProperties } from "react";
import { motion, useReducedMotion } from "motion/react";
import { hero } from "../data/hero";

const easeOut = [0.22, 1, 0.36, 1] as const;

const trees = [
  { left: "3%", bottom: "19%", scale: 0.82, delay: "-1.7s" },
  { left: "10%", bottom: "17%", scale: 1.08, delay: "-3.2s" },
  { left: "18%", bottom: "20%", scale: 0.68, delay: "-0.8s" },
  { left: "78%", bottom: "19%", scale: 0.76, delay: "-2.4s" },
  { left: "86%", bottom: "16%", scale: 1.16, delay: "-4.1s" },
  { left: "95%", bottom: "20%", scale: 0.72, delay: "-1.2s" },
] as const;

const flowers = [
  { left: "7%", bottom: "11%", color: "#ffe08a", delay: "-1.4s" },
  { left: "16%", bottom: "7%", color: "#f9a8d4", delay: "-2.7s" },
  { left: "27%", bottom: "13%", color: "#c4b5fd", delay: "-0.6s" },
  { left: "68%", bottom: "9%", color: "#fde68a", delay: "-3.1s" },
  { left: "79%", bottom: "12%", color: "#f9a8d4", delay: "-1.9s" },
  { left: "92%", bottom: "7%", color: "#c4b5fd", delay: "-3.8s" },
] as const;

const motes = Array.from({ length: 14 }, (_, index) => ({
  left: `${5 + ((index * 17) % 90)}%`,
  top: `${17 + ((index * 29) % 60)}%`,
  delay: `${(index % 7) * -1.15}s`,
  duration: `${6.8 + (index % 5) * 0.9}s`,
}));

function PixelTree({
  left,
  bottom,
  scale,
  delay,
}: (typeof trees)[number]) {
  return (
    <div
      className="scene-one-tree"
      style={{ left, bottom, scale: String(scale), "--wind-delay": delay } as CSSProperties}
    >
      <span className="scene-one-tree__trunk" />
      <span className="scene-one-tree__crown scene-one-tree__crown--back" />
      <span className="scene-one-tree__crown scene-one-tree__crown--front" />
      <span className="scene-one-tree__highlight" />
    </div>
  );
}

function PixelFlower({
  left,
  bottom,
  color,
  delay,
}: (typeof flowers)[number]) {
  return (
    <span
      className="scene-one-flower"
      style={
        {
          left,
          bottom,
          "--flower-color": color,
          "--wind-delay": delay,
        } as CSSProperties
      }
    />
  );
}

function PixelLandscape() {
  return (
    <div aria-hidden="true" className="scene-one-world pointer-events-none absolute inset-0">
      <div className="scene-one-sky absolute inset-0" />
      <div className="scene-one-dither absolute inset-0 opacity-20" />

      <div className="scene-one-sun">
        <span />
      </div>

      <div className="scene-one-cloud scene-one-cloud--one" />
      <div className="scene-one-cloud scene-one-cloud--two" />
      <div className="scene-one-cloud scene-one-cloud--three" />

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        shapeRendering="crispEdges"
      >
        <path
          fill="#617da0"
          d="M0 520 120 420l68 45 138-153 89 99 114-170 121 170 95-110 126 143 100-98 154 164 115-74 120 99v365H0Z"
        />
        <path
          fill="#496983"
          d="m174 465 14 0 138-153 89 99 114-170 121 170 95-110 126 143 100-98 154 164 115-74 120 99v365H0V520l120-100Z"
          opacity=".56"
        />
        <path fill="#c9d8d7" d="m326 312-52 58 34-12 18 21 28-28 30 10Zm203-71-61 91 37-22 24 32 30-38 43 25Zm216 60-48 56 31-13 17 20 30-25 30 17Z" />
        <path
          fill="#284e52"
          d="M0 588c142-57 236-71 354-18 114 51 204-19 326-23 134-4 202 68 338 38 167-37 274-16 422 50v265H0Z"
        />
        <path
          fill="#1c3d3b"
          d="M0 653c151-63 273-22 391-5 137 21 219-54 361-31 155 26 240 70 388 25 109-33 207-10 300 31v227H0Z"
        />
        <path
          fill="#17362f"
          d="M0 710c189-71 353-8 506-15 158-8 265-48 438-8 199 47 340-22 496 34v179H0Z"
        />
        <path
          fill="#d8ad73"
          d="M641 900c-9-77 18-137 77-173 39-24 41-49 10-76h69c35 38 20 76-30 104-54 30-58 83-44 145Z"
          opacity=".92"
        />
        <path fill="#f3cf91" d="M677 900c-5-70 17-113 68-144 46-28 54-61 24-105h28c35 38 20 76-30 104-54 30-58 83-44 145Z" opacity=".38" />
      </svg>

      <div className="scene-one-grassline scene-one-grassline--back" />
      <div className="scene-one-grassline scene-one-grassline--front" />

      {trees.map((tree) => (
        <PixelTree key={`${tree.left}-${tree.bottom}`} {...tree} />
      ))}

      {flowers.map((flower) => (
        <PixelFlower key={`${flower.left}-${flower.bottom}`} {...flower} />
      ))}

      {motes.map((mote, index) => (
        <span
          key={index}
          className="scene-one-mote"
          style={
            {
              left: mote.left,
              top: mote.top,
              animationDelay: mote.delay,
              animationDuration: mote.duration,
            } as CSSProperties
          }
        />
      ))}

      <div className="scene-one-birds">
        <span />
        <span />
        <span />
      </div>

      <div className="scene-one-vignette absolute inset-0" />
    </div>
  );
}

export default function SceneOne() {
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = prefersReducedMotion !== false;

  return (
    <section
      data-cinematic-scene={1}
      data-scene-scroll
      aria-labelledby="arrival-title"
      className="scene-one-pixel portfolio-scene relative h-full overflow-y-auto overflow-x-hidden overscroll-contain bg-[#172c42]"
    >
      <PixelLandscape />

      <div className="relative z-10 flex min-h-full items-center justify-center px-5 pb-32 pt-24 sm:px-8 sm:pb-28 sm:pt-24 lg:justify-start lg:px-16 xl:px-24">
        <motion.div
          className="scene-one-dialogue relative mx-auto w-full max-w-3xl lg:mx-0"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: reducedMotion ? 0.03 : 0.13,
                delayChildren: reducedMotion ? 0 : 0.16,
              },
            },
          }}
        >
          <span aria-hidden="true" className="scene-one-dialogue__corner scene-one-dialogue__corner--tl" />
          <span aria-hidden="true" className="scene-one-dialogue__corner scene-one-dialogue__corner--tr" />
          <span aria-hidden="true" className="scene-one-dialogue__corner scene-one-dialogue__corner--bl" />
          <span aria-hidden="true" className="scene-one-dialogue__corner scene-one-dialogue__corner--br" />

          <motion.div
            variants={{
              hidden: reducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: reducedMotion ? 0.15 : 0.48, ease: easeOut },
              },
            }}
            className="flex flex-wrap items-center gap-3"
          >
            <span className="scene-one-pixel-label">Scene 01</span>
            <span className="scene-one-pixel-rule" />
            <span className="scene-one-pixel-kicker">Arrival</span>
          </motion.div>

          <motion.p
            variants={{
              hidden: reducedMotion ? { opacity: 0 } : { opacity: 0, x: -12 },
              visible: {
                opacity: 1,
                x: 0,
                transition: { duration: reducedMotion ? 0.15 : 0.52, ease: easeOut },
              },
            }}
            className="scene-one-character-name mt-6"
          >
            {hero.name}
          </motion.p>

          <motion.h1
            id="arrival-title"
            variants={{
              hidden: reducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 20, filter: "blur(4px)" },
              visible: {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                transition: { duration: reducedMotion ? 0.16 : 0.72, ease: easeOut },
              },
            }}
            className="scene-one-title mt-3 max-w-2xl text-3xl leading-[1.14] sm:text-5xl sm:leading-[1.12] lg:text-6xl"
          >
            {hero.headline}
          </motion.h1>

          <motion.p
            variants={{
              hidden: reducedMotion ? { opacity: 0 } : { opacity: 0, y: 12 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: reducedMotion ? 0.15 : 0.58, ease: easeOut },
              },
            }}
            className="scene-one-copy mt-5 max-w-xl text-sm leading-6 sm:text-base sm:leading-7"
          >
            {hero.subheadline}
          </motion.p>

          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { duration: reducedMotion ? 0.15 : 0.55, ease: easeOut },
              },
            }}
            className="mt-8 flex items-center gap-4"
          >
            <span className="scene-one-scroll-icon" aria-hidden="true">
              <span />
            </span>
            <div>
              <p className="scene-one-scroll-label">New adventure</p>
              <p className="mt-1 text-xs text-[#dce7db] sm:text-sm">{hero.scrollText}</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

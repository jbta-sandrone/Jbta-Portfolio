import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";
import sceneOneBackgroundVideo from "../assets/videos/blue particles.mp4";

gsap.registerPlugin(ScrollTrigger);

const CAMERA_PATH = {
  arrival: 0,
  glassAvenue: 2,
  projectPlaza: 3.25,
  technologyDistrict: 4.5,
  openHorizon: 5.75,
  ascent: 6.35,
  nightSkyline: 7,
  end: 7.25,
} as const;

const skylineHeights = [14, 22, 18, 31, 24, 38, 28, 45, 33, 26, 36, 21, 29, 17];
const avenueTowerHeights = [28, 42, 35, 51];

export default function CinematicBackground() {
  const rootRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const atmosphereRef = useRef<HTMLDivElement>(null);
  const skylineRef = useRef<HTMLDivElement>(null);
  const avenueRef = useRef<HTMLDivElement>(null);
  const midgroundLeftRef = useRef<HTMLDivElement>(null);
  const midgroundRightRef = useRef<HTMLDivElement>(null);
  const foregroundLeftRef = useRef<HTMLDivElement>(null);
  const foregroundRightRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const projectPlazaRef = useRef<HTMLDivElement>(null);
  const projectHologramsRef = useRef<HTMLDivElement>(null);
  const technologyDistrictRef = useRef<HTMLDivElement>(null);
  const horizonRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<HTMLDivElement>(null);
  const nightRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    const world = document.querySelector<HTMLElement>("#portfolio-world");
    const camera = cameraRef.current;
    const atmosphere = atmosphereRef.current;
    const skyline = skylineRef.current;
    const avenue = avenueRef.current;
    const midgroundLeft = midgroundLeftRef.current;
    const midgroundRight = midgroundRightRef.current;
    const foregroundLeft = foregroundLeftRef.current;
    const foregroundRight = foregroundRightRef.current;
    const particles = particlesRef.current;
    const projectPlaza = projectPlazaRef.current;
    const projectHolograms = projectHologramsRef.current;
    const technologyDistrict = technologyDistrictRef.current;
    const horizon = horizonRef.current;
    const stars = starsRef.current;
    const night = nightRef.current;

    if (
      !root ||
      !world ||
      !camera ||
      !atmosphere ||
      !skyline ||
      !avenue ||
      !midgroundLeft ||
      !midgroundRight ||
      !foregroundLeft ||
      !foregroundRight ||
      !particles ||
      !projectPlaza ||
      !projectHolograms ||
      !technologyDistrict ||
      !horizon ||
      !stars ||
      !night ||
      prefersReducedMotion !== false
    ) {
      return;
    }

    const media = gsap.matchMedia();

    media.add(
      {
        desktop: "(min-width: 768px)",
        mobile: "(max-width: 767.98px)",
      },
      (context) => {
        const mobile = context.conditions?.mobile ?? false;
        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: world,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.15,
            invalidateOnRefresh: true,
          },
        });

        timeline
          .addLabel("arrival", CAMERA_PATH.arrival)
          .addLabel("glassAvenue", CAMERA_PATH.glassAvenue)
          .addLabel("projectPlaza", CAMERA_PATH.projectPlaza)
          .addLabel("technologyDistrict", CAMERA_PATH.technologyDistrict)
          .addLabel("openHorizon", CAMERA_PATH.openHorizon)
          .addLabel("ascent", CAMERA_PATH.ascent)
          .addLabel("nightSkyline", CAMERA_PATH.nightSkyline);

        // One camera advances for the full journey, then gently climbs above the city.
        timeline.to(
          camera,
          {
            scale: mobile ? 1.045 : 1.09,
            yPercent: mobile ? -1.5 : -3,
            duration: CAMERA_PATH.ascent,
          },
          "arrival",
        );
        timeline.to(
          camera,
          {
            scale: mobile ? 1.025 : 1.055,
            yPercent: mobile ? 2 : 4,
            duration: CAMERA_PATH.end - CAMERA_PATH.ascent,
            ease: "sine.inOut",
          },
          "ascent",
        );

        // The world brightens gradually along the avenue before resolving into night.
        timeline.to(
          root,
          {
            backgroundColor: "#07172f",
            duration: CAMERA_PATH.openHorizon,
          },
          "arrival",
        );
        timeline.to(
          root,
          {
            backgroundColor: "#010309",
            duration: CAMERA_PATH.end - CAMERA_PATH.openHorizon,
          },
          "openHorizon",
        );

        if (videoRef.current) {
          timeline.to(
            videoRef.current,
            {
              scale: mobile ? 1.07 : 1.12,
              yPercent: mobile ? -2 : -4,
              opacity: 0.09,
              duration: CAMERA_PATH.ascent,
            },
            "arrival",
          );
          timeline.to(
            videoRef.current,
            {
              scale: mobile ? 1.09 : 1.16,
              yPercent: mobile ? -3 : -6,
              opacity: 0.025,
              duration: CAMERA_PATH.end - CAMERA_PATH.ascent,
            },
            "ascent",
          );
        }

        // Depth speed: atmosphere and skyline move least.
        timeline.to(
          atmosphere,
          {
            yPercent: mobile ? -4 : -8,
            scale: mobile ? 1.1 : 1.2,
            duration: CAMERA_PATH.end,
          },
          "arrival",
        );
        timeline.to(
          skyline,
          {
            scale: mobile ? 1.02 : 1.035,
            yPercent: mobile ? -1 : -2,
            duration: CAMERA_PATH.ascent,
          },
          "arrival",
        );
        timeline.to(
          skyline,
          {
            scale: mobile ? 0.96 : 0.91,
            yPercent: mobile ? 6 : 10,
            opacity: 0.38,
            duration: CAMERA_PATH.end - CAMERA_PATH.ascent,
            ease: "sine.inOut",
          },
          "ascent",
        );

        // The central avenue provides uninterrupted forward motion beneath every location.
        timeline.to(
          avenue,
          {
            scale: mobile ? 2.25 : 3.45,
            yPercent: mobile ? -18 : -34,
            duration: CAMERA_PATH.end,
          },
          "arrival",
        );

        // Midground buildings pass faster than the skyline.
        timeline.to(
          midgroundLeft,
          {
            xPercent: mobile ? -22 : -42,
            yPercent: mobile ? -10 : -18,
            scale: mobile ? 1.55 : 2.2,
            duration: CAMERA_PATH.end,
          },
          "arrival",
        );
        timeline.to(
          midgroundRight,
          {
            xPercent: mobile ? 22 : 42,
            yPercent: mobile ? -10 : -18,
            scale: mobile ? 1.55 : 2.2,
            duration: CAMERA_PATH.end,
          },
          "arrival",
        );

        // Foreground facades leave the frame fastest, selling the 2.5D fly-through.
        timeline.to(
          foregroundLeft,
          {
            xPercent: mobile ? -42 : -76,
            yPercent: mobile ? -18 : -32,
            scale: mobile ? 2.2 : 3.8,
            duration: CAMERA_PATH.end,
          },
          "arrival",
        );
        timeline.to(
          foregroundRight,
          {
            xPercent: mobile ? 42 : 76,
            yPercent: mobile ? -18 : -32,
            scale: mobile ? 2.2 : 3.8,
            duration: CAMERA_PATH.end,
          },
          "arrival",
        );
        timeline.to(
          particles,
          {
            yPercent: mobile ? -8 : -18,
            scale: mobile ? 1.08 : 1.18,
            opacity: 0.045,
            duration: CAMERA_PATH.end,
          },
          "arrival",
        );

        // The plaza approaches first; its holograms activate only after arrival.
        timeline.fromTo(
          projectPlaza,
          { scale: 0.46, yPercent: 28, opacity: 0 },
          {
            scale: 0.82,
            yPercent: 7,
            opacity: 0.36,
            duration: 0.72,
          },
          "glassAvenue+=0.53",
        );
        timeline.to(
          projectPlaza,
          {
            scale: 1,
            yPercent: 0,
            opacity: 0.62,
            duration: 0.48,
          },
          "projectPlaza-=0.1",
        );
        timeline.fromTo(
          projectHolograms,
          { opacity: 0, yPercent: 16, scale: 0.88 },
          {
            opacity: 1,
            yPercent: 0,
            scale: 1,
            duration: 0.56,
            ease: "sine.out",
          },
          "projectPlaza+=0.12",
        );
        timeline.to(
          projectPlaza,
          {
            scale: mobile ? 1.75 : 2.65,
            yPercent: mobile ? -42 : -68,
            opacity: 0,
            duration: 1.2,
            ease: "power1.in",
          },
          "projectPlaza+=0.78",
        );

        // Technology architecture is already farther down the same avenue.
        timeline.fromTo(
          technologyDistrict,
          { scale: 0.44, yPercent: 30, opacity: 0 },
          {
            scale: 0.78,
            yPercent: 8,
            opacity: 0.32,
            duration: 0.72,
          },
          "projectPlaza+=0.5",
        );
        timeline.to(
          technologyDistrict,
          {
            scale: 1,
            yPercent: 0,
            opacity: 0.56,
            duration: 0.48,
          },
          "technologyDistrict-=0.12",
        );
        timeline.to(
          technologyDistrict,
          {
            scale: mobile ? 1.65 : 2.35,
            yPercent: mobile ? -44 : -72,
            opacity: 0,
            duration: 1.22,
            ease: "power1.in",
          },
          "technologyDistrict+=0.58",
        );

        // The same horizon opens as architecture clears, then falls away on ascent.
        timeline.to(
          horizon,
          {
            scale: mobile ? 1.18 : 1.38,
            yPercent: mobile ? -2 : -5,
            opacity: 0.86,
            duration: CAMERA_PATH.openHorizon,
          },
          "arrival",
        );
        timeline.to(
          horizon,
          {
            scale: mobile ? 1.38 : 1.72,
            yPercent: mobile ? 8 : 14,
            opacity: 0.14,
            duration: CAMERA_PATH.end - CAMERA_PATH.ascent,
            ease: "sine.inOut",
          },
          "ascent",
        );
        timeline.to(
          stars,
          {
            opacity: 0.3,
            yPercent: -5,
            duration: CAMERA_PATH.end - CAMERA_PATH.openHorizon,
          },
          "openHorizon",
        );
        timeline.to(
          night,
          {
            opacity: 0.7,
            duration: CAMERA_PATH.end - CAMERA_PATH.openHorizon,
          },
          "openHorizon",
        );
      },
    );

    return () => media.revert();
  }, [prefersReducedMotion]);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-slate-950"
    >
      <div className="absolute -inset-[8%] bg-[radial-gradient(circle_at_50%_48%,rgba(29,78,216,0.28),transparent_34%),linear-gradient(180deg,#020617_0%,#06152f_55%,#020617_100%)]" />

      {prefersReducedMotion === false && (
        <video
          ref={videoRef}
          aria-hidden="true"
          tabIndex={-1}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          disablePictureInPicture
          className="absolute -inset-[5%] h-[110%] w-[110%] max-w-none scale-[1.02] object-cover object-center opacity-[0.18] will-change-transform"
        >
          <source src={sceneOneBackgroundVideo} type="video/mp4" />
        </video>
      )}

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.72)_0%,rgba(4,15,39,0.52)_48%,rgba(2,6,23,0.82)_100%)]" />

      <div ref={cameraRef} className="absolute inset-0 origin-center will-change-transform">
        <div
          ref={atmosphereRef}
          className="absolute -inset-[12%] origin-center will-change-transform"
        >
          <div className="absolute left-[8%] top-[12%] h-[64vh] w-[64vh] rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.18),rgba(30,64,175,0.05)_48%,transparent_72%)]" />
          <div className="absolute bottom-[-5%] right-[-8%] hidden h-[72vh] w-[72vh] rounded-full bg-[radial-gradient(circle,rgba(14,165,233,0.11),rgba(30,58,138,0.04)_48%,transparent_74%)] md:block" />
        </div>

        <div
          ref={horizonRef}
          className="absolute left-[12%] top-[22%] h-[58vh] w-[76vw] origin-center bg-[radial-gradient(ellipse,rgba(59,130,246,0.19),rgba(29,78,216,0.055)_46%,transparent_72%)] opacity-55 will-change-transform md:left-[24%] md:w-[52vw]"
        />

        <div
          ref={starsRef}
          className="absolute -inset-[5%] opacity-[0.035] [background-image:radial-gradient(rgba(191,219,254,0.7)_0_0.7px,transparent_1px),radial-gradient(rgba(96,165,250,0.55)_0_0.5px,transparent_0.9px)] [background-position:0_0,47px_61px] [background-size:128px_128px,173px_173px]"
        />

        <div
          ref={skylineRef}
          className="absolute inset-x-[-4%] bottom-[23%] flex origin-bottom items-end justify-center gap-[clamp(4px,1vw,14px)] opacity-55 will-change-transform"
        >
          {skylineHeights.map((height, index) => (
            <div
              key={`${height}-${index}`}
              style={{ height: `${height}vh` }}
              className="relative w-[clamp(18px,4vw,58px)] border border-blue-300/[0.08] bg-[linear-gradient(180deg,rgba(37,99,235,0.14),rgba(3,12,30,0.88))] shadow-[0_0_32px_rgba(37,99,235,0.06)]"
            >
              <div className="absolute inset-x-[22%] top-[18%] h-px bg-blue-200/15" />
            </div>
          ))}
        </div>

        <div className="absolute inset-x-0 bottom-[20%] h-px bg-gradient-to-r from-transparent via-blue-300/25 to-transparent" />

        <div className="absolute inset-x-0 bottom-[-8%] flex justify-center">
          <div
            ref={avenueRef}
            className="relative h-[76vh] w-[82vw] origin-bottom will-change-transform [clip-path:polygon(44%_0,56%_0,100%_100%,0_100%)] md:w-[64vw]"
          >
            <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent_0_19%,rgba(96,165,250,0.11)_19.5%_20%,transparent_20.5%_39%,rgba(96,165,250,0.08)_39.5%_40%,transparent_40.5%_59%,rgba(96,165,250,0.08)_59.5%_60%,transparent_60.5%_79%,rgba(96,165,250,0.11)_79.5%_80%,transparent_80.5%_100%),linear-gradient(180deg,rgba(59,130,246,0.02),rgba(15,56,104,0.18))]" />
            <div className="absolute inset-y-0 left-1/2 w-px bg-gradient-to-b from-blue-200/5 via-blue-300/25 to-blue-200/5" />
          </div>
        </div>

        <div
          ref={midgroundLeftRef}
          className="absolute bottom-[5%] left-[-4%] flex origin-bottom-left items-end gap-2 will-change-transform"
        >
          {avenueTowerHeights.map((height, index) => (
            <div
              key={`left-${height}`}
              style={{ height: `${height + index * 2}vh` }}
              className="w-[clamp(34px,7vw,96px)] border border-blue-200/10 bg-[linear-gradient(120deg,rgba(96,165,250,0.1),rgba(5,18,43,0.72))] shadow-[inset_-12px_0_28px_rgba(2,6,23,0.34)]"
            />
          ))}
        </div>
        <div
          ref={midgroundRightRef}
          className="absolute bottom-[5%] right-[-4%] flex origin-bottom-right items-end gap-2 will-change-transform"
        >
          {avenueTowerHeights.slice().reverse().map((height, index) => (
            <div
              key={`right-${height}`}
              style={{ height: `${height + index * 2}vh` }}
              className="w-[clamp(34px,7vw,96px)] border border-sky-200/[0.09] bg-[linear-gradient(240deg,rgba(56,189,248,0.08),rgba(5,18,43,0.74))] shadow-[inset_12px_0_28px_rgba(2,6,23,0.34)]"
            />
          ))}
        </div>

        <div className="absolute inset-x-0 bottom-[10%] flex justify-center">
          <div
            ref={projectPlazaRef}
            className="relative h-[42vh] w-[76vw] origin-bottom opacity-0 will-change-transform md:w-[54vw]"
          >
            <div className="absolute inset-x-[5%] bottom-0 h-[22%] border border-blue-300/10 bg-blue-300/[0.025] [clip-path:polygon(12%_0,88%_0,100%_100%,0_100%)]" />
            <div
              ref={projectHologramsRef}
              className="absolute inset-x-0 bottom-[18%] flex origin-bottom items-end justify-center gap-[6vw] opacity-0"
            >
              <div className="h-[18vh] w-[22vw] max-w-60 border border-blue-300/20 bg-blue-400/[0.025] shadow-[0_0_36px_rgba(59,130,246,0.1)]" />
              <div className="h-[29vh] w-[27vw] max-w-72 border border-blue-100/30 bg-blue-300/[0.045] shadow-[0_0_58px_rgba(96,165,250,0.18)]" />
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-[8%] flex justify-center">
          <div
            ref={technologyDistrictRef}
            className="relative h-[46vh] w-[72vw] origin-bottom opacity-0 will-change-transform md:w-[50vw]"
          >
            <div className="absolute bottom-0 left-[7%] h-[75%] w-px bg-gradient-to-t from-blue-300/30 to-transparent" />
            <div className="absolute bottom-0 right-[7%] h-[68%] w-px bg-gradient-to-t from-sky-300/25 to-transparent" />
            <div className="absolute inset-x-[18%] bottom-[16%] h-[58%] border-x border-t border-blue-200/15 bg-[linear-gradient(90deg,rgba(37,99,235,0.035),transparent,rgba(14,165,233,0.03))]" />
            <div className="absolute inset-x-[4%] bottom-0 h-[28%] bg-[repeating-linear-gradient(90deg,transparent_0_15%,rgba(96,165,250,0.14)_15.5%_16%,transparent_16.5%_32%)] [clip-path:polygon(18%_0,82%_0,100%_100%,0_100%)]" />
          </div>
        </div>

        <div
          ref={foregroundLeftRef}
          className="absolute bottom-[-8%] left-[-22%] h-[88vh] w-[42vw] origin-bottom-left border-r border-blue-200/10 bg-[linear-gradient(115deg,rgba(2,6,23,0.96),rgba(30,64,175,0.09))] opacity-70 will-change-transform [clip-path:polygon(0_0,66%_9%,100%_100%,0_100%)] md:left-[-14%]"
        />
        <div
          ref={foregroundRightRef}
          className="absolute bottom-[-8%] right-[-22%] h-[88vh] w-[42vw] origin-bottom-right border-l border-sky-200/[0.09] bg-[linear-gradient(245deg,rgba(2,6,23,0.96),rgba(14,116,144,0.07))] opacity-70 will-change-transform [clip-path:polygon(34%_9%,100%_0,100%_100%,0_100%)] md:right-[-14%]"
        />

      </div>

      <div
        ref={particlesRef}
        className="absolute -inset-[8%] hidden opacity-[0.1] [background-image:radial-gradient(rgba(191,219,254,0.55)_0_0.7px,transparent_1.1px),radial-gradient(rgba(96,165,250,0.38)_0_0.5px,transparent_0.9px)] [background-position:0_0,38px_54px] [background-size:112px_112px,146px_146px] will-change-transform sm:block"
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_24%,rgba(2,6,23,0.3)_65%,rgba(1,3,10,0.9)_100%)]" />
      <div className="absolute inset-0 hidden opacity-[0.03] [background-image:radial-gradient(rgba(255,255,255,0.65)_0.5px,transparent_0.5px)] [background-size:3px_3px] sm:block" />
      <div
        ref={nightRef}
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.84),rgba(1,3,10,0.68))] opacity-0"
      />
    </div>
  );
}

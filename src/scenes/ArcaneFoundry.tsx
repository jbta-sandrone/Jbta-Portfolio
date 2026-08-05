import {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
  type Variants,
} from "motion/react";
import { useSceneNavigation } from "../components/SceneNavigationContext";
import {
  techGroups,
  type TechGroup,
  type Technology,
} from "../data/sceneFourTechnologyData";
import "../styles/arcane-foundry.css";

const foundryEase = [0.22, 1, 0.36, 1] as const;

type StationKind = "interface" | "engine" | "vault" | "oracle" | "launch";

type StationPresentation = {
  name: string;
  craft: string;
  kind: StationKind;
  accent: string;
  accentDark: string;
  accentLight: string;
};

const stationPresentation: Record<TechGroup["id"], StationPresentation> = {
  frontend: {
    name: "Interface Loom",
    craft: "Frontend Craft",
    kind: "interface",
    accent: "#5e9e8b",
    accentDark: "#315d54",
    accentLight: "#a7d7b9",
  },
  backend: {
    name: "Engine Chamber",
    craft: "Backend Systems",
    kind: "engine",
    accent: "#c16d42",
    accentDark: "#733d2b",
    accentLight: "#f3bd72",
  },
  database: {
    name: "Data Vault",
    craft: "Storage & Persistence",
    kind: "vault",
    accent: "#5f8092",
    accentDark: "#344f60",
    accentLight: "#a9c5cf",
  },
  ai: {
    name: "Oracle Core",
    craft: "Artificial Intelligence",
    kind: "oracle",
    accent: "#a05d78",
    accentDark: "#62394f",
    accentLight: "#e2a7b6",
  },
  deployment: {
    name: "Launch Bay",
    craft: "Tools & Deployment",
    kind: "launch",
    accent: "#aa8750",
    accentDark: "#67502f",
    accentLight: "#f0cf82",
  },
};

const foundrySparks = Array.from({ length: 12 }, (_, index) => ({
  left: `${8 + ((index * 29) % 86)}%`,
  top: `${18 + ((index * 31) % 66)}%`,
  delay: `${(index % 6) * -1.15}s`,
  duration: `${5.8 + (index % 4) * 0.9}s`,
}));

const stationVariants = (reducedMotion: boolean): Variants => ({
  hidden: reducedMotion
    ? { opacity: 0 }
    : { opacity: 0, y: 28, scale: 0.985 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: reducedMotion ? 0.15 : 0.72,
      ease: foundryEase,
      staggerChildren: reducedMotion ? 0.02 : 0.08,
    },
  },
});

const stationChildVariants = (reducedMotion: boolean): Variants => ({
  hidden: reducedMotion ? { opacity: 0 } : { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: reducedMotion ? 0.12 : 0.48, ease: foundryEase },
  },
});

export default function ArcaneFoundry() {
  const scrollContainerRef = useRef<HTMLElement>(null);
  const activeGroupRef = useRef(0);
  const [activeGroup, setActiveGroup] = useState(0);
  const [hoveredTechnology, setHoveredTechnology] = useState<string | null>(null);
  const [pinnedTechnology, setPinnedTechnology] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = prefersReducedMotion !== false;
  const { navigateToScene, isTransitioning } = useSceneNavigation();
  const { scrollYProgress } = useScroll({ container: scrollContainerRef });
  const farY = useTransform(scrollYProgress, [0, 1], [0, -52]);
  const middleY = useTransform(scrollYProgress, [0, 1], [0, -94]);
  const nearY = useTransform(scrollYProgress, [0, 1], [0, -132]);

  useEffect(() => {
    const scene = scrollContainerRef.current;
    if (!scene) return;

    const syncVisibility = () => {
      scene.classList.toggle("foundry-animation-paused", document.hidden);
    };

    syncVisibility();
    document.addEventListener("visibilitychange", syncVisibility);
    return () => document.removeEventListener("visibilitychange", syncVisibility);
  }, []);

  const activateGroup = useCallback((index: number) => {
    if (activeGroupRef.current === index) return;
    activeGroupRef.current = index;
    setActiveGroup(index);
    setHoveredTechnology(null);
    setPinnedTechnology(null);
  }, []);

  const pinTechnology = (technologyId: string) => {
    setPinnedTechnology((current) =>
      current === technologyId ? null : technologyId,
    );
  };

  return (
    <section
      ref={scrollContainerRef}
      data-cinematic-scene={4}
      data-scene-scroll
      aria-labelledby="craft-title"
      className="arcane-foundry portfolio-scene relative h-full overflow-y-auto overflow-x-hidden overscroll-contain"
    >
      <FoundryEnvironment
        reducedMotion={reducedMotion}
        farY={farY}
        middleY={middleY}
        nearY={nearY}
      />

      <main className="foundry-content relative z-10">
        <FoundryEntrance reducedMotion={reducedMotion} />

        <div className="foundry-stations" aria-label="Technology crafting stations">
          {techGroups.map((group, index) => (
            <Fragment key={group.id}>
              <FoundryStation
                group={group}
                index={index}
                reducedMotion={reducedMotion}
                scrollRoot={scrollContainerRef}
                hoveredTechnology={hoveredTechnology}
                pinnedTechnology={pinnedTechnology}
                onInspect={setHoveredTechnology}
                onPin={pinTechnology}
                onActivate={() => activateGroup(index)}
              />
              {index < techGroups.length - 1 && (
                <EnergyChannel
                  from={stationPresentation[group.id].name}
                  to={stationPresentation[techGroups[index + 1].id].name}
                />
              )}
            </Fragment>
          ))}
        </div>

        <FoundryAssembly reducedMotion={reducedMotion} />
        <FoundryExit
          disabled={isTransitioning}
          onContinue={() => navigateToScene(4)}
        />
      </main>

      <FoundryProgress activeGroup={activeGroup} />
    </section>
  );
}

type FoundryEnvironmentProps = {
  reducedMotion: boolean;
  farY: MotionValue<number>;
  middleY: MotionValue<number>;
  nearY: MotionValue<number>;
};

function FoundryEnvironment({
  reducedMotion,
  farY,
  middleY,
  nearY,
}: FoundryEnvironmentProps) {
  const depthStyle = (y: MotionValue<number>) =>
    reducedMotion ? undefined : { y };

  return (
    <div aria-hidden="true" className="foundry-environment pointer-events-none">
      <motion.div
        className="foundry-depth foundry-depth--far"
        style={depthStyle(farY)}
      >
        <div className="foundry-stone-wall" />
        <div className="foundry-ceiling-beam" />
        <div className="foundry-wall-pipe foundry-wall-pipe--one">
          <i /><i /><i />
        </div>
        <div className="foundry-wall-pipe foundry-wall-pipe--two">
          <i /><i />
        </div>
        <div className="foundry-upper-walkway">
          {Array.from({ length: 13 }, (_, index) => <i key={index} />)}
        </div>
      </motion.div>

      <motion.div
        className="foundry-depth foundry-depth--middle"
        style={depthStyle(middleY)}
      >
        <FoundryGear className="foundry-gear--one" teeth={12} />
        <FoundryGear className="foundry-gear--two" teeth={10} reverse />
        <FoundryGear className="foundry-gear--three" teeth={8} />
        <div className="foundry-chain foundry-chain--left">
          {Array.from({ length: 8 }, (_, index) => <i key={index} />)}
        </div>
        <div className="foundry-chain foundry-chain--right">
          {Array.from({ length: 7 }, (_, index) => <i key={index} />)}
        </div>
        <div className="foundry-furnace foundry-furnace--left">
          <span /><span /><i />
        </div>
        <div className="foundry-furnace foundry-furnace--right">
          <span /><span /><i />
        </div>
        <div className="foundry-central-conduit">
          <span /><i /><i /><i />
        </div>
      </motion.div>

      <motion.div
        className="foundry-depth foundry-depth--near"
        style={depthStyle(nearY)}
      >
        <div className="foundry-floor-grid" />
        <div className="foundry-floor-channel foundry-floor-channel--left"><i /></div>
        <div className="foundry-floor-channel foundry-floor-channel--right"><i /></div>
        <div className="foundry-tool-rack foundry-tool-rack--left">
          <i /><i /><i />
        </div>
        <div className="foundry-tool-rack foundry-tool-rack--right">
          <i /><i />
        </div>
        <div className="foundry-steam-vent foundry-steam-vent--left">
          <i /><i /><i />
        </div>
        <div className="foundry-steam-vent foundry-steam-vent--right">
          <i /><i />
        </div>
      </motion.div>

      {foundrySparks.map((spark, index) => (
        <span
          key={index}
          className={`foundry-ambient-spark ${
            index > 7 ? "foundry-ambient-spark--desktop" : ""
          }`}
          style={
            {
              left: spark.left,
              top: spark.top,
              animationDelay: spark.delay,
              animationDuration: spark.duration,
            } as CSSProperties
          }
        />
      ))}
      <div className="foundry-light-vignette" />
    </div>
  );
}

function FoundryGear({
  className,
  teeth,
  reverse = false,
}: {
  className: string;
  teeth: number;
  reverse?: boolean;
}) {
  return (
    <div className={`foundry-gear ${className} ${reverse ? "is-reverse" : ""}`}>
      {Array.from({ length: teeth }, (_, index) => (
        <i key={index} style={{ rotate: `${(360 / teeth) * index}deg` }} />
      ))}
      <span />
    </div>
  );
}

function FoundryEntrance({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <section className="foundry-entrance" aria-labelledby="craft-title">
      <div aria-hidden="true" className="foundry-elevator">
        <div className="foundry-elevator__cable foundry-elevator__cable--left" />
        <div className="foundry-elevator__cable foundry-elevator__cable--right" />
        <motion.div
          className="foundry-elevator__door foundry-elevator__door--left"
          initial={reducedMotion ? { opacity: 1 } : { x: 0 }}
          animate={reducedMotion ? { opacity: 0.35 } : { x: "-76%" }}
          transition={{
            duration: reducedMotion ? 0.15 : 1.05,
            delay: reducedMotion ? 0 : 0.18,
            ease: foundryEase,
          }}
        />
        <motion.div
          className="foundry-elevator__door foundry-elevator__door--right"
          initial={reducedMotion ? { opacity: 1 } : { x: 0 }}
          animate={reducedMotion ? { opacity: 0.35 } : { x: "76%" }}
          transition={{
            duration: reducedMotion ? 0.15 : 1.05,
            delay: reducedMotion ? 0 : 0.18,
            ease: foundryEase,
          }}
        />
        <div className="foundry-elevator__light" />
        <div className="foundry-elevator__platform" />
      </div>

      <motion.header
        className="foundry-chapter-panel"
        initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: reducedMotion ? 0.16 : 0.7,
          delay: reducedMotion ? 0 : 0.5,
          ease: foundryEase,
        }}
      >
        <span aria-hidden="true" className="foundry-panel-corner foundry-panel-corner--tl" />
        <span aria-hidden="true" className="foundry-panel-corner foundry-panel-corner--tr" />
        <span aria-hidden="true" className="foundry-panel-corner foundry-panel-corner--bl" />
        <span aria-hidden="true" className="foundry-panel-corner foundry-panel-corner--br" />
        <p className="foundry-chapter-index">Scene Four</p>
        <div aria-hidden="true" className="foundry-chapter-rule">
          <span /><FoundryMark /><span />
        </div>
        <p className="foundry-chapter-kicker">Crafts</p>
        <h1 id="craft-title">The Arcane Foundry</h1>
        <p className="foundry-chapter-copy">
          Every creation begins with the right tools.
        </p>
        <p className="foundry-descent-prompt">
          Descend into the forge <i aria-hidden="true" />
        </p>
      </motion.header>
    </section>
  );
}

type FoundryStationProps = {
  group: TechGroup;
  index: number;
  reducedMotion: boolean;
  scrollRoot: RefObject<HTMLElement | null>;
  hoveredTechnology: string | null;
  pinnedTechnology: string | null;
  onInspect: (technologyId: string | null) => void;
  onPin: (technologyId: string) => void;
  onActivate: () => void;
};

function FoundryStation({
  group,
  index,
  reducedMotion,
  scrollRoot,
  hoveredTechnology,
  pinnedTechnology,
  onInspect,
  onPin,
  onActivate,
}: FoundryStationProps) {
  const presentation = stationPresentation[group.id];
  const inspectedTechnology =
    group.technologies.find(
      (technology) =>
        technology.id === hoveredTechnology ||
        technology.id === pinnedTechnology,
    ) ?? group.technologies[0];
  const stationStyle = {
    "--station-accent": presentation.accent,
    "--station-accent-dark": presentation.accentDark,
    "--station-accent-light": presentation.accentLight,
  } as CSSProperties;
  const detailId = `foundry-detail-${group.id}`;

  return (
    <motion.article
      id={`foundry-${group.id}`}
      aria-labelledby={`foundry-${group.id}-title`}
      className={`foundry-station foundry-station--${presentation.kind}`}
      style={stationStyle}
      variants={stationVariants(reducedMotion)}
      initial="hidden"
      whileInView="visible"
      viewport={{ root: scrollRoot, amount: 0.28, once: false }}
      onViewportEnter={onActivate}
      onPointerLeave={() => onInspect(null)}
    >
      <div aria-hidden="true" className="foundry-station__rail foundry-station__rail--top">
        <i /><i /><i /><i />
      </div>

      <motion.header
        variants={stationChildVariants(reducedMotion)}
        className="foundry-station__header"
      >
        <div className="foundry-station__number" aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </div>
        <div>
          <p className="foundry-station__craft">{presentation.craft}</p>
          <h2 id={`foundry-${group.id}-title`}>{presentation.name}</h2>
          <p className="foundry-station__category">{group.label}</p>
        </div>
        <div aria-hidden="true" className="foundry-station__status">
          <span />
          Station online
        </div>
      </motion.header>

      <div className="foundry-station__body">
        <motion.div variants={stationChildVariants(reducedMotion)}>
          <FoundryMachine kind={presentation.kind} />
        </motion.div>

        <motion.div
          variants={stationChildVariants(reducedMotion)}
          className="foundry-console"
        >
          <span aria-hidden="true" className="foundry-console__bolt foundry-console__bolt--tl" />
          <span aria-hidden="true" className="foundry-console__bolt foundry-console__bolt--tr" />
          <p className="foundry-console__label">Crafting modules</p>
          <ul className="foundry-tech-grid" aria-label={`${group.label} technologies`}>
            {group.technologies.map((technology) => (
              <li key={technology.id}>
                <PixelTechTile
                  technology={technology}
                  selected={inspectedTechnology.id === technology.id}
                  pinned={pinnedTechnology === technology.id}
                  detailId={detailId}
                  onInspect={onInspect}
                  onPin={onPin}
                />
              </li>
            ))}
          </ul>
          <TechnologyDetail
            id={detailId}
            technology={inspectedTechnology}
            pinned={pinnedTechnology === inspectedTechnology.id}
            reducedMotion={reducedMotion}
          />
        </motion.div>
      </div>

      <div aria-hidden="true" className="foundry-station__rail foundry-station__rail--bottom">
        <i /><i /><i /><i />
      </div>
    </motion.article>
  );
}

function FoundryMachine({ kind }: { kind: StationKind }) {
  if (kind === "interface") {
    return (
      <div aria-hidden="true" className="foundry-machine foundry-machine--interface">
        <div className="loom-frame">
          <span className="loom-screen loom-screen--one"><i /><i /></span>
          <span className="loom-screen loom-screen--two"><i /></span>
          <div className="loom-thread loom-thread--one" />
          <div className="loom-thread loom-thread--two" />
          <div className="loom-thread loom-thread--three" />
          <div className="loom-shuttle"><i /></div>
          <span className="loom-component loom-component--one" />
          <span className="loom-component loom-component--two" />
          <span className="loom-component loom-component--three" />
        </div>
        <MachineBase />
      </div>
    );
  }

  if (kind === "engine") {
    return (
      <div aria-hidden="true" className="foundry-machine foundry-machine--engine">
        <div className="engine-housing">
          <FoundryGear className="engine-gear engine-gear--large" teeth={10} />
          <FoundryGear className="engine-gear engine-gear--small" teeth={8} reverse />
          <span className="engine-piston engine-piston--one"><i /></span>
          <span className="engine-piston engine-piston--two"><i /></span>
          <span className="engine-signal engine-signal--in" />
          <span className="engine-signal engine-signal--out" />
        </div>
        <MachineBase />
      </div>
    );
  }

  if (kind === "vault") {
    return (
      <div aria-hidden="true" className="foundry-machine foundry-machine--vault">
        <div className="vault-housing">
          <div className="vault-door">
            <span /><i /><i /><i /><i />
          </div>
          <div className="vault-crystals">
            <i /><i /><i /><i />
          </div>
          <span className="vault-drawer vault-drawer--one" />
          <span className="vault-drawer vault-drawer--two" />
          <span className="vault-signal" />
        </div>
        <MachineBase />
      </div>
    );
  }

  if (kind === "oracle") {
    return (
      <div aria-hidden="true" className="foundry-machine foundry-machine--oracle">
        <div className="oracle-chamber">
          <span className="oracle-ring oracle-ring--outer"><i /></span>
          <span className="oracle-ring oracle-ring--inner"><i /></span>
          <span className="oracle-crystal"><i /></span>
          <span className="oracle-rune oracle-rune--one">01</span>
          <span className="oracle-rune oracle-rune--two">AI</span>
          <span className="oracle-rune oracle-rune--three">{`{ }`}</span>
          <span className="oracle-signal oracle-signal--left" />
          <span className="oracle-signal oracle-signal--right" />
        </div>
        <MachineBase />
      </div>
    );
  }

  return (
    <div aria-hidden="true" className="foundry-machine foundry-machine--launch">
      <div className="launch-housing">
        <div className="launch-portal"><span /><i /></div>
        <div className="launch-conveyor">
          <span /><span /><span /><span /><span />
          <i className="launch-crate launch-crate--one" />
          <i className="launch-crate launch-crate--two" />
        </div>
        <span className="launch-light launch-light--one" />
        <span className="launch-light launch-light--two" />
        <span className="launch-light launch-light--three" />
      </div>
      <MachineBase />
    </div>
  );
}

function MachineBase() {
  return (
    <div className="machine-base">
      <span /><span /><i /><i />
    </div>
  );
}

function PixelTechTile({
  technology,
  selected,
  pinned,
  detailId,
  onInspect,
  onPin,
}: {
  technology: Technology;
  selected: boolean;
  pinned: boolean;
  detailId: string;
  onInspect: (technologyId: string | null) => void;
  onPin: (technologyId: string) => void;
}) {
  return (
    <button
      type="button"
      aria-label={`${technology.name}. ${technology.description} Used in ${formatUsedIn(
        technology.projects,
      )}.`}
      aria-pressed={pinned}
      aria-describedby={detailId}
      data-cursor-label={technology.name}
      className={`foundry-tech-tile portfolio-focus ${
        selected ? "is-selected" : ""
      } ${pinned ? "is-pinned" : ""}`}
      onPointerEnter={(event) => {
        if (event.pointerType !== "touch") onInspect(technology.id);
      }}
      onPointerLeave={(event) => {
        if (
          event.pointerType !== "touch" &&
          document.activeElement !== event.currentTarget
        ) {
          onInspect(null);
        }
      }}
      onFocus={() => onInspect(technology.id)}
      onBlur={(event) => {
        if (!event.currentTarget.matches(":hover")) onInspect(null);
      }}
      onClick={() => onPin(technology.id)}
    >
      <span
        className={`foundry-tech-icon ${technology.lightTile ? "is-light" : ""}`}
      >
        <BrandIcon technology={technology} />
      </span>
      <span className="foundry-tech-name">{technology.name}</span>
      <span aria-hidden="true" className="foundry-tech-rune" />
    </button>
  );
}

function BrandIcon({ technology }: { technology: Technology }) {
  const Icon = technology.icon;

  if (technology.brandColorSecondary) {
    return (
      <span aria-hidden="true" className="foundry-brand-icon is-dual">
        <Icon
          className="foundry-brand-icon__half foundry-brand-icon__half--top"
          style={{ color: technology.brandColor }}
        />
        <Icon
          className="foundry-brand-icon__half foundry-brand-icon__half--bottom"
          style={{ color: technology.brandColorSecondary }}
        />
      </span>
    );
  }

  return (
    <Icon
      aria-hidden="true"
      className="foundry-brand-icon"
      style={{ color: technology.brandColor }}
    />
  );
}

function TechnologyDetail({
  id,
  technology,
  pinned,
  reducedMotion,
}: {
  id: string;
  technology: Technology;
  pinned: boolean;
  reducedMotion: boolean;
}) {
  return (
    <aside id={id} aria-live="polite" className="foundry-tech-detail">
      <span aria-hidden="true" className="foundry-tech-detail__corner foundry-tech-detail__corner--left" />
      <span aria-hidden="true" className="foundry-tech-detail__corner foundry-tech-detail__corner--right" />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={technology.id}
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
          transition={{
            duration: reducedMotion ? 0.12 : 0.28,
            ease: foundryEase,
          }}
        >
          <div className="foundry-tech-detail__heading">
            <span className={`foundry-tech-detail__icon ${technology.lightTile ? "is-light" : ""}`}>
              <BrandIcon technology={technology} />
            </span>
            <div>
              <p>Module inspection</p>
              <h3>{technology.name}</h3>
            </div>
            {pinned && <span className="foundry-pinned-label">Pinned</span>}
          </div>
          <p className="foundry-tech-detail__copy">{technology.description}</p>
          <p className="foundry-tech-detail__projects">
            <strong>Used in</strong> {formatUsedIn(technology.projects)}
          </p>
        </motion.div>
      </AnimatePresence>
    </aside>
  );
}

function EnergyChannel({ from, to }: { from: string; to: string }) {
  return (
    <div className="foundry-energy-channel" aria-hidden="true">
      <span className="foundry-energy-channel__pipe">
        <i /><i /><i />
      </span>
      <p>{from}</p>
      <span className="foundry-energy-channel__arrow" />
      <p>{to}</p>
    </div>
  );
}

function FoundryAssembly({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <motion.section
      className="foundry-assembly"
      aria-labelledby="foundry-assembly-title"
      initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ amount: 0.35, once: false }}
      transition={{ duration: reducedMotion ? 0.15 : 0.65, ease: foundryEase }}
    >
      <div aria-hidden="true" className="foundry-assembly-machine">
        <span className="assembly-pipe assembly-pipe--one"><i /></span>
        <span className="assembly-pipe assembly-pipe--two"><i /></span>
        <span className="assembly-pipe assembly-pipe--three"><i /></span>
        <span className="assembly-pipe assembly-pipe--four"><i /></span>
        <span className="assembly-pipe assembly-pipe--five"><i /></span>
        <div className="assembly-emblem"><FoundryMark /></div>
      </div>
      <p className="foundry-assembly-label">Complete crafting system</p>
      <h2 id="foundry-assembly-title">One connected set of tools.</h2>
      <p className="foundry-assembly-copy">
        Interfaces, services, data, intelligence, and delivery combine to turn
        thoughtful ideas into complete applications.
      </p>
    </motion.section>
  );
}

function FoundryExit({
  disabled,
  onContinue,
}: {
  disabled: boolean;
  onContinue: () => void;
}) {
  return (
    <section className="foundry-exit" aria-labelledby="foundry-exit-title">
      <div aria-hidden="true" className="foundry-exit-gate">
        <div className="foundry-exit-gate__light" />
        <span className="foundry-exit-gate__door foundry-exit-gate__door--left" />
        <span className="foundry-exit-gate__door foundry-exit-gate__door--right" />
        <span className="foundry-exit-step foundry-exit-step--one" />
        <span className="foundry-exit-step foundry-exit-step--two" />
        <span className="foundry-exit-step foundry-exit-step--three" />
      </div>
      <p className="foundry-exit-label">The forge path continues</p>
      <h2 id="foundry-exit-title">Connections wait beyond the powered gate.</h2>
      <button
        type="button"
        disabled={disabled}
        onClick={onContinue}
        data-cursor-label="Scene Five"
        className="foundry-exit-button portfolio-focus"
      >
        Continue to Scene Five
        <span aria-hidden="true" />
      </button>
    </section>
  );
}

function FoundryProgress({ activeGroup }: { activeGroup: number }) {
  return (
    <div
      className="foundry-progress"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <span className="foundry-progress__count">
        {String(activeGroup + 1).padStart(2, "0")} /{" "}
        {String(techGroups.length).padStart(2, "0")}
      </span>
      <span className="foundry-progress__track" aria-hidden="true">
        {techGroups.map((group, index) => (
          <i key={group.id} className={index === activeGroup ? "is-active" : ""} />
        ))}
      </span>
      <span className="foundry-progress__name">
        {stationPresentation[techGroups[activeGroup].id].name}
      </span>
    </div>
  );
}

function FoundryMark() {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      shapeRendering="crispEdges"
      className="foundry-mark"
    >
      <path
        fill="currentColor"
        d="M12 2h8v4h4v4h4v12h-4v4h-4v4h-8v-4H8v-4H4V10h4V6h4Zm0 8v4H8v4h4v4h8v-4h4v-4h-4v-4Zm2 4h4v4h-4Z"
      />
    </svg>
  );
}

function formatUsedIn(projects: readonly string[]) {
  if (projects.length === 1) return projects[0];
  if (projects.length === 2) return `${projects[0]} and ${projects[1]}`;
  return `${projects.slice(0, -1).join(", ")}, and ${projects.at(-1)}`;
}

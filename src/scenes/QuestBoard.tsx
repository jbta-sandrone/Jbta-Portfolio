import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
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
import "../styles/quest-board.css";

type QuestRank = "S" | "A" | "B";
type QuestIconName =
  | "full-stack"
  | "frontend"
  | "backend"
  | "ai"
  | "database"
  | "deployment";

type GuildQuest = {
  id: string;
  title: string;
  icon: QuestIconName;
  rank: QuestRank;
  description: string;
  detail: string;
  specialties: readonly string[];
};

const guildQuests: readonly GuildQuest[] = [
  {
    id: "full-stack-web-development",
    title: "Full-Stack Web Development",
    icon: "full-stack",
    rank: "S",
    description:
      "Build complete web applications from interface to data and deployment.",
    detail:
      "Bring the client experience, application logic, persistent data, and delivery workflow together as one clear and maintainable product.",
    specialties: [
      "React",
      "TypeScript",
      "Node.js",
      "Express",
      "PostgreSQL",
      "Prisma",
    ],
  },
  {
    id: "frontend-development",
    title: "Frontend Development",
    icon: "frontend",
    rank: "A",
    description:
      "Create responsive, accessible interfaces with thoughtful motion and polish.",
    detail:
      "Develop component-based experiences that remain readable, usable, and visually consistent across screen sizes and input methods.",
    specialties: [
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Motion",
      "Responsive Design",
      "Accessibility",
    ],
  },
  {
    id: "backend-api-development",
    title: "Backend & API Development",
    icon: "backend",
    rank: "A",
    description:
      "Develop application logic, APIs, authentication flows, and server features.",
    detail:
      "Create practical service layers that connect interfaces, stored data, user accounts, and intelligent product features.",
    specialties: ["Node.js", "Express", "FastAPI", "Python", "REST APIs", "JWT"],
  },
  {
    id: "ai-feature-integration",
    title: "AI Feature Integration",
    icon: "ai",
    rank: "S",
    description:
      "Add useful AI search, evaluation, recommendation, and assistant features.",
    detail:
      "Integrate Gemini workflows with structured prompts and outputs that support a specific user task instead of adding AI for novelty alone.",
    specialties: [
      "Google Gemini",
      "Prompt Engineering",
      "Structured Output",
      "AI Search",
      "AI Chat",
      "Recommendations",
    ],
  },
  {
    id: "database-authentication",
    title: "Database & Authentication",
    icon: "database",
    rank: "A",
    description:
      "Organize application data, user accounts, permissions, and access flows.",
    detail:
      "Model and connect relational, realtime, or serverless data with authentication patterns suited to the needs of the application.",
    specialties: [
      "PostgreSQL",
      "Prisma",
      "Firebase",
      "Upstash",
      "JWT",
      "Authentication",
    ],
  },
  {
    id: "deployment-optimization",
    title: "Deployment & Optimization",
    icon: "deployment",
    rank: "B",
    description:
      "Release applications, resolve issues, improve performance, and maintain builds.",
    detail:
      "Prepare frontend and backend projects for delivery, diagnose build or runtime problems, and keep project workflows dependable.",
    specialties: [
      "Vercel",
      "Render",
      "GitHub",
      "Debugging",
      "Performance",
      "Maintenance",
    ],
  },
] as const;

const guildEase = [0.22, 1, 0.36, 1] as const;

const dustMotes = Array.from({ length: 10 }, (_, index) => ({
  left: `${7 + ((index * 29) % 86)}%`,
  top: `${10 + ((index * 23) % 76)}%`,
  delay: `${-(index % 5) * 1.1}s`,
  duration: `${9 + (index % 4) * 1.5}s`,
}));

const contractReveal: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: (index: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.34,
      delay: index * 0.055,
      ease: guildEase,
    },
  }),
};

export default function QuestBoard() {
  const sceneRef = useRef<HTMLElement>(null);
  const scrollRootRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = Boolean(prefersReducedMotion);
  const { navigateToScene, isTransitioning } = useSceneNavigation();
  const [selectedQuestId, setSelectedQuestId] = useState(guildQuests[0].id);
  const [activeQuestIndex, setActiveQuestIndex] = useState(0);

  const { scrollYProgress } = useScroll({ container: scrollRootRef });
  const farY = useTransform(scrollYProgress, [0, 1], [-8, 16]);
  const roomY = useTransform(scrollYProgress, [0, 1], [-3, 26]);
  const nearY = useTransform(scrollYProgress, [0, 1], [0, 38]);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const syncAnimationState = () => {
      scene.classList.toggle("qb-is-paused", document.hidden);
    };

    syncAnimationState();
    document.addEventListener("visibilitychange", syncAnimationState);
    return () => document.removeEventListener("visibilitychange", syncAnimationState);
  }, []);

  const selectQuest = (questId: string, index: number) => {
    setActiveQuestIndex(index);
    setSelectedQuestId((current) => (current === questId ? "" : questId));
  };

  return (
    <section
      ref={(node) => {
        sceneRef.current = node;
        scrollRootRef.current = node;
      }}
      className={`qb-scene portfolio-scene relative h-full overflow-y-auto overflow-x-hidden overscroll-contain${
        reducedMotion ? " qb-reduced-motion" : " scroll-smooth"
      }`}
      data-cinematic-scene={4}
      data-scene-scroll
      aria-labelledby="quest-board-title"
    >
      <GuildHallEnvironment
        reducedMotion={reducedMotion}
        farY={farY}
        roomY={roomY}
        nearY={nearY}
      />

      <main className="qb-story">
        <GuildRegistration reducedMotion={reducedMotion} />
        <GuildPassage reducedMotion={reducedMotion} scrollRoot={scrollRootRef} />

        <section className="qb-contract-hall" aria-labelledby="guild-contracts-title">
          <GuildBoard>
            <header className="qb-board-heading">
              <p>Official Contract Registry</p>
              <h2 id="guild-contracts-title">Available Software Quests</h2>
              <span>Select a contract to inspect its capabilities.</span>
            </header>

            <div className="qb-contract-grid">
              {guildQuests.map((quest, index) => (
                <QuestContract
                  key={quest.id}
                  quest={quest}
                  index={index}
                  expanded={selectedQuestId === quest.id}
                  reducedMotion={reducedMotion}
                  scrollRoot={scrollRootRef}
                  onSelect={() => selectQuest(quest.id, index)}
                />
              ))}
            </div>

            <p className="qb-rank-note">
              Guild ranks are decorative markers for this RPG presentation, not professional certifications.
            </p>
          </GuildBoard>
        </section>

        <FoundryPassage
          reducedMotion={reducedMotion}
          disabled={isTransitioning}
          onContinue={() => navigateToScene(4)}
        />
      </main>

      <QuestTracker activeIndex={activeQuestIndex} />
    </section>
  );
}

type GuildHallEnvironmentProps = {
  reducedMotion: boolean;
  farY: MotionValue<number>;
  roomY: MotionValue<number>;
  nearY: MotionValue<number>;
};

function GuildHallEnvironment({
  reducedMotion,
  farY,
  roomY,
  nearY,
}: GuildHallEnvironmentProps) {
  const depth = (y: MotionValue<number>) => (reducedMotion ? undefined : { y });

  return (
    <div className="qb-environment" aria-hidden="true">
      <motion.div className="qb-depth qb-depth--far" style={depth(farY)}>
        <div className="qb-stone-foundation" />
        <div className="qb-timber-wall" />
        <div className="qb-ceiling-beam qb-ceiling-beam--one" />
        <div className="qb-ceiling-beam qb-ceiling-beam--two" />
        <div className="qb-window qb-window--left"><i /><span /></div>
        <div className="qb-window qb-window--right"><i /><span /></div>
        <div className="qb-back-crest"><GuildCrest /></div>
      </motion.div>

      <motion.div className="qb-depth qb-depth--room" style={depth(roomY)}>
        <TimberPost side="left" />
        <TimberPost side="right" />
        <GuildBanner side="left" />
        <GuildBanner side="right" />
        <GuildShelf side="left" />
        <GuildShelf side="right" />
        <Fireplace />
        <WeaponRack />
        <WallLantern side="left" />
        <WallLantern side="right" />
        <div className="qb-light-ray qb-light-ray--left" />
        <div className="qb-light-ray qb-light-ray--right" />
      </motion.div>

      <motion.div className="qb-depth qb-depth--near" style={depth(nearY)}>
        <div className="qb-floor" />
        <div className="qb-runner" />
        <div className="qb-barrel qb-barrel--left"><i /><i /></div>
        <div className="qb-crates qb-crates--right"><i /><span /></div>
        <div className="qb-rope-coil"><i /><i /><i /></div>
        <div className="qb-map-tube"><i /><i /></div>
        <div className="qb-floor-plant"><i /><i /><span /></div>
      </motion.div>

      {dustMotes.map((mote, index) => (
        <span
          key={index}
          className={`qb-dust${index > 6 ? " qb-dust--secondary" : ""}`}
          style={
            {
              left: mote.left,
              top: mote.top,
              "--qb-dust-delay": mote.delay,
              "--qb-dust-duration": mote.duration,
            } as CSSProperties
          }
        />
      ))}
      <div className="qb-room-shade" />
    </div>
  );
}

function TimberPost({ side }: { side: "left" | "right" }) {
  return (
    <div className={`qb-timber-post qb-timber-post--${side}`}>
      <span />
      <i />
    </div>
  );
}

function GuildBanner({ side }: { side: "left" | "right" }) {
  return (
    <div className={`qb-banner qb-banner--${side}`}>
      <GuildCrest />
      <i />
    </div>
  );
}

function GuildShelf({ side }: { side: "left" | "right" }) {
  return (
    <div className={`qb-shelf qb-shelf--${side}`}>
      <div className="qb-shelf-books"><i /><i /><i /><i /></div>
      <div className="qb-shelf-scrolls"><i /><i /><i /></div>
      <div className="qb-shelf-map"><span /></div>
    </div>
  );
}

function Fireplace() {
  return (
    <div className="qb-fireplace">
      <div className="qb-fireplace-mantle"><i /><i /></div>
      <div className="qb-fireplace-mouth">
        <span className="qb-flame qb-flame--back" />
        <span className="qb-flame qb-flame--front" />
        <i className="qb-fire-log qb-fire-log--one" />
        <i className="qb-fire-log qb-fire-log--two" />
      </div>
      <div className="qb-fireplace-glow" />
    </div>
  );
}

function WeaponRack() {
  return (
    <div className="qb-weapon-rack">
      <span />
      <i className="qb-training-sword qb-training-sword--one" />
      <i className="qb-training-sword qb-training-sword--two" />
      <b />
    </div>
  );
}

function WallLantern({ side }: { side: "left" | "right" }) {
  return (
    <div className={`qb-wall-lantern qb-wall-lantern--${side}`}>
      <i />
      <span />
    </div>
  );
}

function GuildRegistration({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <section className="qb-registration" aria-labelledby="quest-board-title">
      <motion.div
        className="qb-hanging-sign"
        initial={reducedMotion ? { opacity: 0 } : { rotate: -7, y: -18, opacity: 0 }}
        animate={{ rotate: 0, y: 0, opacity: 1 }}
        transition={{ duration: reducedMotion ? 0.12 : 0.56, ease: guildEase }}
        aria-hidden="true"
      >
        <i className="qb-sign-chain qb-sign-chain--left" />
        <i className="qb-sign-chain qb-sign-chain--right" />
        <GuildCrest />
        <span>The Adventurer&apos;s Guild</span>
      </motion.div>

      <div className="qb-reception">
        <div className="qb-reception-backdrop" aria-hidden="true">
          <div className="qb-registration-slots"><i /><i /><i /><i /></div>
          <div className="qb-guild-clerk">
            <span className="qb-clerk-head"><i /></span>
            <span className="qb-clerk-body" />
            <span className="qb-clerk-arm" />
          </div>
        </div>

        <div className="qb-counter-top" aria-hidden="true">
          <div className="qb-desk-bell"><i /><span /></div>
          <div className="qb-ink-pot"><i /></div>
          <div className="qb-quill" />
        </div>

        <motion.header
          className="qb-ledger"
          initial={reducedMotion ? { opacity: 0 } : { clipPath: "inset(0 50% 0 50%)" }}
          animate={reducedMotion ? { opacity: 1 } : { clipPath: "inset(0 0 0 0)" }}
          transition={{ duration: reducedMotion ? 0.12 : 0.62, delay: reducedMotion ? 0 : 0.24, ease: guildEase }}
        >
          <div className="qb-ledger-page qb-ledger-page--left">
            <p className="qb-scene-label">Scene Four</p>
            <span className="qb-ledger-line" aria-hidden="true" />
            <p className="qb-registration-status">
              <span aria-hidden="true" /> Guild registration complete
            </p>
            <p className="qb-ledger-note">
              Entry recorded. The guild registry is open.
            </p>
          </div>
          <div className="qb-ledger-spine" aria-hidden="true" />
          <div className="qb-ledger-page qb-ledger-page--right">
            <p className="qb-ledger-kicker">Quest Board</p>
            <h1 id="quest-board-title">The Adventurer&apos;s Guild</h1>
            <p>Available software contracts await inside.</p>
            <motion.div
              className="qb-ledger-stamp"
              initial={reducedMotion ? { opacity: 1 } : { scale: 1.45, rotate: -8, opacity: 0 }}
              animate={{ scale: 1, rotate: -3, opacity: 1 }}
              transition={{ duration: reducedMotion ? 0.1 : 0.28, delay: reducedMotion ? 0 : 0.82, ease: guildEase }}
              aria-hidden="true"
            >
              <GuildCrest />
              <span>Open</span>
            </motion.div>
          </div>
        </motion.header>

        <div className="qb-counter-front" aria-hidden="true">
          <span className="qb-counter-panel qb-counter-panel--left" />
          <div className="qb-counter-crest"><GuildCrest /></div>
          <span className="qb-counter-panel qb-counter-panel--right" />
        </div>
      </div>

      <div className="qb-registration-route" aria-hidden="true">
        <span>Proceed to the contract registry</span>
        <i /><i /><i />
      </div>
    </section>
  );
}

type GuildPassageProps = {
  reducedMotion: boolean;
  scrollRoot: RefObject<HTMLElement | null>;
};

function GuildPassage({ reducedMotion, scrollRoot }: GuildPassageProps) {
  return (
    <section className="qb-passage" aria-label="Path to the guild contract registry">
      <div className="qb-passage-rail qb-passage-rail--left" aria-hidden="true" />
      <div className="qb-passage-rail qb-passage-rail--right" aria-hidden="true" />
      <div className="qb-passage-path" aria-hidden="true">
        <i /><i /><i /><i /><i />
      </div>
      <motion.div
        className="qb-passage-message"
        initial={reducedMotion ? { opacity: 0 } : { clipPath: "inset(0 100% 0 0)" }}
        whileInView={reducedMotion ? { opacity: 1 } : { clipPath: "inset(0 0 0 0)" }}
        viewport={{ root: scrollRoot, amount: 0.65, once: true }}
        transition={{ duration: reducedMotion ? 0.1 : 0.48, ease: guildEase }}
      >
        <span aria-hidden="true" />
        <p>The board is active. Choose a contract to inspect.</p>
        <span aria-hidden="true" />
      </motion.div>
    </section>
  );
}

function GuildBoard({ children }: { children: ReactNode }) {
  return (
    <div className="qb-board-structure">
      <div className="qb-board-shadow" aria-hidden="true" />
      <div className="qb-board-hanging-plaque" aria-hidden="true">
        <i /><span>Quest Registry</span><i />
      </div>
      <div className="qb-board-beam" aria-hidden="true">
        <span className="qb-board-bolt qb-board-bolt--one" />
        <span className="qb-board-bolt qb-board-bolt--two" />
        <span className="qb-board-bolt qb-board-bolt--three" />
        <span className="qb-board-bolt qb-board-bolt--four" />
      </div>
      <div className="qb-board-post qb-board-post--left" aria-hidden="true"><i /></div>
      <div className="qb-board-post qb-board-post--right" aria-hidden="true"><i /></div>
      <BoardLantern side="left" />
      <BoardLantern side="right" />

      <div className="qb-board-panel">
        <div className="qb-board-bracket qb-board-bracket--tl" aria-hidden="true"><i /></div>
        <div className="qb-board-bracket qb-board-bracket--tr" aria-hidden="true"><i /></div>
        <div className="qb-board-bracket qb-board-bracket--bl" aria-hidden="true"><i /></div>
        <div className="qb-board-bracket qb-board-bracket--br" aria-hidden="true"><i /></div>
        <div className="qb-board-status"><i aria-hidden="true" /> Open for opportunities</div>
        {children}
      </div>
    </div>
  );
}

function BoardLantern({ side }: { side: "left" | "right" }) {
  return (
    <div className={`qb-board-lantern qb-board-lantern--${side}`} aria-hidden="true">
      <i />
      <span />
    </div>
  );
}

type QuestContractProps = {
  quest: GuildQuest;
  index: number;
  expanded: boolean;
  reducedMotion: boolean;
  scrollRoot: RefObject<HTMLElement | null>;
  onSelect: () => void;
};

function QuestContract({
  quest,
  index,
  expanded,
  reducedMotion,
  scrollRoot,
  onSelect,
}: QuestContractProps) {
  const titleId = `${quest.id}-title`;
  const detailId = `${quest.id}-details`;

  return (
    <motion.article
      className={`qb-contract qb-contract--rank-${quest.rank.toLowerCase()}${expanded ? " is-selected" : ""}`}
      variants={reducedMotion ? undefined : contractReveal}
      custom={index}
      initial={reducedMotion ? { opacity: 0 } : "hidden"}
      whileInView={reducedMotion ? { opacity: 1 } : "visible"}
      viewport={{ root: scrollRoot, amount: 0.25, once: true }}
      aria-labelledby={titleId}
    >
      <span className="qb-contract-corner qb-contract-corner--tl" aria-hidden="true" />
      <span className="qb-contract-corner qb-contract-corner--tr" aria-hidden="true" />
      <span className="qb-contract-corner qb-contract-corner--bl" aria-hidden="true" />
      <span className="qb-contract-corner qb-contract-corner--br" aria-hidden="true" />
      <span className="qb-contract-trace" aria-hidden="true" />

      <button
        type="button"
        className="qb-contract-trigger portfolio-focus"
        aria-expanded={expanded}
        aria-controls={detailId}
        onClick={onSelect}
        data-cursor-label={expanded ? "Close Quest" : "Inspect Quest"}
      >
        <span className="qb-contract-icon" aria-hidden="true">
          <QuestIcon type={quest.icon} />
        </span>
        <span className="qb-contract-copy">
          <span className="qb-contract-number">Contract {String(index + 1).padStart(2, "0")}</span>
          <strong id={titleId}>{quest.title}</strong>
          <span className="qb-contract-description">{quest.description}</span>
        </span>
        <span
          className="qb-contract-rank"
          aria-label={`Guild rank ${quest.rank}. Decorative ranking only.`}
        >
          <small>Rank</small>
          <b>{quest.rank}</b>
        </span>
        <span className="qb-contract-action" aria-hidden="true">
          <i /> {expanded ? "Contract open" : "Inspect contract"}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            id={detailId}
            className="qb-contract-details"
            role="region"
            aria-labelledby={titleId}
            initial={reducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={reducedMotion ? { opacity: 1 } : { height: "auto", opacity: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: reducedMotion ? 0.08 : 0.28, ease: guildEase }}
          >
            <div className="qb-contract-details-inner">
              <p>{quest.detail}</p>
              <ul aria-label={`${quest.title} technologies and capabilities`}>
                {quest.specialties.map((specialty) => (
                  <li key={specialty}><i aria-hidden="true" />{specialty}</li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

function QuestTracker({ activeIndex }: { activeIndex: number }) {
  return (
    <aside className="qb-tracker" aria-label="Selected guild contract" aria-live="polite">
      <span className="qb-tracker-count">
        {String(activeIndex + 1).padStart(2, "0")} / {String(guildQuests.length).padStart(2, "0")}
      </span>
      <span className="qb-tracker-markers" aria-hidden="true">
        {guildQuests.map((quest, index) => (
          <i key={quest.id} className={index === activeIndex ? "is-active" : ""} />
        ))}
      </span>
      <span className="qb-tracker-name">{guildQuests[activeIndex].title}</span>
    </aside>
  );
}

type FoundryPassageProps = {
  reducedMotion: boolean;
  disabled: boolean;
  onContinue: () => void;
};

function FoundryPassage({ reducedMotion, disabled, onContinue }: FoundryPassageProps) {
  return (
    <section className="qb-foundry-exit" aria-labelledby="quest-foundry-title">
      <motion.div
        className="qb-forge-passage"
        initial={reducedMotion ? { opacity: 0 } : { opacity: 0, clipPath: "inset(0 0 42% 0)" }}
        whileInView={reducedMotion ? { opacity: 1 } : { opacity: 1, clipPath: "inset(0 0 0 0)" }}
        viewport={{ amount: 0.45, once: true }}
        transition={{ duration: reducedMotion ? 0.12 : 0.58, ease: guildEase }}
        aria-hidden="true"
      >
        <div className="qb-forge-lintel"><i /><i /><i /></div>
        <div className="qb-forge-wall qb-forge-wall--left" />
        <div className="qb-forge-wall qb-forge-wall--right" />
        <div className="qb-forge-glow" />
        <div className="qb-forge-pipe"><i /><i /></div>
        <div className="qb-forge-gear qb-forge-gear--left"><i /></div>
        <div className="qb-forge-gear qb-forge-gear--right"><i /></div>
        <div className="qb-forge-stairs"><i /><i /><i /><i /></div>
      </motion.div>

      <div className="qb-exit-copy">
        <p>Deeper Within the Guild</p>
        <h2 id="quest-foundry-title">The forge lies beyond the contract hall.</h2>
        <span>Continue downward to discover the tools behind every creation.</span>
        <button
          type="button"
          className="qb-continue portfolio-focus"
          onClick={onContinue}
          disabled={disabled}
          data-cursor-label="Enter Foundry"
        >
          Enter the Arcane Foundry <i aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}

function GuildCrest() {
  return (
    <svg
      viewBox="0 0 48 56"
      fill="none"
      aria-hidden="true"
      focusable="false"
      shapeRendering="crispEdges"
    >
      <path d="M4 4h40v31h-5v8h-7v5h-8v5h-8v-5H9v-5H4V4Z" className="qb-crest-outline" />
      <path d="M9 9h30v24h-5v7h-6v4h-8v-4h-6v-7H9V9Z" className="qb-crest-field" />
      <path d="M21 12h6v9h8v6h-8v9h-6v-9h-8v-6h8v-9Z" className="qb-crest-mark" />
    </svg>
  );
}

function QuestIcon({ type }: { type: QuestIconName }) {
  const common = {
    viewBox: "0 0 48 48",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    shapeRendering: "crispEdges" as const,
    focusable: false,
    "aria-hidden": true,
  };

  if (type === "full-stack") {
    return (
      <svg {...common}>
        <path d="M7 8h34v11H7V8Zm0 15h34v17H7V23Z" />
        <path d="M12 13h3m4 0h3m-10 16h24m-24 6h17" />
        <path d="m29 30 3 3 5-6" />
      </svg>
    );
  }

  if (type === "frontend") {
    return (
      <svg {...common}>
        <path d="M6 8h36v31H6V8Z" />
        <path d="M6 16h36M12 12h2m4 0h2m-7 12 6 5-6 5m22-10-6 5 6 5m-13 2 5-14" />
      </svg>
    );
  }

  if (type === "backend") {
    return (
      <svg {...common}>
        <path d="M7 7h34v10H7V7Zm0 14h34v10H7V21Zm0 14h34v7H7v-7Z" />
        <path d="M12 12h3m4 0h3m-10 14h3m4 0h3m-10 12h3m17-26h4m-4 14h4m-4 12h4" />
      </svg>
    );
  }

  if (type === "ai") {
    return (
      <svg {...common}>
        <path d="M18 8h12v5h6v7h5v10h-5v7h-6v5H18v-5h-6v-7H7V20h5v-7h6V8Z" />
        <path d="M18 19h4v4h-4v-4Zm8 0h4v4h-4v-4Zm-8 11h12m-6-15v18M10 24H5m38 0h-5" />
      </svg>
    );
  }

  if (type === "database") {
    return (
      <svg {...common}>
        <path d="M8 11c0-4 7-7 16-7s16 3 16 7v26c0 4-7 7-16 7S8 41 8 37V11Z" />
        <path d="M8 11c0 4 7 7 16 7s16-3 16-7M8 24c0 4 7 7 16 7s16-3 16-7M8 36c0 4 7 7 16 7s16-3 16-7" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M6 28h23v13H6V28Zm27-9h9v22h-9V19Z" />
      <path d="M10 33h4m4 0h7m-15 4h11M28 8h11v7M39 8 25 22m1-7-1 7 7-1" />
    </svg>
  );
}

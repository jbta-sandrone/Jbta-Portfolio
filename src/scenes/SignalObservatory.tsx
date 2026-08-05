import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent as ReactFocusEvent,
  type RefObject,
} from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, Check, Copy, FileText, Mail } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
  type Variants,
} from "motion/react";
import type { IconType } from "react-icons";
import { FaFacebookF, FaGithub, FaLinkedinIn } from "react-icons/fa";
import { useSceneNavigation } from "../components/SceneNavigationContext";
import "../styles/signal-observatory.css";

type ConnectionType = "email" | "profile" | "resume";
type ConnectionIcon = LucideIcon | IconType;
type CopyStatus = "copied" | "failed";
type StationKind = "message" | "archive" | "network" | "messenger" | "record";

type ConnectionItem = {
  id: string;
  label: string;
  shortLabel: string;
  value: string;
  href: string;
  icon: ConnectionIcon;
  type: ConnectionType;
  external: boolean;
  copyValue?: string;
  description: string;
  actionLabel: string;
  brandColor: string;
  stationLabel: string;
  stationName: string;
  stationKind: StationKind;
};

const connectionItems: readonly ConnectionItem[] = [
  {
    id: "email",
    label: "Start a Conversation",
    shortLabel: "Email",
    value: "ablogjonelbryan@gmail.com",
    href: "mailto:ablogjonelbryan@gmail.com",
    icon: Mail,
    type: "email",
    external: false,
    copyValue: "ablogjonelbryan@gmail.com",
    description: "Share what you are building, exploring, or imagining, and let us begin there.",
    actionLabel: "Send Email",
    brandColor: "#fcd34d",
    stationLabel: "Direct Message",
    stationName: "Email Channel",
    stationKind: "message",
  },
  {
    id: "github",
    label: "Explore My Code",
    shortLabel: "GitHub",
    value: "https://github.com/jbta-sandrone",
    href: "https://github.com/jbta-sandrone",
    icon: FaGithub,
    type: "profile",
    external: true,
    copyValue: "https://github.com/jbta-sandrone",
    description: "Browse the systems, experiments, and product work behind this portfolio.",
    actionLabel: "Open GitHub",
    brandColor: "#f5f5f5",
    stationLabel: "Code Archive",
    stationName: "GitHub",
    stationKind: "archive",
  },
  {
    id: "linkedin",
    label: "Let's Connect",
    shortLabel: "LinkedIn",
    value: "https://www.linkedin.com/in/jbtablog",
    href: "https://www.linkedin.com/in/jbtablog",
    icon: FaLinkedinIn,
    type: "profile",
    external: true,
    copyValue: "https://www.linkedin.com/in/jbtablog",
    description: "Connect professionally and follow the next chapter of my work and growth.",
    actionLabel: "Open LinkedIn",
    brandColor: "#0a66c2",
    stationLabel: "Guild Network",
    stationName: "LinkedIn",
    stationKind: "network",
  },
  {
    id: "facebook",
    label: "Find Me on Facebook",
    shortLabel: "Facebook",
    value: "https://www.facebook.com/ablogjonel.21/",
    href: "https://www.facebook.com/ablogjonel.21/",
    icon: FaFacebookF,
    type: "profile",
    external: true,
    copyValue: "https://www.facebook.com/ablogjonel.21/",
    description: "A more personal place to stay connected beyond projects and professional updates.",
    actionLabel: "Open Facebook",
    brandColor: "#1877f2",
    stationLabel: "Messenger Post",
    stationName: "Facebook",
    stationKind: "messenger",
  },
  {
    id: "resume",
    label: "Professional Resume",
    shortLabel: "Resume",
    value: "jonel-bryan-ablog-resume.pdf",
    href: "/Jonel_Ablog_Resume.pdf",
    icon: FileText,
    type: "resume",
    external: true,
    description: "View my experience, education, projects, and technical background.",
    actionLabel: "View Resume",
    brandColor: "#fde68a",
    stationLabel: "Traveler Record",
    stationName: "Résumé",
    stationKind: "record",
  },
] as const;

const observatoryEase = [0.22, 1, 0.36, 1] as const;
const AUTO_CYCLE_MS = 5200;

const stars = Array.from({ length: 28 }, (_, index) => ({
  left: `${3 + ((index * 37) % 94)}%`,
  top: `${4 + ((index * 23) % 58)}%`,
  size: index % 7 === 0 ? 5 : index % 3 === 0 ? 3 : 2,
  delay: `${(index % 9) * -0.7}s`,
  duration: `${4.8 + (index % 5) * 0.8}s`,
}));

const signalMotes = Array.from({ length: 9 }, (_, index) => ({
  left: `${18 + ((index * 31) % 65)}%`,
  delay: `${(index % 6) * -1.15}s`,
  duration: `${7 + (index % 4) * 0.85}s`,
}));

const revealVariants = (reducedMotion: boolean): Variants => ({
  hidden: reducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: reducedMotion ? 0.15 : 0.68,
      ease: observatoryEase,
      staggerChildren: reducedMotion ? 0.02 : 0.08,
    },
  },
});

const childVariants = (reducedMotion: boolean): Variants => ({
  hidden: reducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: reducedMotion ? 0.12 : 0.46, ease: observatoryEase },
  },
});

export default function SignalObservatory() {
  const sectionRef = useRef<HTMLElement>(null);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [copyResult, setCopyResult] = useState<{
    id: string;
    status: CopyStatus;
  } | null>(null);
  const [interactionPaused, setInteractionPaused] = useState(false);
  const [sceneVisible, setSceneVisible] = useState(true);
  const [documentVisible, setDocumentVisible] = useState(true);
  const copyTimerRef = useRef<number | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = prefersReducedMotion !== false;
  const { navigateToScene, isTransitioning } = useSceneNavigation();
  const { scrollYProgress } = useScroll({ container: sectionRef });
  const skyY = useTransform(scrollYProgress, [0, 1], [0, -38]);
  const mountainY = useTransform(scrollYProgress, [0, 1], [0, -72]);
  const platformY = useTransform(scrollYProgress, [0, 1], [0, -108]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => setSceneVisible(Boolean(entry?.isIntersecting)),
      { threshold: [0, 0.2] },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const syncVisibility = () => {
      const visible = document.visibilityState === "visible";
      setDocumentVisible(visible);
      section?.classList.toggle("observatory-animation-paused", !visible);
    };

    syncVisibility();
    document.addEventListener("visibilitychange", syncVisibility);
    return () => document.removeEventListener("visibilitychange", syncVisibility);
  }, []);

  useEffect(() => {
    if (
      reducedMotion ||
      interactionPaused ||
      !sceneVisible ||
      !documentVisible
    ) {
      return;
    }

    const cycleTimer = window.setInterval(() => {
      setActiveIndex((current) => {
        const next = (current + 1) % connectionItems.length;
        activeIndexRef.current = next;
        return next;
      });
      setCopyResult(null);
    }, AUTO_CYCLE_MS);

    return () => window.clearInterval(cycleTimer);
  }, [documentVisible, interactionPaused, reducedMotion, sceneVisible]);

  useEffect(
    () => () => {
      if (copyTimerRef.current !== null) window.clearTimeout(copyTimerRef.current);
    },
    [],
  );

  const selectConnection = useCallback((index: number) => {
    activeIndexRef.current = index;
    setActiveIndex(index);
    setCopyResult(null);
  }, []);

  const copyConnectionValue = async (item: ConnectionItem) => {
    if (!item.copyValue) return;
    if (copyTimerRef.current !== null) window.clearTimeout(copyTimerRef.current);

    try {
      if (!navigator.clipboard) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(item.copyValue);
      setCopyResult({ id: item.id, status: "copied" });
    } catch {
      setCopyResult({ id: item.id, status: "failed" });
    }

    copyTimerRef.current = window.setTimeout(() => setCopyResult(null), 1800);
  };

  const handleInteractionBlur = (event: ReactFocusEvent<HTMLElement>) => {
    if (
      event.relatedTarget instanceof Node &&
      event.currentTarget.contains(event.relatedTarget)
    ) {
      return;
    }
    setInteractionPaused(false);
  };

  const activeItem = connectionItems[activeIndex];

  return (
    <section
      ref={sectionRef}
      data-cinematic-scene={5}
      data-scene-scroll
      aria-labelledby="scene-five-title"
      className="celestial-observatory portfolio-scene relative h-full overflow-y-auto overflow-x-hidden overscroll-contain"
    >
      <ObservatoryEnvironment
        reducedMotion={reducedMotion}
        skyY={skyY}
        mountainY={mountainY}
        platformY={platformY}
      />

      <main className="observatory-content relative z-10">
        <ObservatoryEntrance reducedMotion={reducedMotion} />

        <section
          className="observatory-signal-section"
          aria-labelledby="communication-channel-title"
        >
          <motion.div
            className="observatory-beacon-column"
            variants={revealVariants(reducedMotion)}
            initial="hidden"
            whileInView="visible"
            viewport={{ root: sectionRef, amount: 0.3, once: false }}
          >
            <motion.div variants={childVariants(reducedMotion)}>
              <SignalBeacon activeItem={activeItem} />
            </motion.div>
            <motion.div variants={childVariants(reducedMotion)} className="beacon-copy">
              <p>Central signal beacon</p>
              <h2>Messages begin their journey here.</h2>
              <span>
                The observatory routes each open channel toward the horizon.
              </span>
            </motion.div>
          </motion.div>

          <motion.div
            variants={revealVariants(reducedMotion)}
            initial="hidden"
            whileInView="visible"
            viewport={{ root: sectionRef, amount: 0.28, once: false }}
            onPointerEnter={(event) => {
              if (event.pointerType === "mouse") setInteractionPaused(true);
            }}
            onPointerLeave={(event) => {
              if (event.pointerType === "mouse") setInteractionPaused(false);
            }}
            onFocusCapture={() => setInteractionPaused(true)}
            onBlurCapture={handleInteractionBlur}
          >
            <CommunicationChannel
              item={activeItem}
              copyResult={copyResult}
              reducedMotion={reducedMotion}
              onCopy={copyConnectionValue}
            />
          </motion.div>
        </section>

        <ConnectionStations
          activeIndex={activeIndex}
          reducedMotion={reducedMotion}
          scrollRoot={sectionRef}
          onSelect={selectConnection}
          onPauseChange={setInteractionPaused}
        />

        <ObservatoryFinale
          disabled={isTransitioning}
          onContinue={() => navigateToScene(5)}
        />
      </main>

      <ConnectionProgress activeIndex={activeIndex} />
    </section>
  );
}

type EnvironmentProps = {
  reducedMotion: boolean;
  skyY: MotionValue<number>;
  mountainY: MotionValue<number>;
  platformY: MotionValue<number>;
};

function ObservatoryEnvironment({
  reducedMotion,
  skyY,
  mountainY,
  platformY,
}: EnvironmentProps) {
  const depthStyle = (y: MotionValue<number>) =>
    reducedMotion ? undefined : { y };

  return (
    <div
      aria-hidden="true"
      className="observatory-environment pointer-events-none"
    >
      <motion.div
        className="observatory-depth observatory-depth--sky"
        style={depthStyle(skyY)}
      >
        <div className="observatory-night-sky" />
        {stars.map((star, index) => (
          <span
            key={index}
            className={`observatory-star ${
              star.size >= 5 ? "observatory-star--large" : ""
            }`}
            style={
              {
                left: star.left,
                top: star.top,
                width: `${star.size}px`,
                height: `${star.size}px`,
                animationDelay: star.delay,
                animationDuration: star.duration,
              } as CSSProperties
            }
          />
        ))}
        <PixelConstellation />
        <span className="observatory-shooting-star" />
        <div className="observatory-moon"><span /></div>
      </motion.div>

      <motion.div
        className="observatory-depth observatory-depth--mountains"
        style={depthStyle(mountainY)}
      >
        <div className="observatory-mountain observatory-mountain--far" />
        <div className="observatory-village-lights">
          {Array.from({ length: 9 }, (_, index) => <i key={index} />)}
        </div>
        <div className="observatory-cloud observatory-cloud--one" />
        <div className="observatory-cloud observatory-cloud--two" />
        <div className="observatory-cloud observatory-cloud--three" />
        <div className="observatory-mountain observatory-mountain--near" />
      </motion.div>

      <motion.div
        className="observatory-depth observatory-depth--platform"
        style={depthStyle(platformY)}
      >
        <div className="observatory-tower">
          <span className="observatory-dome"><i /><i /></span>
          <span className="observatory-tower-window"><i /></span>
          <span className="observatory-tower-door" />
        </div>
        <div className="observatory-telescope">
          <span /><i /><i />
        </div>
        <div className="observatory-dish observatory-dish--left">
          <span /><i />
        </div>
        <div className="observatory-dish observatory-dish--right">
          <span /><i />
        </div>
        <div className="observatory-railing observatory-railing--left">
          {Array.from({ length: 7 }, (_, index) => <i key={index} />)}
        </div>
        <div className="observatory-railing observatory-railing--right">
          {Array.from({ length: 7 }, (_, index) => <i key={index} />)}
        </div>
        <div className="observatory-lantern observatory-lantern--left"><span /></div>
        <div className="observatory-lantern observatory-lantern--right"><span /></div>
        <div className="observatory-flag observatory-flag--left"><span /></div>
        <div className="observatory-flag observatory-flag--right"><span /></div>
        <div className="observatory-cable observatory-cable--one" />
        <div className="observatory-cable observatory-cable--two" />
        <div className="observatory-stone-platform" />
      </motion.div>

      {signalMotes.map((mote, index) => (
        <span
          key={index}
          className={`observatory-signal-mote ${
            index > 5 ? "observatory-signal-mote--desktop" : ""
          }`}
          style={
            {
              left: mote.left,
              animationDelay: mote.delay,
              animationDuration: mote.duration,
            } as CSSProperties
          }
        />
      ))}
      <div className="observatory-readability" />
    </div>
  );
}

function PixelConstellation() {
  return (
    <svg
      className="observatory-constellation"
      viewBox="0 0 1000 420"
      preserveAspectRatio="none"
      shapeRendering="crispEdges"
    >
      <g className="constellation-path constellation-path--one">
        <path d="M80 165 176 92 268 138 358 63 447 119" />
        <circle cx="80" cy="165" r="4" />
        <circle cx="176" cy="92" r="5" />
        <circle cx="268" cy="138" r="3" />
        <circle cx="358" cy="63" r="5" />
        <circle cx="447" cy="119" r="4" />
      </g>
      <g className="constellation-path constellation-path--two">
        <path d="M604 91 674 151 754 104 831 185 922 126" />
        <circle cx="604" cy="91" r="4" />
        <circle cx="674" cy="151" r="3" />
        <circle cx="754" cy="104" r="5" />
        <circle cx="831" cy="185" r="4" />
        <circle cx="922" cy="126" r="5" />
      </g>
      <path
        className="constellation-signal"
        d="M80 165 176 92 268 138 358 63 447 119"
      />
    </svg>
  );
}

function ObservatoryEntrance({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <section className="observatory-entrance" aria-labelledby="scene-five-title">
      <div aria-hidden="true" className="observatory-elevator">
        <div className="observatory-elevator__forge" />
        <span className="observatory-elevator__chain observatory-elevator__chain--left" />
        <span className="observatory-elevator__chain observatory-elevator__chain--right" />
        <motion.div
          className="observatory-elevator__car"
          initial={reducedMotion ? { opacity: 0.7 } : { y: "42%" }}
          animate={reducedMotion ? { opacity: 1 } : { y: "0%" }}
          transition={{
            duration: reducedMotion ? 0.15 : 1.15,
            delay: reducedMotion ? 0 : 0.12,
            ease: observatoryEase,
          }}
        >
          <span /><i /><i />
        </motion.div>
        <div className="observatory-elevator__night" />
        <div className="observatory-elevator__gate" />
      </div>

      <motion.header
        className="observatory-chapter-panel"
        initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: reducedMotion ? 0.16 : 0.7,
          delay: reducedMotion ? 0 : 0.55,
          ease: observatoryEase,
        }}
      >
        <PixelPanelCorners />
        <p className="observatory-chapter-index">Scene Five</p>
        <div aria-hidden="true" className="observatory-chapter-rule">
          <span /><SignalGlyph /><span />
        </div>
        <p className="observatory-chapter-kicker">Connections</p>
        <h1 id="scene-five-title">The Celestial Signal Observatory</h1>
        <p className="observatory-chapter-copy">
          Every great journey begins with a connection.
        </p>
        <p className="observatory-arrival-prompt">
          Step onto the observation deck <i aria-hidden="true" />
        </p>
      </motion.header>
    </section>
  );
}

function SignalBeacon({ activeItem }: { activeItem: ConnectionItem }) {
  const Icon = activeItem.icon;

  return (
    <div
      className={`signal-beacon signal-beacon--${activeItem.stationKind}`}
      aria-hidden="true"
    >
      <div className="signal-beacon__sky-path signal-beacon__sky-path--left"><i /></div>
      <div className="signal-beacon__sky-path signal-beacon__sky-path--right"><i /></div>
      <span className="signal-beacon__ring signal-beacon__ring--outer"><i /></span>
      <span className="signal-beacon__ring signal-beacon__ring--middle"><i /></span>
      <span className="signal-beacon__ring signal-beacon__ring--inner"><i /></span>
      <div className="signal-beacon__crystal">
        <Icon style={{ color: activeItem.brandColor }} />
      </div>
      <div className="signal-beacon__support signal-beacon__support--left" />
      <div className="signal-beacon__support signal-beacon__support--right" />
      <div className="signal-beacon__console">
        <span /><span /><span /><i />
      </div>
      <div className="signal-beacon__base">
        <span /><i /><i />
      </div>
    </div>
  );
}

function CommunicationChannel({
  item,
  copyResult,
  reducedMotion,
  onCopy,
}: {
  item: ConnectionItem;
  copyResult: { id: string; status: CopyStatus } | null;
  reducedMotion: boolean;
  onCopy: (item: ConnectionItem) => void;
}) {
  const Icon = item.icon;
  const itemCopyResult = copyResult?.id === item.id ? copyResult.status : null;
  const copyLabel =
    itemCopyResult === "copied"
      ? "Copied"
      : itemCopyResult === "failed"
        ? "Copy unavailable"
        : item.type === "email"
          ? "Copy Email"
          : "Copy Link";

  return (
    <section
      className="communication-channel"
      aria-labelledby="communication-channel-title"
    >
      <PixelPanelCorners />
      <header className="communication-channel__header">
        <div>
          <p>Open Signal</p>
          <h2 id="communication-channel-title">Communication Channel</h2>
        </div>
        <span className="communication-channel__status">
          <i aria-hidden="true" />
          Channel online
        </span>
      </header>

      <div className="communication-channel__screen">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={item.id}
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={{
              duration: reducedMotion ? 0.13 : 0.3,
              ease: observatoryEase,
            }}
          >
            <div className="communication-channel__identity">
              <span className="communication-channel__icon">
                <Icon aria-hidden="true" style={{ color: item.brandColor }} />
              </span>
              <div>
                <p>{item.stationLabel}</p>
                <h3>{item.label}</h3>
              </div>
            </div>
            <p className="communication-channel__description">
              {item.description}
            </p>
            <p className="communication-channel__value">{item.value}</p>

            <div className="communication-channel__actions">
              {item.copyValue && (
                <button
                  type="button"
                  onClick={() => onCopy(item)}
                  data-cursor-label="Copy"
                  className="observatory-button observatory-button--secondary portfolio-focus"
                >
                  {itemCopyResult === "copied" ? (
                    <Check aria-hidden="true" />
                  ) : (
                    <Copy aria-hidden="true" />
                  )}
                  {copyLabel}
                </button>
              )}
              <a
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noreferrer" : undefined}
                aria-label={`${item.actionLabel}${
                  item.external ? " (opens in a new tab)" : ""
                }`}
                data-cursor-label={
                  item.type === "resume"
                    ? "View"
                    : item.type === "email"
                      ? "Send"
                      : "Open"
                }
                className="observatory-button observatory-button--primary portfolio-focus"
              >
                {item.actionLabel}
                <ArrowUpRight aria-hidden="true" />
              </a>
            </div>

            <p className="communication-channel__feedback" aria-live="polite">
              {itemCopyResult === "copied"
                ? `${item.shortLabel} address copied.`
                : itemCopyResult === "failed"
                  ? "Copying is unavailable. Use the open action instead."
                  : ""}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function ConnectionStations({
  activeIndex,
  reducedMotion,
  scrollRoot,
  onSelect,
  onPauseChange,
}: {
  activeIndex: number;
  reducedMotion: boolean;
  scrollRoot: RefObject<HTMLElement | null>;
  onSelect: (index: number) => void;
  onPauseChange: (paused: boolean) => void;
}) {
  const handleBlur = (event: ReactFocusEvent<HTMLElement>) => {
    if (
      event.relatedTarget instanceof Node &&
      event.currentTarget.contains(event.relatedTarget)
    ) {
      return;
    }
    onPauseChange(false);
  };

  return (
    <motion.section
      className="connection-stations-section"
      aria-labelledby="connection-stations-title"
      variants={revealVariants(reducedMotion)}
      initial="hidden"
      whileInView="visible"
      viewport={{ root: scrollRoot, amount: 0.18, once: false }}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") onPauseChange(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") onPauseChange(false);
      }}
      onFocusCapture={() => onPauseChange(true)}
      onBlurCapture={handleBlur}
    >
      <motion.header
        variants={childVariants(reducedMotion)}
        className="connection-stations-header"
      >
        <p>Observatory array</p>
        <h2 id="connection-stations-title">Choose a signal station.</h2>
        <span>
          Each station opens a real channel for conversation, collaboration, or
          learning more about the work.
        </span>
      </motion.header>

      <div className="connection-stations-grid">
        {connectionItems.map((item, index) => (
          <motion.div key={item.id} variants={childVariants(reducedMotion)}>
            <ConnectionStation
              item={item}
              index={index}
              active={activeIndex === index}
              onSelect={onSelect}
            />
          </motion.div>
        ))}
      </div>
      <div aria-hidden="true" className="connection-stations-signal">
        <span><i /></span>
        <span><i /></span>
        <span><i /></span>
        <span><i /></span>
        <span><i /></span>
      </div>
    </motion.section>
  );
}

function ConnectionStation({
  item,
  index,
  active,
  onSelect,
}: {
  item: ConnectionItem;
  index: number;
  active: boolean;
  onSelect: (index: number) => void;
}) {
  const Icon = item.icon;

  return (
    <button
      type="button"
      aria-label={`Tune to ${item.shortLabel}: ${item.label}`}
      aria-pressed={active}
      aria-controls="communication-channel-title"
      data-cursor-label={item.shortLabel}
      onClick={() => onSelect(index)}
      className={`connection-station connection-station--${item.stationKind} portfolio-focus ${
        active ? "is-active" : ""
      }`}
    >
      <span className="connection-station__mast" aria-hidden="true">
        <i /><i /><i />
      </span>
      <span className="connection-station__icon">
        <Icon aria-hidden="true" style={{ color: item.brandColor }} />
      </span>
      <span className="connection-station__copy">
        <small>{item.stationLabel}</small>
        <strong>{item.stationName}</strong>
        <span>{item.actionLabel}</span>
      </span>
      <span className="connection-station__signal" aria-hidden="true"><i /></span>
      <span className="connection-station__light" aria-hidden="true" />
    </button>
  );
}

function ObservatoryFinale({
  disabled,
  onContinue,
}: {
  disabled: boolean;
  onContinue: () => void;
}) {
  return (
    <section className="observatory-finale" aria-labelledby="observatory-finale-title">
      <div aria-hidden="true" className="observatory-final-platform">
        <div className="observatory-final-telescope"><span /><i /><i /></div>
        <div className="observatory-final-bench"><span /><i /><i /></div>
        <div className="observatory-final-path">
          <span /><span /><span /><span />
        </div>
        <div className="observatory-next-gate">
          <span /><i /><i />
        </div>
      </div>
      <p className="observatory-finale-label">The journey continues</p>
      <h2 id="observatory-finale-title">
        The next horizon waits beyond the mountain path.
      </h2>
      <p className="observatory-finale-copy">
        Thank you for visiting the observatory. One final destination remains.
      </p>
      <button
        type="button"
        disabled={disabled}
        onClick={onContinue}
        data-cursor-label="Scene Six"
        className="observatory-button observatory-button--primary observatory-finale-button portfolio-focus"
      >
        Continue the Journey
        <span aria-hidden="true" />
      </button>
    </section>
  );
}

function ConnectionProgress({ activeIndex }: { activeIndex: number }) {
  return (
    <div
      className="observatory-progress"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <span className="observatory-progress__count">
        {String(activeIndex + 1).padStart(2, "0")} /{" "}
        {String(connectionItems.length).padStart(2, "0")}
      </span>
      <span className="observatory-progress__track" aria-hidden="true">
        {connectionItems.map((item, index) => (
          <i key={item.id} className={index === activeIndex ? "is-active" : ""} />
        ))}
      </span>
      <span className="observatory-progress__name">
        {connectionItems[activeIndex].shortLabel}
      </span>
    </div>
  );
}

function PixelPanelCorners() {
  return (
    <span aria-hidden="true">
      <i className="observatory-panel-corner observatory-panel-corner--tl" />
      <i className="observatory-panel-corner observatory-panel-corner--tr" />
      <i className="observatory-panel-corner observatory-panel-corner--bl" />
      <i className="observatory-panel-corner observatory-panel-corner--br" />
    </span>
  );
}

function SignalGlyph() {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      shapeRendering="crispEdges"
      className="observatory-signal-glyph"
    >
      <path
        fill="currentColor"
        d="M14 2h4v12h4v4h-4v12h-4V18h-4v-4h4ZM6 7h4v4H6v10h4v4H6v-4H2V11h4Zm16 0h4v4h4v10h-4v4h-4v-4h4V11h-4Z"
      />
    </svg>
  );
}

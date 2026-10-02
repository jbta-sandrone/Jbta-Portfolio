import { useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, ArrowUpRight, Check, Copy, FileText, Mail } from "lucide-react";
import type { IconType } from "react-icons";
import { FaFacebookF, FaGithub, FaLinkedinIn } from "react-icons/fa";
import { useSceneNavigation } from "../components/SceneNavigationContext";
import "../styles/signal-observatory.css";

type ConnectionType = "email" | "profile" | "resume";
type ConnectionIcon = LucideIcon | IconType;
type CopyStatus = "copied" | "failed";

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
  },
] as const;

const primaryEmail = connectionItems.find((item) => item.type === "email")!;
const secondaryConnections = connectionItems.filter((item) => item.type !== "email");

function copyWithSelection(value: string) {
  const previousFocus = document.activeElement;
  const field = document.createElement("textarea");
  field.value = value;
  field.readOnly = true;
  field.style.position = "fixed";
  field.style.opacity = "0";
  field.style.pointerEvents = "none";
  document.body.appendChild(field);

  try {
    field.focus();
    field.select();
    return document.execCommand("copy");
  } finally {
    field.remove();
    if (previousFocus instanceof HTMLElement) previousFocus.focus({ preventScroll: true });
  }
}

export default function SignalObservatory() {
  const [copyResult, setCopyResult] = useState<{
    id: string;
    status: CopyStatus;
  } | null>(null);
  const copyTimerRef = useRef<number | null>(null);
  const { navigateToScene } = useSceneNavigation();

  useEffect(
    () => () => {
      if (copyTimerRef.current !== null) window.clearTimeout(copyTimerRef.current);
    },
    [],
  );

  const copyConnectionValue = async (item: ConnectionItem) => {
    if (!item.copyValue) return;
    if (copyTimerRef.current !== null) window.clearTimeout(copyTimerRef.current);

    try {
      if (navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(item.copyValue);
        } catch {
          if (!copyWithSelection(item.copyValue)) throw new Error("Copy unavailable");
        }
      } else if (!copyWithSelection(item.copyValue)) {
        throw new Error("Copy unavailable");
      }
      setCopyResult({ id: item.id, status: "copied" });
    } catch {
      setCopyResult({ id: item.id, status: "failed" });
    }

    copyTimerRef.current = window.setTimeout(() => setCopyResult(null), 1800);
  };

  const emailCopyStatus =
    copyResult?.id === primaryEmail.id ? copyResult.status : null;

  return (
    <section
      id="connect"
      data-portfolio-section
      className="connection-endpoint professional-theme portfolio-section relative"
      data-cinematic-scene={6}
      aria-labelledby="connect-title"
    >
      <div className="connection-endpoint__scroll">
        <div className="connection-endpoint__layout professional-container professional-container--wide">
          <header className="connection-endpoint__intro">
            <div>
              <p className="connection-endpoint__marker professional-label">
                <span>06 / CONTACT</span>
                <span aria-hidden="true" />
                LET'S CONNECT
              </p>
              <h2 data-section-heading tabIndex={-1} id="connect-title" className="connection-endpoint__heading professional-heading">
                Let's build
                <span> something useful.</span>
              </h2>
            </div>
            <div className="connection-endpoint__intro-aside">
              <p className="professional-body">
                If you’d like to discuss software work, AI features, or a
                project, email me directly or use one of the routes below.
              </p>
              <p className="connection-endpoint__route-count professional-mono">
                {String(connectionItems.length).padStart(2, "0")} EXISTING DESTINATIONS
              </p>
            </div>
          </header>

          <section
            className="connection-endpoint__primary"
            aria-labelledby="primary-email-title"
          >
            <div className="connection-endpoint__primary-heading">
              <p className="professional-mono">01 / PRIMARY CHANNEL</p>
              <h3 id="primary-email-title">Email</h3>
              <p>{primaryEmail.description}</p>
            </div>
            <div className="connection-endpoint__email-route">
              <span className="connection-endpoint__route-kicker professional-label">
                DIRECT / EMAIL
              </span>
              <p className="connection-endpoint__email-value">{primaryEmail.value}</p>
              <div className="connection-endpoint__email-actions">
                <a
                  className="professional-button professional-button--primary"
                  href={primaryEmail.href}
                  data-cursor-label="Send Email"
                >
                  Send Email <ArrowUpRight size={17} aria-hidden="true" />
                </a>
                <button
                  type="button"
                  className="professional-button professional-button--secondary"
                  onClick={() => copyConnectionValue(primaryEmail)}
                  data-cursor-label="Copy Email"
                >
                  {emailCopyStatus === "copied" ? (
                    <Check size={17} aria-hidden="true" />
                  ) : (
                    <Copy size={17} aria-hidden="true" />
                  )}
                  {emailCopyStatus === "copied"
                    ? "Copied"
                    : emailCopyStatus === "failed"
                      ? "Copy unavailable"
                      : "Copy Email"}
                </button>
              </div>
              <p
                className="connection-endpoint__feedback"
                role="status"
                aria-live="polite"
                aria-atomic="true"
              >
                {emailCopyStatus === "copied"
                  ? "Email copied."
                  : emailCopyStatus === "failed"
                    ? "Copying is unavailable. Use Send Email instead."
                    : ""}
              </p>
            </div>
          </section>

          <section
            className="connection-endpoint__directory"
            aria-labelledby="connection-directory-title"
          >
            <header className="connection-endpoint__directory-heading">
              <div>
                <p className="professional-mono">02 / DIRECTORY</p>
                <h3 id="connection-directory-title">Profiles and résumé</h3>
              </div>
              <span className="professional-mono" aria-hidden="true">
                {String(secondaryConnections.length).padStart(2, "0")} ROUTES
              </span>
            </header>
            <ul className="connection-endpoint__routes">
              {secondaryConnections.map((item) => (
                <ConnectionRoute
                  key={item.id}
                  item={item}
                  copyStatus={copyResult?.id === item.id ? copyResult.status : null}
                  onCopy={() => copyConnectionValue(item)}
                />
              ))}
            </ul>
          </section>

          <footer className="connection-endpoint__next">
            <div>
              <p className="professional-label">07 / NEXT</p>
              <h3>Continue through the portfolio.</h3>
            </div>
            <button
              type="button"
              className="connection-endpoint__continue"
              onClick={(event) => navigateToScene(6, { focus: event.detail === 0 })}
              data-cursor-label="Continue"
            >
              Continue <ArrowRight size={17} aria-hidden="true" />
            </button>
          </footer>
        </div>
      </div>
    </section>
  );
}

function ConnectionRoute({
  item,
  copyStatus,
  onCopy,
}: {
  item: ConnectionItem;
  copyStatus: CopyStatus | null;
  onCopy: () => void;
}) {
  const Icon = item.icon;

  return (
    <li className="connection-endpoint__route">
      <span className="connection-endpoint__route-icon" aria-hidden="true">
        <Icon />
      </span>
      <div className="connection-endpoint__route-copy">
        <h4>{item.shortLabel}</h4>
        <p>{item.description}</p>
        <span className="connection-endpoint__route-value">
          {item.type === "resume" ? "PDF document" : item.value}
        </span>
        <span
          className="connection-endpoint__feedback"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {copyStatus === "copied"
            ? item.shortLabel + " link copied."
            : copyStatus === "failed"
              ? "Copying is unavailable. Use the open link instead."
              : ""}
        </span>
      </div>
      <div className="connection-endpoint__route-actions">
        {item.copyValue && (
          <button
            type="button"
            className="connection-endpoint__copy-link"
            onClick={onCopy}
            aria-label={`Copy ${item.shortLabel} link`}
            data-cursor-label="Copy Link"
          >
            {copyStatus === "copied" ? (
              <Check size={16} aria-hidden="true" />
            ) : (
              <Copy size={16} aria-hidden="true" />
            )}
            {copyStatus === "copied"
              ? "Copied"
              : copyStatus === "failed"
                ? "Copy unavailable"
                : "Copy link"}
          </button>
        )}
        <a
          href={item.href}
          target={item.external ? "_blank" : undefined}
          rel={item.external ? "noopener noreferrer" : undefined}
          aria-label={`${item.actionLabel}${item.external ? " (opens in a new tab)" : ""}`}
          className="connection-endpoint__open-link"
          data-cursor-label={item.actionLabel}
        >
          {item.actionLabel} <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </div>
    </li>
  );
}

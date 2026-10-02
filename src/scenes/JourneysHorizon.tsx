import { ArrowRight, ArrowUpRight } from "lucide-react";
import { FaFacebookF, FaGithub, FaLinkedinIn } from "react-icons/fa";
import type { IconType } from "react-icons";
import { useSceneNavigation } from "../components/SceneNavigationContext";
import "../styles/journeys-horizon.css";

const sceneDestinations = [
  { label: "Introduction", sceneIndex: 0 },
  { label: "About", sceneIndex: 1 },
  { label: "Selected Work", sceneIndex: 2 },
  { label: "Services", sceneIndex: 3 },
  { label: "Technology", sceneIndex: 4 },
  { label: "Contact", sceneIndex: 5 },
] as const;

type ConnectionLink = {
  label: string;
  href: string;
  cursorLabel: string;
  accessibleLabel: string;
  external?: boolean;
  icon: IconType;
};

const connectionLinks: readonly ConnectionLink[] = [
  {
    label: "GitHub",
    href: "https://github.com/jbta-sandrone",
    cursorLabel: "GitHub",
    accessibleLabel: "Open Jonel’s GitHub profile in a new tab",
    external: true,
    icon: FaGithub,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/jbtablog",
    cursorLabel: "LinkedIn",
    accessibleLabel: "Open Jonel’s LinkedIn profile in a new tab",
    external: true,
    icon: FaLinkedinIn,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/ablogjonel.21/",
    cursorLabel: "Facebook",
    accessibleLabel: "Open Jonel’s Facebook profile in a new tab",
    external: true,
    icon: FaFacebookF,
  },
] as const;
export default function JourneysHorizon() {
  const { navigateToScene } = useSceneNavigation();

  return (
    <section
      id="ending"
      data-portfolio-section
      className="closing-frame professional-theme portfolio-section relative"
      data-cinematic-scene={7}
      aria-labelledby="ending-title"
    >
      <div className="closing-frame__scroll">
        <div className="closing-frame__stage professional-container professional-container--wide">
          <p className="closing-frame__marker professional-label">
            <span>07 / CLOSING</span>
            <span aria-hidden="true" />
            A FINAL NOTE
          </p>

          <div className="closing-frame__composition">
            <div className="closing-frame__message">
              <h2 data-section-heading tabIndex={-1} id="ending-title" className="closing-frame__heading professional-heading">
                Ideas become systems.
                <span> Let’s build the next one.</span>
              </h2>
            </div>
            <div className="closing-frame__action">
              <p>
                Thanks for exploring my work. If you have an idea or opportunity
                to discuss, my contact details are one step away.
              </p>
              <span className="closing-frame__action-label professional-mono">
                TO CONTACT / 06
              </span>
              <button
                type="button"
                className="professional-button professional-button--primary"
                onClick={(event) => navigateToScene(5, { focus: event.detail === 0 })}
                data-cursor-label="Contact"
                aria-label="Let's connect — return to Contact"
              >
                Let’s connect <ArrowUpRight size={18} aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="closing-frame__terminus" aria-hidden="true">
            <span className="closing-frame__terminus-line" />
            <span className="closing-frame__terminus-node" />
            <span className="professional-mono">END / 07</span>
          </div>
        </div>

      </div>
    </section>
  );
}

export function PortfolioFooter() {
  const { navigateToScene } = useSceneNavigation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="closing-footer professional-theme" data-portfolio-footer aria-labelledby="closing-footer-title">
      <div className="closing-footer__inner professional-container professional-container--wide">
        <div className="closing-footer__topline" aria-hidden="true">
          <span className="professional-mono">PORTFOLIO / 07</span>
          <span />
          <span className="professional-mono">JONEL T. ABLOG</span>
        </div>

        <div className="closing-footer__grid">
          <div className="closing-footer__identity">
            <h2 id="closing-footer-title">Jonel Bryan Ablog</h2>
            <p>Software Developer building toward Software Engineering</p>
          </div>

          <nav className="closing-footer__navigation" aria-label="Portfolio navigation">
            <h3 className="closing-footer__label professional-label">Navigation</h3>
            <ul>
              {sceneDestinations.map((destination) => (
                <li key={destination.sceneIndex}>
                  <button
                    type="button"
                    onClick={(event) => navigateToScene(destination.sceneIndex, { focus: event.detail === 0 })}
                    data-cursor-label={destination.label}
                    aria-label={`Go to ${destination.label}`}
                  >
                    {destination.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="closing-footer__resources" aria-label="Profiles and resources">
            <h3 className="closing-footer__label professional-label">
              Profiles &amp; resources
            </h3>
            <ul>
              <li>
                <a
                  href="mailto:ablogjonelbryan@gmail.com"
                  data-cursor-label="Email"
                  aria-label="Email Jonel Bryan Ablog"
                >
                  Email <ArrowUpRight size={14} aria-hidden="true" />
                </a>
              </li>
              {connectionLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    data-cursor-label={link.cursorLabel}
                    aria-label={link.accessibleLabel}
                  >
                    {link.label} <ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="/Jonel_Ablog_Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor-label="Resume"
                  aria-label="View Jonel Bryan Ablog’s résumé in a new tab"
                >
                  Résumé <ArrowUpRight size={14} aria-hidden="true" />
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="closing-footer__bottom">
          <p>© {currentYear} Jonel Bryan Ablog. All rights reserved.</p>
          <p>Designed and developed by Jonel Bryan Ablog. Built with React and TypeScript.</p>
          <button
            type="button"
            onClick={(event) => navigateToScene(0, { focus: event.detail === 0 })}
            className="closing-footer__return"
            data-cursor-label="Introduction"
            aria-label="Return to Introduction"
          >
            Back to top <ArrowRight size={15} aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  );
}

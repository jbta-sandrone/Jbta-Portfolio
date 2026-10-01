import { useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { useSceneNavigation } from "../components/SceneNavigationContext";
import "../styles/quest-board.css";

type Service = {
  id: string;
  title: string;
  description: string;
  detail: string;
  specialties: readonly string[];
};

const services: readonly Service[] = [
  {
    id: "full-stack-web-development",
    title: "Full-Stack Web Development",
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
    description:
      "Develop application logic, APIs, authentication flows, and server features.",
    detail:
      "Create practical service layers that connect interfaces, stored data, user accounts, and intelligent product features.",
    specialties: ["Node.js", "Express", "FastAPI", "Python", "REST APIs", "JWT"],
  },
  {
    id: "ai-feature-integration",
    title: "AI Feature Integration",
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

export default function QuestBoard() {
  const [selectedServiceId, setSelectedServiceId] = useState(services[0].id);
  const reducedMotion = useReducedMotion();
  const { navigateToScene, isTransitioning } = useSceneNavigation();

  const selectService = (serviceId: string) => {
    setSelectedServiceId((current) => (current === serviceId ? "" : serviceId));
  };

  return (
    <section
      className="services-architecture professional-theme portfolio-scene relative h-full overflow-hidden"
      data-cinematic-scene={4}
      aria-labelledby="quest-board-title"
      data-reduced-motion={reducedMotion ? "true" : undefined}
    >
      <div className="services-architecture__scroll" data-scene-scroll>
        <div className="services-architecture__layout professional-container professional-container--wide">
          <header className="services-architecture__intro">
            <p className="services-architecture__marker professional-label">
              <span>04 / SERVICES</span>
              <span aria-hidden="true" />
              WHAT I DO
            </p>
            <h1 id="quest-board-title" className="services-architecture__heading professional-heading">
              Engineering capabilities,<br />
              <span>from interface to intelligence.</span>
            </h1>
            <p className="services-architecture__copy professional-body">
              I build and contribute to web applications across interfaces, application
              logic, data, AI features, and deployment.
            </p>
            <div className="services-architecture__annotation" aria-hidden="true">
              <span className="professional-mono">PRACTICE / 04</span>
              <span className="services-architecture__annotation-rule" />
              <p>One connected system.<br />Six areas of contribution.</p>
            </div>
          </header>

          <section className="services-architecture__system" aria-labelledby="services-index-title">
            <header className="services-architecture__system-heading">
              <h2 id="services-index-title" className="professional-label">Capability architecture</h2>
              <span className="professional-mono">01 — 06</span>
            </header>
            <ol className="services-architecture__index">
              {services.map((service, index) => (
                <ServiceRow
                  key={service.id}
                  service={service}
                  index={index}
                  expanded={selectedServiceId === service.id}
                  onSelect={() => selectService(service.id)}
                />
              ))}
            </ol>
            <p className="services-architecture__system-note">
              Select a capability to explore its scope and supporting tools.
            </p>
          </section>

          <footer className="services-architecture__connection">
            <div>
              <p className="professional-label">START A CONVERSATION</p>
              <h2>Have something in mind?</h2>
              <p>Let’s talk about what you want to build.</p>
            </div>
            <div className="services-architecture__actions">
              <button
                type="button"
                className="professional-button professional-button--primary"
                disabled={isTransitioning}
                onClick={() => navigateToScene(5)}
                data-cursor-label="Contact"
              >
                Contact Jonel <ArrowUpRight size={17} aria-hidden="true" />
              </button>
              <button
                type="button"
                className="services-architecture__next"
                disabled={isTransitioning}
                onClick={() => navigateToScene(4)}
                data-cursor-label="Technology"
              >
                Explore Technology <ArrowRight size={17} aria-hidden="true" />
              </button>
            </div>
          </footer>
        </div>
      </div>
    </section>
  );
}

function ServiceRow({
  service,
  index,
  expanded,
  onSelect,
}: {
  service: Service;
  index: number;
  expanded: boolean;
  onSelect: () => void;
}) {
  const titleId = `${service.id}-title`;
  const descriptionId = `${service.id}-description`;
  const detailId = `${service.id}-details`;

  return (
    <li className={`services-architecture__row${expanded ? " is-expanded" : ""}`}>
      <h3 className="services-architecture__row-heading">
        <button
          type="button"
          className="services-architecture__trigger"
          aria-expanded={expanded}
          aria-controls={detailId}
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          onClick={onSelect}
          onKeyDown={(event) => {
            // Keep scene-level shortcuts from navigating away from a focused service.
            if (["ArrowUp", "ArrowDown", "PageUp", "PageDown"].includes(event.key)) {
              event.stopPropagation();
            }
          }}
          data-cursor-label={expanded ? "Close" : "View capability"}
        >
          <span className="services-architecture__number" aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="services-architecture__row-copy">
            <span id={titleId} className="services-architecture__title">{service.title}</span>
            <span id={descriptionId} className="services-architecture__description">{service.description}</span>
          </span>
          <span className="services-architecture__control" aria-hidden="true">
            <span>{expanded ? "Close" : "View capability"}</span>
            <span className="services-architecture__indicator" />
          </span>
        </button>
      </h3>

      <div
        id={detailId}
        className="services-architecture__details"
        role="region"
        aria-labelledby={titleId}
        aria-hidden={!expanded}
        inert={!expanded}
      >
        <div className="services-architecture__details-clip">
          <div className="services-architecture__details-inner">
            <div className="services-architecture__scope">
              <h4 className="professional-label">Scope</h4>
              <p>{service.detail}</p>
            </div>
            <div className="services-architecture__capabilities">
              <h4 className="professional-label">Technologies &amp; capabilities</h4>
              <ul aria-label={`${service.title} technologies and capabilities`}>
                {service.specialties.map((specialty) => (
                  <li key={specialty}>{specialty}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

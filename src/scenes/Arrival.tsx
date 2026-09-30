import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { hero } from "../data/hero";
import { useSceneNavigation } from "../components/SceneNavigationContext";
import "../styles/arrival-hero.css";

function SystemDiagram() {
  return (
    <div className="arrival-hero__diagram" aria-hidden="true">
      <svg viewBox="0 0 540 540" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g className="arrival-hero__diagram-construction" stroke="currentColor" strokeWidth="1">
          <path d="M34 270H506M270 34V506" />
          <path d="M87 87H453V453H87z" strokeDasharray="2 8" />
          <circle cx="270" cy="270" r="206" />
          <circle cx="270" cy="270" r="149" />
          <circle cx="270" cy="270" r="84" />
          <path d="M270 64a206 206 0 0 1 201 160M64 270a206 206 0 0 1 104-178M367 441a206 206 0 0 1-175 20" stroke="#2458c6" strokeWidth="1.5" />
          <path d="M270 121v65M354 270h65M270 354v65M121 270h65" strokeDasharray="3 5" />
          <path d="M90 81v12m-6-6h12M450 81v12m-6-6h12M90 447v12m-6-6h12M450 447v12m-6-6h12" />
          <path d="M202 201 138 138M338 202l64-64M338 338l64 64M202 338l-64 64" strokeDasharray="3 5" />
        </g>

        <g stroke="#9daab7" strokeWidth="1.25">
          <path d="M270 270 168 168M270 270l103-103M270 270l103 103M270 270 168 373" />
          <path d="M168 168h-66M373 167h65M373 373h65M168 373h-66" />
        </g>

        <g className="arrival-hero__diagram-core">
          <rect x="234" y="234" width="72" height="72" fill="#f8f8f5" stroke="#15191f" strokeWidth="1.5" />
          <path d="M248 270h44m-22-22v44" stroke="#2458c6" strokeWidth="1.5" />
          <circle cx="270" cy="270" r="5" fill="#2458c6" />
        </g>

        <g fill="#f8f8f5" stroke="#15191f" strokeWidth="1.5">
          <circle cx="168" cy="168" r="5" />
          <circle cx="373" cy="167" r="5" />
          <circle cx="373" cy="373" r="5" />
          <circle cx="168" cy="373" r="5" />
        </g>
        <circle className="arrival-hero__diagram-signal" cx="373" cy="167" r="8" fill="#2458c6" />
        <circle cx="168" cy="373" r="5" fill="#15191f" />

        <g className="arrival-hero__diagram-labels" fill="#46515d">
          <text x="100" y="131">FRONTEND</text>
          <text x="382" y="131">BACKEND</text>
          <text x="382" y="414">AI</text>
          <text x="100" y="414">DATA</text>
          <text x="44" y="37">SYSTEM / 01</text>
          <text x="447" y="505">JBA—26</text>
        </g>
      </svg>
      <span className="arrival-hero__diagram-caption">INTERCONNECTED SYSTEMS <span>—</span> HUMAN-CENTERED OUTPUT</span>
    </div>
  );
}

export default function Arrival() {
  const { navigateToScene, isTransitioning } = useSceneNavigation();

  return (
    <section
      data-cinematic-scene={1}
      data-scene-scroll
      aria-labelledby="arrival-title"
      className="arrival-hero professional-theme portfolio-scene relative h-full overflow-y-auto overflow-x-hidden overscroll-contain"
    >
      <div className="professional-grid professional-grid--fade arrival-hero__grid" aria-hidden="true" />

      <div className="arrival-hero__inner professional-container professional-container--wide">
        <div className="arrival-hero__metadata professional-enter">
          <span className="arrival-hero__eyebrow professional-label"><span className="arrival-hero__eyebrow-dot" />SOFTWARE + AI ENGINEERING</span>
          <span className="arrival-hero__index professional-mono">01 / INTRODUCTION</span>
        </div>

        <div className="arrival-hero__composition">
          <div className="arrival-hero__content">
            <p className="arrival-hero__name professional-label professional-enter">{hero.name}</p>
            <h1 id="arrival-title" className="arrival-hero__headline professional-display professional-enter">
              Building thoughtful <em>digital experiences.</em>
            </h1>
            <p className="arrival-hero__copy professional-body professional-enter">
              {hero.subheadline}. I build responsive full-stack applications and practical AI-powered features with a focus on useful, human-centered experiences.
            </p>
            <div className="arrival-hero__actions professional-enter">
              <button
                type="button"
                className="professional-button professional-button--primary"
                onClick={() => navigateToScene(2)}
                disabled={isTransitioning}
              >
                View Selected Work <ArrowUpRight aria-hidden="true" size={17} />
              </button>
              <button
                type="button"
                className="professional-button professional-button--secondary"
                onClick={() => navigateToScene(1)}
                disabled={isTransitioning}
              >
                About Me <ArrowUpRight aria-hidden="true" size={17} />
              </button>
            </div>
          </div>

          <SystemDiagram />
        </div>

        <div className="arrival-hero__footer professional-enter">
          <ul className="arrival-hero__capabilities" aria-label="Areas of work">
            <li>FULL-STACK DEVELOPMENT</li>
            <li>AI FEATURE INTEGRATION</li>
            <li>RESPONSIVE INTERFACES</li>
          </ul>
          <button
            type="button"
            className="arrival-hero__explore professional-link"
            onClick={() => navigateToScene(1)}
            disabled={isTransitioning}
            aria-label="Explore Behind the Work"
          >
            Explore <ArrowDownRight aria-hidden="true" size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}

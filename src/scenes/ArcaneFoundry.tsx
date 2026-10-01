import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useSceneNavigation } from "../components/SceneNavigationContext";
import {
  techGroups,
  type TechGroup,
  type Technology,
} from "../data/sceneFourTechnologyData";
import "../styles/arcane-foundry.css";

const technologyCount = techGroups.reduce(
  (total, group) => total + group.technologies.length,
  0,
);

export default function ArcaneFoundry() {
  const { navigateToScene, isTransitioning } = useSceneNavigation();

  return (
    <section
      className="technology-architecture professional-theme portfolio-scene relative h-full overflow-hidden"
      data-cinematic-scene={5}
      aria-labelledby="craft-title"
    >
      <div className="technology-architecture__scroll" data-scene-scroll>
        <div className="technology-architecture__layout professional-container professional-container--wide">
          <header className="technology-architecture__intro">
            <div>
              <p className="technology-architecture__marker professional-label">
                <span>05 / TECHNOLOGY</span>
                <span aria-hidden="true" />
                SKILLS &amp; TOOLS
              </p>
              <h1
                id="craft-title"
                className="technology-architecture__heading professional-heading"
              >
                The technologies behind
                <span> the systems I build.</span>
              </h1>
            </div>
            <div className="technology-architecture__intro-aside">
              <p className="professional-body">
                My stack spans interfaces, application services, data,
                AI systems, and delivery. Explore each layer to see the
                tools and where I’ve used them.
              </p>
              <p className="technology-architecture__summary professional-mono">
                {String(techGroups.length).padStart(2, "0")} STACK LAYERS
                <span aria-hidden="true"> / </span>
                {String(technologyCount).padStart(2, "0")} TECHNOLOGIES
              </p>
            </div>
          </header>

          <section
            className="technology-architecture__system"
            aria-labelledby="technology-architecture-title"
          >
            <div className="technology-architecture__system-heading">
              <h2 id="technology-architecture-title" className="professional-label">
                Technology architecture
              </h2>
              <span className="professional-mono" aria-hidden="true">
                CLIENT / SERVICES / DATA / INTELLIGENCE / DELIVERY
              </span>
            </div>

            <ol className="technology-architecture__layers">
              {techGroups.map((group, index) => (
                <TechnologyLayer key={group.id} group={group} index={index} />
              ))}
            </ol>
          </section>

          <footer className="technology-architecture__next">
            <div>
              <p className="professional-label">06 / NEXT</p>
              <h2>Have something in mind?</h2>
              <p>Let’s talk about what you want to build.</p>
            </div>
            <button
              type="button"
              className="professional-button professional-button--primary"
              disabled={isTransitioning}
              onClick={() => navigateToScene(5)}
              data-cursor-label="Contact"
            >
              Let’s connect <ArrowUpRight size={17} aria-hidden="true" />
            </button>
          </footer>
        </div>
      </div>
    </section>
  );
}

function TechnologyLayer({
  group,
  index,
}: {
  group: TechGroup;
  index: number;
}) {
  const [selectedId, setSelectedId] = useState(group.technologies[0].id);
  const selectedTechnology =
    group.technologies.find((technology) => technology.id === selectedId) ??
    group.technologies[0];
  const inspectorId = `technology-inspector-${group.id}`;
  const titleId = `technology-layer-${group.id}-title`;

  return (
    <li className="technology-architecture__layer">
      <section aria-labelledby={titleId} className="technology-architecture__band">
        <header className="technology-architecture__layer-heading">
          <span className="technology-architecture__layer-number professional-mono">
            {String(index + 1).padStart(2, "0")} / {String(techGroups.length).padStart(2, "0")}
          </span>
          <h3 id={titleId}>{group.label}</h3>
          <p>{group.eyebrow}</p>
        </header>

        <ul
          className="technology-architecture__nodes"
          aria-label={`${group.label} technologies`}
        >
          {group.technologies.map((technology) => (
            <li key={technology.id}>
              <TechnologyNode
                technology={technology}
                selected={selectedTechnology.id === technology.id}
                inspectorId={inspectorId}
                onSelect={() => setSelectedId(technology.id)}
              />
            </li>
          ))}
        </ul>

        <TechnologyInspector
          id={inspectorId}
          technology={selectedTechnology}
          groupLabel={group.label}
        />
      </section>
    </li>
  );
}

function TechnologyNode({
  technology,
  selected,
  inspectorId,
  onSelect,
}: {
  technology: Technology;
  selected: boolean;
  inspectorId: string;
  onSelect: () => void;
}) {
  const Icon = technology.icon;

  return (
    <button
      type="button"
      className={`technology-architecture__node${selected ? " is-selected" : ""}`}
      aria-pressed={selected}
      aria-controls={inspectorId}
      aria-label={`Inspect ${technology.name}`}
      onClick={onSelect}
      onFocus={onSelect}
      onKeyDown={(event) => {
        // Keep scene shortcuts from navigating while a technology has focus.
        if (["ArrowUp", "ArrowDown", "PageUp", "PageDown"].includes(event.key)) {
          event.stopPropagation();
        }
      }}
      data-cursor-label={technology.name}
    >
      <Icon className="technology-architecture__node-icon" aria-hidden="true" />
      <span>{technology.name}</span>
      <span className="technology-architecture__node-endpoint" aria-hidden="true" />
    </button>
  );
}

function TechnologyInspector({
  id,
  technology,
  groupLabel,
}: {
  id: string;
  technology: Technology;
  groupLabel: string;
}) {
  const Icon = technology.icon;

  return (
    <aside
      id={id}
      className="technology-architecture__inspector"
      aria-label={`${groupLabel} technology details`}
      aria-live="polite"
      aria-atomic="true"
    >
      <div key={technology.id} className="technology-architecture__inspector-content">
        <p className="technology-architecture__inspector-label professional-mono">
          SELECTED TECHNOLOGY
        </p>
        <div className="technology-architecture__inspector-heading">
          <span className="technology-architecture__inspector-icon" aria-hidden="true">
            <Icon />
          </span>
          <h4>{technology.name}</h4>
        </div>
        <p className="technology-architecture__description">
          {technology.description}
        </p>
        <div className="technology-architecture__projects">
          <p className="professional-label">Used in</p>
          <ul>
            {technology.projects.map((project) => (
              <li key={project}>{project}</li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}

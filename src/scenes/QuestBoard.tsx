import "../styles/quest-board.css";

type QuestRank = "S" | "A" | "B" | "C";

type QuestEntry = {
  id: string;
  rank: QuestRank;
  title: string;
  brief: string;
  detail: string;
  rewards: readonly string[];
};

const QUESTS: readonly QuestEntry[] = [
  {
    id: "full-stack-expeditions",
    rank: "A",
    title: "Full-Stack Expeditions",
    brief: "Complete systems, built from the ground up.",
    detail:
      "End-to-end applications where I design the database, wire the API, and build the interface travelers actually touch — from account systems to real-time dashboards.",
    rewards: ["React", "Node.js", "Express", "PostgreSQL", "Prisma"],
  },
  {
    id: "ai-integrated-artifacts",
    rank: "S",
    title: "AI-Integrated Artifacts",
    brief: "Practical magic — LLMs woven into everyday tools.",
    detail:
      "Enchanting ordinary applications with AI: intelligent search, structured evaluation, and prompt-engineered features built to solve real problems, not chase novelty.",
    rewards: ["Google Gemini", "Prompt Engineering", "Structured Output"],
  },
  {
    id: "interface-forging",
    rank: "B",
    title: "Interface Forging",
    brief: "Interactive, motion-driven experiences worth exploring.",
    detail:
      "Interfaces built with intention — responsive layouts, considered motion, and pixel-level polish. This very portfolio is one of these contracts.",
    rewards: ["TypeScript", "Tailwind CSS", "Motion", "Accessibility"],
  },
  {
    id: "backend-fortifications",
    rank: "B",
    title: "Backend Fortifications",
    brief: "Sturdy APIs and data layers that hold under pressure.",
    detail:
      "REST APIs, authentication flows, and database schemas built to stay reliable as a project grows well past its first version.",
    rewards: ["FastAPI", "Python", "REST APIs", "Firebase"],
  },
  {
    id: "tooling-contracts",
    rank: "C",
    title: "Tooling & Automation Contracts",
    brief: "Small quests that save big time.",
    detail:
      "Scripts, workflows, and developer conveniences that quietly remove friction from the rest of the journey.",
    rewards: ["Git", "Vercel", "Render", "CI Workflows"],
  },
];

export default function QuestBoard() {
  return (
    <div className="quest-board-scene relative h-full w-full">
      <div className="quest-board-scroll h-full w-full overflow-y-auto" data-scene-scroll>
        <div className="quest-board-inner">
          <header className="quest-board-header">
            <span aria-hidden="true" className="quest-board-header__pin quest-board-header__pin--left" />
            <span aria-hidden="true" className="quest-board-header__pin quest-board-header__pin--right" />
            <p className="quest-board-eyebrow">Adventurer&apos;s Guild</p>
            <h2 className="quest-board-title">Quest Board</h2>
            <p className="quest-board-subtitle">
              Contracts I&apos;ve accepted — the kinds of software quests I enjoy taking on.
            </p>
          </header>

          <ul className="quest-board-list">
            {QUESTS.map((quest) => (
              <li key={quest.id} className="quest-card-wrap">
                <article className="quest-card">
                  <span aria-hidden="true" className="quest-card__pin" />

                  <div className="quest-card__head">
                    <span className={`quest-rank quest-rank--${quest.rank.toLowerCase()}`}>
                      <span className="quest-rank__label">Rank</span>
                      <span className="quest-rank__value">{quest.rank}</span>
                    </span>
                    <span className="quest-status">
                      <i aria-hidden="true" className="quest-status__dot" />
                      Accepted
                    </span>
                  </div>

                  <h3 className="quest-card__title">{quest.title}</h3>
                  <p className="quest-card__brief">{quest.brief}</p>
                  <p className="quest-card__detail">{quest.detail}</p>

                  <ul className="quest-card__rewards" aria-label={`Tools used for ${quest.title}`}>
                    {quest.rewards.map((reward) => (
                      <li key={reward} className="quest-reward-tag">
                        {reward}
                      </li>
                    ))}
                  </ul>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
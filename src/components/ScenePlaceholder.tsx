type ScenePlaceholderProps = {
  number: number;
  label: string;
  align?: "left" | "right";
};

export default function ScenePlaceholder({
  number,
  label,
  align = "left",
}: ScenePlaceholderProps) {
  const headingId = `scene-${number}-heading`;

  return (
    <section
      data-cinematic-scene={number}
      data-scene-scroll
      aria-labelledby={headingId}
      className="portfolio-scene relative h-full overflow-y-auto overscroll-contain"
    >
      <div className="flex min-h-full items-center px-6 py-20 sm:px-10 lg:px-16">
        <div
          className={`mx-auto w-full max-w-6xl ${
            align === "right" ? "text-right" : "text-left"
          }`}
        >
          <p className="portfolio-eyebrow text-xs font-semibold uppercase tracking-[0.28em] sm:text-sm">
            Scene {String(number).padStart(2, "0")}
          </p>
          <h2
            id={headingId}
            className="portfolio-heading mt-4 text-3xl font-medium sm:text-5xl lg:text-6xl"
          >
            {label}
          </h2>
          <div
            aria-hidden="true"
            className={`portfolio-divider mt-8 h-px w-24 ${
              align === "right" ? "ml-auto rotate-180" : ""
            }`}
          />
        </div>
      </div>
    </section>
  );
}

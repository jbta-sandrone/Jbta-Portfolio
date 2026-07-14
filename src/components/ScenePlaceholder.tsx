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
      aria-labelledby={headingId}
      className="relative min-h-[125vh] overflow-hidden text-white"
    >
      <div className="sticky top-0 flex min-h-screen items-center px-6 py-20 sm:px-10 lg:px-16">
        <div
          className={`mx-auto w-full max-w-6xl ${
            align === "right" ? "text-right" : "text-left"
          }`}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-300/70 sm:text-sm">
            Scene {String(number).padStart(2, "0")}
          </p>
          <h2
            id={headingId}
            className="mt-4 text-3xl font-medium text-white/90 sm:text-5xl lg:text-6xl"
          >
            {label}
          </h2>
          <div
            aria-hidden="true"
            className={`mt-8 h-px w-24 bg-gradient-to-r from-blue-300/70 to-transparent ${
              align === "right" ? "ml-auto rotate-180" : ""
            }`}
          />
        </div>
      </div>
    </section>
  );
}

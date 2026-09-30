import { useEffect, useRef, type KeyboardEvent as ReactKeyboardEvent, type MouseEvent as ReactMouseEvent, type RefObject } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import type { ProjectNote, ProjectNoteSection } from "../data/projectNotes";
import "../styles/project-notes.css";

type ProjectNotesDialogProps = {
  note: ProjectNote | null;
  projectNumber: number;
  onClose: () => void;
  returnFocusRef: RefObject<HTMLButtonElement | null>;
};

function NoteSection({ section, number, noteId }: { section: ProjectNoteSection; number: number; noteId: string }) {
  const sectionId = `project-notes-${noteId}-${section.id}`;

  return (
    <section className="project-notes__section" id={sectionId} aria-labelledby={`${sectionId}-title`}>
      <div className="project-notes__section-heading">
        <span aria-hidden="true">{String(number).padStart(2, "0")}</span>
        <h3 id={`${sectionId}-title`}>{section.title}</h3>
      </div>

      {section.kind === "text" && (
        <div className="project-notes__prose">
          {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      )}

      {section.kind === "list" && (
        <div className="project-notes__section-content">
          {section.intro && <p className="project-notes__intro">{section.intro}</p>}
          <ul className="project-notes__capabilities">
            {section.items.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      )}

      {section.kind === "groups" && (
        <div className="project-notes__section-content">
          {section.intro && <p className="project-notes__intro">{section.intro}</p>}
          <dl className="project-notes__groups">
            {section.groups.map((group) => (
              <div key={group.title}><dt>{group.title}</dt><dd>{group.detail}</dd></div>
            ))}
          </dl>
        </div>
      )}

      {section.kind === "architecture" && (
        <div className="project-notes__section-content">
          <ol className="project-notes__flow">
            {section.steps.map((step) => <li key={step}>{step}</li>)}
          </ol>
          <p className="project-notes__architecture-note">{section.note}</p>
        </div>
      )}

      {section.kind === "technology" && (
        <dl className="project-notes__technology">
          {section.groups.map((group) => (
            <div key={group.label}>
              <dt>{group.label}</dt>
              <dd>{group.items.join(" · ")}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}

function ProjectNotesSurface({ note, projectNumber, onClose, returnFocusRef }: ProjectNotesDialogProps & { note: ProjectNote }) {
  const panelRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = prefersReducedMotion !== false;

  useEffect(() => {
    const root = document.getElementById("root");
    const wasInert = root?.inert ?? false;
    const returnFocusTo = returnFocusRef.current;
    if (root) root.inert = true;

    const focusFrame = window.requestAnimationFrame(() => scrollRef.current?.focus({ preventScroll: true }));
    return () => {
      window.cancelAnimationFrame(focusFrame);
      if (root) root.inert = wasInert;
      window.requestAnimationFrame(() => returnFocusTo?.focus({ preventScroll: true }));
    };
  }, [returnFocusRef]);

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    // The app's scene-navigation listener is on window; dialog keys must not reach it.
    event.stopPropagation();

    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }

    if (event.key !== "Tab" || !panelRef.current) return;
    const focusable = Array.from(
      panelRef.current.querySelectorAll<HTMLElement>(
        "button:not(:disabled), a[href], [tabindex]:not([tabindex='-1'])",
      ),
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!first || !last) return;

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const handleBackdropMouseDown = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) onClose();
  };

  const goToSection = (sectionId: string) => {
    const scroller = scrollRef.current;
    const section = scroller?.querySelector<HTMLElement>(`#project-notes-${note.id}-${sectionId}`);
    if (!scroller || !section) return;
    const top = section.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop;
    scroller.scrollTo({ top, behavior: reducedMotion ? "instant" : "smooth" });
    scroller.focus({ preventScroll: true });
  };

  return (
    <motion.div
      className="project-notes__overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reducedMotion ? 0.01 : 0.18 }}
      onMouseDown={handleBackdropMouseDown}
      onWheel={(event) => event.stopPropagation()}
      onTouchStart={(event) => event.stopPropagation()}
      onTouchEnd={(event) => event.stopPropagation()}
      onKeyDown={handleKeyDown}
    >
      <motion.article
        ref={panelRef}
        className="project-notes__panel professional-theme"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-notes-title"
        aria-describedby="project-notes-descriptor"
        initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.992 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.995 }}
        transition={{ duration: reducedMotion ? 0.01 : 0.23, ease: [0.22, 1, 0.36, 1] }}
      >
        <header className="project-notes__header">
          <div>
            <p className="project-notes__eyebrow">PROJECT DOCUMENTATION <span>—</span> PROJECT / {String(projectNumber).padStart(2, "0")}</p>
            <h2 id="project-notes-title">{note.title}</h2>
            <p id="project-notes-descriptor">{note.descriptor}</p>
          </div>
          <button type="button" className="project-notes__close" onClick={onClose} aria-label={`Close ${note.title} project notes`}>
            <span>Close</span><X size={18} aria-hidden="true" />
          </button>
        </header>

        <div className="project-notes__scroll" ref={scrollRef} tabIndex={0} aria-label={`${note.title} project documentation`}>
          <div className="project-notes__body">
            <nav className="project-notes__index" aria-label="Project notes sections">
              <p>IN THIS DOCUMENT</p>
              <ol>
                {note.sections.map((section, index) => (
                  <li key={section.id}>
                    <button type="button" onClick={() => goToSection(section.id)}>
                      <span>{String(index + 1).padStart(2, "0")}</span>{section.title}
                    </button>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="project-notes__sections">
              {note.sections.map((section, index) => (
                <NoteSection key={section.id} noteId={note.id} section={section} number={index + 1} />
              ))}
            </div>
          </div>
        </div>
      </motion.article>
    </motion.div>
  );
}

export default function ProjectNotesDialog({ note, projectNumber, onClose, returnFocusRef }: ProjectNotesDialogProps) {
  return createPortal(
    <AnimatePresence>
      {note && (
        <ProjectNotesSurface
          key={note.id}
          note={note}
          projectNumber={projectNumber}
          onClose={onClose}
          returnFocusRef={returnFocusRef}
        />
      )}
    </AnimatePresence>,
    document.body,
  );
}

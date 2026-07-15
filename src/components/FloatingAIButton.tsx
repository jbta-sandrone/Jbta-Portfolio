import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { ChevronRight, SendHorizontal, Sparkles, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import chatbotAvatar from "../assets/images/aichatbot.webp";
import {
  chatbotOpeningMessage,
  chatbotSuggestionGroups,
  getChatbotAnswer,
} from "../data/chatbot";

type ChatMessage = {
  id: number;
  sender: "assistant" | "user";
  text: string;
};

const controlEase = [0.65, 0, 0.35, 1] as const;
const responseDelayMs = 360;
const suggestedQuestions = chatbotSuggestionGroups.flatMap(
  (group) => group.questions,
);

export default function FloatingAIButton() {
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = prefersReducedMotion !== false;
  const [panelOpen, setPanelOpen] = useState(false);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [responding, setResponding] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 0, sender: "assistant", text: chatbotOpeningMessage },
  ]);
  const controlRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const suggestionTriggerRef = useRef<HTMLButtonElement>(null);
  const suggestionPanelRef = useRef<HTMLDivElement>(null);
  const suggestionItemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const responseTimerRef = useRef<number | null>(null);
  const nextMessageIdRef = useRef(1);

  const closePanel = useCallback((restoreFocus = true) => {
    setSuggestionsOpen(false);
    setPanelOpen(false);
    if (restoreFocus) {
      window.requestAnimationFrame(() => triggerRef.current?.focus());
    }
  }, []);

  const closeSuggestions = useCallback((restoreFocus = true) => {
    setSuggestionsOpen(false);
    if (restoreFocus) {
      window.requestAnimationFrame(() => suggestionTriggerRef.current?.focus());
    }
  }, []);

  useEffect(() => {
    if (!panelOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (
        controlRef.current &&
        !controlRef.current.contains(event.target as Node)
      ) {
        closePanel(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      if (suggestionsOpen) {
        closeSuggestions();
        return;
      }
      closePanel();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [closePanel, closeSuggestions, panelOpen, suggestionsOpen]);

  useEffect(() => {
    if (!panelOpen) return;

    const focusFrame = window.requestAnimationFrame(() => {
      inputRef.current?.focus();
    });

    return () => window.cancelAnimationFrame(focusFrame);
  }, [panelOpen]);

  useEffect(() => {
    if (!suggestionsOpen) return;

    const focusFrame = window.requestAnimationFrame(() => {
      suggestionItemRefs.current[0]?.focus();
    });

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (
        controlRef.current?.contains(target) &&
        !suggestionPanelRef.current?.contains(target) &&
        !suggestionTriggerRef.current?.contains(target)
      ) {
        closeSuggestions(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [closeSuggestions, suggestionsOpen]);

  useEffect(() => {
    if (!panelOpen) return;

    const scrollFrame = window.requestAnimationFrame(() => {
      const messageList = messagesRef.current;
      if (messageList) {
        messageList.scrollTo({
          top: messageList.scrollHeight,
          behavior: reducedMotion ? "auto" : "smooth",
        });
      }
    });

    return () => window.cancelAnimationFrame(scrollFrame);
  }, [messages, panelOpen, reducedMotion, responding]);

  useEffect(
    () => () => {
      if (responseTimerRef.current !== null) {
        window.clearTimeout(responseTimerRef.current);
      }
    },
    [],
  );

  const togglePanel = () => {
    if (panelOpen) {
      closePanel();
      return;
    }

    setPanelOpen(true);
  };

  const toggleSuggestions = () => {
    if (suggestionsOpen) {
      closeSuggestions();
      return;
    }

    setSuggestionsOpen(true);
  };

  const sendQuestion = useCallback(
    (rawQuestion: string) => {
      const question = rawQuestion.trim();
      if (!question || responding) return false;

      const userMessage: ChatMessage = {
        id: nextMessageIdRef.current++,
        sender: "user",
        text: question,
      };
      const answer = getChatbotAnswer(question);

      setMessages((current) => [...current, userMessage]);
      setInput("");
      setResponding(true);

      responseTimerRef.current = window.setTimeout(() => {
        setMessages((current) => [
          ...current,
          {
            id: nextMessageIdRef.current++,
            sender: "assistant",
            text: answer,
          },
        ]);
        setResponding(false);
        responseTimerRef.current = null;
        window.requestAnimationFrame(() => inputRef.current?.focus());
      }, reducedMotion ? 0 : responseDelayMs);

      return true;
    },
    [reducedMotion, responding],
  );

  const submitQuestion = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    closeSuggestions(false);
    sendQuestion(input);
  };

  const selectSuggestedQuestion = (question: string) => {
    closeSuggestions();
    sendQuestion(question);
  };

  const handleSuggestionKeyDown = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    let nextIndex: number | null = null;

    if (event.key === "ArrowDown") {
      nextIndex = (index + 1) % suggestedQuestions.length;
    } else if (event.key === "ArrowUp") {
      nextIndex =
        (index - 1 + suggestedQuestions.length) % suggestedQuestions.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = suggestedQuestions.length - 1;
    } else if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      closeSuggestions();
      return;
    }

    if (nextIndex === null) return;
    event.preventDefault();
    event.stopPropagation();
    suggestionItemRefs.current[nextIndex]?.focus();
  };

  return (
    <motion.div
      ref={controlRef}
      initial={
        reducedMotion
          ? { opacity: 0 }
          : { opacity: 0, x: 9, y: -7, filter: "blur(5px)" }
      }
      animate={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
      transition={{
        duration: reducedMotion ? 0.15 : 0.52,
        ease: controlEase,
      }}
      className="floating-ai-control fixed z-40"
    >
      <motion.button
        ref={triggerRef}
        type="button"
        aria-label={panelOpen ? "Close JBTA Assistant" : "Open JBTA Assistant"}
        aria-expanded={panelOpen}
        aria-controls="jbta-assistant-panel"
        data-cursor-label={panelOpen ? "Close Chat" : "Ask JBTA"}
        onClick={togglePanel}
        whileHover={
          reducedMotion
            ? undefined
            : {
                y: -3,
                scale: 1.04,
                borderColor: "rgba(253,230,138,0.52)",
                boxShadow:
                  "0 16px 38px rgba(0,0,0,0.4), 0 0 24px rgba(245,158,11,0.28)",
              }
        }
        whileTap={reducedMotion ? undefined : { scale: 0.97 }}
        transition={{ duration: 0.24, ease: "easeInOut" }}
        className="portfolio-focus group relative flex size-12 items-center justify-center overflow-hidden rounded-[0.95rem]"
      >
        <motion.span
          aria-hidden="true"
          animate={reducedMotion ? { opacity: 0.35 } : { opacity: [0.25, 0.62, 0.25] }}
          transition={{
            duration: 4.8,
            repeat: reducedMotion ? 0 : Infinity,
            ease: "easeInOut",
          }}
          className="pointer-events-none absolute inset-1 rounded-xl shadow-[0_0_18px_rgba(245,158,11,0.3)]"
        />
        <img
          src={chatbotAvatar}
          alt=""
          aria-hidden="true"
          draggable={false}
          className="relative z-10 size-10 select-none rounded-full object-cover transition-[filter] duration-300 group-hover:brightness-110 sm:size-12"
        />
      </motion.button>

      <AnimatePresence>
        {panelOpen && (
          <motion.section
            id="jbta-assistant-panel"
            role="dialog"
            aria-labelledby="jbta-assistant-title"
            initial={
              reducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: -8, scale: 0.97, filter: "blur(5px)" }
            }
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={
              reducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: -6, scale: 0.98, filter: "blur(4px)" }
            }
            transition={{
              duration: reducedMotion ? 0.12 : 0.26,
              ease: controlEase,
            }}
            style={{
              height:
                "min(31rem, calc(100dvh - 10.5rem - env(safe-area-inset-bottom)))",
            }}
            onWheel={(event) => event.stopPropagation()}
            onTouchStart={(event) => event.stopPropagation()}
            onTouchMove={(event) => event.stopPropagation()}
            onTouchEnd={(event) => event.stopPropagation()}
            onKeyDown={(event) => {
              if (
                event.key === "ArrowUp" ||
                event.key === "ArrowDown" ||
                event.key === "PageUp" ||
                event.key === "PageDown"
              ) {
                event.stopPropagation();
              }
            }}
            className="portfolio-navigation absolute right-0 top-full mt-3 flex w-[min(22rem,calc(100vw-2rem))] origin-top-right flex-col overflow-hidden rounded-2xl border shadow-[0_24px_60px_rgba(0,0,0,0.52),0_0_30px_var(--portfolio-glow)]"
          >
            <header className="flex shrink-0 items-center gap-3 border-b border-[var(--portfolio-border-subtle)] bg-black/30 px-4 py-3">
              <img
                src={chatbotAvatar}
                alt="JBTA Assistant avatar"
                className="size-10 rounded-xl border border-[var(--portfolio-border)] object-cover"
              />
              <div className="min-w-0 flex-1">
                <h2
                  id="jbta-assistant-title"
                  className="portfolio-heading truncate text-sm font-semibold"
                >
                  JBTA Assistant
                </h2>
                <p className="mt-0.5 flex items-center gap-1.5 text-[0.65rem] font-medium text-[var(--portfolio-status-soft)]">
                  <span
                    aria-hidden="true"
                    className="size-1.5 rounded-full bg-[var(--portfolio-status)] shadow-[0_0_8px_rgba(52,211,153,0.55)]"
                  />
                  Online
                </p>
              </div>
              <button
                type="button"
                aria-label="Close JBTA Assistant"
                data-cursor-label="Close"
                onClick={() => closePanel()}
                className="portfolio-focus portfolio-navigation-button flex size-9 shrink-0 items-center justify-center rounded-xl transition-colors"
              >
                <X aria-hidden="true" className="size-4" />
              </button>
            </header>

            <div
              ref={messagesRef}
              role="log"
              aria-live="polite"
              aria-relevant="additions"
              aria-label="Conversation with JBTA Assistant"
              className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain px-3.5 py-4 [scrollbar-color:rgba(253,230,138,0.22)_transparent] [scrollbar-width:thin]"
            >
              {messages.map((message) => (
                <ChatBubble key={message.id} message={message} reducedMotion={reducedMotion} />
              ))}

              {responding && <TypingIndicator reducedMotion={reducedMotion} />}
            </div>

            <footer className="relative shrink-0 border-t border-[var(--portfolio-border-subtle)] bg-black/35">
              <div className="relative flex items-center px-3 pt-2.5">
                <button
                  ref={suggestionTriggerRef}
                  type="button"
                  aria-label={
                    suggestionsOpen
                      ? "Hide suggested questions"
                      : "Show suggested questions"
                  }
                  aria-expanded={suggestionsOpen}
                  aria-controls="jbta-suggested-questions"
                  aria-haspopup="menu"
                  title="Suggested questions"
                  data-cursor-label="Suggestions"
                  onClick={toggleSuggestions}
                  className={`portfolio-focus group flex min-h-8 items-center gap-1.5 rounded-lg border px-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.08em] transition-[color,background-color,border-color,box-shadow] duration-200 ${
                    suggestionsOpen
                      ? "border-[var(--portfolio-border)] bg-[var(--portfolio-accent-soft)] text-[var(--portfolio-accent-bright)] shadow-[0_0_14px_var(--portfolio-glow)]"
                      : "border-[var(--portfolio-border-subtle)] bg-[var(--portfolio-surface)] text-[var(--portfolio-text-muted)] hover:border-[var(--portfolio-border)] hover:text-[var(--portfolio-accent-bright)]"
                  }`}
                >
                  <Sparkles aria-hidden="true" className="size-3.5 shrink-0" />
                  <span className="hidden min-[350px]:inline">
                    Suggested questions
                  </span>
                </button>

                <AnimatePresence>
                  {suggestionsOpen && (
                    <motion.div
                      ref={suggestionPanelRef}
                      id="jbta-suggested-questions"
                      role="menu"
                      aria-label="Suggested questions"
                      initial={
                        reducedMotion
                          ? { opacity: 0 }
                          : {
                              opacity: 0,
                              y: 6,
                              scale: 0.97,
                              filter: "blur(3px)",
                            }
                      }
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        filter: "blur(0px)",
                      }}
                      exit={
                        reducedMotion
                          ? { opacity: 0 }
                          : {
                              opacity: 0,
                              y: 5,
                              scale: 0.97,
                              filter: "blur(2px)",
                            }
                      }
                      transition={{
                        duration: reducedMotion ? 0.1 : 0.21,
                        ease: controlEase,
                      }}
                      className="portfolio-navigation absolute bottom-full left-3 right-3 z-20 mb-2 max-h-[min(12rem,38dvh)] origin-bottom-left overflow-y-auto overscroll-contain rounded-xl border border-[var(--portfolio-border)] p-2 shadow-[0_18px_38px_rgba(0,0,0,0.48),0_0_22px_var(--portfolio-glow)] [scrollbar-color:rgba(253,230,138,0.22)_transparent] [scrollbar-width:thin]"
                    >
                      {chatbotSuggestionGroups.map((group) => (
                        <div
                          key={group.id}
                          role="group"
                          aria-label={group.label}
                          className="mb-2 border-b border-[var(--portfolio-border-subtle)] pb-2 last:mb-0 last:border-0 last:pb-0"
                        >
                          <p
                            aria-hidden="true"
                            className="px-2 pb-1 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-[var(--portfolio-accent-strong)]"
                          >
                            {group.label}
                          </p>
                          <div className="space-y-0.5">
                            {group.questions.map((question) => {
                              const questionIndex =
                                suggestedQuestions.indexOf(question);

                              return (
                                <button
                                  key={question}
                                  ref={(element) => {
                                    suggestionItemRefs.current[questionIndex] =
                                      element;
                                  }}
                                  type="button"
                                  role="menuitem"
                                  disabled={responding}
                                  data-cursor-label="Ask"
                                  onClick={() =>
                                    selectSuggestedQuestion(question)
                                  }
                                  onKeyDown={(event) =>
                                    handleSuggestionKeyDown(
                                      event,
                                      questionIndex,
                                    )
                                  }
                                  className="portfolio-focus group/question flex min-h-10 w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-xs leading-4 text-[var(--portfolio-text-muted)] transition-[color,background-color] duration-200 hover:bg-[var(--portfolio-accent-soft)] hover:text-[var(--portfolio-accent-bright)] focus-visible:bg-[var(--portfolio-accent-soft)] disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                  <span>{question}</span>
                                  <ChevronRight
                                    aria-hidden="true"
                                    className="size-3.5 shrink-0 text-[var(--portfolio-accent-strong)] transition-transform duration-200 group-hover/question:translate-x-0.5 group-focus-visible/question:translate-x-0.5"
                                  />
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <form
                onSubmit={submitQuestion}
                className="flex items-end gap-2 p-3 pt-2"
              >
                <label htmlFor="jbta-assistant-input" className="sr-only">
                  Ask JBTA Assistant about Jonel
                </label>
                <input
                  ref={inputRef}
                  id="jbta-assistant-input"
                  type="text"
                  value={input}
                  maxLength={300}
                  autoComplete="off"
                  placeholder="Ask about Jonel…"
                  onChange={(event) => setInput(event.target.value)}
                  className="portfolio-focus min-h-11 min-w-0 flex-1 rounded-xl border border-[var(--portfolio-border-subtle)] bg-black/45 px-3.5 text-sm text-[var(--portfolio-text-soft)] placeholder:text-[var(--portfolio-text-subtle)]"
                />
                <button
                  type="submit"
                  aria-label="Send question"
                  data-cursor-label="Send"
                  disabled={!input.trim() || responding}
                  className="portfolio-button-primary portfolio-focus flex size-11 shrink-0 items-center justify-center rounded-xl border transition-colors disabled:cursor-not-allowed disabled:opacity-35"
                >
                  <SendHorizontal aria-hidden="true" className="size-4" />
                </button>
              </form>
            </footer>
          </motion.section>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ChatBubble({
  message,
  reducedMotion,
}: {
  message: ChatMessage;
  reducedMotion: boolean;
}) {
  const assistantMessage = message.sender === "assistant";

  return (
    <motion.div
      initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: reducedMotion ? 0.1 : 0.24, ease: controlEase }}
      className={`flex items-end gap-2 ${assistantMessage ? "justify-start" : "justify-end"}`}
    >
      {assistantMessage && (
        <img
          src={chatbotAvatar}
          alt=""
          aria-hidden="true"
          className="size-6 shrink-0 rounded-lg object-cover"
        />
      )}
      <p
        className={`max-w-[82%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-xs leading-5 shadow-md ${
          assistantMessage
            ? "rounded-bl-md border border-[var(--portfolio-border-subtle)] bg-[rgba(28,23,18,0.88)] text-[var(--portfolio-text-muted)]"
            : "rounded-br-md border border-[rgba(253,230,138,0.24)] bg-[var(--portfolio-accent-soft)] text-[var(--portfolio-accent-bright)]"
        }`}
      >
        {message.text}
      </p>
    </motion.div>
  );
}

function TypingIndicator({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <div className="flex items-end gap-2" aria-label="JBTA Assistant is responding">
      <img
        src={chatbotAvatar}
        alt=""
        aria-hidden="true"
        className="size-6 shrink-0 rounded-lg object-cover"
      />
      <div className="flex h-9 items-center gap-1 rounded-2xl rounded-bl-md border border-[var(--portfolio-border-subtle)] bg-[rgba(28,23,18,0.88)] px-3">
        {[0, 1, 2].map((dot) => (
          <motion.span
            key={dot}
            aria-hidden="true"
            animate={
              reducedMotion
                ? { opacity: 0.55 }
                : { opacity: [0.3, 0.9, 0.3], y: [0, -2, 0] }
            }
            transition={{
              duration: 0.9,
              delay: dot * 0.12,
              repeat: reducedMotion ? 0 : Infinity,
              ease: "easeInOut",
            }}
            className="size-1 rounded-full bg-[var(--portfolio-accent-strong)]"
          />
        ))}
      </div>
    </div>
  );
}

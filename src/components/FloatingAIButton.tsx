import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import chatbotAvatar from "../assets/images/aichatbot.webp";
import {
  chatbotOpeningMessage,
  chatbotSuggestionGroups,
  getChatbotAnswer,
} from "../data/chatbot";
import "../styles/neli-companion.css";

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
      className="floating-ai-control neli-control fixed z-40"
    >
      <motion.button
        ref={triggerRef}
        type="button"
        aria-label={
          panelOpen
            ? "Close Neli, Pixel Oracle Companion"
            : "Open Neli, Pixel Oracle Companion"
        }
        aria-expanded={panelOpen}
        aria-controls="jbta-assistant-panel"
        aria-haspopup="dialog"
        data-cursor-label={panelOpen ? "Close Chat" : "Ask JBTA"}
        onClick={togglePanel}
        whileHover={
          reducedMotion
            ? undefined
            : {
                y: -3,
                scale: 1.04,
                
              }
        }
        whileTap={reducedMotion ? undefined : { scale: 0.97 }}
        transition={{ duration: 0.24, ease: "easeInOut" }}
        className={`neli-summon-button portfolio-focus group relative flex items-center justify-center ${
          panelOpen ? "neli-summon-button--open" : ""
        }`}
      >
        <motion.span
          aria-hidden="true"
          animate={reducedMotion ? { opacity: 0.35 } : { opacity: [0.25, 0.62, 0.25] }}
          transition={{
            duration: 4.8,
            repeat: reducedMotion ? 0 : Infinity,
            ease: "easeInOut",
          }}
          className="neli-summon-aura pointer-events-none absolute"
        />
        <img
          src={chatbotAvatar}
          alt=""
          aria-hidden="true"
          draggable={false}
          className="neli-summon-portrait relative z-10 select-none object-contain transition-[filter] duration-300 group-hover:brightness-110"
        />
        <span aria-hidden="true" className="neli-summon-sparkle" />
        <span aria-hidden="true" className="neli-summon-particle neli-summon-particle--one" />
        <span aria-hidden="true" className="neli-summon-particle neli-summon-particle--two" />
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
                : { opacity: 0, y: 24, clipPath: "inset(100% 0 0 0)" }
            }
            animate={{ opacity: 1, y: 0, clipPath: "inset(0 0 0 0)" }}
            exit={
              reducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 16, clipPath: "inset(0 0 100% 0)" }
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
            className="neli-panel absolute right-0 top-full mt-3 flex w-[min(23.5rem,calc(100vw-1.5rem))] origin-bottom-right flex-col overflow-hidden"
          >
            <header className="neli-header flex shrink-0 items-center gap-3 px-4 py-3">
              <img
                src={chatbotAvatar}
                alt="Neli, Pixel Oracle Companion"
                className="neli-header-portrait size-10 object-cover"
              />
              <div className="min-w-0 flex-1">
                <h2
                  id="jbta-assistant-title"
                  className="neli-title truncate text-sm font-semibold"
                >
                  NELI
                </h2>
                <p className="neli-subtitle mt-0.5">
                  Pixel Oracle Companion
                </p>
              </div>
              <span aria-hidden="true" className="neli-minimize-mark" />
              <button
                type="button"
                aria-label="Close Neli, Pixel Oracle Companion"
                data-cursor-label="Close"
                onClick={() => closePanel()}
                className="neli-titlebar-button portfolio-focus flex size-9 shrink-0 items-center justify-center"
              >
                <PixelGlyph type="close" />
              </button>
            </header>

            <div
              ref={messagesRef}
              role="log"
              aria-live="polite"
              aria-relevant="additions"
              aria-label="Conversation with Neli, Pixel Oracle Companion"
              className="neli-message-scroll min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain px-3.5 py-4"
            >
              {messages.map((message) => (
                <ChatBubble key={message.id} message={message} reducedMotion={reducedMotion} />
              ))}

              {responding && <TypingIndicator reducedMotion={reducedMotion} />}
            </div>

            <footer className="neli-footer relative shrink-0">
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
                  className={`neli-prompt-trigger portfolio-focus group flex min-h-9 items-center gap-1.5 px-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.08em] ${
                    suggestionsOpen
                      ? "neli-prompt-trigger--open"
                      : ""
                  }`}
                >
                  <PixelGlyph type="spark" />
                  <span className="hidden min-[350px]:inline">
                    Guild prompts
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
                          : { opacity: 0, y: 8, clipPath: "inset(100% 0 0 0)" }
                      }
                      animate={{
                        opacity: 1,
                        y: 0,
                        clipPath: "inset(0 0 0 0)",
                      }}
                      exit={
                        reducedMotion
                          ? { opacity: 0 }
                          : { opacity: 0, y: 6, clipPath: "inset(0 0 100% 0)" }
                      }
                      transition={{
                        duration: reducedMotion ? 0.1 : 0.21,
                        ease: controlEase,
                      }}
                      className="neli-suggestion-panel absolute bottom-full left-3 right-3 z-20 mb-2 max-h-[min(12rem,38dvh)] origin-bottom-left overflow-y-auto overscroll-contain p-2"
                    >
                      {chatbotSuggestionGroups.map((group) => (
                        <div
                          key={group.id}
                          role="group"
                          aria-label={group.label}
                          className="neli-suggestion-group mb-2 pb-2 last:mb-0 last:border-0 last:pb-0"
                        >
                          <p
                            aria-hidden="true"
                            className="neli-suggestion-label px-2 pb-1 text-[0.6rem] font-semibold uppercase tracking-[0.16em]"
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
                                  className="neli-prompt-option portfolio-focus group/question flex min-h-10 w-full items-center justify-between gap-2 px-2.5 py-2 text-left text-xs leading-4 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                  <span>{question}</span>
                                  <span aria-hidden="true" className="neli-prompt-arrow" />
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
                className="neli-command-form flex items-end gap-2 p-3 pt-2"
              >
                <label htmlFor="jbta-assistant-input" className="sr-only">
                  Ask Neli about Jonel
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
                  className="neli-command-input portfolio-focus min-h-11 min-w-0 flex-1 px-3.5 text-sm"
                />
                <button
                  type="submit"
                  aria-label="Send inquiry to Neli"
                  data-cursor-label="Send"
                  disabled={!input.trim() || responding}
                  className="neli-send-button portfolio-focus flex size-11 shrink-0 items-center justify-center disabled:cursor-not-allowed disabled:opacity-35"
                >
                  <PixelGlyph type="rune" />
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
      initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reducedMotion ? 0.1 : 0.24, ease: controlEase }}
      className={`neli-message flex items-end gap-2 ${assistantMessage ? "neli-message--oracle justify-start" : "neli-message--traveler justify-end"}`}
    >
      {assistantMessage && (
        <img
          src={chatbotAvatar}
          alt=""
          aria-hidden="true"
          className="neli-message-portrait size-7 shrink-0 object-cover"
        />
      )}
      <p
        className={`neli-message-bubble max-w-[82%] whitespace-pre-wrap px-3.5 py-2.5 text-xs leading-5 ${
          assistantMessage ? "neli-message-bubble--oracle" : "neli-message-bubble--traveler"
        }`}
      >
        {message.text}
      </p>
    </motion.div>
  );
}

function TypingIndicator({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <div className="neli-message neli-message--oracle flex items-end gap-2" aria-label="Neli is responding">
      <img
        src={chatbotAvatar}
        alt=""
        aria-hidden="true"
        className="neli-message-portrait size-7 shrink-0 object-cover"
      />
      <div className={`neli-typing flex h-9 items-center gap-1 px-3 ${reducedMotion ? "neli-typing--still" : ""}`}>
        {[0, 1, 2].map((dot) => (
          <span
            key={dot}
            aria-hidden="true"
            className="neli-typing-pixel"
          />
        ))}
      </div>
    </div>
  );
}

function PixelGlyph({ type }: { type: "close" | "rune" | "spark" }) {
  if (type === "close") {
    return <span aria-hidden="true" className="neli-glyph neli-glyph--close" />;
  }

  if (type === "spark") {
    return <span aria-hidden="true" className="neli-glyph neli-glyph--spark" />;
  }

  return <span aria-hidden="true" className="neli-glyph neli-glyph--rune" />;
}

import { useState, type KeyboardEvent } from "react";
import { Loader2, Sparkles, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  question: string;
  onQuestionChange: (value: string) => void;
  onAsk: () => void;
  isAsking: boolean;
  exampleQuestions: string[];
  disabled?: boolean;
}

export function QuestionPanel({
  question,
  onQuestionChange,
  onAsk,
  isAsking,
  exampleQuestions,
  disabled,
}: Props) {
  const [focused, setFocused] = useState(false);
  const canAsk = question.trim().length > 0 && !isAsking && !disabled;

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (canAsk) onAsk();
    }
  }

  return (
    <section aria-labelledby="ask-heading" className="space-y-4">
      {exampleQuestions.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Try asking
          </p>
          <ul className="flex flex-wrap gap-2">
            {exampleQuestions.map((example) => (
              <li key={example}>
                <button
                  type="button"
                  onClick={() => onQuestionChange(example)}
                  className="rounded-full border border-border bg-surface px-3.5 py-1.5 text-left text-xs text-muted-foreground transition-all hover:border-brand/40 hover:bg-brand-soft hover:text-foreground"
                >
                  {example}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div
        className="glass-panel rounded-3xl p-4 transition-shadow duration-300 sm:p-5"
        style={focused ? { boxShadow: "var(--shadow-brand)" } : undefined}
      >
        <h2 id="ask-heading" className="sr-only">
          Ask a question
        </h2>
        <label htmlFor="question" className="sr-only">
          Your question
        </label>
        <textarea
          id="question"
          value={question}
          rows={3}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(event) => onQuestionChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask SQLGenie anything about your data..."
          className="w-full resize-none bg-transparent font-sans text-base leading-relaxed text-foreground outline-none placeholder:text-muted-foreground/70 disabled:opacity-60"
        />
        <div className="mt-3 flex flex-col gap-3 border-t border-border pt-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            Enter to ask · Shift + Enter for a new line
          </p>
          <Button
            type="button"
            onClick={onAsk}
            disabled={!canAsk}
            className="w-full bg-brand font-medium text-brand-foreground hover:bg-brand/90 sm:w-auto"
          >
            {isAsking ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                SQLGenie is thinking...
              </>
            ) : (
              <>
                <WandSparkles className="size-4" aria-hidden />
                Ask SQLGenie
              </>
            )}
          </Button>
        </div>
      </div>
    </section>
  );
}

export function EmptyResultState() {
  return (
    <div className="hairline-grid flex min-h-[16rem] flex-col items-center justify-center rounded-3xl border border-border bg-surface/30 p-8 text-center">
      <span className="flex size-12 items-center justify-center rounded-2xl bg-brand-soft text-brand">
        <Sparkles className="size-5" aria-hidden />
      </span>
      <p className="mt-4 font-display text-lg font-semibold">
        Ask questions. Get answers from your data.
      </p>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">
        SQLGenie retrieves the schema, writes SQL, validates it against its query guard, and runs it
        read-only. The full agent trace shows up here.
      </p>
    </div>
  );
}

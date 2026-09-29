import { useState } from "react";
import { AlertTriangle, BarChart3, Rows3, Sparkles } from "lucide-react";
import type { AskSuccess, SqlGenieError } from "@/lib/api/types";
import { inferChart, scalarHighlight } from "@/lib/result-insight";
import { STEP_LABELS } from "@/lib/pipeline";
import { ResultChart } from "./ResultChart";
import { ResultTable } from "./ResultTable";
import { cn } from "@/lib/utils";

export function AnswerSection({ result }: { result: AskSuccess }) {
  const chartPlan = inferChart(result);
  const highlight = scalarHighlight(result);
  const [view, setView] = useState<"table" | "chart">("table");

  return (
    <section aria-labelledby="answer-heading" className="glass-panel rounded-3xl p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="answer-heading" className="flex items-center gap-2 font-display text-base font-semibold">
          <Sparkles className="size-4 text-brand" aria-hidden />
          Result
        </h2>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            {result.row_count} {result.row_count === 1 ? "row" : "rows"}
          </span>
          {chartPlan && (
            <div
              className="flex rounded-full border border-border bg-surface p-0.5"
              role="tablist"
              aria-label="Result view"
            >
              {(["table", "chart"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  role="tab"
                  aria-selected={view === mode}
                  onClick={() => setView(mode)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors",
                    view === mode
                      ? "bg-brand-soft text-brand"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {mode === "table" ? (
                    <Rows3 className="size-3.5" aria-hidden />
                  ) : (
                    <BarChart3 className="size-3.5" aria-hidden />
                  )}
                  {mode}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {highlight && (
        <div className="mt-4 rounded-2xl border border-brand/30 bg-brand-soft px-5 py-4">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            {highlight.label}
          </p>
          <p className="mt-1 font-display text-3xl font-bold tabular-nums sm:text-4xl">
            {highlight.value}
          </p>
          {result.columns.length > 1 && (
            <p className="mt-1 text-xs text-muted-foreground">
              {result.columns
                .filter((column) => column !== highlight.label)
                .map((column) => `${column}: ${String(result.rows[0]?.[column] ?? "—")}`)
                .join(" · ")}
            </p>
          )}
        </div>
      )}

      <div className="mt-4">
        {chartPlan && view === "chart" ? (
          <ResultChart result={result} plan={chartPlan} />
        ) : (
          <ResultTable result={result} />
        )}
      </div>
    </section>
  );
}

export function ErrorState({ error }: { error: SqlGenieError }) {
  const stepLabel =
    error.failedStep && error.failedStep in STEP_LABELS
      ? STEP_LABELS[error.failedStep as keyof typeof STEP_LABELS]
      : error.failedStep;

  return (
    <section
      role="alert"
      className="rounded-3xl border border-destructive/40 bg-destructive/10 p-4 sm:p-5"
    >
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-destructive/15 text-destructive">
          <AlertTriangle className="size-4" aria-hidden />
        </span>
        <div className="min-w-0">
          <h2 className="font-display text-base font-semibold">SQLGenie couldn't answer that</h2>
          <p className="mt-1 text-sm leading-relaxed text-foreground/90">{error.message}</p>
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            {stepLabel && (
              <span className="rounded-full border border-destructive/30 px-2.5 py-1 text-destructive">
                Failed at: {stepLabel}
              </span>
            )}
            {error.type && (
              <span className="rounded-full border border-border px-2.5 py-1 text-muted-foreground">
                {error.type.replace(/_/g, " ")}
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

import { ChevronDown } from "lucide-react";
import type { PipelineStep, Trace } from "@/lib/api/types";
import { formatDuration, stepLabel } from "@/lib/pipeline";
import { cn } from "@/lib/utils";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
      <dt className="w-44 shrink-0 text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </dt>
      <dd className="min-w-0 break-words text-sm text-foreground">{value}</dd>
    </div>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="mt-1 overflow-x-auto rounded-xl bg-background/70 p-3 font-mono text-xs leading-relaxed text-foreground/90">
      {code}
    </pre>
  );
}

function StepBody({ step }: { step: PipelineStep }) {
  switch (step.type) {
    case "question":
      return step.data?.text ? <Row label="Question" value={step.data.text} /> : null;
    case "schema_retrieval": {
      const tables = step.data?.selected_tables ?? step.data?.tables ?? [];
      const relationships = (step.data?.relationships ?? []).map((rel) =>
        typeof rel === "string" ? rel : [rel.from, rel.to, rel.on].filter(Boolean).join(" → "),
      );
      return (
        <>
          {tables.length > 0 && <Row label="Selected tables" value={tables.join(", ")} />}
          {relationships.length > 0 && (
            <Row label="Relationships" value={relationships.join(" · ")} />
          )}
        </>
      );
    }
    case "sql_generation": {
      const isCorrection = step.data?.correction ?? step.data?.is_correction ?? false;
      return (
        <>
          <Row label="Correction pass" value={isCorrection ? "Yes" : "No"} />
          {step.data?.sql && (
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Generated SQL</p>
              <CodeBlock code={step.data.sql} />
            </div>
          )}
        </>
      );
    }
    case "sql_guard": {
      const rejected = step.data?.rejected === true || step.data?.approved === false;
      return (
        <>
          <Row label="Verdict" value={rejected ? "Rejected" : "Approved"} />
          <Row label="SQL modified" value={step.data?.modified ? "Yes" : "No"} />
          {step.data?.reason && <Row label="Reason" value={step.data.reason} />}
        </>
      );
    }
    case "db_execution":
      return (
        <>
          {typeof step.data?.row_count === "number" && (
            <Row label="Rows returned" value={String(step.data.row_count)} />
          )}
          {step.data?.error && <Row label="Database error" value={step.data.error} />}
        </>
      );
    case "self_correction": {
      const number = step.data?.correction_number ?? step.data?.attempt;
      const error = step.data?.db_error ?? step.data?.error;
      return (
        <>
          {typeof number === "number" && <Row label="Correction number" value={String(number)} />}
          {error && <Row label="Database error" value={error} />}
          {step.data?.failed_sql && (
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Failed SQL</p>
              <CodeBlock code={step.data.failed_sql} />
            </div>
          )}
        </>
      );
    }
    case "result":
      return typeof step.data?.row_count === "number" ? (
        <Row label="Rows returned" value={String(step.data.row_count)} />
      ) : null;
    default:
      return null;
  }
}

export function TraceDetails({ trace }: { trace: Trace | null }) {
  const steps = trace?.steps ?? [];
  if (steps.length === 0) return null;

  return (
    <section className="glass-panel rounded-3xl p-2 sm:p-3">
      <details className="group">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium hover:bg-surface-2/60">
          <span>Pipeline trace details</span>
          <span className="flex items-center gap-2 text-xs text-muted-foreground">
            {steps.length} steps
            <ChevronDown className="size-4 transition-transform group-open:rotate-180" aria-hidden />
          </span>
        </summary>

        <ol className="mt-2 space-y-2 px-1 pb-1">
          {steps.map((step, index) => (
            <li
              key={`${step.index}-${step.type}-${index}`}
              className={cn(
                "rounded-2xl border border-border bg-surface/50 p-3",
                step.status === "failed" && "border-destructive/30",
              )}
            >
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="font-display text-sm font-semibold">{stepLabel(step)}</span>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[11px] font-medium capitalize",
                    step.status === "failed"
                      ? "bg-destructive/15 text-destructive"
                      : step.status === "success"
                        ? "bg-success/10 text-success"
                        : "bg-surface-2 text-muted-foreground",
                  )}
                >
                  {step.status}
                </span>
                {typeof step.attempt === "number" && (
                  <span className="text-xs text-muted-foreground">attempt {step.attempt}</span>
                )}
                {formatDuration(step.duration_ms) && (
                  <span className="text-xs text-muted-foreground">
                    {formatDuration(step.duration_ms)}
                  </span>
                )}
              </div>
              <dl className="mt-2 space-y-1.5">
                <StepBody step={step} />
              </dl>
            </li>
          ))}
        </ol>
      </details>
    </section>
  );
}

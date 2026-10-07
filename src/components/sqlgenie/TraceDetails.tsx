import { ChevronDown } from "lucide-react";
import type { PipelineStep, RetrievedTable, Trace } from "@/lib/api/types";
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

/** A labelled row whose value is a short list of items — rendered as chips,
 * never joined into a single string, so each item stays independently
 * readable (and nothing ever degrades to "[object Object]"). */
function ChipRow({ label, chips }: { label: string; chips: string[] }) {
  if (chips.length === 0) return null;
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:gap-3">
      <dt className="w-44 shrink-0 pt-0.5 text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </dt>
      <dd className="flex min-w-0 flex-wrap gap-1.5">
        {chips.map((chip, i) => (
          <span
            key={`${chip}-${i}`}
            className="rounded-full border border-border bg-surface px-2 py-0.5 text-xs text-foreground"
          >
            {chip}
          </span>
        ))}
      </dd>
    </div>
  );
}

function CodeBlock({ label, code }: { label: string; code: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <pre className="mt-1 overflow-x-auto rounded-xl bg-background/70 p-3 font-mono text-xs leading-relaxed text-foreground/90">
        {code}
      </pre>
    </div>
  );
}

/** Renders one retrieved table as a readable chip — explicit fields, never
 * the object itself (the backend sends `{ name, kind, selected_by, score }`,
 * not a plain string). */
function tableChip(table: RetrievedTable): string {
  const parts = [table.name];
  if (table.kind && table.kind !== "table") parts.push(`(${table.kind})`);
  if (typeof table.score === "number") parts.push(`· score ${table.score}`);
  return parts.join(" ");
}

function StepBody({ step }: { step: PipelineStep }) {
  switch (step.type) {
    case "question":
      return step.data?.text ? <Row label="Question" value={step.data.text} /> : null;

    case "schema_retrieval": {
      const tables = step.data?.tables ?? [];
      const relationships = step.data?.relationships ?? [];
      const sentChars = step.data?.schema_chars;
      const fullChars = step.data?.full_schema_chars;
      return (
        <>
          <ChipRow label="Selected tables" chips={tables.map(tableChip)} />
          <ChipRow label="Relationships" chips={relationships} />
          {typeof sentChars === "number" && (
            <Row
              label="Schema sent to LLM"
              value={
                typeof fullChars === "number"
                  ? `${sentChars.toLocaleString()} chars (full schema: ${fullChars.toLocaleString()} chars)`
                  : `${sentChars.toLocaleString()} chars`
              }
            />
          )}
          {step.data?.error && <Row label="Error" value={step.data.error} />}
        </>
      );
    }

    case "sql_generation": {
      const isCorrection = step.data?.is_correction ?? false;
      return (
        <>
          <Row label="Correction pass" value={isCorrection ? "Yes" : "No"} />
          {step.data?.sql && <CodeBlock label="Generated SQL" code={step.data.sql} />}
          {step.data?.error && <Row label="Error" value={step.data.error} />}
        </>
      );
    }

    case "sql_guard": {
      const rejected = step.data?.approved === false;
      const modified = step.data?.sql_was_modified === true;
      return (
        <>
          <Row label="Verdict" value={rejected ? "Rejected" : "Approved"} />
          <Row label="SQL modified" value={modified ? "Yes" : "No"} />
          {step.data?.reason && <Row label="Reason" value={step.data.reason} />}
          {modified && step.data?.original_sql && (
            <CodeBlock label="Original SQL" code={step.data.original_sql} />
          )}
          {modified && step.data?.executed_sql && (
            <CodeBlock label="Executed SQL (modified by guard)" code={step.data.executed_sql} />
          )}
        </>
      );
    }

    case "db_execution":
      return (
        <>
          {typeof step.data?.row_count === "number" && (
            <Row label="Rows returned" value={String(step.data.row_count)} />
          )}
          <ChipRow label="Columns" chips={step.data?.columns ?? []} />
          {step.data?.error && <Row label="Database error" value={step.data.error} />}
        </>
      );

    case "self_correction": {
      const number = step.data?.correction_number;
      const max = step.data?.max_corrections;
      return (
        <>
          {typeof number === "number" && (
            <Row
              label="Correction attempt"
              value={typeof max === "number" ? `${number} of ${max}` : String(number)}
            />
          )}
          {step.data?.db_error && <Row label="Database error" value={step.data.db_error} />}
          {step.data?.failed_sql && <CodeBlock label="Failed SQL" code={step.data.failed_sql} />}
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
            <ChevronDown
              className="size-4 transition-transform group-open:rotate-180"
              aria-hidden
            />
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

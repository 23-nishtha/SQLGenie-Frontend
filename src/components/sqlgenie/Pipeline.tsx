import {
  Check,
  ChevronRight,
  CircleDashed,
  Database,
  FileCode2,
  Loader2,
  MessageSquare,
  RotateCcw,
  ShieldCheck,
  Table2,
  X,
  type LucideIcon,
} from "lucide-react";
import type { PipelineStep, PipelineStepType, Trace } from "@/lib/api/types";
import { formatDuration, stepLabel } from "@/lib/pipeline";
import { cn } from "@/lib/utils";

const STEP_ICONS: Record<PipelineStepType, LucideIcon> = {
  question: MessageSquare,
  schema_retrieval: Table2,
  sql_generation: FileCode2,
  sql_guard: ShieldCheck,
  db_execution: Database,
  self_correction: RotateCcw,
  result: Check,
};

/** Placeholder stages shown while a request is in flight (no real trace yet). */
const PENDING_STAGES: PipelineStepType[] = [
  "question",
  "schema_retrieval",
  "sql_generation",
  "sql_guard",
  "db_execution",
  "result",
];

function StatusBadge({ status }: { status: string }) {
  if (status === "running") {
    return <Loader2 className="size-3.5 animate-spin text-brand" aria-hidden />;
  }
  if (status === "failed") {
    return <X className="size-3.5 text-destructive" aria-hidden />;
  }
  if (status === "success") {
    return <Check className="size-3.5 text-success" aria-hidden />;
  }
  return <CircleDashed className="size-3.5 text-muted-foreground" aria-hidden />;
}

function StepCard({ step }: { step: PipelineStep }) {
  const Icon = STEP_ICONS[step.type] ?? CircleDashed;
  const duration = formatDuration(step.duration_ms);
  const failed = step.status === "failed";
  const running = step.status === "running";
  const inactive = step.status !== "success" && !failed && !running;

  return (
    <li
      className={cn(
        "flex min-w-[10.5rem] shrink-0 items-center gap-3 rounded-2xl border px-3.5 py-3 transition-all duration-500",
        failed && "border-destructive/40 bg-destructive/10",
        running && "border-brand/50 bg-brand-soft",
        step.status === "success" && "border-border bg-surface",
        inactive && "border-border/60 bg-surface/30 opacity-60",
      )}
    >
      <span
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-xl",
          failed ? "bg-destructive/15 text-destructive" : "bg-surface-2 text-brand",
        )}
      >
        <Icon className="size-4" aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{stepLabel(step)}</p>
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <StatusBadge status={step.status} />
          <span className="capitalize">{step.status}</span>
          {duration && <span className="text-muted-foreground/70">· {duration}</span>}
        </p>
      </div>
    </li>
  );
}

interface Props {
  trace: Trace | null;
  isAsking: boolean;
}

export function Pipeline({ trace, isAsking }: Props) {
  const realSteps = trace?.steps ?? [];
  const summary = trace?.summary;

  const steps: PipelineStep[] =
    realSteps.length > 0
      ? realSteps
      : isAsking
        ? PENDING_STAGES.map(
            (type, index) =>
              ({
                index,
                type,
                status: index === 0 ? "running" : "pending",
              }) as PipelineStep,
          )
        : [];

  if (steps.length === 0) return null;

  const corrected = summary?.corrected === true;
  const attempts = summary?.attempts ?? undefined;
  const total = formatDuration(summary?.total_duration_ms);

  return (
    <section aria-labelledby="pipeline-heading" className="glass-panel rounded-3xl p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2
          id="pipeline-heading"
          className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground"
        >
          Agent pipeline
        </h2>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {typeof attempts === "number" && (
            <span
              className={cn(
                "theme-badge rounded-full border px-2.5 py-1 font-medium",
                corrected
                  ? "border-warning/40 bg-warning/10 text-warning"
                  : "border-success/30 bg-success/10 text-success",
              )}
            >
              {corrected
                ? `Self-corrected · ${attempts} attempts`
                : `Completed in ${attempts} attempt${attempts === 1 ? "" : "s"}`}
            </span>
          )}
          {total && <span className="text-muted-foreground">{total} total</span>}
        </div>
      </div>

      <ol className="-mx-1 mt-4 flex items-center gap-1 overflow-x-auto px-1 pb-2 lg:flex-wrap lg:overflow-visible">
        {steps.map((step, index) => (
          <div key={`${step.index}-${step.type}-${index}`} className="flex items-center gap-1">
            <StepCard step={step} />
            {index < steps.length - 1 && (
              <ChevronRight className="size-4 shrink-0 text-muted-foreground/50" aria-hidden />
            )}
          </div>
        ))}
      </ol>
    </section>
  );
}

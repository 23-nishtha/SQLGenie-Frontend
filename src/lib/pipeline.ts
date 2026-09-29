import type { PipelineStep, PipelineStepType } from "./api/types";

export const STEP_LABELS: Record<PipelineStepType, string> = {
  question: "Question",
  schema_retrieval: "Schema Retrieval",
  sql_generation: "SQL Generation",
  sql_guard: "SQL Guard",
  db_execution: "Database Execution",
  self_correction: "Self-Correction",
  result: "Result",
};

export function stepLabel(step: PipelineStep): string {
  const base = STEP_LABELS[step.type] ?? step.type;
  if (step.type === "sql_generation" && (step.attempt ?? 1) > 1) {
    return `${base} #${step.attempt}`;
  }
  return base;
}

export function formatDuration(ms: number | null | undefined): string | null {
  if (typeof ms !== "number" || !Number.isFinite(ms)) return null;
  return ms >= 1000 ? `${(ms / 1000).toFixed(2)}s` : `${ms.toFixed(0)}ms`;
}

export function guardApproved(steps: PipelineStep[] | null | undefined): boolean {
  if (!steps?.length) return false;
  const guards = steps.filter((step) => step.type === "sql_guard");
  const last = guards[guards.length - 1];
  if (!last || last.type !== "sql_guard") return false;
  if (last.status === "failed") return false;
  if (last.data?.rejected === true) return false;
  return last.data?.approved !== false;
}

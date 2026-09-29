/** Types mirroring the SQLGenie FastAPI backend contract. */

export type ThemeKey =
  | "commerce"
  | "football"
  | "entertainment"
  | "finance"
  | "property"
  | "default";

export interface DatasetProfile {
  id: string;
  name: string;
  domain: string;
  /** Closed theme key from the backend; unknown values fall back to "default". */
  theme: string;
  description?: string | null;
  source?: "built_in" | "uploaded" | string;
  example_questions?: string[];
}

export interface DatasetsResponse {
  active: string;
  datasets: DatasetProfile[];
}

export interface LlmInfo {
  mode?: string | null;
  model?: string | null;
}

export type PipelineStepType =
  | "question"
  | "schema_retrieval"
  | "sql_generation"
  | "sql_guard"
  | "db_execution"
  | "self_correction"
  | "result";

export type PipelineStepStatus = "success" | "failed" | "running" | "skipped" | string;

interface BaseStep {
  index: number;
  status: PipelineStepStatus;
  attempt?: number | null;
  duration_ms?: number | null;
}

export type PipelineStep =
  | (BaseStep & { type: "question"; data?: { text?: string | null } | null })
  | (BaseStep & {
      type: "schema_retrieval";
      data?: {
        tables?: string[] | null;
        selected_tables?: string[] | null;
        relationships?: (string | { from?: string; to?: string; on?: string })[] | null;
      } | null;
    })
  | (BaseStep & {
      type: "sql_generation";
      data?: { sql?: string | null; correction?: boolean | null; is_correction?: boolean | null } | null;
    })
  | (BaseStep & {
      type: "sql_guard";
      data?: {
        approved?: boolean | null;
        rejected?: boolean | null;
        modified?: boolean | null;
        reason?: string | null;
      } | null;
    })
  | (BaseStep & {
      type: "db_execution";
      data?: { row_count?: number | null; error?: string | null } | null;
    })
  | (BaseStep & {
      type: "self_correction";
      data?: {
        correction_number?: number | null;
        attempt?: number | null;
        failed_sql?: string | null;
        error?: string | null;
        db_error?: string | null;
      } | null;
    })
  | (BaseStep & { type: "result"; data?: { row_count?: number | null } | null });

export interface TraceSummary {
  attempts?: number | null;
  max_correction_attempts?: number | null;
  corrected?: boolean | null;
  total_duration_ms?: number | null;
}

export interface Trace {
  summary?: TraceSummary | null;
  steps?: PipelineStep[] | null;
}

export type ResultCell = string | number | boolean | null;

export interface AskSuccess {
  status: "success";
  question: string;
  sql: string;
  columns: string[];
  rows: Record<string, ResultCell>[];
  row_count: number;
  attempts?: number;
  corrected?: boolean;
  dataset?: DatasetProfile;
  llm?: LlmInfo;
  trace?: Trace | null;
}

export type AskErrorType =
  | "sql_rejected"
  | "unsupported_question"
  | "execution_failed"
  | "llm_error"
  | "invalid_request"
  | string;

/** Normalized, single frontend error shape. */
export interface SqlGenieError {
  message: string;
  type?: AskErrorType;
  failedStep?: string;
  trace?: Trace | null;
  dataset?: DatasetProfile;
}

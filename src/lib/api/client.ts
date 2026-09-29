import type {
  AskSuccess,
  DatasetProfile,
  DatasetsResponse,
  SqlGenieError,
  Trace,
} from "./types";

/** Single configurable API base URL. */
export const API_BASE_URL = (
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "http://localhost:8000"
).replace(/\/+$/, "");

export class ApiError extends Error implements SqlGenieError {
  type?: string;
  failedStep?: string;
  trace?: Trace | null;
  constructor(err: SqlGenieError) {
    super(err.message);
    this.name = "ApiError";
    this.type = err.type;
    this.failedStep = err.failedStep;
    this.trace = err.trace ?? null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/** Normalizes every backend failure shape into one frontend error. */
function toApiError(body: unknown, fallback: string): ApiError {
  if (isRecord(body)) {
    const errorBlock = isRecord(body.error) ? body.error : undefined;
    const detail = typeof body.detail === "string" ? body.detail : undefined;
    const message =
      detail ??
      (typeof errorBlock?.message === "string" ? errorBlock.message : undefined) ??
      fallback;
    return new ApiError({
      message,
      type: typeof errorBlock?.type === "string" ? errorBlock.type : undefined,
      failedStep:
        typeof errorBlock?.failed_step === "string" ? errorBlock.failed_step : undefined,
      trace: (body.trace as Trace | undefined) ?? null,
    });
  }
  return new ApiError({ message: fallback });
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        Accept: "application/json",
        ...(init?.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
        ...(init?.headers ?? {}),
      },
    });
  } catch {
    throw new ApiError({
      message: `Could not reach the SQLGenie backend at ${API_BASE_URL}. Check that it is running and reachable.`,
      type: "network_error",
    });
  }

  let body: unknown = null;
  const text = await response.text();
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = null;
    }
  }

  if (!response.ok) {
    throw toApiError(body, `Request failed (HTTP ${response.status}).`);
  }
  if (isRecord(body) && body.status === "error") {
    throw toApiError(body, "SQLGenie could not answer that question.");
  }
  return body as T;
}

export const api = {
  health: () => request<unknown>("/health"),
  listDatasets: () => request<DatasetsResponse>("/datasets"),
  selectDataset: (datasetId: string) =>
    request<DatasetProfile>(`/datasets/${encodeURIComponent(datasetId)}/select`, {
      method: "POST",
    }),
  uploadDataset: (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return request<DatasetProfile>("/datasets/upload", { method: "POST", body: form });
  },
  ask: (question: string) =>
    request<AskSuccess>("/ask", { method: "POST", body: JSON.stringify({ question }) }),
};

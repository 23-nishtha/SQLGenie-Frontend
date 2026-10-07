import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { api, ApiError, API_BASE_URL } from "@/lib/api/client";
import type { AskSuccess, DatasetProfile, SqlGenieError } from "@/lib/api/types";
import { guardApproved } from "@/lib/pipeline";
import { themeMeta } from "@/lib/theme-config";
import { Header, type BackendStatus } from "@/components/sqlgenie/Header";
import { DatasetSelector, DatasetInfo } from "@/components/sqlgenie/DatasetSelector";
import { QuestionPanel, EmptyResultState } from "@/components/sqlgenie/QuestionPanel";
import { Pipeline } from "@/components/sqlgenie/Pipeline";
import { AnswerSection, ErrorState } from "@/components/sqlgenie/AnswerSection";
import { SQLViewer } from "@/components/sqlgenie/SQLViewer";
import { TraceDetails } from "@/components/sqlgenie/TraceDetails";
import { ThemeBackdrop } from "@/components/sqlgenie/theme/ThemeBackdrop";

// No head() here: the home route inherits title/description/og/twitter from
// __root.tsx, and ships no og:image so serve-time hosting can inject the
// project's social preview (explicit og:image or latest screenshot).
export const Route = createFileRoute("/")({
  component: Index,
});

function toSqlGenieError(err: unknown, fallback: string): SqlGenieError {
  return err instanceof ApiError ? err : { message: fallback };
}

function Index() {
  const [backendStatus, setBackendStatus] = useState<BackendStatus>("checking");
  const [datasets, setDatasets] = useState<DatasetProfile[]>([]);
  const [activeDatasetId, setActiveDatasetId] = useState<string | null>(null);
  const [isSwitching, setIsSwitching] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [question, setQuestion] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const [result, setResult] = useState<AskSuccess | null>(null);
  const [error, setError] = useState<SqlGenieError | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const response = await api.listDatasets();
        if (cancelled) return;
        setDatasets(response.datasets);
        setActiveDatasetId(response.active);
        setBackendStatus("online");
      } catch {
        if (!cancelled) setBackendStatus("offline");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const activeDataset = datasets.find((dataset) => dataset.id === activeDatasetId) ?? null;
  const trace = result?.trace ?? error?.trace ?? null;
  const theme = themeMeta(activeDataset);

  async function handleSelectDataset(id: string) {
    setIsSwitching(true);
    setError(null);
    setResult(null);
    try {
      const dataset = await api.selectDataset(id);
      setActiveDatasetId(dataset.id);
    } catch (err) {
      setError(toSqlGenieError(err, "Could not switch datasets."));
    } finally {
      setIsSwitching(false);
    }
  }

  async function handleUploadDataset(file: File) {
    setIsUploading(true);
    setError(null);
    setResult(null);
    try {
      const dataset = await api.uploadDataset(file);
      setDatasets((prev) => (prev.some((d) => d.id === dataset.id) ? prev : [...prev, dataset]));
      setActiveDatasetId(dataset.id);
    } catch (err) {
      setError(toSqlGenieError(err, "Could not upload the dataset."));
    } finally {
      setIsUploading(false);
    }
  }

  async function handleAsk() {
    const trimmed = question.trim();
    if (!trimmed || isAsking) return;
    setIsAsking(true);
    setError(null);
    setResult(null);
    try {
      const data = await api.ask(trimmed);
      setResult(data);
    } catch (err) {
      setError(toSqlGenieError(err, "Something went wrong answering that question."));
    } finally {
      setIsAsking(false);
    }
  }

  return (
    <main data-theme={theme.key} className="relative min-h-screen text-foreground">
      <ThemeBackdrop theme={theme.key} />
      <Header status={backendStatus} icon={theme.Icon} />
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
        {backendStatus === "offline" && (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            Can't reach the SQLGenie backend at {API_BASE_URL}. Make sure it's running, then
            refresh.
          </div>
        )}

        <DatasetSelector
          datasets={datasets}
          activeId={activeDatasetId}
          isSwitching={isSwitching}
          isUploading={isUploading}
          onSelect={handleSelectDataset}
          onUpload={handleUploadDataset}
        />

        {activeDataset && <DatasetInfo dataset={activeDataset} />}

        <QuestionPanel
          question={question}
          onQuestionChange={setQuestion}
          onAsk={handleAsk}
          isAsking={isAsking}
          exampleQuestions={activeDataset?.example_questions ?? []}
          disabled={!activeDatasetId || isSwitching}
        />

        <Pipeline trace={trace} isAsking={isAsking} />

        {result && <AnswerSection result={result} />}
        {error && <ErrorState error={error} />}
        {!result && !error && !isAsking && <EmptyResultState />}

        {result && (
          <SQLViewer sql={result.sql} guardApproved={guardApproved(result.trace?.steps)} />
        )}

        <TraceDetails trace={trace} />
      </div>
    </main>
  );
}

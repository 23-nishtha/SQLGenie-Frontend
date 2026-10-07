import { useRef } from "react";
import { Loader2, Plus, Upload } from "lucide-react";
import type { DatasetProfile } from "@/lib/api/types";
import { themeMeta } from "@/lib/theme-config";
import { cn } from "@/lib/utils";

interface Props {
  datasets: DatasetProfile[];
  activeId: string | null;
  isSwitching: boolean;
  isUploading: boolean;
  onSelect: (id: string) => void;
  onUpload: (file: File) => void;
}

export function DatasetSelector({
  datasets,
  activeId,
  isSwitching,
  isUploading,
  onSelect,
  onUpload,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <section aria-labelledby="dataset-heading" className="space-y-3">
      <div className="flex items-center justify-between">
        <h2
          id="dataset-heading"
          className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground"
        >
          Dataset
        </h2>
        {isSwitching && (
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Loader2 className="size-3 animate-spin" aria-hidden /> Switching…
          </span>
        )}
      </div>

      <div
        className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4"
        role="radiogroup"
        aria-label="Select a dataset"
      >
        {datasets.map((dataset) => {
          const active = dataset.id === activeId;
          const meta = themeMeta(dataset);
          return (
            <button
              key={dataset.id}
              type="button"
              role="radio"
              aria-checked={active}
              disabled={isSwitching}
              onClick={() => !active && onSelect(dataset.id)}
              data-theme={meta.key}
              className={cn(
                "dataset-card min-w-[15rem] shrink-0 snap-start rounded-2xl border p-4 text-left transition-all duration-300 sm:min-w-0",
                "hover:-translate-y-0.5 disabled:opacity-60",
                active
                  ? "border-brand/50 bg-brand-soft shadow-brand"
                  : "border-border bg-surface hover:border-brand/30",
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="flex size-8 items-center justify-center rounded-lg bg-surface-2 text-brand">
                  <meta.Icon className="size-4" aria-hidden />
                </span>
                {dataset.source === "uploaded" && (
                  <span className="rounded-full border border-border px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                    uploaded
                  </span>
                )}
              </div>
              <p className="mt-3 line-clamp-2 font-display text-sm font-semibold">{dataset.name}</p>
              <p className="mt-1 text-xs capitalize text-muted-foreground">{dataset.domain}</p>
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={isUploading}
          className={cn(
            "flex min-w-[13rem] shrink-0 snap-start flex-col items-start justify-center gap-2 rounded-2xl border border-dashed border-border bg-surface/70 p-4 text-left backdrop-blur-sm transition-colors sm:min-w-0",
            "hover:border-brand/40 hover:bg-brand-soft/40 disabled:opacity-60",
          )}
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-surface-2 text-brand">
            {isUploading ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <Plus className="size-4" aria-hidden />
            )}
          </span>
          <span className="font-display text-sm font-semibold">
            {isUploading ? "Uploading…" : "Upload CSV"}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Upload className="size-3" aria-hidden /> CSV, max 5 MB
          </span>
        </button>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept=".csv,text/csv"
        className="sr-only"
        aria-label="Upload a CSV dataset"
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (file) onUpload(file);
        }}
      />
    </section>
  );
}

export function DatasetInfo({ dataset }: { dataset: DatasetProfile }) {
  const meta = themeMeta(dataset);
  return (
    <div className="dataset-info-card rounded-2xl border border-border bg-surface/80 px-4 py-3 backdrop-blur-sm">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand">
          <meta.Icon className="size-3.5" aria-hidden />
        </span>
        <h3 className="font-display text-base font-semibold">{dataset.name}</h3>
        <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[11px] font-medium capitalize text-brand">
          {dataset.domain}
        </span>
      </div>
      {dataset.description && (
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          {dataset.description}
        </p>
      )}
    </div>
  );
}

import { Database, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type BackendStatus = "checking" | "online" | "offline";

const STATUS_COPY: Record<BackendStatus, string> = {
  checking: "Checking backend…",
  online: "Connected",
  offline: "Backend unavailable",
};

export function Header({ status }: { status: BackendStatus }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border/80 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-brand-soft text-brand ring-1 ring-brand/30">
            <Database className="size-5" aria-hidden />
          </span>
          <div className="leading-tight">
            <p className="font-display text-lg font-bold tracking-tight">SQLGenie</p>
            <p className="hidden text-xs text-muted-foreground sm:block">
              AI-Powered Multi-Dataset Analytics
            </p>
          </div>
        </div>

        <div
          className={cn(
            "flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium",
            status === "online" && "border-success/30 bg-success/10 text-success",
            status === "offline" && "border-destructive/30 bg-destructive/10 text-destructive",
            status === "checking" && "border-border bg-surface text-muted-foreground",
          )}
          role="status"
          aria-live="polite"
        >
          {status === "checking" ? (
            <Loader2 className="size-3 animate-spin" aria-hidden />
          ) : (
            <span
              aria-hidden
              className={cn(
                "size-2 rounded-full",
                status === "online" ? "bg-success" : "bg-destructive",
              )}
            />
          )}
          <span>{STATUS_COPY[status]}</span>
        </div>
      </div>
    </header>
  );
}

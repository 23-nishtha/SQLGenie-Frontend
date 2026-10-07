import { useState } from "react";
import { Check, ChevronDown, Copy, ShieldCheck } from "lucide-react";

export function SQLViewer({ sql, guardApproved }: { sql: string; guardApproved: boolean }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(sql);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="glass-panel rounded-3xl p-2 sm:p-3">
      <details open className="group">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium hover:bg-surface-2/60">
          <span className="flex items-center gap-2">
            Generated SQL
            {guardApproved && (
              <span className="theme-badge hidden items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success sm:inline-flex">
                <ShieldCheck className="size-3" aria-hidden />
                Validated by SQLGenie's query guard
              </span>
            )}
          </span>
          <ChevronDown className="size-4 transition-transform group-open:rotate-180" aria-hidden />
        </summary>

        <div className="relative mt-1 px-1 pb-1">
          <button
            type="button"
            onClick={copy}
            className="absolute right-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Copy SQL"
          >
            {copied ? <Check className="size-3.5" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
            {copied ? "Copied" : "Copy"}
          </button>
          <pre className="overflow-x-auto rounded-2xl bg-background/70 p-4 pr-24 font-mono text-[13px] leading-relaxed text-foreground/90">
            <code>{sql}</code>
          </pre>
        </div>
      </details>
    </section>
  );
}

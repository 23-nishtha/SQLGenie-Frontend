import type { AskSuccess, ResultCell } from "@/lib/api/types";
import { formatCell, isNumericCell } from "@/lib/result-insight";
import { cn } from "@/lib/utils";

export function ResultTable({ result }: { result: AskSuccess }) {
  const { columns, rows } = result;

  if (!columns.length || !rows.length) {
    return (
      <p className="rounded-2xl border border-border bg-surface/40 p-6 text-center text-sm text-muted-foreground">
        The query ran successfully but returned no rows.
      </p>
    );
  }

  return (
    <div className="max-h-[28rem] overflow-auto rounded-2xl border border-border">
      <table className="w-full border-collapse text-sm">
        <caption className="sr-only">Query results</caption>
        <thead className="sticky top-0 z-10 bg-surface-2/95 backdrop-blur">
          <tr>
            {columns.map((column) => (
              <th
                key={column}
                scope="col"
                className="whitespace-nowrap border-b border-border px-4 py-3 text-left font-display text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="odd:bg-surface/40 hover:bg-brand-soft/40">
              {columns.map((column) => {
                const value = (row[column] ?? null) as ResultCell;
                return (
                  <td
                    key={column}
                    className={cn(
                      "whitespace-nowrap border-b border-border/60 px-4 py-2.5",
                      isNumericCell(value) && "font-mono tabular-nums",
                      value === null && "text-muted-foreground",
                    )}
                  >
                    {formatCell(value)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

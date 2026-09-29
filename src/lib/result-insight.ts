import type { AskSuccess, ResultCell } from "./api/types";

export function isNumericCell(value: ResultCell): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export function formatCell(value: ResultCell): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "number") {
    return Number.isInteger(value)
      ? value.toLocaleString()
      : value.toLocaleString(undefined, { maximumFractionDigits: 3 });
  }
  if (typeof value === "boolean") return value ? "true" : "false";
  return value;
}

export interface ChartPlan {
  kind: "bar" | "line";
  labelKey: string;
  valueKeys: string[];
}

/** Infers chart suitability from columns + rows only. Returns null when unsure. */
export function inferChart(result: AskSuccess): ChartPlan | null {
  const columns = result.columns ?? [];
  const rows = result.rows ?? [];
  if (!columns.length || !rows.length) return null;
  if (rows.length < 2 || rows.length > 60) return null;
  if (columns.length < 2 || columns.length > 4) return null;

  const labelKey = columns[0];
  if (!labelKey) return null;
  const rest = columns.slice(1);

  const labelsAreScalar = rows.every((row) => {
    const v = row[labelKey];
    return v === null || v === undefined || typeof v === "string" || typeof v === "number";
  });
  if (!labelsAreScalar) return null;

  const uniqueLabels = new Set(rows.map((row) => String(row[labelKey])));
  if (uniqueLabels.size !== rows.length) return null;

  const valueKeys = rest.filter((key) =>
    rows.every((row) => {
      const value = row[key] ?? null;
      return value === null || isNumericCell(value);
    }),
  );
  if (!valueKeys.length) return null;

  const looksTemporal = /year|month|date|day|week|season|time/i.test(labelKey);
  return { kind: looksTemporal ? "line" : "bar", labelKey, valueKeys: valueKeys.slice(0, 3) };
}

/** A presentation label built strictly from returned data — never a claimed fact. */
export function scalarHighlight(result: AskSuccess): { label: string; value: string } | null {
  const columns = result.columns ?? [];
  if (result.row_count !== 1 || columns.length === 0) return null;
  const row = result.rows?.[0];
  if (!row) return null;
  const numericKey = columns.find((c) => isNumericCell(row[c] ?? null));
  const key = numericKey ?? columns[columns.length - 1];
  if (!key) return null;
  return { label: key, value: formatCell(row[key] ?? null) };
}

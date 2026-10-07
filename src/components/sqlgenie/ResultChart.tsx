import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { AskSuccess } from "@/lib/api/types";
import type { ChartPlan } from "@/lib/result-insight";

const SERIES_COLORS = ["var(--brand)", "var(--chart-2)", "var(--chart-3)"];

export function ResultChart({ result, plan }: { result: AskSuccess; plan: ChartPlan }) {
  const data = result.rows.map((row) => {
    const point: Record<string, string | number | null> = {
      __label: String(row[plan.labelKey] ?? "—"),
    };
    plan.valueKeys.forEach((key) => {
      const value = row[key];
      point[key] = typeof value === "number" ? value : null;
    });
    return point;
  });

  const axisProps = {
    stroke: "var(--muted-foreground)",
    tick: { fill: "var(--muted-foreground)", fontSize: 12 },
  } as const;

  const tooltip = (
    <Tooltip
      contentStyle={{
        background: "var(--popover)",
        border: "1px solid var(--border)",
        borderRadius: "0.75rem",
        color: "var(--popover-foreground)",
        fontSize: 12,
      }}
    />
  );

  return (
    <div className="h-[22rem] w-full rounded-2xl border border-border bg-surface/40 p-3">
      <ResponsiveContainer width="100%" height="100%">
        {plan.kind === "line" ? (
          <LineChart data={data} margin={{ top: 12, right: 16, bottom: 8, left: 0 }}>
            <CartesianGrid stroke="var(--border)" vertical={false} />
            <XAxis dataKey="__label" {...axisProps} />
            <YAxis {...axisProps} />
            {tooltip}
            {plan.valueKeys.length > 1 && <Legend wrapperStyle={{ fontSize: 12 }} />}
            {plan.valueKeys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={SERIES_COLORS[index % SERIES_COLORS.length]}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        ) : (
          <BarChart data={data} margin={{ top: 12, right: 16, bottom: 8, left: 0 }}>
            <CartesianGrid stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="__label"
              {...axisProps}
              interval={0}
              angle={-15}
              textAnchor="end"
              height={60}
            />
            <YAxis {...axisProps} />
            {tooltip}
            {plan.valueKeys.length > 1 && <Legend wrapperStyle={{ fontSize: 12 }} />}
            {plan.valueKeys.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                fill={SERIES_COLORS[index % SERIES_COLORS.length]}
                radius={[6, 6, 0, 0]}
              />
            ))}
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}

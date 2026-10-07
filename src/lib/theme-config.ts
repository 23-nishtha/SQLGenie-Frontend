import { Clapperboard, Database, ShoppingBag, Trophy, type LucideIcon } from "lucide-react";
import type { DatasetProfile } from "./api/types";

/**
 * Dataset → theme configuration → CSS variables/classes → whole app UI.
 *
 * Exactly four visual environments exist — no per-component conditionals,
 * no ad-hoc colors outside this file and `src/styles.css`'s
 * `[data-theme="<key>"]` blocks. The actual decorative scenes (the football
 * pitch, the e-commerce floor, the cinema set) live in
 * `src/components/sqlgenie/theme/scenes/`; this file only decides which key
 * applies to a given dataset.
 */
export type VisualThemeKey = "football" | "commerce" | "entertainment" | "default";

export interface ThemeVisual {
  key: VisualThemeKey;
  /** Human-readable identity, shown as a label in the UI. */
  label: string;
  /** Primary icon representing this theme's visual identity. */
  Icon: LucideIcon;
}

const THEME_VISUALS: Record<VisualThemeKey, ThemeVisual> = {
  football: { key: "football", label: "Football Pitch Analytics", Icon: Trophy },
  commerce: { key: "commerce", label: "E-Commerce Operations", Icon: ShoppingBag },
  entertainment: { key: "entertainment", label: "Cinema Analytics", Icon: Clapperboard },
  default: { key: "default", label: "Data Analytics", Icon: Database },
};

/**
 * Resolves a dataset to the visual environment that should drive the whole
 * app's atmosphere.
 *
 * Rule, in order:
 * 1. Any uploaded dataset ALWAYS gets the plain "default" environment —
 *    never Football/E-commerce/Movies — regardless of what theme/domain the
 *    backend reports for it. This is intentional, not a gap: uploads should
 *    read as a clean, generic analytics workspace.
 * 2. A built-in dataset whose backend `theme` matches one of the three
 *    designed environments gets that environment.
 * 3. Everything else (an unrecognized or generic backend theme) falls back
 *    to "default" too.
 */
export function resolveVisualTheme(
  dataset: Pick<DatasetProfile, "theme" | "source"> | null | undefined,
): VisualThemeKey {
  if (!dataset || dataset.source === "uploaded") return "default";
  if (
    dataset.theme === "football" ||
    dataset.theme === "commerce" ||
    dataset.theme === "entertainment"
  ) {
    return dataset.theme;
  }
  return "default";
}

/** The full visual identity (icon + label) for a dataset, or the fallback
 * identity when no dataset is active yet. */
export function themeMeta(
  dataset: Pick<DatasetProfile, "theme" | "source"> | null | undefined,
): ThemeVisual {
  return THEME_VISUALS[resolveVisualTheme(dataset)];
}

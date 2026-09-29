import type { ThemeKey } from "./api/types";

export const THEME_KEYS: ThemeKey[] = [
  "commerce",
  "football",
  "entertainment",
  "finance",
  "property",
  "default",
];

interface ThemeMeta {
  label: string;
  glyph: string;
}

/** Predefined, closed theme configuration. Never generated at runtime. */
const THEMES: Record<ThemeKey, ThemeMeta> = {
  commerce: { label: "E-Commerce", glyph: "🛒" },
  football: { label: "Sports", glyph: "⚽" },
  entertainment: { label: "Entertainment", glyph: "🎬" },
  finance: { label: "Finance", glyph: "📈" },
  property: { label: "Real Estate", glyph: "🏠" },
  default: { label: "Analytics", glyph: "◆" },
};

export function resolveTheme(theme: string | null | undefined): ThemeKey {
  return THEME_KEYS.includes(theme as ThemeKey) ? (theme as ThemeKey) : "default";
}

export function themeMeta(theme: string | null | undefined): ThemeMeta {
  return THEMES[resolveTheme(theme)];
}

import type { ComponentType } from "react";
import type { VisualThemeKey } from "@/lib/theme-config";
import { FootballFieldScene } from "./scenes/FootballFieldScene";
import { EcommerceScene } from "./scenes/EcommerceScene";
import { CinemaScene } from "./scenes/CinemaScene";

/** Maps each visual theme to its decorative scene. "default" (and any
 * uploaded CSV) intentionally has none — a clean, undecorated workspace. */
const SCENES: Record<VisualThemeKey, ComponentType | null> = {
  football: FootballFieldScene,
  commerce: EcommerceScene,
  entertainment: CinemaScene,
  default: null,
};

/**
 * Full-viewport decorative environment for the active dataset theme.
 *
 * Layering (back to front): color wash → the theme's scene (pitch / ops
 * floor / cinema set) → a soft scrim for depth. Fixed and behind all real
 * content (z-index: -1, aria-hidden, pointer-events: none) — every actual
 * panel/card sits on its own semi-opaque, blurred surface on top of this,
 * which is what keeps data fully readable no matter how vivid the scene is.
 */
export function ThemeBackdrop({ theme }: { theme: VisualThemeKey }) {
  const Scene = SCENES[theme];
  return (
    <div className="theme-backdrop" data-theme={theme} aria-hidden="true">
      <span className="theme-backdrop__wash" />
      {Scene && (
        <div className="theme-backdrop__scene">
          <Scene />
        </div>
      )}
      <span className="theme-backdrop__scrim" />
    </div>
  );
}

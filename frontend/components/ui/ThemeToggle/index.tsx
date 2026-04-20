"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "quirk-ui/next";

/**
 * ThemeToggle
 *
 * Renders nothing until mounted — prevents hydration mismatch between
 * server (always "light") and client (actual stored theme).
 * Once mounted, shows Sun (light mode) or Moon (dark mode).
 */
export function ThemeToggle() {
  const { mode, mounted, toggleTheme } = useTheme();

  // Render a placeholder with the same dimensions before mount
  // so layout doesn't shift when the icon appears.
  if (!mounted) {
    return (
      <button
        title="Toggle theme"
        aria-label="Toggle theme"
        style={{ width: 16, height: 16, visibility: "hidden" }}
      />
    );
  }

  return (
    <button
      title="Toggle theme"
      aria-label="Toggle theme"
      onClick={toggleTheme}
    >
      {mode === "dark" ? (
        <Sun size={16} aria-hidden="true" />
      ) : (
        <Moon size={16} aria-hidden="true" />
      )}
    </button>
  );
}

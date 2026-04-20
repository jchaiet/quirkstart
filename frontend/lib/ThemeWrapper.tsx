"use client";
import React from "react";
import { ThemeProvider } from "quirk-ui/core";
import { useTheme } from "quirk-ui/next";
import { lightTheme, darkTheme } from "./theme";

export function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const { mode, mounted } = useTheme();

  // Don't inject CSS variables until mounted — before mount, mode is always
  // "light" (SSR default). If ThemeProvider runs before AppThemeProvider reads
  // the real theme from data-theme, it overwrites the attribute ThemeScript set,
  // causing the theme to revert to light on refresh.
  //
  // After mount, AppThemeProvider has read the real mode from data-theme and
  // ThemeProvider can safely inject the correct theme's CSS variables.
  if (!mounted) return <>{children}</>;

  return (
    <ThemeProvider theme={mode === "light" ? lightTheme : darkTheme}>
      {children}
    </ThemeProvider>
  );
}

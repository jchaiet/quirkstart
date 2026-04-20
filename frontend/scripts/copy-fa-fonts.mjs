/**
 * scripts/copy-fa-fonts.mjs
 *
 * Copies FontAwesome webfonts from node_modules into public/fonts/fontawesome/
 * so they can be referenced via absolute URL in globals.css with font-display: swap.
 *
 * Run manually:    pnpm run copy-fa-fonts
 * Runs automatically on:  pnpm install (via postinstall in package.json)
 */

import { cpSync, mkdirSync } from "fs";
import { join } from "path";

const src = join(
  process.cwd(),
  "node_modules/@fortawesome/fontawesome-free/webfonts",
);
const dest = join(process.cwd(), "public/fonts/fontawesome");

mkdirSync(dest, { recursive: true });
cpSync(src, dest, { recursive: true });

console.log("✓ FontAwesome fonts copied to public/fonts/fontawesome/");

#!/usr/bin/env node
/**
 * scripts/setup.mjs
 *
 * QuirkStart project setup script.
 *
 * Usage:
 *   node scripts/setup.mjs
 *   # or via root package.json: pnpm setup
 *
 * What it does:
 *   1. Prompts for Sanity project ID, dataset, and tokens
 *   2. Generates a SANITY_REVALIDATE_SECRET
 *   3. Writes frontend/.env.local and studio/.env
 *   4. Runs pnpm install in all packages
 */

import { execSync } from "child_process";
import { createInterface } from "readline";
import { writeFileSync, existsSync, readFileSync, rmSync } from "fs";
import { randomBytes } from "crypto";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

// ─── Colours ─────────────────────────────────────────────────────────────────

const c = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  gray: "\x1b[90m",
};

const log = (msg) => console.log(msg);
const success = (msg) => console.log(`${c.green}✓${c.reset} ${msg}`);
const warn = (msg) => console.log(`${c.yellow}⚠${c.reset}  ${msg}`);
const step = (n, msg) =>
  console.log(`\n${c.bold}${c.cyan}[${n}]${c.reset}${c.bold} ${msg}${c.reset}`);
const divider = () => console.log(`${c.gray}${"─".repeat(60)}${c.reset}`);

// ─── Prompt helpers ───────────────────────────────────────────────────────────

const rl = createInterface({ input: process.stdin, output: process.stdout });

function prompt(question, defaultValue = "") {
  const hint = defaultValue ? ` ${c.dim}(${defaultValue})${c.reset}` : "";
  return new Promise((resolve) => {
    rl.question(`  ${question}${hint}: `, (answer) => {
      resolve(answer.trim() || defaultValue);
    });
  });
}

function promptSecret(question) {
  // Use standard readline — raw mode conflicts with pasted input in most terminals.
  // The value is visible while typing, which is acceptable for a local setup script.
  return new Promise((resolve) => {
    rl.question(`  ${question}: `, (answer) => {
      resolve(answer.trim());
    });
  });
}

// ─── Env file writer ──────────────────────────────────────────────────────────
// Reads the .env.example to preserve comments and key ordering,
// then substitutes collected values.

function writeEnvFile(filePath, examplePath, vars) {
  let output;

  if (existsSync(examplePath)) {
    const lines = readFileSync(examplePath, "utf8").split("\n");
    output = lines
      .map((line) => {
        const match = line.match(/^([A-Z_][A-Z0-9_]*)=/);
        if (match && vars[match[1]] !== undefined) {
          return `${match[1]}="${vars[match[1]]}"`;
        }
        return line;
      })
      .join("\n");
  } else {
    output =
      Object.entries(vars)
        .map(([k, v]) => `${k}="${v}"`)
        .join("\n") + "\n";
  }

  writeFileSync(filePath, output, "utf8");
}

// ─── Install helper ───────────────────────────────────────────────────────────

function install(label, cwd) {
  log(`\n  ${c.dim}→ ${label}${c.reset}`);
  try {
    execSync("pnpm install", { cwd, stdio: "inherit" });
    success(`${label} installed`);
  } catch {
    warn(
      `pnpm install failed in ${label} — run manually: cd ${cwd} && pnpm install`,
    );
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.clear();
  divider();
  log(`${c.bold}${c.cyan}  QuirkStart Setup${c.reset}`);
  log(`${c.dim}  Sanity + Next.js boilerplate${c.reset}`);
  divider();
  log(`\nThis script will:`);
  log(`  ${c.dim}•${c.reset} Collect your Sanity project credentials`);
  log(`  ${c.dim}•${c.reset} Generate a secure revalidation secret`);
  log(
    `  ${c.dim}•${c.reset} Write ${c.bold}frontend/.env.local${c.reset} and ${c.bold}studio/.env${c.reset}`,
  );
  log(`  ${c.dim}•${c.reset} Install all dependencies\n`);

  const frontendEnvPath = resolve(ROOT, "frontend/.env.local");
  const frontendExamplePath = resolve(ROOT, "frontend/.env.example");
  const studioEnvPath = resolve(ROOT, "studio/.env");
  const studioExamplePath = resolve(ROOT, "studio/.env.example");

  if (existsSync(frontendEnvPath) || existsSync(studioEnvPath)) {
    warn("Existing env files detected — running setup will overwrite them.");
    const confirm = await prompt("Continue? (yes/no)", "no");
    if (!["yes", "y"].includes(confirm.toLowerCase())) {
      log("\n  Setup cancelled.");
      rl.close();
      process.exit(0);
    }
  }

  // ── Step 1: Sanity credentials ────────────────────────────────────────────
  step(1, "Sanity Project Credentials");
  log(`  ${c.dim}Find these at https://sanity.io/manage${c.reset}\n`);

  const projectId = await prompt("Project ID");
  const dataset = await prompt("Dataset", "production");

  log(`\n  ${c.dim}Create tokens at Manage → API → Tokens${c.reset}`);
  const readToken = await promptSecret("Read-only token (Viewer)");
  const readWriteToken = await promptSecret("Read+Write token (Editor)");

  // ── Step 2: URLs ──────────────────────────────────────────────────────────
  step(2, "URLs");

  const siteUrl = await prompt("Frontend URL", "http://localhost:3000");
  const studioUrl = await prompt("Studio URL", "http://localhost:3333");

  // ── Step 3: Revalidation secret ───────────────────────────────────────────
  step(3, "Revalidation Secret");

  const generated = randomBytes(32).toString("base64");
  log(`  ${c.dim}Auto-generated secure secret:${c.reset}`);
  log(`  ${c.bold}${generated}${c.reset}`);
  log(`  ${c.dim}Copy this into your Sanity webhook secret field.${c.reset}\n`);
  const revalidateSecret = await prompt(
    "Press Enter to use this or paste your own",
    generated,
  );

  // ── Step 4: Email / SMTP (optional) ──────────────────────────────────────
  step(4, "Email / SMTP  (optional — for form submissions)");
  log(`  ${c.dim}Press Enter to skip${c.reset}\n`);

  const smtpHost = await prompt("SMTP Host", "smtp.gmail.com");
  const smtpPort = await prompt("SMTP Port", "587");
  const smtpUser = await prompt("SMTP User (your email address)");
  const smtpPass = smtpUser
    ? await promptSecret("SMTP Password / App Password")
    : "";
  const smtpFrom = smtpUser
    ? await prompt(
        "From address",
        `Forms <noreply@${smtpUser.split("@")[1] ?? "yourdomain.com"}>`,
      )
    : "";

  // ── Write env files ───────────────────────────────────────────────────────
  step(5, "Writing environment files");

  writeEnvFile(frontendEnvPath, frontendExamplePath, {
    NEXT_PUBLIC_SITE_URL: siteUrl,
    NEXT_PUBLIC_SANITY_STUDIO_URL: studioUrl,
    NEXT_PUBLIC_SANITY_PROJECT_ID: projectId,
    NEXT_PUBLIC_SANITY_DATASET: dataset,
    NEXT_PUBLIC_SANITY_BASE_URL: siteUrl,
    SANITY_REVALIDATE_SECRET: revalidateSecret,
    SANITY_STUDIO_PROJECT_ID: projectId,
    SANITY_STUDIO_DATASET: dataset,
    SANITY_API_READ_TOKEN: readToken,
    SANITY_API_READ_WRITE_TOKEN: readWriteToken,
    SMTP_HOST: smtpHost,
    SMTP_PORT: smtpPort,
    SMTP_USER: smtpUser,
    SMTP_PASS: smtpPass,
    SMTP_FROM: smtpFrom,
  });
  success(`frontend/.env.local written`);

  writeEnvFile(studioEnvPath, studioExamplePath, {
    SANITY_STUDIO_PROJECT_ID: projectId,
    SANITY_STUDIO_DATASET: dataset,
    SANITY_STUDIO_API_READ_TOKEN: readToken,
    SANITY_STUDIO_API_READ_WRITE_TOKEN: readWriteToken,
    SANITY_STUDIO_PREVIEW_ORIGIN: siteUrl,
  });
  success(`studio/.env written`);

  // ── Install ───────────────────────────────────────────────────────────────
  step(6, "Installing dependencies");

  const runInstall = await prompt("Run pnpm install now? (yes/no)", "yes");
  if (["yes", "y"].includes(runInstall.toLowerCase())) {
    install("root", ROOT);
    install("frontend", resolve(ROOT, "frontend"));
    install("studio", resolve(ROOT, "studio"));
  } else {
    warn("Skipped — run the following manually:");
    log("    pnpm install");
    log("    cd frontend && pnpm install");
    log("    cd studio && pnpm install");
  }

  // ── Git reinit ────────────────────────────────────────────────────────────────
  step(7, "Resetting git history");

  const gitDir = resolve(ROOT, ".git");
  if (existsSync(gitDir)) {
    try {
      rmSync(gitDir, { recursive: true, force: true });
      execSync('git init && git add -A && git commit -m "Initial commit"', {
        cwd: ROOT,
        stdio: "pipe",
      });
      success("Git history cleared — fresh repo initialized with no remote");
    } catch {
      warn("Could not reinitialize git — do it manually:");
      log(
        "    rm -rf .git && git init && git add -A && git commit -m 'Initial commit'",
      );
    }
  } else {
    warn("No .git directory found — skipping");
  }

  // ── Done ──────────────────────────────────────────────────────────────────
  log("");
  divider();
  log(`\n${c.bold}${c.green}  Setup complete!${c.reset}\n`);
  log(`  Next steps:`);
  log(
    `  ${c.dim}1.${c.reset} Add the revalidation secret to your Sanity webhook`,
  );
  log(
    `     ${c.dim}Manage → API → Webhooks → On-Demand Revalidation → Secret${c.reset}`,
  );
  log(`  ${c.dim}2.${c.reset} Start the project:`);
  log(`     ${c.bold}pnpm dev${c.reset}`);
  log(`\n  ${c.dim}Frontend:${c.reset} ${siteUrl}`);
  log(`  ${c.dim}Studio:${c.reset}   ${studioUrl}\n`);
  divider();

  rl.close();
}

main().catch((err) => {
  console.error(`\n${c.red}Setup failed:${c.reset}`, err.message);
  rl.close();
  process.exit(1);
});

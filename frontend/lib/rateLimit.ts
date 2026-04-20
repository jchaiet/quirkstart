/**
 * lib/rateLimit.ts
 *
 * Shared in-memory rate limiter for API routes.
 *
 * Usage:
 *   const { allowed, retryAfter } = rateLimit(req, { max: 30, windowMs: 60_000 });
 *   if (!allowed) return rateLimitResponse(retryAfter);
 *
 * Note: in-memory store resets on server restart and does not share state
 * across multiple instances. For multi-instance deployments (e.g. Vercel
 * with multiple edge nodes), replace the store with Redis/Upstash:
 *   https://upstash.com/docs/redis/sdks/ratelimit-ts/overview
 */

import { NextRequest, NextResponse } from "next/server";

type RateLimitOptions = {
  /** Maximum requests allowed within the window. */
  max: number;
  /** Window duration in milliseconds. Default: 60_000 (1 minute). */
  windowMs?: number;
  /**
   * Optional key prefix — use to namespace separate limits per route
   * so different routes don't share the same counter for the same IP.
   */
  prefix?: string;
};

type RateLimitResult = {
  allowed: boolean;
  retryAfter?: number;
};

// ─── Store ────────────────────────────────────────────────────────────────────

const store = new Map<string, { count: number; resetAt: number }>();

// Periodically remove expired entries to prevent unbounded memory growth.
setInterval(
  () => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
      if (now > entry.resetAt) store.delete(key);
    }
  },
  // Clean up every 2 minutes
  120_000,
);

// ─── Core function ────────────────────────────────────────────────────────────

export function rateLimit(
  req: NextRequest,
  { max, windowMs = 60_000, prefix = "rl" }: RateLimitOptions,
): RateLimitResult {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  const key = `${prefix}:${ip}`;
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  if (entry.count >= max) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return { allowed: false, retryAfter };
  }

  entry.count++;
  return { allowed: true };
}

// ─── Response helper ──────────────────────────────────────────────────────────

export function rateLimitResponse(retryAfter = 60): NextResponse {
  return NextResponse.json(
    { error: "Too many requests. Please try again shortly." },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfter),
        "X-RateLimit-Limit": "exceeded",
      },
    },
  );
}

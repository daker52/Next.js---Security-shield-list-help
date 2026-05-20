import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

import { getServerEnv } from "@/lib/security/env";

type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
};

const memoryBuckets = new Map<string, { count: number; resetAt: number }>();

function memoryRateLimit(
  identifier: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
  const bucket = memoryBuckets.get(identifier);

  if (!bucket || now > bucket.resetAt) {
    memoryBuckets.set(identifier, { count: 1, resetAt: now + windowMs });
    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: now + windowMs,
    };
  }

  if (bucket.count >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      reset: bucket.resetAt,
    };
  }

  bucket.count += 1;
  return {
    success: true,
    limit,
    remaining: limit - bucket.count,
    reset: bucket.resetAt,
  };
}

let upstashLimiter: Ratelimit | null = null;

function getUpstashLimiter(): Ratelimit | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  if (!upstashLimiter) {
    const env = getServerEnv();
    upstashLimiter = new Ratelimit({
      redis: new Redis({ url, token }),
      limiter: Ratelimit.slidingWindow(
        env.RATE_LIMIT_REQUESTS,
        env.RATE_LIMIT_WINDOW,
      ),
      analytics: true,
    });
  }

  return upstashLimiter;
}

const WINDOW_MS: Record<string, number> = {
  "10 s": 10_000,
  "1 m": 60_000,
  "1 h": 3_600_000,
};

export async function rateLimit(
  identifier: string,
  prefix = "global",
): Promise<RateLimitResult> {
  const key = `${prefix}:${identifier}`;
  const env = getServerEnv();
  const limiter = getUpstashLimiter();

  if (limiter) {
    const result = await limiter.limit(key);
    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
    };
  }

  const windowMs = WINDOW_MS[env.RATE_LIMIT_WINDOW] ?? 60_000;
  return memoryRateLimit(key, env.RATE_LIMIT_REQUESTS, windowMs);
}

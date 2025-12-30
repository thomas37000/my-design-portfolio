import { supabase } from "@/integrations/supabase/client";

interface RateLimitOptions {
  endpoint: string;
  maxRequests?: number;
  windowMinutes?: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  reset_at: string;
  error?: string;
}

/**
 * Check rate limit for the current request
 * @param options - Rate limiting options
 * @returns Rate limit check result
 */
export async function checkRateLimit(options: RateLimitOptions): Promise<RateLimitResult> {
  const { endpoint, maxRequests = 100, windowMinutes = 1 } = options;

  try {
    const { data, error } = await supabase.functions.invoke("rate-limiter", {
      body: {
        endpoint,
        max_requests: maxRequests,
        window_minutes: windowMinutes,
      },
    });

    if (error) {
      console.error("Rate limit check failed:", error);
      // Fail open - allow request if rate limiter is down
      return { allowed: true, remaining: maxRequests, reset_at: "" };
    }

    return data as RateLimitResult;
  } catch (err) {
    console.error("Rate limit error:", err);
    // Fail open - allow request if rate limiter is down
    return { allowed: true, remaining: maxRequests, reset_at: "" };
  }
}

/**
 * Middleware wrapper for rate limiting
 * @param endpoint - The endpoint name to rate limit
 * @param callback - The function to execute if rate limit allows
 * @param options - Additional rate limit options
 */
export async function withRateLimit<T>(
  endpoint: string,
  callback: () => Promise<T>,
  options?: Omit<RateLimitOptions, "endpoint">
): Promise<T | { error: string; retryAfter: string }> {
  const result = await checkRateLimit({ endpoint, ...options });

  if (!result.allowed) {
    return {
      error: "Too many requests. Please try again later.",
      retryAfter: result.reset_at,
    };
  }

  return callback();
}

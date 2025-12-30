import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  reset_at: string;
}

interface RateLimitRequest {
  endpoint: string;
  max_requests?: number;
  window_minutes?: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get client IP from headers
    const forwardedFor = req.headers.get("x-forwarded-for");
    const realIp = req.headers.get("x-real-ip");
    const clientIp = forwardedFor?.split(",")[0]?.trim() || realIp || "unknown";

    console.log(`Rate limit check for IP: ${clientIp}`);

    // Parse request body
    const { endpoint, max_requests = 100, window_minutes = 1 }: RateLimitRequest = await req.json();

    if (!endpoint) {
      return new Response(
        JSON.stringify({ error: "Endpoint is required" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Create Supabase client with service role for database access
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Call the rate limit check function
    const { data, error } = await supabase.rpc("check_rate_limit", {
      p_ip_address: clientIp,
      p_endpoint: endpoint,
      p_max_requests: max_requests,
      p_window_minutes: window_minutes,
    });

    if (error) {
      console.error("Rate limit check error:", error);
      throw error;
    }

    const result = data[0] as RateLimitResult;

    console.log(`Rate limit result for ${clientIp} on ${endpoint}:`, result);

    // Return rate limit info with appropriate headers
    const responseHeaders = {
      ...corsHeaders,
      "Content-Type": "application/json",
      "X-RateLimit-Limit": max_requests.toString(),
      "X-RateLimit-Remaining": result.remaining.toString(),
      "X-RateLimit-Reset": result.reset_at,
    };

    if (!result.allowed) {
      return new Response(
        JSON.stringify({
          error: "Too many requests",
          message: `Rate limit exceeded. Try again after ${result.reset_at}`,
          retry_after: result.reset_at,
        }),
        { 
          status: 429, 
          headers: responseHeaders 
        }
      );
    }

    return new Response(
      JSON.stringify({
        allowed: true,
        remaining: result.remaining,
        reset_at: result.reset_at,
      }),
      { 
        status: 200, 
        headers: responseHeaders 
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Rate limiter error:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});

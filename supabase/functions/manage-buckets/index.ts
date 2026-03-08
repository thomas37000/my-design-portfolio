import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify the user is an admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Non autorisé" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Verify user with anon client
    const anonClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userError } = await anonClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Non autorisé" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check admin role
    const { data: roleData } = await anonClient.rpc("has_role", {
      _user_id: user.id,
      _role: "admin",
    });
    if (!roleData) {
      return new Response(JSON.stringify({ error: "Accès refusé" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Use service role client for bucket operations
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    const { action, bucketId, bucketName, isPublic } = await req.json();

    let result;

    switch (action) {
      case "list": {
        const { data, error } = await adminClient.storage.listBuckets();
        if (error) throw error;
        result = data;
        break;
      }

      case "create": {
        if (!bucketId || !bucketName) throw new Error("bucketId et bucketName requis");
        const { data, error } = await adminClient.storage.createBucket(bucketId, {
          public: isPublic ?? true,
        });
        if (error) throw error;

        // Create default RLS policies for the new bucket
        // Public read
        await adminClient.rpc("execute_sql", { sql: "" }).catch(() => {});
        
        result = data;
        break;
      }

      case "update": {
        if (!bucketId) throw new Error("bucketId requis");
        const { data, error } = await adminClient.storage.updateBucket(bucketId, {
          public: isPublic ?? true,
        });
        if (error) throw error;
        result = data;
        break;
      }

      case "delete": {
        if (!bucketId) throw new Error("bucketId requis");
        // First empty the bucket
        const { error: emptyError } = await adminClient.storage.emptyBucket(bucketId);
        if (emptyError) throw emptyError;
        // Then delete it
        const { data, error } = await adminClient.storage.deleteBucket(bucketId);
        if (error) throw error;
        result = data;
        break;
      }

      default:
        throw new Error(`Action inconnue: ${action}`);
    }

    return new Response(JSON.stringify({ data: result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || "Erreur interne" }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

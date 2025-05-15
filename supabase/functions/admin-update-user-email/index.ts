import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

// Use service role key (from env)
const supabaseAdmin = createClient(
  Deno.env.get("project_url")!,
  Deno.env.get("service_role_key")!
);

serve(async (req) => {
  const origin = req.headers.get("origin") || "";

  // FINAL FIX: Handle preflight CORS request IMMEDIATELY
  if (req.method === "OPTIONS") {
    return corsResponse("", 204, origin);
  }

  // Only allow POST
  if (req.method !== "POST") {
    return corsResponse("Method Not Allowed", 405, origin);
  }

  // Parse body
  let userId: string | undefined;
  let newEmail: string | undefined;
  try {
    const body = await req.json();
    userId = body.userId;
    newEmail = body.newEmail;
  } catch {
    return corsResponse("Invalid JSON body", 400, origin);
  }

  if (!userId || !newEmail) {
    return corsResponse("Missing userId or newEmail", 400, origin);
  }

  // Use service role key (from env) INSIDE the handler
  const supabaseAdmin = createClient(
    Deno.env.get("project_url")!,
    Deno.env.get("service_role_key")!
  );

  // Update user email in Supabase Auth
  const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
    userId,
    {
      email: newEmail,
    }
  );

  if (error) {
    return corsResponse(JSON.stringify({ error: error.message }), 400, origin);
  }

  return corsResponse(JSON.stringify({ data }), 200, origin);
});

serve(async (req) => {
  const origin = req.headers.get("origin") || "";

  // Debug: Log env vars
  console.log("project_url:", Deno.env.get("project_url"));
  console.log("service_role_key:", Deno.env.get("service_role_key"));

  // Handle preflight CORS request IMMEDIATELY
  if (req.method === "OPTIONS") {
    return corsResponse("", 204, origin);
  }

  // ... existing code ...
});

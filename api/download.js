import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { url, name } = req.query;
  if (!url || !name) {
    res.status(400).json({ error: "Missing url or name parameter" });
    return;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      res
        .status(response.status)
        .json({ error: "Failed to fetch file from storage" });
      return;
    }
    const safeName = String(name).replace(/[^a-zA-Z0-9._-]/g, "_");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=\"${safeName}\"`
    );
    res.setHeader(
      "Content-Type",
      response.headers.get("content-type") || "application/octet-stream"
    );
    response.body.pipe(res);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

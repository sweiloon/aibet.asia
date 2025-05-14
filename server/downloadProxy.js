import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/download", async (req, res) => {
  const { url, name } = req.query;
  if (!url || !name) {
    res.status(400).json({ error: "Missing url or name parameter" });
    return;
  }
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(
        "Failed to fetch file:",
        response.status,
        response.statusText,
        url
      );
      res
        .status(response.status)
        .json({ error: "Failed to fetch file from storage" });
      return;
    }
    // Sanitize filename for Content-Disposition header
    const safeName = String(name).replace(/[^a-zA-Z0-9._-]/g, "_");
    res.setHeader("Content-Disposition", `attachment; filename="${safeName}"`);
    res.setHeader(
      "Content-Type",
      response.headers.get("content-type") || "application/octet-stream"
    );
    response.body.pipe(res);
  } catch (error) {
    console.error("Download proxy error:", error, url);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Download proxy server running on port ${PORT}`);
});

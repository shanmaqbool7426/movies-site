import { Router } from "express";
import * as tmdb from "../lib/tmdb";

const router = Router();

router.get("/search", async (req, res) => {
  try {
    const query = String(req.query["query"] ?? "");
    if (!query.trim()) {
      return res.json({ results: [], page: 1, total_pages: 0, total_results: 0 });
    }
    const page = Number(req.query["page"]) || 1;
    const data = await tmdb.searchMulti(query, page);
    return res.json(data);
  } catch (err) {
    req.log.error({ err }, "searchMulti failed");
    return res.status(500).json({ error: "Search failed" });
  }
});

export default router;

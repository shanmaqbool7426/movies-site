import { Router } from "express";
import * as tmdb from "../lib/tmdb";

const router = Router();

router.get("/discover/movies", async (req, res) => {
  try {
    const data = await tmdb.discoverMovies({
      genre: req.query["genre"] as string | undefined,
      year: req.query["year"] ? Number(req.query["year"]) : undefined,
      sort_by: req.query["sort_by"] as string | undefined,
      page: Number(req.query["page"]) || 1,
      language: req.query["language"] as string | undefined,
    });
    res.json(data);
  } catch (err) {
    req.log.error({ err }, "discoverMovies failed");
    res.status(500).json({ error: "Failed to discover movies" });
  }
});

router.get("/discover/tv", async (req, res) => {
  try {
    const data = await tmdb.discoverTv({
      genre: req.query["genre"] as string | undefined,
      year: req.query["year"] ? Number(req.query["year"]) : undefined,
      sort_by: req.query["sort_by"] as string | undefined,
      page: Number(req.query["page"]) || 1,
    });
    res.json(data);
  } catch (err) {
    req.log.error({ err }, "discoverTv failed");
    res.status(500).json({ error: "Failed to discover TV shows" });
  }
});

export default router;

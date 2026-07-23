import { Router } from "express";
import * as tmdb from "../lib/tmdb";

const router = Router();

router.get("/genres/movies", async (req, res) => {
  try {
    const data = await tmdb.getMovieGenres();
    res.json(data);
  } catch (err) {
    req.log.error({ err }, "getMovieGenres failed");
    res.status(500).json({ error: "Failed to fetch movie genres" });
  }
});

router.get("/genres/tv", async (req, res) => {
  try {
    const data = await tmdb.getTvGenres();
    res.json(data);
  } catch (err) {
    req.log.error({ err }, "getTvGenres failed");
    res.status(500).json({ error: "Failed to fetch TV genres" });
  }
});

export default router;

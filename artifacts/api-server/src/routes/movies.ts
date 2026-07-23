import { Router } from "express";
import * as tmdb from "../lib/tmdb";

const router = Router();

router.get("/movies/trending", async (req, res) => {
  try {
    const page = Number(req.query["page"]) || 1;
    const data = await tmdb.getTrendingMovies(page);
    res.json(data);
  } catch (err) {
    req.log.error({ err }, "getTrendingMovies failed");
    res.status(500).json({ error: "Failed to fetch trending movies" });
  }
});

router.get("/movies/popular", async (req, res) => {
  try {
    const page = Number(req.query["page"]) || 1;
    const data = await tmdb.getPopularMovies(page);
    res.json(data);
  } catch (err) {
    req.log.error({ err }, "getPopularMovies failed");
    res.status(500).json({ error: "Failed to fetch popular movies" });
  }
});

router.get("/movies/top-rated", async (req, res) => {
  try {
    const page = Number(req.query["page"]) || 1;
    const data = await tmdb.getTopRatedMovies(page);
    res.json(data);
  } catch (err) {
    req.log.error({ err }, "getTopRatedMovies failed");
    res.status(500).json({ error: "Failed to fetch top-rated movies" });
  }
});

router.get("/movies/now-playing", async (req, res) => {
  try {
    const page = Number(req.query["page"]) || 1;
    const data = await tmdb.getNowPlayingMovies(page);
    res.json(data);
  } catch (err) {
    req.log.error({ err }, "getNowPlayingMovies failed");
    res.status(500).json({ error: "Failed to fetch now-playing movies" });
  }
});

router.get("/movies/:id/similar", async (req, res) => {
  try {
    const id = Number(req.params["id"]);
    const page = Number(req.query["page"]) || 1;
    const data = await tmdb.getSimilarMovies(id, page);
    res.json(data);
  } catch (err) {
    req.log.error({ err }, "getSimilarMovies failed");
    res.status(500).json({ error: "Failed to fetch similar movies" });
  }
});

router.get("/movies/:id", async (req, res) => {
  try {
    const id = Number(req.params["id"]);
    const raw = await tmdb.getMovieDetails(id);
    const data = tmdb.normalizeMovieDetails(raw);
    res.json(data);
  } catch (err) {
    req.log.error({ err }, "getMovieDetails failed");
    res.status(500).json({ error: "Failed to fetch movie details" });
  }
});

export default router;

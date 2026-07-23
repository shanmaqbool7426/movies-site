import { Router } from "express";
import * as tmdb from "../lib/tmdb";

const router = Router();

router.get("/tv/trending", async (req, res) => {
  try {
    const page = Number(req.query["page"]) || 1;
    const data = await tmdb.getTrendingTv(page);
    res.json(data);
  } catch (err) {
    req.log.error({ err }, "getTrendingTv failed");
    res.status(500).json({ error: "Failed to fetch trending TV" });
  }
});

router.get("/tv/popular", async (req, res) => {
  try {
    const page = Number(req.query["page"]) || 1;
    const data = await tmdb.getPopularTv(page);
    res.json(data);
  } catch (err) {
    req.log.error({ err }, "getPopularTv failed");
    res.status(500).json({ error: "Failed to fetch popular TV" });
  }
});

router.get("/tv/top-rated", async (req, res) => {
  try {
    const page = Number(req.query["page"]) || 1;
    const data = await tmdb.getTopRatedTv(page);
    res.json(data);
  } catch (err) {
    req.log.error({ err }, "getTopRatedTv failed");
    res.status(500).json({ error: "Failed to fetch top-rated TV" });
  }
});

router.get("/tv/:id/season/:season", async (req, res) => {
  try {
    const id = Number(req.params["id"]);
    const season = Number(req.params["season"]);
    const data = await tmdb.getTvSeason(id, season);
    res.json(data);
  } catch (err) {
    req.log.error({ err }, "getTvSeason failed");
    res.status(500).json({ error: "Failed to fetch season details" });
  }
});

router.get("/tv/:id/similar", async (req, res) => {
  try {
    const id = Number(req.params["id"]);
    const page = Number(req.query["page"]) || 1;
    const data = await tmdb.getSimilarTv(id, page);
    res.json(data);
  } catch (err) {
    req.log.error({ err }, "getSimilarTv failed");
    res.status(500).json({ error: "Failed to fetch similar TV" });
  }
});

router.get("/tv/:id", async (req, res) => {
  try {
    const id = Number(req.params["id"]);
    const raw = await tmdb.getTvDetails(id);
    const data = tmdb.normalizeTvDetails(raw);
    res.json(data);
  } catch (err) {
    req.log.error({ err }, "getTvDetails failed");
    res.status(500).json({ error: "Failed to fetch TV details" });
  }
});

export default router;

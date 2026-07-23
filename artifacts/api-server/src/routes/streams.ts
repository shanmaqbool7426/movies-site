import { Router } from "express";

const router = Router();

function buildMovieSources(tmdbId: number) {
  return {
    tmdb_id: tmdbId,
    sources: [
      {
        name: "VidSrc",
        url: `https://vidsrc.to/embed/movie/${tmdbId}`,
        server_id: 1,
      },
      {
        name: "SuperEmbed",
        url: `https://multiembed.mov/directstream.php?video_id=${tmdbId}&tmdb=1`,
        server_id: 2,
      },
      {
        name: "AutoEmbed",
        url: `https://autoembed.cc/embed/movie/${tmdbId}`,
        server_id: 3,
      },
      {
        name: "2Embed",
        url: `https://www.2embed.cc/embed/${tmdbId}`,
        server_id: 4,
      },
    ],
  };
}

function buildTvSources(tmdbId: number, season: number, episode: number) {
  return {
    tmdb_id: tmdbId,
    sources: [
      {
        name: "VidSrc",
        url: `https://vidsrc.to/embed/tv/${tmdbId}/${season}/${episode}`,
        server_id: 1,
      },
      {
        name: "SuperEmbed",
        url: `https://multiembed.mov/directstream.php?video_id=${tmdbId}&tmdb=1&s=${season}&e=${episode}`,
        server_id: 2,
      },
      {
        name: "AutoEmbed",
        url: `https://autoembed.cc/embed/tv/${tmdbId}-${season}-${episode}`,
        server_id: 3,
      },
      {
        name: "2Embed",
        url: `https://www.2embed.cc/embedtv/${tmdbId}&s=${season}&e=${episode}`,
        server_id: 4,
      },
    ],
  };
}

router.get("/streams/movie/:id", (req, res) => {
  const id = Number(req.params["id"]);
  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "Invalid movie ID" });
  }
  return res.json(buildMovieSources(id));
});

router.get("/streams/tv/:id/:season/:episode", (req, res) => {
  const id = Number(req.params["id"]);
  const season = Number(req.params["season"]);
  const episode = Number(req.params["episode"]);
  if (!id || isNaN(id) || isNaN(season) || isNaN(episode)) {
    return res.status(400).json({ error: "Invalid parameters" });
  }
  return res.json(buildTvSources(id, season, episode));
});

export default router;

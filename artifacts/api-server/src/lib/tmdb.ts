import NodeCache from "node-cache";
import { logger } from "./logger";

const TMDB_BASE = "https://api.themoviedb.org/3";
const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 }); // 5 min TTL

function getApiKey(): string {
  const key = process.env["TMDB_API_KEY"];
  if (!key) {
    throw new Error("TMDB_API_KEY environment variable is not set");
  }
  return key;
}

async function tmdbFetch<T>(path: string, params: Record<string, string | number | boolean> = {}): Promise<T> {
  const cacheKey = path + JSON.stringify(params);
  const cached = cache.get<T>(cacheKey);
  if (cached !== undefined) {
    return cached;
  }

  const apiKey = getApiKey();
  const url = new URL(`${TMDB_BASE}${path}`);
  url.searchParams.set("api_key", apiKey);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, String(v));
  }

  const res = await fetch(url.toString());
  if (!res.ok) {
    logger.error({ status: res.status, path }, "TMDB API error");
    throw new Error(`TMDB error ${res.status}: ${res.statusText}`);
  }

  const data = (await res.json()) as T;
  cache.set(cacheKey, data);
  return data;
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface TmdbMediaItem {
  id: number;
  title?: string;
  name?: string;
  overview?: string;
  poster_path?: string;
  backdrop_path?: string;
  vote_average: number;
  vote_count: number;
  release_date?: string;
  first_air_date?: string;
  media_type?: string;
  genre_ids?: number[];
  popularity: number;
  original_language?: string;
}

interface TmdbPage {
  results: TmdbMediaItem[];
  page: number;
  total_pages: number;
  total_results: number;
}

interface TmdbGenre {
  id: number;
  name: string;
}

interface TmdbCastMember {
  id: number;
  name: string;
  character?: string;
  profile_path?: string;
  order: number;
}

interface TmdbVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

interface TmdbCredits {
  cast: TmdbCastMember[];
  crew: Array<{ id: number; name: string; job: string }>;
}

interface TmdbVideos {
  results: TmdbVideo[];
}

interface TmdbMovieDetails {
  id: number;
  title: string;
  tagline?: string;
  overview?: string;
  poster_path?: string;
  backdrop_path?: string;
  release_date?: string;
  runtime?: number;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genres: TmdbGenre[];
  original_language?: string;
  status?: string;
  budget?: number;
  revenue?: number;
  imdb_id?: string;
  credits?: TmdbCredits;
  videos?: TmdbVideos;
}

interface TmdbSeason {
  id: number;
  season_number: number;
  name: string;
  episode_count: number;
  air_date?: string;
  poster_path?: string;
  overview?: string;
}

interface TmdbTvDetails {
  id: number;
  name: string;
  tagline?: string;
  overview?: string;
  poster_path?: string;
  backdrop_path?: string;
  first_air_date?: string;
  last_air_date?: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genres: TmdbGenre[];
  original_language?: string;
  status?: string;
  number_of_seasons: number;
  number_of_episodes: number;
  seasons: TmdbSeason[];
  credits?: TmdbCredits;
  videos?: TmdbVideos;
}

interface TmdbEpisode {
  id: number;
  episode_number: number;
  name: string;
  overview?: string;
  air_date?: string;
  still_path?: string;
  vote_average: number;
  runtime?: number;
}

interface TmdbSeasonDetails {
  id: number;
  season_number: number;
  name: string;
  overview?: string;
  air_date?: string;
  poster_path?: string;
  episodes: TmdbEpisode[];
}

// ─── Service Functions ─────────────────────────────────────────────────────────

export async function getTrendingMovies(page = 1): Promise<TmdbPage> {
  return tmdbFetch<TmdbPage>("/trending/movie/week", { page });
}

export async function getPopularMovies(page = 1): Promise<TmdbPage> {
  return tmdbFetch<TmdbPage>("/movie/popular", { page });
}

export async function getTopRatedMovies(page = 1): Promise<TmdbPage> {
  return tmdbFetch<TmdbPage>("/movie/top_rated", { page });
}

export async function getNowPlayingMovies(page = 1): Promise<TmdbPage> {
  return tmdbFetch<TmdbPage>("/movie/now_playing", { page });
}

export async function getMovieDetails(id: number): Promise<TmdbMovieDetails> {
  return tmdbFetch<TmdbMovieDetails>(`/movie/${id}`, {
    append_to_response: "credits,videos",
  });
}

export async function getSimilarMovies(id: number, page = 1): Promise<TmdbPage> {
  return tmdbFetch<TmdbPage>(`/movie/${id}/similar`, { page });
}

export async function getTrendingTv(page = 1): Promise<TmdbPage> {
  return tmdbFetch<TmdbPage>("/trending/tv/week", { page });
}

export async function getPopularTv(page = 1): Promise<TmdbPage> {
  return tmdbFetch<TmdbPage>("/tv/popular", { page });
}

export async function getTopRatedTv(page = 1): Promise<TmdbPage> {
  return tmdbFetch<TmdbPage>("/tv/top_rated", { page });
}

export async function getTvDetails(id: number): Promise<TmdbTvDetails> {
  return tmdbFetch<TmdbTvDetails>(`/tv/${id}`, {
    append_to_response: "credits,videos",
  });
}

export async function getSimilarTv(id: number, page = 1): Promise<TmdbPage> {
  return tmdbFetch<TmdbPage>(`/tv/${id}/similar`, { page });
}

export async function getTvSeason(id: number, season: number): Promise<TmdbSeasonDetails> {
  return tmdbFetch<TmdbSeasonDetails>(`/tv/${id}/season/${season}`);
}

export async function searchMulti(query: string, page = 1): Promise<TmdbPage> {
  return tmdbFetch<TmdbPage>("/search/multi", { query, page });
}

export async function getMovieGenres(): Promise<{ genres: TmdbGenre[] }> {
  return tmdbFetch<{ genres: TmdbGenre[] }>("/genre/movie/list");
}

export async function getTvGenres(): Promise<{ genres: TmdbGenre[] }> {
  return tmdbFetch<{ genres: TmdbGenre[] }>("/genre/tv/list");
}

export async function discoverMovies(params: {
  genre?: string;
  year?: number;
  sort_by?: string;
  page?: number;
  language?: string;
}): Promise<TmdbPage> {
  const query: Record<string, string | number> = {
    page: params.page ?? 1,
    sort_by: params.sort_by ?? "popularity.desc",
  };
  if (params.genre) query["with_genres"] = params.genre;
  if (params.year) query["primary_release_year"] = params.year;
  if (params.language) query["with_original_language"] = params.language;
  return tmdbFetch<TmdbPage>("/discover/movie", query);
}

export async function discoverTv(params: {
  genre?: string;
  year?: number;
  sort_by?: string;
  page?: number;
}): Promise<TmdbPage> {
  const query: Record<string, string | number> = {
    page: params.page ?? 1,
    sort_by: params.sort_by ?? "popularity.desc",
  };
  if (params.genre) query["with_genres"] = params.genre;
  if (params.year) query["first_air_date_year"] = params.year;
  return tmdbFetch<TmdbPage>("/discover/tv", query);
}

// ─── Shape normalizers ────────────────────────────────────────────────────────

export function normalizeMovieDetails(raw: TmdbMovieDetails) {
  const director = raw.credits?.crew.find((c) => c.job === "Director")?.name ?? null;
  const cast = (raw.credits?.cast ?? []).slice(0, 15).map((c) => ({
    id: c.id,
    name: c.name,
    character: c.character ?? null,
    profile_path: c.profile_path ?? null,
    order: c.order,
  }));
  const videos = (raw.videos?.results ?? []).filter((v) => v.site === "YouTube");
  return {
    id: raw.id,
    title: raw.title,
    tagline: raw.tagline ?? null,
    overview: raw.overview ?? null,
    poster_path: raw.poster_path ?? null,
    backdrop_path: raw.backdrop_path ?? null,
    release_date: raw.release_date ?? null,
    runtime: raw.runtime ?? null,
    vote_average: raw.vote_average,
    vote_count: raw.vote_count,
    popularity: raw.popularity,
    genres: raw.genres,
    original_language: raw.original_language ?? null,
    status: raw.status ?? null,
    budget: raw.budget ?? null,
    revenue: raw.revenue ?? null,
    imdb_id: raw.imdb_id ?? null,
    cast,
    director,
    videos,
  };
}

export function normalizeTvDetails(raw: TmdbTvDetails) {
  const cast = (raw.credits?.cast ?? []).slice(0, 15).map((c) => ({
    id: c.id,
    name: c.name,
    character: c.character ?? null,
    profile_path: c.profile_path ?? null,
    order: c.order,
  }));
  const videos = (raw.videos?.results ?? []).filter((v) => v.site === "YouTube");
  return {
    id: raw.id,
    name: raw.name,
    tagline: raw.tagline ?? null,
    overview: raw.overview ?? null,
    poster_path: raw.poster_path ?? null,
    backdrop_path: raw.backdrop_path ?? null,
    first_air_date: raw.first_air_date ?? null,
    last_air_date: raw.last_air_date ?? null,
    vote_average: raw.vote_average,
    vote_count: raw.vote_count,
    popularity: raw.popularity,
    genres: raw.genres,
    original_language: raw.original_language ?? null,
    status: raw.status ?? null,
    number_of_seasons: raw.number_of_seasons,
    number_of_episodes: raw.number_of_episodes,
    seasons: raw.seasons.filter((s) => s.season_number > 0),
    cast,
    videos,
  };
}

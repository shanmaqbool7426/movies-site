import React, { useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { HeroCarousel } from '@/components/ui/HeroCarousel';
import { MediaSection } from '@/components/MediaSection';
import { AdSlot } from '@/components/ui/AdSlot';
import { 
  useGetTrendingMovies, 
  useGetTrendingTv, 
  useGetTopRatedMovies, 
  useGetNowPlayingMovies 
} from '@workspace/api-client-react';

export default function Home() {
  const { data: trendingMovies, isLoading: isTrendingMoviesLoading } = useGetTrendingMovies({ page: 1 });
  const { data: trendingTv, isLoading: isTrendingTvLoading } = useGetTrendingTv({ page: 1 });
  const { data: topRated, isLoading: isTopRatedLoading } = useGetTopRatedMovies({ page: 1 });
  const { data: nowPlaying, isLoading: isNowPlayingLoading } = useGetNowPlayingMovies({ page: 1 });

  useEffect(() => {
    document.title = "StreamFlix | Premium Movies & TV Shows";
  }, []);

  return (
    <Layout>
      <HeroCarousel items={trendingMovies?.results} isLoading={isTrendingMoviesLoading} />
      
      <div className="container mx-auto px-4 py-6">
        <AdSlot type="banner" className="my-4" />
      </div>

      <MediaSection 
        title="Trending Movies" 
        items={trendingMovies?.results} 
        isLoading={isTrendingMoviesLoading}
        viewAllLink="/discover?tab=movie&sort_by=popularity.desc"
        type="movie"
      />
      
      <MediaSection 
        title="Trending TV Shows" 
        items={trendingTv?.results} 
        isLoading={isTrendingTvLoading}
        viewAllLink="/discover?tab=tv&sort_by=popularity.desc"
        type="tv"
        className="bg-white/[0.02]"
      />

      <div className="container mx-auto px-4 py-6">
        <AdSlot type="native" className="my-2 max-w-4xl mx-auto" />
      </div>
      
      <MediaSection 
        title="Top Rated Movies" 
        items={topRated?.results} 
        isLoading={isTopRatedLoading}
        viewAllLink="/discover?tab=movie&sort_by=vote_average.desc"
        type="movie"
      />
      
      <MediaSection 
        title="Now Playing in Theaters" 
        items={nowPlaying?.results} 
        isLoading={isNowPlayingLoading}
        viewAllLink="/discover?tab=movie&sort_by=release_date.desc"
        type="movie"
        className="bg-white/[0.02] pb-16"
      />
    </Layout>
  );
}

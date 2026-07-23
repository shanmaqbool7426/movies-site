import React, { useEffect } from 'react';
import { useParams } from 'wouter';
import { 
  useGetMovieDetails, 
  useGetMovieStreams, 
  useGetSimilarMovies 
} from '@workspace/api-client-react';
import { Layout } from '@/components/Layout';
import { Player } from '@/components/ui/Player';
import { MediaSection } from '@/components/MediaSection';
import { Skeleton } from '@/components/ui/Skeleton';
import { AdSlot } from '@/components/ui/AdSlot';
import { Star, Clock, Calendar, Film } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MovieDetail() {
  const { id } = useParams<{ id: string }>();
  const movieId = parseInt(id || '0', 10);

  const { data: movie, isLoading: isMovieLoading } = useGetMovieDetails(movieId, {
    query: { enabled: movieId > 0 }
  });

  const { data: streams, isLoading: isStreamsLoading } = useGetMovieStreams(movieId, {
    query: { enabled: movieId > 0 }
  });

  const { data: similarMovies, isLoading: isSimilarLoading } = useGetSimilarMovies(movieId, {
    query: { enabled: movieId > 0 }
  });

  useEffect(() => {
    if (movie) {
      document.title = `${movie.title} (${movie.release_date?.substring(0, 4) || ''}) Watch Online Free | StreamFlix`;
    }
  }, [movie]);

  if (isMovieLoading) {
    return (
      <Layout>
        <div className="w-full h-[60vh] bg-card relative">
          <Skeleton className="w-full h-full" />
        </div>
        <div className="container mx-auto px-4 -mt-32 relative z-10">
          <div className="flex flex-col md:flex-row gap-8">
            <Skeleton className="w-64 h-96 rounded-xl shrink-0" />
            <div className="flex-1 space-y-4 pt-8">
              <Skeleton className="w-3/4 h-12" />
              <Skeleton className="w-1/2 h-6" />
              <Skeleton className="w-full h-32" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!movie) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-32 text-center text-muted-foreground">
          <Film className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <h2 className="text-2xl font-bold text-white mb-2">Movie Not Found</h2>
          <p>The movie you're looking for doesn't exist or has been removed.</p>
        </div>
      </Layout>
    );
  }

  const director = movie.cast?.find(c => c.order === 0 && c.character === null)?.name || movie.director || 'Unknown';
  const topCast = movie.cast?.slice(0, 5) || [];
  const year = movie.release_date?.substring(0, 4);

  return (
    <Layout>
      {/* Full Bleed Backdrop Header */}
      <div className="relative w-full h-[50vh] md:h-[60vh] bg-background">
        <div className="absolute inset-0">
          {movie.backdrop_path ? (
            <img
              src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
              alt={movie.title}
              className="w-full h-full object-cover opacity-30"
            />
          ) : (
            <div className="w-full h-full bg-slate-900" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 -mt-40 md:-mt-64 relative z-10 pb-12">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          
          {/* Poster */}
          <div className="w-48 md:w-64 lg:w-72 shrink-0 mx-auto md:mx-0">
            <div className="rounded-xl overflow-hidden shadow-2xl border border-white/10 aspect-[2/3] bg-card">
              {movie.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted/20">
                  <Film className="w-12 h-12 text-muted-foreground opacity-30" />
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 flex flex-col justify-end pb-4 pt-4 md:pt-0">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              {movie.vote_average > 0 && (
                <span className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 rounded text-sm font-bold shadow-lg",
                  movie.vote_average >= 7.5 ? "bg-emerald-500/90 text-white" : "bg-primary text-white"
                )}>
                  <Star className="w-4 h-4 fill-current" />
                  {movie.vote_average.toFixed(1)}
                </span>
              )}
              {year && (
                <span className="flex items-center gap-1.5 text-sm text-slate-300 bg-white/5 border border-white/10 px-2.5 py-1 rounded">
                  <Calendar className="w-4 h-4" /> {year}
                </span>
              )}
              {movie.runtime && movie.runtime > 0 && (
                <span className="flex items-center gap-1.5 text-sm text-slate-300 bg-white/5 border border-white/10 px-2.5 py-1 rounded">
                  <Clock className="w-4 h-4" /> {movie.runtime} min
                </span>
              )}
              <span className="uppercase text-xs tracking-widest text-slate-400 border border-slate-700 px-2 py-1 rounded">
                Movie
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-2 tracking-tight drop-shadow-lg">
              {movie.title}
            </h1>
            
            {movie.tagline && (
              <p className="text-lg text-primary italic mb-6 drop-shadow-md">
                "{movie.tagline}"
              </p>
            )}

            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genres?.map(g => (
                <span key={g.id} className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm text-slate-300 transition-colors">
                  {g.name}
                </span>
              ))}
            </div>

            <div className="max-w-4xl text-slate-300 leading-relaxed mb-8">
              <p className="text-lg">{movie.overview}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl">
              <div>
                <span className="text-muted-foreground text-sm block mb-1">Director</span>
                <span className="text-white font-medium">{director}</span>
              </div>
              {topCast.length > 0 && (
                <div>
                  <span className="text-muted-foreground text-sm block mb-1">Top Cast</span>
                  <span className="text-white font-medium leading-snug">
                    {topCast.map(c => c.name).join(', ')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <AdSlot type="banner" className="mb-12" />
        
        {/* Player Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-primary rounded-full"></span>
            Watch {movie.title}
          </h2>
          
          {isStreamsLoading ? (
            <Skeleton className="w-full aspect-video rounded-xl bg-card" />
          ) : streams ? (
            <Player streams={streams} title={movie.title} />
          ) : (
            <div className="w-full aspect-video bg-card rounded-xl border border-white/10 flex items-center justify-center text-muted-foreground">
              No streams available at the moment.
            </div>
          )}
        </div>

        <AdSlot type="native" className="mb-12 max-w-4xl mx-auto" />

        {/* Similar Movies */}
        <MediaSection 
          title="Similar Movies" 
          items={similarMovies?.results} 
          isLoading={isSimilarLoading}
          type="movie"
        />
      </div>
    </Layout>
  );
}

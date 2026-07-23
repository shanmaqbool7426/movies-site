import React, { useEffect, useState } from 'react';
import { useParams } from 'wouter';
import { 
  useGetTvDetails, 
  useGetTvStreams, 
  useGetSimilarTv,
  useGetTvSeason 
} from '@workspace/api-client-react';
import { Layout } from '@/components/Layout';
import { Player } from '@/components/ui/Player';
import { MediaSection } from '@/components/MediaSection';
import { Skeleton } from '@/components/ui/Skeleton';
import { AdSlot } from '@/components/ui/AdSlot';
import { Star, Clock, Calendar, Tv } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TvDetail() {
  const { id } = useParams<{ id: string }>();
  const tvId = parseInt(id || '0', 10);

  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [selectedEpisode, setSelectedEpisode] = useState<number>(1);

  const { data: tvShow, isLoading: isTvLoading } = useGetTvDetails(tvId, {
    query: { enabled: tvId > 0 }
  });

  const { data: seasonData, isLoading: isSeasonLoading } = useGetTvSeason(tvId, selectedSeason, {
    query: { enabled: tvId > 0 && selectedSeason > 0 }
  });

  const { data: streams, isLoading: isStreamsLoading } = useGetTvStreams(tvId, selectedSeason, selectedEpisode, {
    query: { enabled: tvId > 0 && selectedSeason > 0 && selectedEpisode > 0 }
  });

  const { data: similarTv, isLoading: isSimilarLoading } = useGetSimilarTv(tvId, {
    query: { enabled: tvId > 0 }
  });

  useEffect(() => {
    if (tvShow) {
      document.title = `${tvShow.name} (${tvShow.first_air_date?.substring(0, 4) || ''}) Watch Online Free | StreamFlix`;
      // Default to season 1 if available
      if (tvShow.seasons && tvShow.seasons.length > 0) {
        const firstValidSeason = tvShow.seasons.find(s => s.season_number > 0) || tvShow.seasons[0];
        if (firstValidSeason && selectedSeason === 1) {
          setSelectedSeason(firstValidSeason.season_number);
        }
      }
    }
  }, [tvShow]);

  if (isTvLoading) {
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

  if (!tvShow) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-32 text-center text-muted-foreground">
          <Tv className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <h2 className="text-2xl font-bold text-white mb-2">TV Show Not Found</h2>
          <p>The show you're looking for doesn't exist or has been removed.</p>
        </div>
      </Layout>
    );
  }

  const topCast = tvShow.cast?.slice(0, 5) || [];
  const year = tvShow.first_air_date?.substring(0, 4);

  return (
    <Layout>
      {/* Full Bleed Backdrop Header */}
      <div className="relative w-full h-[50vh] md:h-[60vh] bg-background">
        <div className="absolute inset-0">
          {tvShow.backdrop_path ? (
            <img
              src={`https://image.tmdb.org/t/p/original${tvShow.backdrop_path}`}
              alt={tvShow.name}
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
              {tvShow.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500${tvShow.poster_path}`}
                  alt={tvShow.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted/20">
                  <Tv className="w-12 h-12 text-muted-foreground opacity-30" />
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 flex flex-col justify-end pb-4 pt-4 md:pt-0">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              {tvShow.vote_average > 0 && (
                <span className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 rounded text-sm font-bold shadow-lg",
                  tvShow.vote_average >= 7.5 ? "bg-emerald-500/90 text-white" : "bg-primary text-white"
                )}>
                  <Star className="w-4 h-4 fill-current" />
                  {tvShow.vote_average.toFixed(1)}
                </span>
              )}
              {year && (
                <span className="flex items-center gap-1.5 text-sm text-slate-300 bg-white/5 border border-white/10 px-2.5 py-1 rounded">
                  <Calendar className="w-4 h-4" /> {year} {tvShow.status === 'Ended' ? `- ${tvShow.last_air_date?.substring(0,4)}` : '- Present'}
                </span>
              )}
              <span className="flex items-center gap-1.5 text-sm text-slate-300 bg-white/5 border border-white/10 px-2.5 py-1 rounded">
                <Clock className="w-4 h-4" /> {tvShow.number_of_seasons} Seasons
              </span>
              <span className="uppercase text-xs tracking-widest text-slate-400 border border-slate-700 px-2 py-1 rounded">
                TV Show
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-2 tracking-tight drop-shadow-lg">
              {tvShow.name}
            </h1>
            
            {tvShow.tagline && (
              <p className="text-lg text-primary italic mb-6 drop-shadow-md">
                "{tvShow.tagline}"
              </p>
            )}

            <div className="flex flex-wrap gap-2 mb-6">
              {tvShow.genres?.map(g => (
                <span key={g.id} className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm text-slate-300 transition-colors">
                  {g.name}
                </span>
              ))}
            </div>

            <div className="max-w-4xl text-slate-300 leading-relaxed mb-8">
              <p className="text-lg">{tvShow.overview}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl">
              <div>
                <span className="text-muted-foreground text-sm block mb-1">Status</span>
                <span className="text-white font-medium">{tvShow.status}</span>
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
        <div className="mb-16 grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                Watch {tvShow.name}
              </h2>
              <div className="text-sm text-muted-foreground font-medium bg-card px-3 py-1.5 rounded-lg border border-white/5">
                S{selectedSeason} E{selectedEpisode}
              </div>
            </div>
            
            {isStreamsLoading ? (
              <Skeleton className="w-full aspect-video rounded-xl bg-card" />
            ) : streams ? (
              <Player streams={streams} title={`${tvShow.name} S${selectedSeason}E${selectedEpisode}`} />
            ) : (
              <div className="w-full aspect-video bg-card rounded-xl border border-white/10 flex items-center justify-center text-muted-foreground">
                No streams available for this episode.
              </div>
            )}
          </div>

          {/* Season & Episode Selector */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-card border border-white/5 rounded-xl overflow-hidden shadow-lg h-[500px] lg:h-[calc(100%-40px)] flex flex-col">
              
              <div className="p-4 border-b border-white/5 bg-black/20">
                <select 
                  className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent outline-none appearance-none cursor-pointer"
                  value={selectedSeason}
                  onChange={(e) => {
                    setSelectedSeason(Number(e.target.value));
                    setSelectedEpisode(1); // reset to ep 1 when changing season
                  }}
                >
                  {tvShow.seasons?.filter(s => s.season_number > 0).map(season => (
                    <option key={season.id} value={season.season_number} className="bg-card text-white">
                      {season.name} ({season.episode_count} Episodes)
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                {isSeasonLoading ? (
                  Array.from({ length: 10 }).map((_, i) => (
                    <Skeleton key={i} className="w-full h-16 rounded-lg mb-2" />
                  ))
                ) : seasonData?.episodes ? (
                  seasonData.episodes.map((ep) => (
                    <button
                      key={ep.id}
                      onClick={() => setSelectedEpisode(ep.episode_number)}
                      className={cn(
                        "w-full flex items-center gap-3 p-2 rounded-lg text-left transition-all duration-200",
                        selectedEpisode === ep.episode_number 
                          ? "bg-primary/20 border border-primary/50 text-white" 
                          : "hover:bg-white/5 border border-transparent text-slate-300"
                      )}
                    >
                      <div className="shrink-0 w-12 h-8 bg-black/40 rounded flex items-center justify-center text-xs font-bold text-muted-foreground border border-white/5">
                        E{ep.episode_number}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className={cn("text-sm font-medium truncate", selectedEpisode === ep.episode_number ? "text-primary" : "")}>
                          {ep.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {ep.air_date ? ep.air_date : 'TBA'}
                        </p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-muted-foreground text-sm">
                    No episodes found.
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

        <AdSlot type="native" className="mb-12 max-w-4xl mx-auto" />

        {/* Similar TV Shows */}
        <MediaSection 
          title="Similar Shows" 
          items={similarTv?.results} 
          isLoading={isSimilarLoading}
          type="tv"
        />
      </div>
    </Layout>
  );
}

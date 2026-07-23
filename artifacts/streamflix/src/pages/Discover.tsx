import React, { useEffect, useState } from 'react';
import { useSearch } from 'wouter';
import { 
  useDiscoverMovies, 
  useDiscoverTv, 
  DiscoverMoviesSortBy,
  DiscoverTvSortBy,
  useGetMovieGenres,
  useGetTvGenres
} from '@workspace/api-client-react';
import { Layout } from '@/components/Layout';
import { MediaCard, MediaCardSkeleton } from '@/components/ui/MediaCard';
import { AdSlot } from '@/components/ui/AdSlot';
import { cn } from '@/lib/utils';
import { Filter, SlidersHorizontal, ChevronDown } from 'lucide-react';

export default function Discover() {
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const initialTab = searchParams.get('tab') === 'tv' ? 'tv' : 'movie';
  
  const [activeTab, setActiveTab] = useState<'movie' | 'tv'>(initialTab);
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('popularity.desc');
  const [page, setPage] = useState<number>(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Sync tab from URL if it changes externally
  useEffect(() => {
    const tab = new URLSearchParams(searchString).get('tab');
    if (tab === 'tv' || tab === 'movie') {
      if (tab !== activeTab) {
        setActiveTab(tab);
        setPage(1);
      }
    }
  }, [searchString]);

  useEffect(() => {
    document.title = 'Discover | StreamFlix';
  }, []);

  const { data: movieGenres } = useGetMovieGenres();
  const { data: tvGenres } = useGetTvGenres();

  const currentGenres = activeTab === 'movie' ? movieGenres?.genres : tvGenres?.genres;

  const { data: moviesData, isLoading: isMoviesLoading } = useDiscoverMovies({
    page,
    sort_by: sortBy as DiscoverMoviesSortBy,
    genre: selectedGenre || undefined,
    year: selectedYear ? parseInt(selectedYear, 10) : undefined,
  }, {
    query: { enabled: activeTab === 'movie' }
  });

  const { data: tvData, isLoading: isTvLoading } = useDiscoverTv({
    page,
    sort_by: sortBy as DiscoverTvSortBy,
    genre: selectedGenre || undefined,
    year: selectedYear ? parseInt(selectedYear, 10) : undefined,
  }, {
    query: { enabled: activeTab === 'tv' }
  });

  const currentData = activeTab === 'movie' ? moviesData : tvData;
  const isLoading = activeTab === 'movie' ? isMoviesLoading : isTvLoading;

  const handleTabChange = (tab: 'movie' | 'tv') => {
    setActiveTab(tab);
    setPage(1);
    setSelectedGenre('');
    // Could push URL state here, but local state is fine for simple discover filters
  };

  // Generate years from current year down to 1980
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1979 }, (_, i) => (currentYear - i).toString());

  return (
    <Layout>
      <div className="bg-card border-b border-white/5 pt-24 pb-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-primary/20 flex items-center justify-center text-primary">
                <Filter className="w-5 h-5" />
              </div>
              Discover
            </h1>

            {/* Tabs */}
            <div className="flex items-center bg-black/40 p-1.5 rounded-xl border border-white/5 self-start md:self-auto">
              <button
                onClick={() => handleTabChange('movie')}
                className={cn(
                  "px-6 py-2 rounded-lg font-medium text-sm transition-all duration-300",
                  activeTab === 'movie' ? "bg-primary text-white shadow-lg" : "text-muted-foreground hover:text-white"
                )}
              >
                Movies
              </button>
              <button
                onClick={() => handleTabChange('tv')}
                className={cn(
                  "px-6 py-2 rounded-lg font-medium text-sm transition-all duration-300",
                  activeTab === 'tv' ? "bg-primary text-white shadow-lg" : "text-muted-foreground hover:text-white"
                )}
              >
                TV Shows
              </button>
            </div>
            
            {/* Mobile Filter Toggle */}
            <button 
              className="md:hidden flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-sm text-white font-medium"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>
            
          </div>

          {/* Filters Bar */}
          <div className={cn(
            "mt-6 grid-cols-1 sm:grid-cols-3 gap-4",
            isFilterOpen ? "grid" : "hidden md:grid"
          )}>
            {/* Sort */}
            <div className="relative">
              <select
                className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm appearance-none focus:outline-none focus:border-primary transition-colors cursor-pointer"
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
              >
                <option value="popularity.desc" className="bg-card">Most Popular</option>
                <option value="vote_average.desc" className="bg-card">Highest Rated</option>
                {activeTab === 'movie' ? (
                  <option value="release_date.desc" className="bg-card">Latest Release</option>
                ) : (
                  <option value="first_air_date.desc" className="bg-card">Latest Release</option>
                )}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>

            {/* Genre */}
            <div className="relative">
              <select
                className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm appearance-none focus:outline-none focus:border-primary transition-colors cursor-pointer"
                value={selectedGenre}
                onChange={(e) => { setSelectedGenre(e.target.value); setPage(1); }}
              >
                <option value="" className="bg-card">All Genres</option>
                {currentGenres?.map(genre => (
                  <option key={genre.id} value={genre.id.toString()} className="bg-card">
                    {genre.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>

            {/* Year */}
            <div className="relative">
              <select
                className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm appearance-none focus:outline-none focus:border-primary transition-colors cursor-pointer"
                value={selectedYear}
                onChange={(e) => { setSelectedYear(e.target.value); setPage(1); }}
              >
                <option value="" className="bg-card">All Years</option>
                {years.map(year => (
                  <option key={year} value={year} className="bg-card">{year}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        
        <div className="mb-8">
          <AdSlot type="banner" />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {Array.from({ length: 18 }).map((_, i) => (
              <MediaCardSkeleton key={i} />
            ))}
          </div>
        ) : currentData?.results?.length ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {currentData.results.map((item) => (
                <MediaCard key={item.id} item={item} type={activeTab} />
              ))}
            </div>

            {/* Pagination Controls */}
            {currentData.total_pages > 1 && (
              <div className="mt-12 flex justify-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-card border border-white/10 rounded-lg text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/5 transition-colors"
                >
                  Previous
                </button>
                <div className="px-4 py-2 bg-black/40 border border-white/5 rounded-lg text-sm font-medium text-white">
                  Page {page} of {Math.min(currentData.total_pages, 500)}
                </div>
                <button
                  onClick={() => setPage(p => Math.min(currentData.total_pages, p + 1))}
                  disabled={page >= currentData.total_pages || page >= 500}
                  className="px-4 py-2 bg-card border border-white/10 rounded-lg text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/5 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Filter className="w-16 h-16 text-muted-foreground opacity-20 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No items found</h3>
            <p className="text-muted-foreground">Try adjusting your filters to find what you're looking for.</p>
            <button 
              onClick={() => { setSelectedGenre(''); setSelectedYear(''); setSortBy('popularity.desc'); }}
              className="mt-6 text-primary hover:text-primary/80 font-medium"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}

import React, { useEffect, useState } from 'react';
import { useSearch } from 'wouter';
import { useSearchMulti } from '@workspace/api-client-react';
import { Layout } from '@/components/Layout';
import { MediaCard, MediaCardSkeleton } from '@/components/ui/MediaCard';
import { AdSlot } from '@/components/ui/AdSlot';
import { Search as SearchIcon } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';

export default function Search() {
  const searchString = useSearch();
  const initialQuery = new URLSearchParams(searchString).get('q') || '';
  
  const [searchInput, setSearchInput] = useState(initialQuery);
  const debouncedQuery = useDebounce(searchInput, 500);

  const { data, isLoading } = useSearchMulti(
    { query: debouncedQuery, page: 1 },
    { query: { enabled: debouncedQuery.length > 0 } }
  );

  useEffect(() => {
    document.title = debouncedQuery ? `Search: ${debouncedQuery} | StreamFlix` : 'Search | StreamFlix';
  }, [debouncedQuery]);

  useEffect(() => {
    const q = new URLSearchParams(searchString).get('q') || '';
    if (q !== searchInput && q !== debouncedQuery) {
      setSearchInput(q);
    }
  }, [searchString]);

  // Filter out people from results
  const filteredResults = data?.results?.filter(item => item.media_type !== 'person') || [];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-24 min-h-[80vh]">
        
        <div className="max-w-3xl mx-auto mb-12 relative">
          <div className="relative flex items-center bg-card border border-white/10 rounded-full px-6 py-4 shadow-xl focus-within:border-primary focus-within:shadow-[0_0_20px_rgba(244,63,94,0.2)] transition-all">
            <SearchIcon className="w-6 h-6 text-muted-foreground mr-4" />
            <input
              type="text"
              placeholder="Search for movies, tv shows..."
              className="bg-transparent border-none outline-none text-xl w-full text-white placeholder:text-muted-foreground"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        <AdSlot type="banner" className="mb-8" />

        {debouncedQuery.length > 0 && (
          <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-primary rounded-full"></span>
            Search Results for "{debouncedQuery}"
          </h2>
        )}

        {isLoading && debouncedQuery.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <MediaCardSkeleton key={i} />
            ))}
          </div>
        ) : debouncedQuery.length > 0 ? (
          filteredResults.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {filteredResults.map((item) => (
                <MediaCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-card/30 rounded-2xl border border-white/5">
              <SearchIcon className="w-16 h-16 text-muted-foreground opacity-30 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No results found</h3>
              <p className="text-muted-foreground">We couldn't find anything matching "{debouncedQuery}". Try another search term.</p>
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <SearchIcon className="w-20 h-20 text-muted-foreground opacity-10 mb-6" />
            <h3 className="text-2xl font-bold text-white/50 mb-2">Search StreamFlix</h3>
            <p className="text-muted-foreground max-w-md">Find your favorite movies and TV shows instantly. Just type in the search bar above.</p>
          </div>
        )}

      </div>
    </Layout>
  );
}

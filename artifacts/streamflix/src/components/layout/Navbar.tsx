import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Play, Search, Menu, X, Film, Tv, Compass } from 'lucide-react';
import { useSearchMulti } from '@workspace/api-client-react';
import { useDebounce } from '@/hooks/use-debounce';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export function Navbar() {
  const [location, setLocation] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  const debouncedSearch = useDebounce(searchQuery, 300);
  
  const { data: searchResults, isLoading: isSearchLoading } = useSearchMulti(
    { query: debouncedSearch },
    { query: { enabled: debouncedSearch.length > 2 } }
  );

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchFocused(false);
    }
  };

  return (
    <>
      <header
        className={cn(
          'fixed top-0 inset-x-0 z-50 transition-all duration-300 border-b border-transparent',
          isScrolled ? 'bg-background/90 backdrop-blur-md border-white/10 shadow-lg' : 'bg-gradient-to-b from-black/80 to-transparent'
        )}
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-white shadow-[0_0_15px_rgba(244,63,94,0.5)] group-hover:shadow-[0_0_25px_rgba(244,63,94,0.8)] transition-all">
                <Play fill="currentColor" className="w-4 h-4 ml-0.5" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">
                Stream<span className="text-primary">Flix</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link href="/" className={cn("transition-colors hover:text-primary", location === '/' ? 'text-primary' : 'text-slate-300')}>Home</Link>
              <Link href="/discover?tab=movie" className={cn("transition-colors hover:text-primary", location.startsWith('/movie') || (location === '/discover' && !location.includes('tv')) ? 'text-primary' : 'text-slate-300')}>Movies</Link>
              <Link href="/discover?tab=tv" className={cn("transition-colors hover:text-primary", location.startsWith('/tv') || location.includes('tab=tv') ? 'text-primary' : 'text-slate-300')}>TV Shows</Link>
              <Link href="/discover" className={cn("transition-colors hover:text-primary", location === '/discover' ? 'text-primary' : 'text-slate-300')}>Discover</Link>
            </nav>
          </div>

          <div className="flex items-center gap-4 flex-1 justify-end">
            <form onSubmit={handleSearchSubmit} className="relative w-full max-w-xs hidden sm:block">
              <div className={cn(
                "flex items-center bg-black/40 border transition-colors rounded-full px-3 py-1.5 focus-within:bg-black/60",
                isSearchFocused ? "border-primary shadow-[0_0_10px_rgba(244,63,94,0.2)]" : "border-white/10"
              )}>
                <Search className="w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search movies, tv shows..."
                  className="bg-transparent border-none outline-none text-sm px-2 w-full text-white placeholder:text-muted-foreground focus:ring-0"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                />
              </div>

              {/* Search Dropdown */}
              {isSearchFocused && debouncedSearch.length > 2 && (
                <div className="absolute top-full mt-2 left-0 right-0 bg-card border border-white/10 rounded-lg shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                  {isSearchLoading ? (
                    <div className="p-4 space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex gap-3 items-center">
                          <Skeleton className="w-10 h-14 rounded" />
                          <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/4" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : searchResults?.results?.length ? (
                    <div className="max-h-[300px] overflow-y-auto py-2">
                      {searchResults.results.slice(0, 5).map((item) => (
                        <Link 
                          key={item.id} 
                          href={`/${item.media_type === 'tv' ? 'tv' : 'movie'}/${item.id}`}
                          className="flex items-center gap-3 p-2 mx-2 rounded-md hover:bg-white/5 transition-colors cursor-pointer"
                          onClick={() => setIsSearchFocused(false)}
                        >
                          {item.poster_path ? (
                            <img 
                              src={`https://image.tmdb.org/t/p/w92${item.poster_path}`} 
                              alt={item.title || item.name} 
                              className="w-10 h-14 object-cover rounded shadow-sm"
                            />
                          ) : (
                            <div className="w-10 h-14 bg-muted rounded flex items-center justify-center">
                              <Film className="w-4 h-4 text-muted-foreground" />
                            </div>
                          )}
                          <div className="flex-1 overflow-hidden">
                            <div className="text-sm font-medium text-white truncate">{item.title || item.name}</div>
                            <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                              <span className="uppercase text-[10px] tracking-wider border border-white/20 px-1 rounded bg-black/40">
                                {item.media_type}
                              </span>
                              <span>{(item.release_date || item.first_air_date)?.substring(0, 4)}</span>
                              {item.vote_average > 0 && (
                                <span className="text-emerald-500 font-medium">★ {item.vote_average.toFixed(1)}</span>
                              )}
                            </div>
                          </div>
                        </Link>
                      ))}
                      <Link 
                        href={`/search?q=${encodeURIComponent(debouncedSearch)}`}
                        className="block w-full text-center py-2 text-sm text-primary hover:bg-white/5 mt-1 border-t border-white/5"
                        onClick={() => setIsSearchFocused(false)}
                      >
                        View all results
                      </Link>
                    </div>
                  ) : (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      No results found for "{debouncedSearch}"
                    </div>
                  )}
                </div>
              )}
            </form>

            <button 
              className="md:hidden p-2 -mr-2 text-slate-300 hover:text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background/98 backdrop-blur-xl pt-16 md:hidden flex flex-col border-t border-white/10 animate-in fade-in slide-in-from-top-4">
          <div className="p-4">
            <form onSubmit={handleSearchSubmit} className="relative w-full mb-6">
              <div className="flex items-center bg-black/50 border border-white/10 rounded-full px-4 py-3">
                <Search className="w-5 h-5 text-muted-foreground mr-3" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent border-none outline-none text-base w-full text-white placeholder:text-muted-foreground"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>

            <nav className="flex flex-col gap-2">
              <Link 
                href="/" 
                className={cn("flex items-center gap-3 p-4 rounded-xl text-lg font-medium transition-colors", location === '/' ? "bg-primary/10 text-primary" : "text-white hover:bg-white/5")}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Compass className="w-5 h-5" /> Home
              </Link>
              <Link 
                href="/discover?tab=movie" 
                className={cn("flex items-center gap-3 p-4 rounded-xl text-lg font-medium transition-colors", location.startsWith('/movie') ? "bg-primary/10 text-primary" : "text-white hover:bg-white/5")}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Film className="w-5 h-5" /> Movies
              </Link>
              <Link 
                href="/discover?tab=tv" 
                className={cn("flex items-center gap-3 p-4 rounded-xl text-lg font-medium transition-colors", location.startsWith('/tv') ? "bg-primary/10 text-primary" : "text-white hover:bg-white/5")}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Tv className="w-5 h-5" /> TV Shows
              </Link>
              <Link 
                href="/discover" 
                className={cn("flex items-center gap-3 p-4 rounded-xl text-lg font-medium transition-colors", location === '/discover' ? "bg-primary/10 text-primary" : "text-white hover:bg-white/5")}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Search className="w-5 h-5" /> Discover
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

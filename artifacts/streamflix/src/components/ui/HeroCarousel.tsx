import React, { useEffect, useState, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Link } from 'wouter';
import { Play, Info, Star } from 'lucide-react';
import { MediaItem } from '@workspace/api-client-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface HeroCarouselProps {
  items?: MediaItem[];
  isLoading: boolean;
}

export function HeroCarousel({ items, isLoading }: HeroCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 40 });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    
    // Auto play
    const autoplay = setInterval(() => {
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext();
      } else {
        emblaApi.scrollTo(0);
      }
    }, 6000);
    
    return () => {
      clearInterval(autoplay);
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  if (isLoading) {
    return (
      <div className="relative w-full h-[60vh] md:h-[80vh] bg-card overflow-hidden">
        <Skeleton className="absolute inset-0 w-full h-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 flex flex-col justify-end h-full z-10">
          <Skeleton className="h-12 w-3/4 max-w-2xl mb-4 bg-white/10" />
          <Skeleton className="h-4 w-full max-w-xl mb-2 bg-white/10" />
          <Skeleton className="h-4 w-2/3 max-w-md mb-8 bg-white/10" />
          <div className="flex gap-4">
            <Skeleton className="h-12 w-32 rounded-full bg-white/10" />
            <Skeleton className="h-12 w-32 rounded-full bg-white/10" />
          </div>
        </div>
      </div>
    );
  }

  if (!items || items.length === 0) return null;

  const slides = items.slice(0, 10); // Show top 10

  return (
    <div className="relative w-full h-[70vh] md:h-[85vh] bg-background overflow-hidden group">
      <div className="overflow-hidden h-full" ref={emblaRef}>
        <div className="flex h-full touch-pan-y">
          {slides.map((item, index) => {
            const mediaType = item.media_type || 'movie';
            const isActive = index === selectedIndex;
            
            return (
              <div 
                key={item.id} 
                className="flex-[0_0_100%] min-w-0 relative h-full"
              >
                {/* Backdrop Image */}
                <div className="absolute inset-0">
                  <img
                    src={`https://image.tmdb.org/t/p/original${item.backdrop_path}`}
                    alt={item.title || item.name}
                    className={cn(
                      "w-full h-full object-cover transition-transform duration-10000 ease-linear",
                      isActive ? "scale-110" : "scale-100"
                    )}
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                  {/* Gradients */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent w-full md:w-3/4" />
                </div>

                {/* Content */}
                <div className="absolute inset-0 container mx-auto px-4 flex flex-col justify-end pb-20 md:pb-32 z-10">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
                    <div className="md:col-span-8 space-y-4">
                      {/* Meta Tags */}
                      <div className="flex items-center gap-3 text-sm font-medium text-white/80 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both" style={{ animationDelay: '100ms' }}>
                        <span className="bg-primary/20 text-primary border border-primary/30 px-2 py-0.5 rounded uppercase tracking-wider text-xs">
                          {mediaType}
                        </span>
                        {item.vote_average > 0 && (
                          <span className="flex items-center gap-1 text-emerald-400">
                            <Star className="w-4 h-4 fill-current" />
                            {item.vote_average.toFixed(1)}
                          </span>
                        )}
                        <span>{(item.release_date || item.first_air_date)?.substring(0, 4)}</span>
                      </div>
                      
                      <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight drop-shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both" style={{ animationDelay: '200ms' }}>
                        {item.title || item.name}
                      </h1>
                      
                      <p className="text-lg text-slate-300 max-w-2xl line-clamp-3 drop-shadow animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both" style={{ animationDelay: '300ms' }}>
                        {item.overview}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both" style={{ animationDelay: '400ms' }}>
                        <Link 
                          href={`/${mediaType}/${item.id}`}
                          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-3.5 rounded-full font-semibold transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(244,63,94,0.4)]"
                        >
                          <Play className="w-5 h-5 fill-current" /> Watch Now
                        </Link>
                        <Link 
                          href={`/${mediaType}/${item.id}`}
                          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/10 px-8 py-3.5 rounded-full font-semibold transition-all hover:scale-105 active:scale-95"
                        >
                          <Info className="w-5 h-5" /> More Info
                        </Link>
                      </div>
                    </div>
                    
                    {/* Desktop Poster */}
                    <div className="hidden md:block md:col-span-4 lg:col-span-3 lg:col-start-10 animate-in fade-in slide-in-from-right-8 duration-700 fill-mode-both" style={{ animationDelay: '500ms' }}>
                      <div className="rounded-xl overflow-hidden shadow-2xl border border-white/10 rotate-3 transform transition-transform hover:rotate-0 duration-500">
                        <img 
                          src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} 
                          alt={item.title || item.name} 
                          className="w-full h-auto object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Pagination Dots */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              index === selectedIndex ? "w-8 bg-primary shadow-[0_0_10px_rgba(244,63,94,0.8)]" : "w-2 bg-white/30 hover:bg-white/50"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

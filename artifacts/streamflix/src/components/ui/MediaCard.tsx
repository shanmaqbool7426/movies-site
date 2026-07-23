import React from 'react';
import { Link } from 'wouter';
import { Star, Film } from 'lucide-react';
import { MediaItem } from '@workspace/api-client-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface MediaCardProps {
  item: MediaItem;
  type?: 'movie' | 'tv'; // Fallback if media_type is missing
}

export function MediaCard({ item, type }: MediaCardProps) {
  const mediaType = item.media_type || type || 'movie';
  const title = item.title || item.name;
  const year = (item.release_date || item.first_air_date)?.substring(0, 4);
  const rating = item.vote_average > 0 ? item.vote_average.toFixed(1) : null;
  const isHighRating = item.vote_average >= 7.5;

  return (
    <Link 
      href={`/${mediaType}/${item.id}`}
      className="group relative flex flex-col gap-2 cursor-pointer outline-none"
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-card border border-white/10 shadow-lg transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-[0_0_20px_rgba(244,63,94,0.3)]">
        {item.poster_path ? (
          <img
            src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-muted/30 text-muted-foreground transition-transform duration-500 group-hover:scale-105">
            <Film className="w-10 h-10 mb-2 opacity-50" />
            <span className="text-xs uppercase tracking-wider">No Image</span>
          </div>
        )}

        {/* Rating Badge */}
        {rating && (
          <div className={cn(
            "absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-bold backdrop-blur-md shadow-lg",
            isHighRating ? "bg-emerald-500/90 text-white" : "bg-black/60 text-white border border-white/10"
          )}>
            <Star className={cn("w-3 h-3", isHighRating ? "fill-current" : "fill-primary text-primary")} />
            {rating}
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="text-white font-bold text-sm line-clamp-2 leading-tight">{title}</h3>
            {year && <p className="text-white/70 text-xs mt-1">{year}</p>}
          </div>
        </div>
      </div>
      
      {/* Below Card Text (visible usually, hides slightly on hover logic if we want, but keeping it simple) */}
      <div className="px-1 mt-1">
        <h3 className="text-sm font-medium text-slate-200 truncate group-hover:text-primary transition-colors">{title}</h3>
        <div className="flex items-center justify-between text-xs text-muted-foreground mt-0.5">
          <span>{year}</span>
          <span className="uppercase text-[10px] tracking-wider border border-white/10 px-1 rounded">{mediaType}</span>
        </div>
      </div>
    </Link>
  );
}

export function MediaCardSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="aspect-[2/3] w-full rounded-xl" />
      <div className="space-y-1 mt-1 px-1">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}

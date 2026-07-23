import React from 'react';
import { Link } from 'wouter';
import { ChevronRight } from 'lucide-react';
import { MediaItem } from '@workspace/api-client-react';
import { MediaCard, MediaCardSkeleton } from './ui/MediaCard';
import { cn } from '@/lib/utils';

interface MediaSectionProps {
  title: string;
  items?: MediaItem[];
  isLoading: boolean;
  viewAllLink?: string;
  className?: string;
  type?: 'movie' | 'tv';
}

export function MediaSection({ title, items, isLoading, viewAllLink, className, type }: MediaSectionProps) {
  return (
    <section className={cn("py-8", className)}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="w-1.5 h-6 bg-primary rounded-full"></span>
            {title}
          </h2>
          {viewAllLink && (
            <Link 
              href={viewAllLink}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center"
            >
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <MediaCardSkeleton key={i} />
            ))
          ) : (
            items?.slice(0, 6).map((item) => (
              <MediaCard key={item.id} item={item} type={type} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}

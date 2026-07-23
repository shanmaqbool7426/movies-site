import React from 'react';
import { cn } from '@/lib/utils';

export function AdSlot({ className, type = 'banner' }: { className?: string, type?: 'banner' | 'side' | 'native' }) {
  return (
    <div className={cn(
      "flex items-center justify-center bg-card border border-white/5 rounded-lg overflow-hidden relative",
      type === 'banner' && "w-full max-w-[728px] h-[90px] mx-auto",
      type === 'side' && "w-[300px] h-[250px] mx-auto",
      type === 'native' && "w-full h-[150px]",
      className
    )}>
      <span className="text-muted-foreground/30 text-xs uppercase tracking-widest font-semibold z-10">Advertisement</span>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none mix-blend-overlay"></div>
    </div>
  );
}

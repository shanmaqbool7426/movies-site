import React, { useState } from 'react';
import { StreamSources } from '@workspace/api-client-react';
import { cn } from '@/lib/utils';
import { Play, Download, Server, Monitor, Maximize } from 'lucide-react';

interface PlayerProps {
  streams: StreamSources;
  title: string;
}

export function Player({ streams, title }: PlayerProps) {
  const [activeServerId, setActiveServerId] = useState<number>(streams.sources[0]?.server_id || 1);
  const [isTheaterMode, setIsTheaterMode] = useState(false);

  const activeSource = streams.sources.find(s => s.server_id === activeServerId) || streams.sources[0];

  if (!activeSource) {
    return (
      <div className="w-full aspect-video bg-black rounded-xl border border-white/10 flex flex-col items-center justify-center text-muted-foreground">
        <Monitor className="w-12 h-12 mb-4 opacity-50" />
        <p>No stream sources available.</p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-4", isTheaterMode && "relative z-[60]")}>
      
      {/* Theater Mode Overlay */}
      {isTheaterMode && (
        <div 
          className="fixed inset-0 bg-black/95 backdrop-blur-sm z-[-1]" 
          onClick={() => setIsTheaterMode(false)}
        />
      )}

      {/* Player Container */}
      <div className={cn(
        "bg-black rounded-xl overflow-hidden border border-white/10 shadow-2xl transition-all duration-500",
        isTheaterMode ? "fixed inset-x-0 top-1/2 -translate-y-1/2 mx-auto w-[90vw] max-w-7xl z-10" : "relative w-full aspect-video"
      )}>
        {/* Aspect Ratio Wrapper when not in theater mode, Theater mode uses explicit height */}
        <div className={cn("w-full h-full", !isTheaterMode && "absolute inset-0")}>
          <iframe
            src={activeSource.url}
            title={`${title} Player`}
            className="w-full h-full border-none"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
      </div>

      {/* Controls & Servers */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 bg-card rounded-xl border border-white/5">
        
        <div className="flex-1 flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground mr-2 font-medium flex items-center gap-1">
            <Server className="w-4 h-4" /> Servers:
          </span>
          {streams.sources.map((source) => (
            <button
              key={source.server_id}
              onClick={() => setActiveServerId(source.server_id)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-2",
                activeServerId === source.server_id 
                  ? "bg-primary text-white shadow-[0_0_10px_rgba(244,63,94,0.3)]" 
                  : "bg-white/5 text-slate-300 hover:bg-white/10"
              )}
            >
              <Play className="w-3 h-3" /> {source.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsTheaterMode(!isTheaterMode)}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors"
          >
            <Maximize className="w-4 h-4" /> 
            <span className="hidden sm:inline">{isTheaterMode ? 'Exit Theater' : 'Theater Mode'}</span>
          </button>
        </div>
      </div>

      {/* Downloads (Cosmetic) */}
      <div className="grid grid-cols-3 gap-3">
        <a 
          href={activeSource.url} 
          target="_blank" 
          rel="noreferrer"
          className="flex flex-col items-center justify-center p-3 bg-card border border-white/5 rounded-xl hover:bg-white/5 transition-colors group"
        >
          <Download className="w-5 h-5 text-emerald-500 mb-1 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-bold text-white">1080p</span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Full HD</span>
        </a>
        <a 
          href={activeSource.url} 
          target="_blank" 
          rel="noreferrer"
          className="flex flex-col items-center justify-center p-3 bg-card border border-white/5 rounded-xl hover:bg-white/5 transition-colors group"
        >
          <Download className="w-5 h-5 text-blue-400 mb-1 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-bold text-white">720p</span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">HD</span>
        </a>
        <a 
          href={activeSource.url} 
          target="_blank" 
          rel="noreferrer"
          className="flex flex-col items-center justify-center p-3 bg-card border border-white/5 rounded-xl hover:bg-white/5 transition-colors group"
        >
          <Download className="w-5 h-5 text-slate-400 mb-1 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-bold text-white">480p</span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">SD</span>
        </a>
      </div>
    </div>
  );
}

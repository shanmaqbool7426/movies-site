import React from 'react';
import { Link } from 'wouter';
import { Play, Twitter, Github, Disc } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#05080f] border-t border-white/5 pt-16 pb-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-white">
                <Play fill="currentColor" className="w-4 h-4 ml-0.5" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">
                Stream<span className="text-primary">Flix</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-md leading-relaxed">
              Your premium destination for discovering and streaming the best movies and TV shows. 
              High quality, fast loading, no compromises.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-colors">
                <Disc className="w-4 h-4" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/discover?tab=movie" className="hover:text-primary transition-colors">Movies</Link></li>
              <li><Link href="/discover?tab=tv" className="hover:text-primary transition-colors">TV Shows</Link></li>
              <li><Link href="/discover" className="hover:text-primary transition-colors">Discover</Link></li>
              <li><Link href="/search" className="hover:text-primary transition-colors">Search</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">DMCA</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} StreamFlix. All rights reserved.</p>
          <p>This site does not store any files on its server. All contents are provided by non-affiliated third parties.</p>
        </div>
      </div>
    </footer>
  );
}

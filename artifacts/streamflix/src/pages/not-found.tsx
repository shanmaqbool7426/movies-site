import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { Film } from "lucide-react";

export default function NotFound() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <Film className="w-24 h-24 text-muted-foreground opacity-20 mb-8" />
        <h1 className="text-6xl font-black text-white tracking-tighter mb-4">404</h1>
        <h2 className="text-2xl font-bold text-slate-300 mb-6">Page Not Found</h2>
        <p className="text-muted-foreground max-w-md mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link 
          href="/" 
          className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full font-bold transition-all hover:scale-105 shadow-[0_0_20px_rgba(244,63,94,0.4)]"
        >
          Return to Homepage
        </Link>
      </div>
    </Layout>
  );
}

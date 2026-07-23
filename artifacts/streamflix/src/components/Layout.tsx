import React from 'react';
import { Navbar } from './layout/Navbar';
import { Footer } from './layout/Footer';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Navbar />
      <main className="flex-1 w-full">{children}</main>
      <Footer />
    </div>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Search,
  ArrowRight,
  Zap,
  Target,
  Layers,
} from 'lucide-react';
import AppIcon from '@/components/Appicon';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-primary/10 rounded-full blur-[100px]" />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full p-6 flex items-center justify-between z-50 bg-background/50 backdrop-blur-md border-b border-border/50">
        <div className="flex items-center gap-2">
          <AppIcon />
          <span className="text-xl font-bold tracking-tight">Xartup</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="px-4 py-2 rounded-xl text-muted-foreground hover:text-foreground transition-colors">
            Login
          </Link>
          <Link href="/signup" className="px-5 py-2.5 bg-primary text-black rounded-xl font-bold hover:scale-105 transition-all shadow-lg shadow-primary/20">
            Join Fellowship
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 text-center max-w-4xl px-6 space-y-8 py-20 mt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium"
        >
          <Zap className="w-4 h-4 fill-primary" />
          Connecting the next generation of founders
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]"
        >
          Find Your Next <br />
          <span className="text-primary italic">Breakthrough</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-muted-foreground max-w-2xl mx-auto"
        >
          The Fellowship Discovery platform for high-potential startups and founders.
          Search, track, and save the startups that matter.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/signup"
            className="w-full sm:w-auto px-8 py-4 bg-primary text-black rounded-2xl font-black text-lg flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-xl shadow-primary/30"
          >
            Get Started
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-4 glass border border-border/50 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-primary/10 transition-all"
          >
            Sign In
          </Link>
        </motion.div>
      </div>

      {/* Features Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl px-6 pb-20">
        <div className="glass p-8 rounded-3xl border border-border/50 space-y-4 hover:border-primary/50 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold">Smart Discovery</h3>
          <p className="text-muted-foreground">Advanced filtering and search to find exactly what you're looking for.</p>
        </div>
        <div className="glass p-8 rounded-3xl border border-border/50 space-y-4 hover:border-primary/50 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold">Curated Lists</h3>
          <p className="text-muted-foreground">Save and organize startups into custom lists for quick access.</p>
        </div>
        <div className="glass p-8 rounded-3xl border border-border/50 space-y-4 hover:border-primary/50 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold">Saved Searches</h3>
          <p className="text-muted-foreground">Never miss a new entry with saved search queries and alerts.</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 w-full py-12 border-t border-border/50 flex flex-col items-center gap-6">
        <div className="flex items-center gap-2 opacity-50">
          <div className="w-6 h-6 rounded bg-foreground flex items-center justify-center text-background font-bold text-xs">
            X
          </div>
          <span className="font-bold">Xartup Fellowship</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
          <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
          <Link href="#" className="hover:text-primary transition-colors">Contact</Link>
        </div>
      </footer>
    </div>
  );
}

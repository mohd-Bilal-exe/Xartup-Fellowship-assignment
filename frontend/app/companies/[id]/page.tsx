'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    ArrowLeft,
    ExternalLink,
    Zap,
    MapPin,
    Calendar,
    Tag,
    Loader2,
    CheckCircle2,
    AlertCircle,
    MessageSquare
} from 'lucide-react';
import { companyService } from '@/services/api';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function CompanyProfilePage() {
    const { id } = useParams();
    const router = useRouter();
    const [company, setCompany] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [enriching, setEnriching] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCompany = async () => {
        setLoading(true);
        try {
            const { data } = await companyService.getCompany(id as string);
            setCompany(data);
        } catch (error) {
            console.error('Failed to fetch company:', error);
            setError('Failed to load company details.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompany();
    }, [id]);

    const handleEnrich = async () => {
        setEnriching(true);
        try {
            const { data } = await companyService.enrichCompany(id as string);
            setCompany(data);
        } catch (error: any) {
            console.error('Enrichment failed:', error);
            alert(error.response?.data?.error || 'Enrichment failed. Please check backend logs.');
        } finally {
            setEnriching(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !company) {
        return (
            <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-red-300 mx-auto mb-4" />
                <p className="text-muted-foreground">{error || 'Company not found'}</p>
                <button
                    onClick={() => router.back()}
                    className="mt-4 text-primary hover:underline"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Discovery
                </button>

                <button
                    onClick={handleEnrich}
                    disabled={enriching}
                    className={cn(
                        "flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-all shadow-lg",
                        "bg-primary text-white hover:bg-primary/90 shadow-primary/20",
                        enriching && "opacity-50 cursor-not-allowed"
                    )}
                >
                    {enriching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 fill-white" />}
                    {enriching ? 'Enriching with AI...' : 'Enrich This Profile'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass p-8 rounded-3xl border border-border/50">
                        <h1 className="text-4xl font-bold mb-2">{company.name}</h1>
                        <a
                            href={company.url}
                            target="_blank"
                            className="text-primary flex items-center gap-1 hover:underline mb-6"
                        >
                            {company.url} <ExternalLink className="w-4 h-4" />
                        </a>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">AI Summary</h3>
                                <p className="text-lg leading-relaxed text-slate-200">
                                    {company.summary || "No AI summary available. Click 'Enrich This Profile' to generate one."}
                                </p>
                            </div>

                            {company.description && (
                                <div>
                                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Capabilities</h3>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {company.description.split('\n').map((bullet: string, i: number) => (
                                            <li key={i} className="flex items-start gap-2 text-slate-300">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />
                                                <span>{bullet.replace(/^- /, '')}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="glass p-8 rounded-3xl border border-border/50">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold">Signals & Insights</h3>
                            <Tag className="w-5 h-5 text-muted-foreground" />
                        </div>

                        <div className="space-y-4">
                            {company.signals && company.signals.length > 0 ? (
                                company.signals.map((signal: any) => (
                                    <div key={signal.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 group hover:border-primary/50 transition-colors">
                                        <span className="font-medium">{signal.label}</span>
                                        <span className="text-slate-400 group-hover:text-white transition-colors">{signal.value}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="py-12 text-center text-muted-foreground">
                                    No signals detected yet.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="glass p-6 rounded-3xl border border-border/50">
                        <h3 className="text-lg font-bold mb-4">Metadata</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-sm">
                                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                                    <Tag className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-muted-foreground text-xs">Industry</p>
                                    <p className="font-medium">{company.industry || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                                    <Zap className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-muted-foreground text-xs">Stage</p>
                                    <p className="font-medium">{company.stage || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                                    <MapPin className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-muted-foreground text-xs">Location</p>
                                    <p className="font-medium">{company.location || 'Unknown'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass p-6 rounded-3xl border border-border/50">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold">Notes</h3>
                            <button className="text-xs text-primary hover:underline">Add Note</button>
                        </div>
                        <div className="space-y-4">
                            {company.notes?.length > 0 ? (
                                company.notes.map((note: any) => (
                                    <div key={note.id} className="text-sm p-3 rounded-lg bg-white/5 text-slate-300">
                                        {note.content}
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground italic">No notes yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

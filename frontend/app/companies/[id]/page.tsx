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
    MessageSquare,
    Plus
} from 'lucide-react';
import { companyService, listService } from '@/services/api';
import { cn } from '@/lib/utils';
import Modal from '@/components/Modal';

export default function CompanyProfilePage() {
    const { id } = useParams();
    const router = useRouter();
    const [company, setCompany] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [enriching, setEnriching] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lists, setLists] = useState<any[]>([]);

    // Interaction State
    const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);
    const [noteContent, setNoteContent] = useState('');
    const [isAddToListModalOpen, setIsAddToListModalOpen] = useState(false);
    const [isCreatingList, setIsCreatingList] = useState(false);
    const [newListName, setNewListName] = useState('');

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

    const fetchLists = async () => {
        try {
            const { data } = await listService.getLists();
            setLists(data);
        } catch (error) {
            console.error('Failed to fetch lists:', error);
        }
    };

    useEffect(() => {
        fetchCompany();
        fetchLists();
    }, [id]);

    const handleEnrich = async () => {
        setEnriching(true);
        try {
            const { data } = await companyService.enrichCompany(id as string);
            setCompany(data);
        } catch (error: any) {
            console.error('Enrichment failed:', error.response?.data?.error);
            alert(error.response?.data?.error || 'Enrichment failed. Please check backend logs.');
        } finally {
            setEnriching(false);
        }
    };

    const handleAddNote = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!noteContent) return;
        try {
            const { data } = await companyService.addNote(id as string, noteContent);
            setCompany({
                ...company,
                notes: [...(company.notes || []), data]
            });
            setIsAddNoteModalOpen(false);
            setNoteContent('');
        } catch (error) {
            console.error('Failed to add note:', error);
        }
    };

    const handleAddToList = async (listId: string) => {
        try {
            await listService.addToList(listId, id as string);
            setIsAddToListModalOpen(false);
            // Optional: toast success
        } catch (error) {
            console.error('Failed to add to list:', error);
        }
    };

    const handleCreateListAndAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newListName) return;
        try {
            const { data: newList } = await listService.createList(newListName);
            await listService.addToList(newList.id, id as string);
            setIsAddToListModalOpen(false);
            setNewListName('');
            setIsCreatingList(false);
            fetchLists();
        } catch (error) {
            console.error('Failed to create list and add:', error);
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
                <div className="flex flex-col gap-1">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors text-sm mb-1"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Discovery
                    </button>
                    {company.lastEnrichedAt && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-primary" />
                            AI-Enriched on {new Date(company.lastEnrichedAt).toLocaleDateString()}
                        </span>
                    )}
                </div>
                <div className="flex gap-2">
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

                    <button
                        onClick={() => setIsAddToListModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold bg-secondary text-white hover:bg-white/10 transition-all border border-white/5"
                    >
                        <Plus className="w-4 h-4" />
                        Save to List
                    </button></div>
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
                            <button
                                onClick={() => setIsAddNoteModalOpen(true)}
                                className="text-xs text-primary hover:underline"
                            >
                                Add Note
                            </button>
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

                    {company.sources && company.sources.length > 0 && (
                        <div className="glass p-6 rounded-3xl border border-border/50">
                            <h3 className="text-lg font-bold mb-4">Data Sources</h3>
                            <div className="space-y-4">
                                {company.sources.map((source: any) => (
                                    <div key={source.id} className="space-y-1">
                                        <p className="text-xs text-primary truncate hover:text-primary transition-colors cursor-default" title={source.url}>
                                            {source.url}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            Scraped: {new Date(source.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            <Modal
                isOpen={isAddNoteModalOpen}
                onClose={() => setIsAddNoteModalOpen(false)}
                title="Add Note"
            >
                <form onSubmit={handleAddNote} className="space-y-4">
                    <textarea
                        required
                        autoFocus
                        placeholder="Write your observation here..."
                        className="w-full h-32 px-4 py-3 bg-secondary border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                        value={noteContent}
                        onChange={(e) => setNoteContent(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="w-full py-4 bg-primary text-black rounded-2xl font-black text-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        Save Note
                    </button>
                </form>
            </Modal>

            <Modal
                isOpen={isAddToListModalOpen}
                onClose={() => {
                    setIsAddToListModalOpen(false);
                    setIsCreatingList(false);
                }}
                title="Save to List"
            >
                <div className="space-y-6">
                    {!isCreatingList ? (
                        <>
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-muted-foreground uppercase">Select Destination List</label>
                                <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                    {lists.map((list) => (
                                        <button
                                            key={list.id}
                                            onClick={() => handleAddToList(list.id)}
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/5 hover:border-primary/50 hover:bg-primary/10 transition-all text-left flex items-center justify-between group"
                                        >
                                            <span className="font-bold">{list.name}</span>
                                            <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors">
                                                {list._count?.companies || 0} companies
                                            </span>
                                        </button>
                                    ))}
                                    {lists.length === 0 && (
                                        <p className="text-center py-4 text-muted-foreground text-sm italic">You don't have any lists yet.</p>
                                    )}
                                </div>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-border" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-2 text-muted-foreground">Or</span>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsCreatingList(true)}
                                className="w-full py-3 rounded-xl border border-dashed border-border hover:border-primary hover:text-primary transition-all font-bold flex items-center justify-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Create New List
                            </button>
                        </>
                    ) : (
                        <form onSubmit={handleCreateListAndAdd} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-muted-foreground uppercase">New List Name</label>
                                <input
                                    type="text"
                                    required
                                    autoFocus
                                    placeholder="e.g. My Favorites"
                                    className="w-full px-4 py-3 bg-secondary border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    value={newListName}
                                    onChange={(e) => setNewListName(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsCreatingList(false)}
                                    className="flex-1 py-3 bg-secondary text-secondary-foreground rounded-xl font-bold hover:bg-secondary/80 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-[2] py-3 bg-primary text-black rounded-xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    Create & Save
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </Modal>
        </div>
    );
}

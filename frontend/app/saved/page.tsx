'use client';

import React from 'react';
import {
    History,
    Search,
    Trash2,
    ArrowRight,
    Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

import { savedSearchService } from '@/services/api';
import { useRouter } from 'next/navigation';
import Modal from '@/components/Modal';
import { toast } from 'react-toastify';

export default function SavedSearchesPage() {
    const [savedSearches, setSavedSearches] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [deleteId, setDeleteId] = React.useState<string | null>(null);
    const router = useRouter();

    const fetchSearches = async () => {
        setLoading(true);
        try {
            const { data } = await savedSearchService.getSavedSearches();
            setSavedSearches(data);
            console.log(data);
        } catch (error) {
            console.error('Failed to fetch searches:', error);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchSearches();
    }, []);

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await savedSearchService.deleteSavedSearch(deleteId);
            setDeleteId(null);
            fetchSearches();
            toast.success('Search deleted successfully');
        } catch (error) {
            console.error('Failed to delete search:', error);
            toast.error('Failed to delete search');
        }
    };

    const runSearch = (search: any) => {
        let filters: { industry?: string; stage?: string } = {};
        try {
            filters = typeof search.filters === 'string' ? JSON.parse(search.filters) : (search.filters || {});
        } catch (e) {
            console.error('Failed to parse filters:', e);
        }

        const params = new URLSearchParams();
        if (search.query) params.set('q', search.query);
        if (filters.industry) params.set('industry', filters.industry);
        if (filters.stage) params.set('stage', filters.stage);

        router.push(`/companies?${params.toString()}`);
    };
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Saved Searches</h1>
                <p className="text-muted-foreground">Quickly jump back into your previous market research.</p>
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="py-20 text-center text-muted-foreground animate-pulse">
                        Loading saved searches...
                    </div>
                ) : savedSearches.length > 0 ? (
                    savedSearches.map((search) => (
                        <div key={search.id} className="glass p-5 rounded-2xl border border-border hover:bg-primary/5 transition-colors group flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground">
                                    <History className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{search.name || search.query || 'Unnamed Search'}</h3>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                        <Filter className="w-3 h-3" />
                                        <span>{typeof search.filters === 'string' ? search.filters : JSON.stringify(search.filters)}</span>
                                        <span className="mx-1">•</span>
                                        <span>{new Date(search.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setDeleteId(search.id)}
                                    className="p-2 rounded-lg hover:bg-red-300/10 text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => runSearch(search)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary border border-border text-sm font-medium hover:bg-primary hover:text-white transition-all"
                                >
                                    Run Search
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-20 text-center glass rounded-3xl border border-dashed border-border">
                        <p className="text-muted-foreground">No saved searches yet.</p>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                title="Confirm Deletion"
            >
                <div className="space-y-6">
                    <p className="text-muted-foreground">Are you sure you want to delete this saved search? This action cannot be undone.</p>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setDeleteId(null)}
                            className="flex-1 py-3 bg-secondary text-secondary-foreground rounded-xl font-bold hover:bg-secondary/80 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            className="flex-1 py-3 bg-red-300 text-white rounded-xl font-bold hover:bg-red-300/90 transition-all"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

'use client';

import React, { useState, useEffect } from 'react';
import {
    Download,
    MoreHorizontal,
    Plus,
    Search,
    LayoutList,
    Building2,
    ChevronRight,
    Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { listService } from '@/services/api';
import Link from 'next/link';
import Modal from '@/components/Modal';

function ClientOnlyDate({ date }: { date: string }) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    if (!mounted) return null;
    return <>Created {new Date(date).toLocaleDateString()}</>;
}

export default function ListsPage() {
    const [lists, setLists] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newListName, setNewListName] = useState('');
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const fetchLists = async () => {
        setLoading(true);
        try {
            const { data } = await listService.getLists();
            setLists(data);
        } catch (error) {
            console.error('Failed to fetch lists:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLists();
    }, []);

    const handleCreateList = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newListName) return;
        try {
            await listService.createList(newListName);
            setIsCreateModalOpen(false);
            setNewListName('');
            fetchLists();
        } catch (error) {
            console.error('Failed to create list:', error);
        }
    };

    const handleDeleteList = async () => {
        if (!deleteId) return;
        try {
            await listService.deleteList(deleteId);
            setDeleteId(null);
            fetchLists();
        } catch (error) {
            console.error('Failed to delete list:', error);
        }
    };

    const handleExport = (list: any) => {
        const exportData = {
            listName: list.name,
            exportedAt: new Date().toISOString(),
            companyCount: list.companies?.length || 0,
            companies: list.companies || []
        };
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `${list.name.replace(/\s+/g, '_')}_export.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight">My Lists</h1>
                    <p className="text-muted-foreground">Manage and export your curated company collections.</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                >
                    <Plus className="w-4 h-4" />
                    Create New List
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full py-20 text-center text-muted-foreground animate-pulse">
                        Loading your lists...
                    </div>
                ) : lists.length > 0 ? (
                    lists.map((list) => (
                        <div key={list.id} className="glass p-6 rounded-3xl border border-border hover:border-primary/50 transition-all group cursor-pointer relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 group-hover:bg-primary/10 transition-colors" />

                            <div className="flex items-start justify-between mb-8 relative z-10">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                                    <LayoutList className="w-6 h-6" />
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setDeleteId(list.id); }}
                                    className="p-2 rounded-lg hover:bg-red-200/10 text-muted-foreground hover:text-red-400 transition-colors text-red-300 cursor-pointer"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="space-y-1 relative z-10">
                                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{list.name}</h3>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Building2 className="w-4 h-4" />
                                    <span>{list._count?.companies || 0} companies</span>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-border/50 flex items-center justify-between relative z-10">
                                <span className="text-xs text-muted-foreground">
                                    <ClientOnlyDate date={list.createdAt} />
                                </span>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleExport(list); }}
                                        className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                                        title="Export as JSON"
                                    >
                                        <Download className="w-4 h-4" />
                                    </button>
                                    <Link href={`/lists/${list.id}`} className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors">
                                        <ChevronRight className="w-5 h-5" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center glass rounded-3xl border border-dashed border-border">
                        <p className="text-muted-foreground mb-4">You haven't created any lists yet.</p>
                        <button onClick={() => setIsCreateModalOpen(true)} className="text-primary hover:underline font-medium">Create your first list</button>
                    </div>
                )}
            </div>

            {/* Create List Modal */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Create New List"
            >
                <form onSubmit={handleCreateList} className="space-y-4">
                    <div className="space-y-3">
                        <label className="text-sm font-bold dark:text-white/70 text-black/70 uppercase ">List Name</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Fortune 500 Targets"
                            className="w-full px-4 py-3 bg-secondary border border-border text-foreground rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            value={newListName}
                            onChange={(e) => setNewListName(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-4 bg-primary text-black rounded-2xl dark:text-white/70 text-black/70 font-black text-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        Create List
                    </button>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                title="Confirm Deletion"
            >
                <div className="space-y-6">
                    <p className="text-foreground">Are you sure you want to delete this list? This action will remove all companies from the collection.</p>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setDeleteId(null)}
                            className="flex-1 py-3 bg-secondary text-secondary-foreground rounded-xl font-bold hover:bg-secondary/80 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDeleteList}
                            className="flex-1 py-3 bg-red-300/5 dark:text-white/70 text-black/70 rounded-xl font-bold hover:bg-red-500/50 transition-all cursor-pointer"
                        >
                            Delete List
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

'use client';
import React, { useState, useEffect, Suspense } from 'react';
import {
    Search,
    ExternalLink,
    Plus,
    Loader2,
    ChevronLeft,
    ChevronRight,
    History
} from 'lucide-react';
import { companyService, listService, savedSearchService } from '@/services/api';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Modal from '@/components/Modal';

function DiscoveryContent() {
    const searchParams = useSearchParams();
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState(searchParams.get('q') || '');
    const [industry, setIndustry] = useState(searchParams.get('industry') || '');
    const [stage, setStage] = useState(searchParams.get('stage') || '');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [lists, setLists] = useState<any[]>([]);

    // Modal State
    const [isSaveSearchModalOpen, setIsSaveSearchModalOpen] = useState(false);
    const [saveSearchName, setSaveSearchName] = useState('');
    const [isAddToListModalOpen, setIsAddToListModalOpen] = useState(false);
    const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
    const [newListName, setNewListName] = useState('');
    const [isCreatingList, setIsCreatingList] = useState(false);

    useEffect(() => {
        setSearch(searchParams.get('q') || '');
        setIndustry(searchParams.get('industry') || '');
        setStage(searchParams.get('stage') || '');
    }, [searchParams]);

    const fetchCompanies = async () => {
        setLoading(true);
        try {
            console.log('Fetching companies. with queries, - ', search, industry, stage, page, sortBy, sortOrder);
            const { data } = await companyService.getCompanies({
                search,
                industry,
                stage,
                page,
                limit: 10,
                sortBy,
                sortOrder
            });
            setCompanies(data.data);
            setTotalPages(data.meta.totalPages);
        } catch (error) {
            console.error('Failed to fetch companies:', error);
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
        const timer = setTimeout(() => {
            fetchCompanies();
        }, 300);
        return () => clearTimeout(timer);
    }, [search, industry, stage, page, sortBy, sortOrder]);

    useEffect(() => {
        fetchLists();
    }, []);

    const handleSaveSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!saveSearchName) return;

        const filters = { industry, stage };
        try {
            await savedSearchService.saveSearch(saveSearchName, search, filters);
            setIsSaveSearchModalOpen(false);
            setSaveSearchName('');
            // Optional: Show success toast
        } catch (error) {
            console.error('Failed to save search:', error);
        }
    };

    const handleCreateListAndAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newListName || !selectedCompanyId) return;

        try {
            const { data: newList } = await listService.createList(newListName);
            await listService.addToList(newList.id, selectedCompanyId);
            setIsAddToListModalOpen(false);
            setNewListName('');
            setIsCreatingList(false);
            fetchLists();
        } catch (error) {
            console.error('Failed to create list and add company:', error);
        }
    };

    const handleAddToList = async (listId: string) => {
        if (!selectedCompanyId) return;
        try {
            await listService.addToList(listId, selectedCompanyId);
            setIsAddToListModalOpen(false);
        } catch (error) {
            console.error('Failed to add to list:', error);
        }
    };


    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Discovery</h1>
                <p className="text-muted-foreground">Find and track high-potential companies.</p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
                <div className="relative flex-1 min-w-[300px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search companies by name, keywords..."
                        className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-foreground transition-all"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <select
                    className="px-2 py-2.5 bg-card border border-border text-foreground rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                >
                    <option value="">All Industries</option>
                    <option value="Software">Software</option>
                    <option value="Energy">Energy</option>
                    <option value="Finance">Finance</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Transportation">Transportation</option>
                </select>

                <select
                    className="px-2 py-2.5 bg-card border border-border text-foreground rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                    value={stage}
                    onChange={(e) => setStage(e.target.value)}
                >
                    <option value="">All Stages</option>
                    <option value="Seed">Seed</option>
                    <option value="Series A">Series A</option>
                    <option value="Series B">Series B</option>
                    <option value="Series C">Series C</option>
                    <option value="Late Stage">Late Stage</option>
                </select>

                <button
                    onClick={() => {
                        setSaveSearchName(search || 'My Search');
                        setIsSaveSearchModalOpen(true);
                    }}
                    className="px-4 py-2.5 bg-secondary text-foreground rounded-xl hover:bg-primary hover:text-white transition-all flex items-center gap-2 font-medium border border-border"
                >
                    <History className="w-4 h-4" />
                    Save Search
                </button>
            </div>

            <div className="glass rounded-2xl border border-border overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-border bg-secondary/50">
                            <th className="px-6 py-4 font-medium text-muted-foreground">Company</th>
                            <th className="px-6 py-4 font-medium text-muted-foreground">Industry</th>
                            <th className="px-6 py-4 font-medium text-muted-foreground">Stage</th>
                            <th className="px-6 py-4 font-medium text-muted-foreground">Location</th>
                            <th className="px-6 py-4 font-medium text-muted-foreground text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td colSpan={5} className="px-6 py-8">
                                        <div className="h-4 bg-muted rounded w-full" />
                                    </td>
                                </tr>
                            ))
                        ) : companies ? (
                            companies.map((company: any) => (
                                <tr key={company.id} className="hover:bg-primary/5 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-foreground">{company.name}</span>
                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                {company.url} <ExternalLink className="w-3 h-3" />
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 rounded-md bg-secondary text-xs font-medium">
                                            {company.industry || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-foreground">{company.stage || 'N/A'}</td>
                                    <td className="px-6 py-4 text-sm text-muted-foreground">{company.location || 'Unknown'}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/companies/${company.id}`}
                                                className="p-2 rounded-lg hover:bg-primary/20 text-primary transition-colors"
                                            >
                                                View Company Profile
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    setSelectedCompanyId(company.id);
                                                    setIsAddToListModalOpen(true);
                                                }}
                                                className="p-2 rounded-lg hover:bg-secondary transition-colors cursor-pointer"
                                                title="Add to List"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                                    No companies found matching your criteria.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-secondary/30">
                    <p className="text-sm text-muted-foreground">
                        Page {page} of {totalPages}
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            className="p-2 rounded-lg hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            className="p-2 rounded-lg hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Save Search Modal */}
            <Modal
                isOpen={isSaveSearchModalOpen}
                onClose={() => setIsSaveSearchModalOpen(false)}
                title="Save Search"
            >
                <form onSubmit={handleSaveSearch} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-muted-foreground uppercase">Search Name</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Fintech Seed Startups"
                            className="w-full px-4 py-3 bg-secondary border border-border text-foreground rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            value={saveSearchName}
                            onChange={(e) => setSaveSearchName(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-2 pt-2">
                        <div className="text-xs text-muted-foreground bg-secondary p-3 rounded-lg border border-border">
                            <p className="font-bold mb-1 uppercase text-[10px]">Filters to be saved:</p>
                            <p>Query: {search || 'None'}</p>
                            <p>Industry: {industry || 'All'}</p>
                            <p>Stage: {stage || 'All'}</p>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full py-4 bg-primary text-black rounded-2xl font-black text-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        Save Search
                    </button>
                </form>
            </Modal>

            {/* Add to List Modal */}
            <Modal
                isOpen={isAddToListModalOpen}
                onClose={() => {
                    setIsAddToListModalOpen(false);
                    setIsCreatingList(false);
                }}
                title="Add to List"
            >
                <div className="space-y-6">
                    {!isCreatingList ? (
                        <>
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-muted-foreground uppercase">Select Departure List</label>
                                <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                    {lists.map((list) => (
                                        <button
                                            key={list.id}
                                            onClick={() => handleAddToList(list.id)}
                                            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border hover:border-primary/50 hover:bg-primary/10 transition-all text-left flex items-center justify-between group"
                                        >
                                            <span className="font-bold text-foreground">{list.name}</span>
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
                                    className="w-full px-4 py-3 bg-secondary border border-border text-foreground rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
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
                                    Create & Add
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </Modal>
        </div >
    );
}

export default function DiscoveryPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        }>
            <DiscoveryContent />
        </Suspense>
    );
}
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Trash2,
    Building2,
    ExternalLink,
    ChevronRight
} from 'lucide-react';
import { listService } from '@/services/api';
import Link from 'next/link';
import Modal from '@/components/Modal';

export default function ListDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [list, setList] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [removingCompanyId, setRemovingCompanyId] = useState<string | null>(null);

    const fetchListDetails = async () => {
        setLoading(true);
        try {
            const { data } = await listService.getLists();
            const currentList = data.find((l: any) => l.id === id);
            setList(currentList);
        } catch (error) {
            console.error('Failed to fetch list details:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchListDetails();
    }, [id]);

    const handleRemoveCompany = async () => {
        if (!removingCompanyId) return;
        try {
            await listService.removeFromList(id as string, removingCompanyId);
            setRemovingCompanyId(null);
            fetchListDetails();
        } catch (error) {
            console.error('Failed to remove company from list:', error);
        }
    };

    if (loading) return <div className="py-20 text-center text-muted-foreground animate-pulse">Loading list...</div>;
    if (!list) return <div className="py-20 text-center text-muted-foreground">List not found.</div>;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Lists
                </button>
            </div>

            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-bold tracking-tight">{list.name}</h1>
                <p className="text-muted-foreground">Curated collection of {list._count?.companies || 0} companies.</p>
            </div>

            <div className="glass rounded-3xl border border-border/50 overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-border/50 bg-white/5">
                            <th className="px-6 py-4 font-medium text-muted-foreground">Company</th>
                            <th className="px-6 py-4 font-medium text-muted-foreground">Industry</th>
                            <th className="px-6 py-4 font-medium text-muted-foreground">Stage</th>
                            <th className="px-6 py-4 font-medium text-muted-foreground text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {list.companies?.length > 0 ? (
                            list.companies.map((company: any) => (
                                <tr key={company.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-semibold">{company.name}</span>
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
                                    <td className="px-6 py-4 text-sm font-medium">{company.stage || 'N/A'}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/companies/${company.id}`}
                                                className="p-2 rounded-lg hover:bg-primary/20 text-primary transition-colors"
                                            >
                                                View Profile
                                            </Link>
                                            <button
                                                onClick={() => setRemovingCompanyId(company.id)}
                                                className="p-2 rounded-lg hover:bg-red-300/10 text-red-300 transition-colors"
                                                title="Remove from List"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground italic">
                                    No companies in this list yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Remove Confirmation Modal */}
            <Modal
                isOpen={!!removingCompanyId}
                onClose={() => setRemovingCompanyId(null)}
                title="Remove Company"
            >
                <div className="space-y-6">
                    <p className="text-muted-foreground">Are you sure you want to remove this company from the list? This won't delete the company from the platform.</p>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setRemovingCompanyId(null)}
                            className="flex-1 py-3 bg-secondary text-secondary-foreground rounded-xl font-bold hover:bg-secondary/80 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleRemoveCompany}
                            className="flex-1 py-3 bg-red-300 text-white rounded-xl font-bold hover:bg-red-300/90 transition-all"
                        >
                            Remove
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

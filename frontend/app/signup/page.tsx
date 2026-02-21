'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { authService } from '@/services/api';
import { motion } from 'framer-motion';
import {
    Mail,
    Lock,
    User,
    ArrowRight,
    Loader2,
    Eye,
    EyeOff
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import AppIcon from '@/components/Appicon';
import { toast } from 'react-toastify';

export default function SignupPage() {
    const { login } = useAuthStore();
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await authService.signup({ name, email, password });
            login(res.data.token, res.data.user);
            toast.success('Account created successfully! Welcome to Xartup.');
            router.push('/companies');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to sign up');
            toast.error(err.response?.data?.error || 'Failed to sign up');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.05),transparent)]">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md space-y-8"
            >
                <div className="text-center space-y-2">
                    <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
                        <AppIcon />
                        <span className="text-xl font-bold tracking-tight">Xartup</span>
                    </Link>
                    <h1 className="text-3xl font-black tracking-tighter">Create Account</h1>
                    <p className="text-muted-foreground text-sm">Join the next wave of founders and innovators.</p>
                </div>

                <form onSubmit={handleSubmit} className="glass p-8 rounded-3xl border border-border space-y-6">
                    {error && (
                        <div className="p-4 rounded-xl bg-red-300/10 border border-red-300/20 text-red-300 text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-muted-foreground uppercase ml-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    required
                                    placeholder="John Doe"
                                    className="w-full pl-10 pr-4 py-3 bg-secondary border border-border text-foreground rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground/50"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-muted-foreground uppercase ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="email"
                                    required
                                    placeholder="name@example.com"
                                    className="w-full pl-10 pr-4 py-3 bg-secondary border border-border text-foreground rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground/50"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-muted-foreground uppercase ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-12 py-3 bg-secondary border border-border text-foreground rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground/50"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <button
                        disabled={loading}
                        className="w-full py-4 bg-primary text-black rounded-2xl font-black text-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none shadow-xl shadow-primary/20"
                    >
                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                            <>
                                Get Started
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>

                    <p className="text-center text-sm text-muted-foreground">
                        Already have an account? <Link href="/login" className="text-primary font-bold hover:underline">Sign In</Link>
                    </p>
                </form>
            </motion.div>
        </div>
    );
}

'use client';

import React, { useState } from 'react';
import {
    User,
    Bell,
    Lock,
    Moon,
    Sun,
    Globe,
    Shield,
    CreditCard
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
    const [darkMode, setDarkMode] = useState(true);
    const [profile, setProfile] = useState({
        name: 'Mohd Bilal',
        email: 'bilal@example.com',
        role: 'Venture Analyst',
        avatar: 'MB'
    });

    return (
        <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">Manage your account preferences and application settings.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Sidebar Nav */}
                <div className="flex flex-col gap-1">
                    <button className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-primary/10 text-primary font-medium text-left">
                        <User className="w-4 h-4" />
                        Profile
                    </button>
                    <button className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-muted-foreground hover:bg-white/5 hover:text-white transition-all text-left">
                        <Bell className="w-4 h-4" />
                        Notifications
                    </button>
                    <button className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-muted-foreground hover:bg-white/5 hover:text-white transition-all text-left">
                        <Lock className="w-4 h-4" />
                        Security
                    </button>
                    <button className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-muted-foreground hover:bg-white/5 hover:text-white transition-all text-left">
                        <CreditCard className="w-4 h-4" />
                        Billing
                    </button>
                </div>

                {/* Main Content */}
                <div className="md:col-span-3 space-y-8">
                    {/* Profile Section */}
                    <section className="glass p-8 rounded-3xl border border-border/50 space-y-8">
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-primary text-2xl font-bold border-2 border-primary/50">
                                {profile.avatar}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">{profile.name}</h3>
                                <p className="text-muted-foreground">{profile.role}</p>
                                <button className="mt-2 text-sm text-primary hover:underline">Change Avatar</button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                                <input
                                    type="text"
                                    value={profile.name}
                                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                                <input
                                    type="email"
                                    value={profile.email}
                                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button className="px-6 py-2.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                                Save Changes
                            </button>
                        </div>
                    </section>

                    {/* Preferences */}
                    <section className="glass p-8 rounded-3xl border border-border/50">
                        <h3 className="text-lg font-bold mb-6">App Preferences</h3>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground">
                                        {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <p className="font-semibold">Dark Mode</p>
                                        <p className="text-sm text-muted-foreground">Toggle application theme</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setDarkMode(!darkMode)}
                                    className={cn(
                                        "w-12 h-6 rounded-full transition-colors relative",
                                        darkMode ? "bg-primary" : "bg-muted"
                                    )}
                                >
                                    <div className={cn(
                                        "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                                        darkMode ? "left-7" : "left-1"
                                    )} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground">
                                        <Globe className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">Language</p>
                                        <p className="text-sm text-muted-foreground">System language preference</p>
                                    </div>
                                </div>
                                <select className="bg-secondary border border-border rounded-lg px-3 py-1.5 text-sm outline-none">
                                    <option>English (US)</option>
                                    <option>Spanish</option>
                                    <option>French</option>
                                </select>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

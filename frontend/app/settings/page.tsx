'use client';

import React, { useState, useEffect } from 'react';
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
import { useAuthStore } from '@/store/useAuthStore';
import { authService } from '@/services/api';
import { Loader2 } from 'lucide-react';

export default function SettingsPage() {
    const { user, loading, updateUser } = useAuthStore();
    const [darkMode, setDarkMode] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        role: 'Venture Analyst',
        avatar: ''
    });

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            setDarkMode(false);
        }
    }, []);

    useEffect(() => {
        if (user) {
            setProfile({
                name: user.name || 'Anonymous User',
                email: user.email,
                role: 'Venture Analyst',
                avatar: (user.name || 'A').split(' ').map((n: string) => n[0]).join('').toUpperCase()
            });
        }
    }, [user]);

    // Handle Dark Mode toggle
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const { data } = await authService.updateMe({
                name: profile.name,
                email: profile.email
            });
            updateUser(data);
            alert('Profile updated successfully!');
        } catch (error: any) {
            console.error('Failed to update profile:', error);
            alert(error.response?.data?.error || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    const buttons = [
        {
            title: "Profile",
            icon: User,
            active: true
        },
        /*  {
              title: "Notifications",
              icon: Bell,
              active: false
          },
          {
              title: "Security",
              icon: Lock,
              active: false
          },
          {
              title: "Billing",
              icon: CreditCard,
              active: false
          }*/
    ]
    return (
        <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">Manage your account preferences and application settings.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Sidebar Nav */}
                <div className="flex flex-col gap-1">
                    {
                        buttons.map((button, index) => {
                            return (
                                <button key={index} className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-primary/10 text-primary font-medium text-left">
                                    <button.icon className="w-4 h-4" />
                                    {button.title}
                                </button>
                            )
                        })
                    }

                </div>

                {/* Main Content */}
                <div className="md:col-span-3 space-y-8">
                    {/* Profile Section */}
                    <section className="glass p-8 rounded-3xl border border-border space-y-8">
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-primary text-2xl font-bold border-2 border-primary/50">
                                {profile.avatar}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-foreground">{profile.name}</h3>
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
                                    className="w-full px-4 py-2.5 bg-secondary border border-border text-foreground rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                                <input
                                    type="email"
                                    value={profile.email}
                                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-secondary border border-border text-foreground rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="px-6 py-2.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
                            >
                                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </section>

                    {/* Preferences */}
                    <section className="glass p-8 rounded-3xl border border-border">
                        <h3 className="text-lg font-bold mb-6">App Preferences</h3>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground">
                                        {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-foreground">Dark Mode</p>
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


                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

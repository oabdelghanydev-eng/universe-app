// Header Component - Main navigation
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import { logoutUser, checkRegistrationStatus } from '@/actions/auth';
import Logo from '@/components/ui/Logo';
import { Plus, User, CheckCircle2, LayoutGrid, LogOut, ChevronDown } from 'lucide-react';

interface UserState {
    isLoggedIn: boolean;
    isRegistered: boolean;
    fullName?: string;
    photoURL?: string;
}

export default function Header() {
    const router = useRouter();
    const [user, setUser] = useState<UserState | null>(null);
    const [loading, setLoading] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function checkAuth() {
            try {
                const result = await checkRegistrationStatus();
                if (result.success && result.data) {
                    setUser({
                        isLoggedIn: result.data.isLoggedIn,
                        isRegistered: result.data.isRegistered,
                        fullName: result.data.user?.fullName,
                        photoURL: undefined,
                    });
                }
            } catch (error) {
                console.error('Auth check error:', error);
            } finally {
                setLoading(false);
            }
        }

        checkAuth();

        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                setUser(prev => prev ? { ...prev, photoURL: firebaseUser.photoURL || undefined } : prev);
            }
        });

        return () => unsubscribe();
    }, []);

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    async function handleLogout() {
        try {
            await signOut(auth);
            await logoutUser();
            setUser(null);
            router.push('/');
            router.refresh();
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    return (
        <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-[var(--glass-border)]">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="block scale-90 sm:scale-100 transition-opacity hover:opacity-90"
                    >
                        <Logo size="md" />
                    </Link>

                    {/* Navigation */}
                    <nav className="flex items-center gap-4">
                        {loading ? (
                            <div className="w-24 h-9 skeleton rounded-lg" />
                        ) : user?.isLoggedIn && user?.isRegistered ? (
                            <div className="flex items-center gap-3">
                                {/* New Listing Button */}
                                <Link
                                    href="/listing/new"
                                    className="btn btn-primary btn-sm flex items-center gap-1.5"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span className="hidden sm:inline">انشر إعلان</span>
                                </Link>

                                {/* User Menu */}
                                <div className="relative" ref={menuRef}>
                                    <button
                                        onClick={() => setMenuOpen(!menuOpen)}
                                        className="flex items-center gap-2 p-1.5 rounded-xl glass-subtle hover:bg-[var(--glass-bg-elevated)] transition-all duration-200"
                                        aria-expanded={menuOpen}
                                        aria-haspopup="true"
                                    >
                                        {user.photoURL ? (
                                            <img
                                                src={user.photoURL}
                                                alt=""
                                                className="w-8 h-8 rounded-lg object-cover ring-2 ring-[var(--glass-border-strong)]"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-nebula-500 to-stellar-500 flex items-center justify-center text-white">
                                                <User className="w-4 h-4" />
                                            </div>
                                        )}
                                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {menuOpen && (
                                        <div className="absolute left-0 mt-2 w-56 glass-elevated rounded-xl shadow-glass overflow-hidden animate-fade-slide-up">
                                            {/* User Info */}
                                            <div className="px-4 py-3 border-b border-[var(--glass-border)]">
                                                <p className="font-semibold text-[var(--text-primary)] truncate">
                                                    {user.fullName}
                                                </p>
                                                <p className="text-xs text-[var(--text-muted)] mt-0.5 flex items-center gap-1">
                                                    طالب موثّق <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                                                </p>
                                            </div>

                                            {/* Menu Items */}
                                            <div className="py-1">
                                                <Link
                                                    href="/profile"
                                                    className="flex items-center gap-3 px-4 py-2.5 text-[var(--text-secondary)] hover:bg-[var(--glass-bg)] hover:text-[var(--text-primary)] transition-colors"
                                                    onClick={() => setMenuOpen(false)}
                                                >
                                                    <LayoutGrid className="w-4 h-4" />
                                                    إعلاناتي
                                                </Link>

                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-[var(--aurora-danger)] hover:bg-[var(--aurora-danger-muted)] transition-colors"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    تسجيل خروج
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : user?.isLoggedIn && !user?.isRegistered ? (
                            <Link
                                href="/register"
                                className="btn btn-primary btn-sm"
                            >
                                أكمل التسجيل
                            </Link>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/login"
                                    className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-medium transition-colors"
                                >
                                    تسجيل الدخول
                                </Link>
                                <Link
                                    href="/register"
                                    className="btn btn-primary btn-sm"
                                >
                                    إنشاء حساب
                                </Link>
                            </div>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
}

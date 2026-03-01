import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useDarkMode from '../hooks/useDarkMode';
import Button from '../components/Button';
import ConfirmDialog from '../components/ConfirmDialog';

export default function AppLayout() {
    const { user, logout, isAdmin, overdueLoans } = useAuth();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const { isDark, toggle } = useDarkMode();
    const navigate = useNavigate();
    const navLinkClass = ({ isActive }) =>
        `rounded-full px-3 py-1 text-sm font-semibold transition ${
            isActive
                ? 'bg-indigo-50 text-indigo-700 shadow-sm dark:bg-indigo-500/20 dark:text-indigo-200'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/70 dark:hover:text-white'
        }`;

    const handleLogout = async () => {
        setShowLogoutConfirm(true);
    };

    const confirmLogout = async () => {
        try {
            await logout();
        } finally {
            setShowLogoutConfirm(false);
            navigate('/login', { replace: true });
        }
    };

    const cancelLogout = () => {
        setShowLogoutConfirm(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
            <header className="relative overflow-hidden border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-indigo-50 via-white to-emerald-50 dark:from-indigo-950/40 dark:via-slate-950 dark:to-emerald-950/30"
                />
                <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
                    <Link to="/" className="text-lg font-bold tracking-tight text-indigo-600 dark:text-indigo-300">
                        PustakaDinamis
                    </Link>
                    <nav className="flex items-center gap-4 text-sm font-semibold">
                        <NavLink
                            to="/"
                            end
                            className={navLinkClass}
                        >
                            Buku
                        </NavLink>
                        {user && (
                            <NavLink
                                to="/loans"
                                className={navLinkClass}
                            >
                                Pinjaman Saya
                            </NavLink>
                        )}
                        {isAdmin && (
                            <>
                                <NavLink
                                    to="/admin/books"
                                    className={navLinkClass}
                                >
                                    Kelola Buku
                                </NavLink>
                                <NavLink
                                    to="/admin/loans"
                                    className={navLinkClass}
                                >
                                    Data Pinjaman
                                </NavLink>
                            </>
                        )}
                    </nav>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={toggle}
                            className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-indigo-400 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-200"
                        >
                            {isDark ? 'White Mode' : 'Dark Mode'}
                        </button>
                        {user ? (
                            <>
                                <span className="hidden text-xs text-slate-500 dark:text-slate-400 sm:inline">
                                    {user.name} - {user.role}
                                </span>
                                <Button variant="secondary" onClick={handleLogout}>
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link
                                    to="/login"
                                    className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-indigo-400/60 dark:hover:text-indigo-200"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-500 hover:shadow-md dark:bg-indigo-500 dark:hover:bg-indigo-400"
                                >
                                    Signup
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {user && overdueLoans.length > 0 && (
                <div className="border-b border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/30 dark:bg-rose-950">
                    <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 text-sm">
                        <span>
                            Ada {overdueLoans.length} pinjaman melewati batas waktu. Segera kembalikan untuk menjaga akses peminjaman.
                        </span>
                        <Link to="/loans" className="text-sm font-semibold underline">
                            Lihat detail
                        </Link>
                    </div>
                </div>
            )}

            <main className="mx-auto w-full max-w-6xl px-4 py-8">
                <Outlet />
            </main>

            <ConfirmDialog
                open={showLogoutConfirm}
                title="Konfirmasi Logout"
                description="Apakah Anda yakin ingin logout dari aplikasi?"
                onConfirm={confirmLogout}
                onCancel={cancelLogout}
            />
        </div>
    );
}

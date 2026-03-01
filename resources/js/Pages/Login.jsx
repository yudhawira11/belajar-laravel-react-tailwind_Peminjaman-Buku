import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');
        try {
            await login({ email, password });
            const redirectTo = location.state?.from?.pathname || '/';
            navigate(redirectTo, { replace: true });
        } catch (err) {
            setError(err?.response?.data?.message || 'Email atau password salah.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="relative mx-auto max-w-2xl">
            <div
                aria-hidden
                className="pointer-events-none absolute -left-16 -top-20 h-44 w-44 rounded-full bg-indigo-200/70 blur-3xl dark:bg-indigo-500/20"
            />
            <div
                aria-hidden
                className="pointer-events-none absolute -bottom-20 right-0 h-40 w-40 rounded-full bg-emerald-200/70 blur-3xl dark:bg-emerald-500/20"
            />
            <div className="relative rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/80">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <span className="inline-flex rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200">
                            Masuk
                        </span>
                        <h1 className="mt-3 text-2xl font-semibold">Masuk ke Akun</h1>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                            Selamat datang kembali. Kelola pinjaman bukumu dengan cepat.
                        </p>
                    </div>
                    <div className="hidden sm:flex flex-col items-end text-xs text-slate-500 dark:text-slate-400">
                        <span>Perpustakaan Digital</span>
                        <span className="font-semibold text-indigo-600 dark:text-indigo-300">PustakaDinamis</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <Input
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    {error && <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-600">{error}</div>}

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Memproses...' : 'Login'}
                    </Button>
                </form>

                <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
                    Belum punya akun?{' '}
                    <Link to="/signup" className="font-semibold text-indigo-600 dark:text-indigo-300">
                        Daftar sekarang
                    </Link>
                </p>
            </div>
        </section>
    );
}

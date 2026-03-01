import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';

export default function Signup() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true);
        try {
            await register(form);
            navigate('/', { replace: true });
        } catch (err) {
            setError(err?.response?.data?.message || 'Gagal membuat akun.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="relative mx-auto max-w-2xl">
            <div
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-emerald-200/70 blur-3xl dark:bg-emerald-500/20"
            />
            <div
                aria-hidden
                className="pointer-events-none absolute -bottom-20 left-0 h-40 w-40 rounded-full bg-indigo-200/70 blur-3xl dark:bg-indigo-500/20"
            />
            <div className="relative rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/80">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200">
                            Daftar
                        </span>
                        <h1 className="mt-3 text-2xl font-semibold">Buat Akun Baru</h1>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                            Daftar untuk mulai meminjam dan melacak buku favoritmu.
                        </p>
                    </div>
                    <div className="hidden sm:flex flex-col items-end text-xs text-slate-500 dark:text-slate-400">
                        <span>Mulai petualangan baca</span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-300">Gratis & cepat</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <Input name="name" label="Nama Lengkap" value={form.name} onChange={handleChange} required />
                    <Input name="email" label="Email" type="email" value={form.email} onChange={handleChange} required />
                    <Input
                        name="password"
                        label="Password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        name="password_confirmation"
                        label="Konfirmasi Password"
                        type="password"
                        value={form.password_confirmation}
                        onChange={handleChange}
                        required
                    />

                    {error && <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-600">{error}</div>}

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Membuat akun...' : 'Signup'}
                    </Button>
                </form>

                <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
                    Sudah punya akun?{' '}
                    <Link to="/login" className="font-semibold text-indigo-600 dark:text-indigo-300">
                        Login
                    </Link>
                </p>
            </div>
        </section>
    );
}

import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
            <h1 className="text-3xl font-semibold">Halaman tidak ditemukan</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
                Sepertinya kamu tersesat. Kembali ke beranda untuk melihat daftar buku.
            </p>
            <Link to="/" className="text-sm font-semibold text-indigo-600 dark:text-indigo-300">
                Kembali ke Beranda
            </Link>
        </div>
    );
}

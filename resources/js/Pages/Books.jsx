import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import Badge from '../components/Badge';
import Button from '../components/Button';

export default function Books() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState('');
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState(null);

    useEffect(() => {
        let active = true;
        const fetchBooks = async () => {
            setLoading(true);
            try {
                const { data } = await api.get('/books', {
                    params: {
                        page,
                        per_page: 10,
                        search: query || undefined,
                    },
                });
                if (active) {
                    setBooks(data.data || []);
                    setMeta(data.meta || null);
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };
        fetchBooks();
        return () => {
            active = false;
        };
    }, [page, query]);

    const totalBooks = meta?.total ?? books.length;
    const currentPage = meta?.current_page ?? page;
    const lastPage = meta?.last_page ?? 1;
    const pageItems = Array.from({ length: lastPage }, (_, index) => index + 1).filter((p) => {
        if (lastPage <= 5) return true;
        if (p === 1 || p === lastPage) return true;
        return Math.abs(p - currentPage) <= 1;
    });

    return (
        <section className="space-y-6">
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
                <div
                    aria-hidden
                    className="pointer-events-none absolute -right-10 -top-16 h-40 w-40 rounded-full bg-indigo-200/70 blur-3xl dark:bg-indigo-500/20"
                />
                <div
                    aria-hidden
                    className="pointer-events-none absolute -bottom-16 left-10 h-32 w-32 rounded-full bg-emerald-200/70 blur-3xl dark:bg-emerald-500/20"
                />
                <div className="relative space-y-4">
                    <div>
                        <span className="inline-flex rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200">
                            Koleksi Terbaru
                        </span>
                    </div>
                    <div>
                        <h1 className="text-2xl font-semibold">Katalog Buku</h1>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                            Pilih buku favoritmu, cek ketersediaan, lalu pinjam langsung dari dashboard.
                        </p>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <input
                            value={query}
                            onChange={(event) => {
                                setQuery(event.target.value);
                                setPage(1);
                            }}
                            placeholder="Cari judul, penulis, atau penerbit..."
                            className="w-full flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/30"
                        />
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                            {totalBooks} buku tersedia
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="text-sm text-slate-500">Memuat daftar buku...</div>
            ) : (
                <>
                    <div className="grid gap-5 md:grid-cols-2">
                        {books.length === 0 && (
                            <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700">
                                Buku tidak ditemukan.
                            </div>
                        )}
                        {books.map((book) => {
                            const availability =
                                book.stock === 0 ? (
                                    <Badge tone="empty">Stok habis</Badge>
                                ) : book.stock <= 3 ? (
                                    <Badge tone="low">Stok menipis</Badge>
                                ) : (
                                    <Badge tone="available">Tersedia</Badge>
                                );
                            return (
                                <div
                                    key={book.id}
                                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-500/40"
                                >
                                    <div
                                        aria-hidden
                                        className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100"
                                    >
                                        <div className="absolute -right-10 -top-12 h-24 w-24 rounded-full bg-indigo-100 blur-2xl dark:bg-indigo-500/20" />
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-lg font-semibold">{book.title}</h2>
                                            {availability}
                                        </div>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            {book.author} {'\u00b7'} {book.publisher} {'\u00b7'} {book.year}
                                        </p>
                                        <p className="text-sm text-slate-600 dark:text-slate-300">
                                            {book.description || 'Deskripsi belum tersedia.'}
                                        </p>
                                    </div>
                                    <div className="mt-4 flex items-center justify-between text-sm">
                                        <span className="text-slate-500 dark:text-slate-400">Stok: {book.stock}</span>
                                        <Link
                                            to={`/books/${book.id}`}
                                            className="font-semibold text-indigo-600 transition hover:text-indigo-500 dark:text-indigo-300"
                                        >
                                            Lihat detail
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    {lastPage > 1 && (
                        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                            <Button variant="secondary" onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                                Sebelumnya
                            </Button>
                            {pageItems.map((pageNumber, index) => (
                                <React.Fragment key={pageNumber}>
                                    {index > 0 && pageNumber - pageItems[index - 1] > 1 && (
                                        <span className="px-2 text-sm text-slate-400">...</span>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => setPage(pageNumber)}
                                        className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                                            pageNumber === currentPage
                                                ? 'bg-indigo-600 text-white shadow-sm'
                                                : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'
                                        }`}
                                    >
                                        {pageNumber}
                                    </button>
                                </React.Fragment>
                            ))}
                            <Button
                                variant="secondary"
                                onClick={() => setPage((prev) => Math.min(prev + 1, lastPage))}
                                disabled={currentPage === lastPage}
                            >
                                Berikutnya
                            </Button>
                        </div>
                    )}
                </>
            )}
        </section>
    );
}

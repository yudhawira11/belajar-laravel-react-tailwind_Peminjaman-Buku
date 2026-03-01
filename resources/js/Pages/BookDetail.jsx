import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/client';
import Badge from '../components/Badge';
import Button from '../components/Button';

export default function BookDetail() {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [borrowing, setBorrowing] = useState(false);
    const [days, setDays] = useState(7);
    const [message, setMessage] = useState('');

    useEffect(() => {
        let active = true;
        const fetchBook = async () => {
            try {
                const { data } = await api.get(`/books/${id}`);
                if (active) {
                    setBook(data.data);
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };
        fetchBook();
        return () => {
            active = false;
        };
    }, [id]);

    const handleBorrow = async () => {
        setBorrowing(true);
        setMessage('');
        try {
            const { data } = await api.post('/loans', { book_id: book.id, days });
            setBook((prev) => ({ ...prev, stock: Math.max(prev.stock - 1, 0) }));
            setMessage(`Berhasil meminjam. Batas waktu: ${data.data.due_at_human}.`);
        } catch (error) {
            const errorMessage = error?.response?.data?.message || 'Gagal meminjam buku.';
            setMessage(errorMessage);
        } finally {
            setBorrowing(false);
        }
    };

    if (loading) {
        return <div className="text-sm text-slate-500">Memuat detail buku...</div>;
    }

    if (!book) {
        return <div className="text-sm text-slate-500">Buku tidak ditemukan.</div>;
    }

    const availability =
        book.stock === 0 ? (
            <Badge tone="empty">Stok habis</Badge>
        ) : book.stock <= 3 ? (
            <Badge tone="low">Stok menipis</Badge>
        ) : (
            <Badge tone="available">Tersedia</Badge>
        );

    return (
        <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
            <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">{book.title}</h1>
                    {availability}
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    {book.author} · {book.publisher} · {book.year}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                    {book.description || 'Deskripsi belum tersedia.'}
                </p>
                <div className="flex flex-wrap gap-3 text-sm text-slate-500 dark:text-slate-400">
                    <span>ISBN: {book.isbn || '-'}</span>
                    <span>Stok tersedia: {book.stock}</span>
                </div>
            </div>
            <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <h2 className="text-lg font-semibold">Pinjam Buku</h2>
                <label className="text-sm text-slate-600 dark:text-slate-300">
                    Durasi peminjaman (hari)
                    <input
                        type="number"
                        min="1"
                        max="30"
                        value={days}
                        onChange={(event) => setDays(Number(event.target.value || 1))}
                        className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                    />
                </label>
                <Button onClick={handleBorrow} disabled={borrowing || book.stock === 0} className="w-full">
                    {borrowing ? 'Memproses...' : 'Pinjam Sekarang'}
                </Button>
                {message && (
                    <p className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
                        {message}
                    </p>
                )}
            </div>
        </section>
    );
}

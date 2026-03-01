import React, { useEffect, useState } from 'react';
import api from '../api/client';
import Button from '../components/Button';
import Input from '../components/Input';

const emptyForm = {
    id: null,
    title: '',
    author: '',
    publisher: '',
    year: new Date().getFullYear(),
    isbn: '',
    stock: 1,
    description: '',
};

export default function AdminBooks() {
    const [books, setBooks] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState(null);

    const fetchBooks = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/books', {
                params: {
                    page,
                    per_page: 10,
                    search: search || undefined,
                },
            });
            setBooks(data.data || []);
            setMeta(data.meta || null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, [page, search]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage('');
        try {
            if (form.id) {
                await api.put(`/books/${form.id}`, form);
                setMessage('Buku berhasil diperbarui.');
            } else {
                await api.post('/books', form);
                setMessage('Buku baru berhasil ditambahkan.');
            }
            setForm(emptyForm);
            fetchBooks();
        } catch (error) {
            setMessage(error?.response?.data?.message || 'Gagal menyimpan buku.');
        }
    };

    const handleEdit = (book) => {
        setForm({
            id: book.id,
            title: book.title,
            author: book.author,
            publisher: book.publisher,
            year: book.year,
            isbn: book.isbn || '',
            stock: book.stock,
            description: book.description,
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (bookId) => {
        if (!window.confirm('Hapus buku ini?')) {
            return;
        }
        setMessage('');
        try {
            await api.delete(`/books/${bookId}`);
            setMessage('Buku berhasil dihapus.');
            fetchBooks();
        } catch (error) {
            setMessage(error?.response?.data?.message || 'Gagal menghapus buku.');
        }
    };

    return (
        <section className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <h1 className="text-2xl font-semibold">Manajemen Buku</h1>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Tambah, ubah, atau hapus koleksi buku perpustakaan.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
                    <Input name="title" label="Judul" value={form.title} onChange={handleChange} required />
                    <Input name="author" label="Penulis" value={form.author} onChange={handleChange} required />
                    <Input name="publisher" label="Penerbit" value={form.publisher} onChange={handleChange} required />
                    <Input name="year" label="Tahun" type="number" value={form.year} onChange={handleChange} required />
                    <Input name="isbn" label="ISBN" value={form.isbn} onChange={handleChange} />
                    <Input name="stock" label="Stok" type="number" value={form.stock} onChange={handleChange} required />
                    <label className="md:col-span-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                        Deskripsi
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            className="mt-2 h-24 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                        />
                    </label>
                    <div className="flex flex-wrap gap-2 md:col-span-2">
                        <Button type="submit">{form.id ? 'Simpan Perubahan' : 'Tambah Buku'}</Button>
                        {form.id && (
                            <Button type="button" variant="secondary" onClick={() => setForm(emptyForm)}>
                                Batal
                            </Button>
                        )}
                    </div>
                </form>
                {message && (
                    <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
                        {message}
                    </div>
                )}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-lg font-semibold">Daftar Buku</h2>
                    <input
                        value={search}
                        onChange={(event) => {
                            setSearch(event.target.value);
                            setPage(1);
                        }}
                        placeholder="Cari judul, penulis, penerbit, atau ISBN..."
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/30 sm:max-w-xs"
                    />
                </div>
                {loading ? (
                    <div className="mt-4 text-sm text-slate-500">Memuat data...</div>
                ) : (
                    <>
                        <div className="mt-4 grid gap-4">
                            {books.length === 0 && (
                                <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700">
                                    Buku tidak ditemukan.
                                </div>
                            )}
                            {books.map((book) => (
                                <div
                                    key={book.id}
                                    className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950 md:flex-row md:items-center"
                                >
                                    <div className="space-y-1">
                                        <h3 className="text-lg font-semibold">{book.title}</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            {book.author} {'·'} {book.publisher} {'·'} {book.year}
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Stok: {book.stock}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="secondary" onClick={() => handleEdit(book)}>
                                            Edit
                                        </Button>
                                        <Button variant="danger" onClick={() => handleDelete(book.id)}>
                                            Hapus
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {meta?.last_page > 1 && (
                            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                                <Button
                                    variant="secondary"
                                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={meta.current_page === 1}
                                >
                                    Sebelumnya
                                </Button>
                                {Array.from({ length: meta.last_page }, (_, index) => index + 1)
                                    .filter((p) => {
                                        if (meta.last_page <= 5) return true;
                                        if (p === 1 || p === meta.last_page) return true;
                                        return Math.abs(p - meta.current_page) <= 1;
                                    })
                                    .map((pageNumber, index, arr) => (
                                        <React.Fragment key={pageNumber}>
                                            {index > 0 && pageNumber - arr[index - 1] > 1 && (
                                                <span className="px-2 text-sm text-slate-400">...</span>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => setPage(pageNumber)}
                                                className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                                                    pageNumber === meta.current_page
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
                                    onClick={() => setPage((prev) => Math.min(prev + 1, meta.last_page))}
                                    disabled={meta.current_page === meta.last_page}
                                >
                                    Berikutnya
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}

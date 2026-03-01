import React, { useEffect, useState } from 'react';
import ConfirmDialog from '../components/ConfirmDialog';
import api from '../api/client';
import Badge from '../components/Badge';
import Button from '../components/Button';

const filters = [
    { key: 'active', label: 'Aktif' },
    { key: 'overdue', label: 'Jatuh Tempo' },
    { key: 'returned', label: 'Dikembalikan' },
];

export default function AdminLoans() {
    const [status, setStatus] = useState('active');
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedLoanId, setSelectedLoanId] = useState(null);

    const fetchLoans = async (selectedStatus) => {
        setLoading(true);
        try {
            const { data } = await api.get('/loans', { params: { status: selectedStatus } });
            setLoans(data.data || []);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLoans(status);
    }, [status]);

    const handleReturn = (loanId) => {
        setSelectedLoanId(loanId);
        setShowConfirm(true);
    };

    const confirmReturn = async () => {
        setMessage('');
        try {
            await api.post(`/loans/${selectedLoanId}/return`);
            setMessage('Pinjaman berhasil ditandai sebagai dikembalikan.');
            fetchLoans(status);
        } catch (error) {
            setMessage(error?.response?.data?.message || 'Gagal mengubah status pinjaman.');
        } finally {
            setShowConfirm(false);
            setSelectedLoanId(null);
        }
    };

    const cancelReturn = () => {
        setShowConfirm(false);
        setSelectedLoanId(null);
    };

    return (
        <section className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold">Data Pinjaman</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Pantau seluruh peminjaman dan kelola pengembalian.
                    </p>
                </div>
                <div className="flex gap-2 rounded-full border border-slate-200 bg-white p-1 text-xs font-semibold dark:border-slate-800 dark:bg-slate-900">
                    {filters.map((filter) => (
                        <button
                            key={filter.key}
                            type="button"
                            onClick={() => setStatus(filter.key)}
                            className={`rounded-full px-4 py-2 transition ${
                                status === filter.key
                                    ? 'bg-indigo-600 text-white'
                                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-300'
                            }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>
            </div>

            {message && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
                    {message}
                </div>
            )}

            {loading ? (
                <div className="text-sm text-slate-500">Memuat data pinjaman...</div>
            ) : (
                <div className="grid gap-4">
                    {loans.length === 0 && (
                        <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700">
                            Tidak ada data pinjaman di status ini.
                        </div>
                    )}
                    {loans.map((loan) => (
                        <div
                            key={loan.id}
                            className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:flex-row md:items-center md:justify-between"
                        >
                            <div className="space-y-2">
                                <h3 className="text-lg font-semibold">{loan.book.title}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    {loan.user.name} · {loan.user.email}
                                </p>
                                <div className="flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400">
                                    <span>Dipinjam: {loan.borrowed_at_human}</span>
                                    <span>Batas: {loan.due_at_human}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {loan.status === 'overdue' && <Badge tone="overdue">Jatuh tempo</Badge>}
                                {loan.status === 'active' && <Badge tone="active">Aktif</Badge>}
                                {loan.status === 'returned' && <Badge tone="returned">Dikembalikan</Badge>}
                                {(loan.status === 'active' || loan.status === 'overdue') && (
                                    <Button variant="secondary" onClick={() => handleReturn(loan.id)}>
                                        Tandai Dikembalikan
                                    </Button>
                                )}
                                        <ConfirmDialog
                                            open={showConfirm}
                                            title="Konfirmasi Pengembalian"
                                            description="Apakah Anda yakin ingin menandai pinjaman ini sebagai dikembalikan?"
                                            onConfirm={confirmReturn}
                                            onCancel={cancelReturn}
                                        />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}

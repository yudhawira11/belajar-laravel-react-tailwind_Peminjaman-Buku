import React from 'react';

export default function ConfirmDialog({ open, title, description, onConfirm, onCancel }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="rounded-lg bg-white p-6 shadow-xl dark:bg-slate-900 min-w-[320px]">
                <h2 className="mb-2 text-lg font-bold text-slate-900 dark:text-slate-100">{title}</h2>
                <p className="mb-6 text-sm text-slate-600 dark:text-slate-300">{description}</p>
                <div className="flex justify-end gap-2">
                    <button
                        className="rounded px-4 py-2 text-sm font-semibold bg-slate-200 text-slate-900 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                        onClick={onCancel}
                    >
                        Batal
                    </button>
                    <button
                        className="rounded px-4 py-2 text-sm font-semibold bg-rose-600 text-white hover:bg-rose-500"
                        onClick={onConfirm}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}

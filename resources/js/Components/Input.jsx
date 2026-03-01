import React from 'react';

export default function Input({ label, error, className = '', ...props }) {
    return (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
            {label && <span className="mb-2 block">{label}</span>}
            <input
                {...props}
                className={`w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/30 ${className}`}
            />
            {error && <span className="mt-2 block text-xs text-rose-500">{error}</span>}
        </label>
    );
}

import React from 'react';

const styles = {
    available: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
    low: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
    empty: 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300',
    overdue: 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300',
    active: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300',
    returned: 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200',
};

export default function Badge({ tone = 'available', children }) {
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${styles[tone]}`}>
            {children}
        </span>
    );
}

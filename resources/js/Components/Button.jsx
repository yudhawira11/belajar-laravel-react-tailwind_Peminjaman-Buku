import React from 'react';

const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-500',
    secondary: 'bg-slate-200 text-slate-900 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700',
    ghost: 'bg-transparent text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white',
    danger: 'bg-rose-600 text-white hover:bg-rose-500',
};

export default function Button({ variant = 'primary', className = '', ...props }) {
    return (
        <button
            {...props}
            className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
        />
    );
}

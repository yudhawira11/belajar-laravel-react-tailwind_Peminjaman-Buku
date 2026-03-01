import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'pustaka-theme';

export default function useDarkMode() {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const shouldDark = saved ? saved === 'dark' : prefersDark;
        document.documentElement.classList.toggle('dark', shouldDark);
        setIsDark(shouldDark);
    }, []);

    const toggle = useCallback(() => {
        setIsDark((prev) => {
            const next = !prev;
            document.documentElement.classList.toggle('dark', next);
            localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light');
            return next;
        });
    }, []);

    return { isDark, toggle };
}

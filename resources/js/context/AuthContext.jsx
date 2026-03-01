import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import api from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(async () => {
        try {
            const { data } = await api.get('/me');
            setUser(data.data);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    const login = useCallback(async (payload) => {
        await axios.get('/sanctum/csrf-cookie');
        const { data } = await api.post('/auth/login', payload);
        setUser(data.data);
        await refresh();
        return data;
    }, [refresh]);

    const register = useCallback(async (payload) => {
        await axios.get('/sanctum/csrf-cookie');
        const { data } = await api.post('/auth/register', payload);
        setUser(data.data);
        await refresh();
        return data;
    }, [refresh]);

    const logout = useCallback(async () => {
        try {
            await api.post('/auth/logout');
        } finally {
            setUser(null);
        }
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const value = useMemo(
        () => ({
            user,
            loading,
            login,
            register,
            logout,
            refresh,
            isAdmin: user?.role === 'admin',
            overdueLoans: user?.overdue_loans ?? [],
        }),
        [user, loading, login, register, logout, refresh]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth harus digunakan di dalam AuthProvider.');
    }
    return context;
}

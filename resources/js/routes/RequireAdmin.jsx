import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RequireAdmin({ children }) {
    const { isAdmin } = useAuth();

    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }

    return children;
}

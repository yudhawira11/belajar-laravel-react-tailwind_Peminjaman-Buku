import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './bootstrap';
import '../css/app.css';

import { AuthProvider } from './context/AuthContext';
import AppLayout from './layouts/AppLayout';
import RequireAdmin from './routes/RequireAdmin';
import RequireAuth from './routes/RequireAuth';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Books from './pages/Books';
import BookDetail from './pages/BookDetail';
import MyLoans from './pages/MyLoans';
import AdminBooks from './pages/AdminBooks';
import AdminLoans from './pages/AdminLoans';
import NotFound from './pages/NotFound';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route element={<AppLayout />}>
                        <Route index element={<Books />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route
                            path="/books/:id"
                            element={
                                <RequireAuth>
                                    <BookDetail />
                                </RequireAuth>
                            }
                        />
                        <Route
                            path="/loans"
                            element={
                                <RequireAuth>
                                    <MyLoans />
                                </RequireAuth>
                            }
                        />
                        <Route
                            path="/admin/books"
                            element={
                                <RequireAuth>
                                    <RequireAdmin>
                                        <AdminBooks />
                                    </RequireAdmin>
                                </RequireAuth>
                            }
                        />
                        <Route
                            path="/admin/loans"
                            element={
                                <RequireAuth>
                                    <RequireAdmin>
                                        <AdminLoans />
                                    </RequireAdmin>
                                </RequireAuth>
                            }
                        />
                    </Route>
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

const root = document.getElementById('app');
if (root) {
    createRoot(root).render(<App />);
}

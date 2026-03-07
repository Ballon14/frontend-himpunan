import { createContext, useContext, useState, useEffect } from 'react';
import { adminLogin, getMe } from '../api/admin';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('admin_token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            getMe()
                .then((res) => {
                    setUser(res.data.data);
                    setLoading(false);
                })
                .catch(() => {
                    localStorage.removeItem('admin_token');
                    setToken(null);
                    setUser(null);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [token]);

    const login = async (email, password) => {
        const res = await adminLogin(email, password);
        const { token: newToken, user: userData } = res.data.data;
        localStorage.setItem('admin_token', newToken);
        setToken(newToken);
        setUser(userData);
        return res;
    };

    const logout = () => {
        localStorage.removeItem('admin_token');
        setToken(null);
        setUser(null);
    };

    const isAuthenticated = !!user && !!token;

    return (
        <AuthContext.Provider value={{ user, token, loading, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}

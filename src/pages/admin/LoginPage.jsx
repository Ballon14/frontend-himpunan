import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    if (isAuthenticated) {
        return <Navigate to="/admin/dashboard" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
            toast.success('Login berhasil!');
            navigate('/admin/dashboard', { replace: true });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login gagal.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-page">
            <div className="admin-login-card">
                <div className="admin-login-header">
                    <div className="admin-login-logo">H</div>
                    <h1>HMTKBG Admin</h1>
                    <p>Masuk untuk mengelola website</p>
                </div>

                <form onSubmit={handleSubmit} className="admin-login-form">
                    <div className="admin-form-group">
                        <label>
                            <FiMail className="admin-input-icon" />
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoFocus
                            />
                        </label>
                    </div>

                    <div className="admin-form-group">
                        <label>
                            <FiLock className="admin-input-icon" />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </label>
                    </div>

                    <button type="submit" className="admin-login-btn" disabled={loading}>
                        {loading ? (
                            <span className="admin-btn-loading">Memproses...</span>
                        ) : (
                            <>
                                <FiLogIn /> Masuk
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

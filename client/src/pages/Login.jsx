import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import Card from '../components/Card';
import Button from '../components/Button';
import { FaUser, FaLock, FaArrowRight, FaIdCard, FaUsers, FaEye, FaEyeSlash } from 'react-icons/fa';
import '../styles/variables.css';

const Login = ({ onLogin }) => {
    const [formData, setFormData] = useState({ username: '', password: '', userType: 'public' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUserTypeChange = (type) => {
        setFormData({ ...formData, userType: type });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await api.post('/auth/login', formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            if (onLogin) onLogin(res.data.user);

            if (res.data.user.role === 'admin') navigate('/admin');
            else if (res.data.user.role === 'mla') navigate('/admin');
            else if (res.data.user.role === 'pa') navigate('/pa');
            else navigate('/user');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    const styles = {
        pageContainer: {
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            position: 'relative',
            overflow: 'hidden'
        },
        loginCard: {
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-xl)',
            width: '100%',
            maxWidth: '450px',
            padding: '40px',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            position: 'relative',
            zIndex: 1,
            animation: 'fadeInUp 0.8s ease-out'
        },
        header: {
            textAlign: 'center',
            marginBottom: '35px'
        },
        title: {
            fontSize: '2.2rem',
            fontWeight: '800',
            background: 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 8px 0',
            letterSpacing: '-0.025em'
        },
        subtitle: {
            color: 'var(--text-muted)',
            fontSize: '1rem',
            margin: '0',
            fontWeight: '500'
        },
        typeSelector: {
            display: 'flex',
            backgroundColor: 'rgba(6, 182, 212, 0.08)',
            borderRadius: 'var(--radius-md)',
            padding: '6px',
            marginBottom: '35px',
            border: '1px solid rgba(6, 182, 212, 0.1)'
        },
        typeBtn: (isActive) => ({
            flex: 1,
            padding: '12px',
            border: 'none',
            background: isActive ? 'var(--white)' : 'transparent',
            borderRadius: 'var(--radius-sm)',
            color: isActive ? 'var(--primary-teal)' : 'var(--text-muted)',
            fontWeight: '700',
            fontSize: '0.95rem',
            cursor: 'pointer',
            boxShadow: isActive ? 'var(--shadow-md)' : 'none',
            transition: 'var(--transition)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px'
        }),
        inputGroup: {
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            marginBottom: '25px'
        },
        label: {
            fontWeight: '600',
            fontSize: '0.9rem',
            color: 'var(--text-dark)',
            marginLeft: '4px'
        },
        inputWrapper: {
            position: 'relative'
        },
        icon: {
            position: 'absolute',
            left: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--primary-teal)',
            fontSize: '1rem',
            opacity: 0.7
        },
        input: {
            padding: '14px 48px 14px 48px',
            borderRadius: 'var(--radius-md)',
            border: '2px solid rgba(6, 182, 212, 0.1)',
            fontSize: '1rem',
            width: '100%',
            outline: 'none',
            transition: 'var(--transition)',
            background: 'rgba(255, 255, 255, 0.9)',
            color: 'var(--text-dark)'
        },
        errorMsg: {
            color: 'var(--white)',
            background: 'var(--danger)',
            padding: '12px 20px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '25px',
            fontSize: '0.9rem',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)',
            animation: 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both'
        },
        submitBtn: {
            width: '100%',
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--gradient-primary)',
            color: 'var(--white)',
            border: 'none',
            fontSize: '1.1rem',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginTop: '15px',
            transition: 'var(--transition)',
            boxShadow: 'var(--shadow-lg)',
            letterSpacing: '0.02em'
        },
        signupLink: {
            textAlign: 'center',
            marginTop: '30px',
            fontSize: '1rem',
            color: 'var(--text-muted)'
        },
        eyeIcon: {
            position: 'absolute',
            right: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--primary-teal)',
            fontSize: '1.2rem',
            cursor: 'pointer',
            opacity: 0.7,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '5px',
            zIndex: 2
        }
    };

    return (
        <div style={styles.pageContainer}>
            <div style={styles.loginCard}>
                <div style={styles.header}>
                    <h1 style={styles.title}>Welcome Back</h1>
                    <p style={styles.subtitle}>Login to Perinthalmanna E-Governance</p>
                </div>

                {error && <div style={styles.errorMsg}>{error}</div>}

                <div style={styles.typeSelector}>
                    <button
                        type="button"
                        style={styles.typeBtn(formData.userType === 'public')}
                        onClick={() => handleUserTypeChange('public')}
                    >
                        <FaUsers /> Public
                    </button>
                    <button
                        type="button"
                        style={styles.typeBtn(formData.userType === 'authority')}
                        onClick={() => handleUserTypeChange('authority')}
                    >
                        <FaIdCard /> Authority
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>
                            {formData.userType === 'public' ? 'Email Address' : 'Identification'}
                        </label>
                        <div style={styles.inputWrapper}>
                            <FaUser style={styles.icon} />
                            <input
                                type={formData.userType === 'public' ? 'email' : 'text'}
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                style={styles.input}
                                placeholder={formData.userType === 'public' ? 'name@example.com' : 'Username / Email'}
                            />
                        </div>
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password</label>
                        <div style={styles.inputWrapper}>
                            <FaLock style={styles.icon} />
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                style={styles.input}
                                required
                                placeholder="••••••••"
                            />
                            <div
                                style={styles.eyeIcon}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </div>
                        </div>
                    </div>

                    <div style={{ textAlign: 'right', marginTop: '-10px', marginBottom: '15px' }}>
                        <Link
                            to="/reset-password"
                            style={{
                                color: 'var(--primary-teal)',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                textDecoration: 'none',
                                transition: 'var(--transition)'
                            }}
                            onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                            onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                        >
                            Forgot Password?
                        </Link>
                    </div>

                    <button type="submit" style={styles.submitBtn} disabled={loading}>
                        {loading ? 'Logging in...' : <>Login <FaArrowRight /></>}
                    </button>
                </form>

                {formData.userType === 'public' && (
                    <div style={styles.signupLink}>
                        Don't have an account? <Link to="/signup" style={{ color: 'var(--primary-teal)', fontWeight: '700', textDecoration: 'underline' }}>Sign up</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;

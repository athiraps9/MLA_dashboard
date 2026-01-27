import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { FaEnvelope, FaArrowRight, FaCheckCircle } from 'react-icons/fa';
import '../styles/variables.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [touched, setTouched] = useState(false);
    const navigate = useNavigate();

    const validateEmail = (email) => {
        if (!email) return 'Email address is required';
        if (!/\S+@\S+\.\S+/.test(email)) return 'Please enter a valid email address';
        return '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const emailError = validateEmail(email);
        if (emailError) {
            setError(emailError);
            return;
        }

        setLoading(true);
        try {
            const res = await api.post('/auth/forgot-password', { email });
            setSuccess(res.data.message);
            setEmail('');
            setTouched(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send reset link. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleBlur = () => {
        setTouched(true);
        if (email) {
            const emailError = validateEmail(email);
            if (emailError) setError(emailError);
        }
    };

    const handleChange = (e) => {
        setEmail(e.target.value);
        if (touched) {
            const emailError = validateEmail(e.target.value);
            setError(emailError);
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
        card: {
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
            padding: '14px 48px',
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
        successMsg: {
            color: 'var(--white)',
            background: 'var(--success)',
            padding: '12px 20px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '25px',
            fontSize: '0.9rem',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(34, 197, 94, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px'
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
        backLink: {
            textAlign: 'center',
            marginTop: '30px',
            fontSize: '1rem',
            color: 'var(--text-muted)'
        }
    };

    return (
        <div style={styles.pageContainer}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <h1 style={styles.title}>Forgot Password?</h1>
                    <p style={styles.subtitle}>Enter your email to receive a reset link</p>
                </div>

                {error && <div style={styles.errorMsg}>{error}</div>}
                {success && (
                    <div style={styles.successMsg}>
                        <FaCheckCircle /> {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email Address</label>
                        <div style={styles.inputWrapper}>
                            <FaEnvelope style={styles.icon} />
                            <input
                                type="email"
                                value={email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                style={styles.input}
                                placeholder="name@example.com"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <button type="submit" style={styles.submitBtn} disabled={loading}>
                        {loading ? 'Sending...' : <>Send Reset Link <FaArrowRight /></>}
                    </button>
                </form>

                <div style={styles.backLink}>
                    Remember your password? <Link to="/login" style={{ color: 'var(--primary-teal)', fontWeight: '700', textDecoration: 'underline' }}>Back to Login</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;

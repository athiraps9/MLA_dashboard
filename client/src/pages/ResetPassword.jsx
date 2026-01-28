import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { FaLock, FaArrowRight, FaCheckCircle, FaEye, FaEyeSlash, FaCheck, FaTimes, FaEnvelope } from 'react-icons/fa';
import '../styles/variables.css';

const ResetPassword = () => {
    const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [touched, setTouched] = useState({});
    const [fieldErrors, setFieldErrors] = useState({});
    const navigate = useNavigate();

    const getPasswordRequirements = (val) => {
        return [
            { label: '8+ characters', met: val.length >= 8 },
            { label: 'Uppercase letter', met: /[A-Z]/.test(val) },
            { label: 'Lowercase letter', met: /[a-z]/.test(val) },
            { label: 'Number', met: /[0-9]/.test(val) },
            { label: 'Special character', met: /[^A-Za-z0-9]/.test(val) }
        ];
    };

    const validateField = (name, value) => {
        let error = '';
        if (name === 'email') {
            if (!value) error = 'Email is required';
            else if (!/\S+@\S+\.\S+/.test(value)) error = 'Please enter a valid email address';
        } else if (name === 'password') {
            if (!value) error = 'Password is required';
            else {
                const requirements = getPasswordRequirements(value);
                const failed = requirements.filter(req => !req.met);
                if (failed.length > 0) error = 'Password does not meet requirements';
            }
        } else if (name === 'confirmPassword') {
            if (!value) error = 'Please confirm your password';
            else if (value !== formData.password) error = 'Passwords do not match';
        }
        return error;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (touched[name]) {
            const fieldError = validateField(name, value);
            setFieldErrors(prev => ({ ...prev, [name]: fieldError }));
        }

        if (name === 'password' && touched.confirmPassword) {
            const confirmError = value === formData.confirmPassword ? '' : 'Passwords do not match';
            setFieldErrors(prev => ({ ...prev, confirmPassword: confirmError }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        const fieldError = validateField(name, value);
        setFieldErrors(prev => ({ ...prev, [name]: fieldError }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const newErrors = {};
        ['email', 'password', 'confirmPassword'].forEach(field => {
            const err = validateField(field, formData[field]);
            if (err) newErrors[field] = err;
        });

        setFieldErrors(newErrors);
        setTouched({ email: true, password: true, confirmPassword: true });

        if (Object.keys(newErrors).length > 0) return;

        setLoading(true);
        try {
            const res = await api.post('/auth/simple-reset-password', {
                email: formData.email,
                password: formData.password
            });
            setSuccess(res.data.message);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
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
        card: {
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-xl)',
            width: '100%',
            maxWidth: '500px',
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
        inputError: {
            borderColor: 'var(--danger)',
            backgroundColor: '#fffcfc'
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
        fieldError: {
            color: 'var(--danger)',
            fontSize: '0.8rem',
            marginTop: '4px',
            fontWeight: '500'
        },
        hintGroup: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '8px',
            marginTop: '10px',
            padding: '12px',
            backgroundColor: '#f8f9fa',
            borderRadius: 'var(--radius-md)'
        },
        hintItem: {
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.75rem',
            color: 'var(--text-secondary)',
            transition: 'color 0.2s'
        },
        hintMet: {
            color: 'var(--success)',
            fontWeight: '600'
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
                    <h1 style={styles.title}>Reset Password</h1>
                    <p style={styles.subtitle}>Enter your email and new password</p>
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
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                style={{
                                    ...styles.input,
                                    ...(fieldErrors.email ? styles.inputError : {})
                                }}
                                required
                                placeholder="name@example.com"
                                disabled={loading || success}
                            />
                        </div>
                        {fieldErrors.email && <span style={styles.fieldError}>{fieldErrors.email}</span>}
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>New Password</label>
                        <div style={styles.inputWrapper}>
                            <FaLock style={styles.icon} />
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                style={{
                                    ...styles.input,
                                    ...(fieldErrors.password ? styles.inputError : {})
                                }}
                                required
                                placeholder="••••••••"
                                disabled={loading || success}
                            />
                            <div
                                style={styles.eyeIcon}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </div>
                        </div>
                        {fieldErrors.password && <span style={styles.fieldError}>{fieldErrors.password}</span>}
                    </div>

                    {(formData.password || touched.password) && (
                        <div style={styles.hintGroup}>
                            {getPasswordRequirements(formData.password).map((req, i) => (
                                <div key={i} style={{
                                    ...styles.hintItem,
                                    ...(req.met ? styles.hintMet : {})
                                }}>
                                    {req.met ? <FaCheck size={10} /> : <FaTimes size={10} />}
                                    {req.label}
                                </div>
                            ))}
                        </div>
                    )}

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Confirm Password</label>
                        <div style={styles.inputWrapper}>
                            <FaLock style={styles.icon} />
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                style={{
                                    ...styles.input,
                                    ...(fieldErrors.confirmPassword ? styles.inputError : {})
                                }}
                                required
                                placeholder="••••••••"
                                disabled={loading || success}
                            />
                            <div
                                style={styles.eyeIcon}
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </div>
                        </div>
                        {fieldErrors.confirmPassword && <span style={styles.fieldError}>{fieldErrors.confirmPassword}</span>}
                    </div>

                    <button type="submit" style={styles.submitBtn} disabled={loading || success}>
                        {loading ? 'Resetting...' : success ? 'Redirecting...' : <>Reset Password <FaArrowRight /></>}
                    </button>
                </form>

                {!success && (
                    <div style={styles.backLink}>
                        Remember your password? <Link to="/login" style={{ color: 'var(--primary-teal)', fontWeight: '700', textDecoration: 'underline' }}>Back to Login</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;

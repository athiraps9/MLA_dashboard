import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Card from '../components/Card';
import Button from '../components/Button';
import '../styles/variables.css';

const Login = ({ onLogin }) => {
    const [formData, setFormData] = useState({ username: '', password: '', userType: 'public' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUserTypeChange = (type) => {
        setFormData({ ...formData, userType: type });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            console.log("res.data from handlesubmit", res.data.user);
            onLogin(res.data.user);

            if (res.data.user.role === 'admin') navigate('/admin');
            else if (res.data.user.role === 'mla') navigate('/admin'); // MLA uses Admin dashboard for now, or unified
            else if (res.data.user.role === 'pa') navigate('/pa');
            else navigate('/user'); // Public user
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    const styles = {
        container: {
            maxWidth: '400px',
            margin: '60px auto',
            padding: '0 20px'
        },
        inputGroup: {
            marginBottom: '15px'
        },
        label: {
            display: 'block',
            marginBottom: '5px',
            fontWeight: '500'
        },
        input: {
            width: '100%',
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid var(--border-color, #ccc)',
            fontSize: '1rem'
        },
        error: {
            color: 'var(--danger-color, red)',
            marginBottom: '15px',
            fontSize: '0.9rem'
        },
        typeSelector: {
            display: 'flex',
            marginBottom: '20px',
            borderBottom: '1px solid var(--border-color, #ccc)'
        },
        typeBtn: (isActive) => ({
            flex: 1,
            padding: '10px',
            border: 'none',
            background: 'none',
            borderBottom: isActive ? '3px solid var(--primary-color, blue)' : 'none',
            color: isActive ? 'var(--primary-color, blue)' : 'var(--text-muted, grey)',
            fontWeight: isActive ? 'bold' : 'normal',
            cursor: 'pointer'
        })
    };

    return (
        <div style={styles.container}>
            <Card title="Login to Portal">
                {error && <div style={styles.error}>{error}</div>}

                <div style={styles.typeSelector}>
                    <button
                        type="button"
                        style={styles.typeBtn(formData.userType === 'public')}
                        onClick={() => handleUserTypeChange('public')}
                    >
                        Public User
                    </button>
                    <button
                        type="button"
                        style={styles.typeBtn(formData.userType === 'authority')}
                        onClick={() => handleUserTypeChange('authority')}
                    >
                        Authority
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={styles.label}>{formData.userType === 'public' ? 'Email Address' : 'Username / Email'}</label>
                        <input
                            type={formData.userType === 'public' ? 'email' : 'text'}
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            style={styles.input}
                            placeholder={formData.userType === 'public' ? 'Enter your email' : 'Enter official username'}
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            style={styles.input}
                            required
                            placeholder="Enter password"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Login</button>
                </form>

                {formData.userType === 'public' && (
                    <p className="text-center" style={{ marginTop: '1rem' }}>
                        Don't have an account? <a href="/signup" style={{ color: 'var(--primary-color)' }}>Sign up</a>
                    </p>
                )}
            </Card>
        </div>
    );
};

export default Login;

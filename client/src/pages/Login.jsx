import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Card from '../components/Card';
import Button from '../components/Button';
import '../styles/variables.css';

const Login = ({ onLogin }) => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
            else if (res.data.user.role === 'mla') navigate('/mla-portal');
            else navigate('/'); // Public user
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
            border: '1px solid var(--border-color)',
            fontSize: '1rem'
        },
        error: {
            color: 'var(--danger-color)',
            marginBottom: '15px',
            fontSize: '0.9rem'
        }
    };

    return (
        <div style={styles.container}>
            <Card title="Login to Dashboard">
                {error && <div style={styles.error}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                        <label>Email</label>
                        <input
                            type="email"
                            name="username" // Backend accepts email in username field or I can change state name but let's keep it simple
                            value={formData.username}
                            onChange={e => setFormData({ ...formData, username: e.target.value })}
                            required
                            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
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
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Login</button>
                </form>
                <p className="text-center" style={{ marginTop: '1rem' }}>
                    Don't have an account? <a href="/signup" style={{ color: 'var(--primary-color)' }}>Sign up</a>
                </p>
            </Card>
        </div>
    );
};

export default Login;

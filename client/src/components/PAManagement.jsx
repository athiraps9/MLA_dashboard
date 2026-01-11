import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Button from './Button';

const PAManagement = () => {
    const [pas, setPas] = useState([]);
    const [formData, setFormData] = useState({ fullName: '', username: '', email: '', password: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fetchPas = async () => {
        try {
            const res = await api.get('/auth/pas');
            setPas(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPas();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            console.log(formData);
            console.log("form data end by handle submit **");
            await api.post('/auth/create-pa', formData);
            setSuccess('PA account created successfully!');
            setFormData({ fullName: '', username: '', email: '', password: '' });
            fetchPas();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create PA');
        }
    };

    return (
        <div>
            <h2>PA Management</h2>

            <div className="card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
                <h3>Add New Personal Assistant</h3>
                {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
                {success && <div style={{ color: 'green', marginBottom: '10px' }}>{success}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                    <input name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required style={{ padding: '8px' }} />
                    <input name="username" placeholder="Username" value={formData.username} onChange={handleChange} required style={{ padding: '8px' }} />
                    <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required style={{ padding: '8px' }} />
                    <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required style={{ padding: '8px' }}
                    />
                    <Button type="submit">Create Account</Button>
                </form>
            </div>

            <h3>Active PA Accounts</h3>
            {loading ? <p>Loading...</p> : pas.length === 0 ? <p>No PAs found.</p> : (
                <div style={{ display: 'grid', gap: '10px' }}>
                    {pas.map(pa => (
                        <div key={pa._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px' }}>
                            <div>
                                <strong>{pa.fullName}</strong>
                                <div style={{ fontSize: '0.9rem', color: '#666' }}>@{pa.username} | {pa.email}</div>
                            </div>
                            <span className="badge badge-success">Active</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PAManagement;

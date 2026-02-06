import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Button from './Button';

const PAManagement = () => {
    const [pas, setPas] = useState([]);
    const [formData, setFormData] = useState({ fullName: '', username: '', email: '', password: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [editingId, setEditingId] = useState(null);

    const fetchPas = async () => {
        try {
            const res = await api.get('/auth/pas');
            setPas(res.data);
            console.log(res.data);
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
            if (editingId) {
                // Update existing PA
                await api.put(`/auth/pas/${editingId}`, formData);
                setSuccess('PA account updated successfully!');
                setEditingId(null);
            } else {
                // Create new PA
                await api.post('/auth/create-pa', formData);
                setSuccess('PA account created successfully!');
            }
            
            setFormData({ fullName: '', username: '', email: '', password: '' });
            fetchPas();
        } catch (err) {
            setError(err.response?.data?.message || `Failed to ${editingId ? 'update' : 'create'} PA`);
        }
    };

    const handleEdit = (pa) => {
        setEditingId(pa._id);
        setFormData({
            fullName: pa.fullName,
            username: pa.username,
            email: pa.email,
            password: '' // Don't populate password for security
        });
        setError('');
        setSuccess('');
        // Scroll to form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({ fullName: '', username: '', email: '', password: '' });
        setError('');
        setSuccess('');
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this PA account?')) {
            return;
        }

        try {
            await api.delete(`/auth/pas/${id}`);
            setSuccess('PA account deleted successfully!');
            fetchPas();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete PA');
            console.error('Delete error:', err);
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        try {
            await api.put(`/auth/pas/${id}/status`, { 
                isActive: !currentStatus 
            });
            setSuccess(`PA account ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
            fetchPas();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update status');
            console.error('Status update error:', err);
        }
    };

    return (
        <div>
            <h2>PA Management</h2>

            <div className="card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
                <h3>{editingId ? 'Edit Personal Assistant' : 'Add New Personal Assistant'}</h3>
                {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
                {success && <div style={{ color: 'green', marginBottom: '10px' }}>{success}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                    <input 
                        name="fullName" 
                        placeholder="Full Name" 
                        value={formData.fullName} 
                        onChange={handleChange} 
                        required 
                        style={{ padding: '8px' }} 
                    />
                    <input 
                        name="username" 
                        placeholder="Username" 
                        value={formData.username} 
                        onChange={handleChange} 
                        required 
                        style={{ padding: '8px' }} 
                    />
                    <input 
                        name="email" 
                        type="email" 
                        placeholder="Email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        required 
                        style={{ padding: '8px' }} 
                    />
                    <input 
                        name="password" 
                        type="password" 
                        placeholder={editingId ? "New Password (leave blank to keep current)" : "Password"} 
                        value={formData.password} 
                        onChange={handleChange} 
                        required={!editingId}
                        style={{ padding: '8px' }}
                    />
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <Button type="submit">
                            {editingId ? 'Update Account' : 'Create Account'}
                        </Button>
                        {editingId && (
                            <Button type="button" onClick={handleCancelEdit} style={{ backgroundColor: '#6c757d' }}>
                                Cancel
                            </Button>
                        )}
                    </div>
                </form>
            </div>

            <h3>Active PA Accounts</h3>
            {loading ? (
                <p>Loading...</p>
            ) : pas.length === 0 ? (
                <p>No PAs found.</p>
            ) : (
                <div style={{ display: 'grid', gap: '10px' }}>
                    {pas.map(pa => (
                        <div 
                            key={pa._id} 
                            className="card" 
                            style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center', 
                                padding: '15px',
                                backgroundColor: editingId === pa._id ? '#f0f8ff' : 'white'
                            }}
                        >
                            <div>
                                <strong>{pa.fullName}</strong>
                                <div style={{ fontSize: '0.9rem', color: '#666' }}>
                                    @{pa.username} | {pa.email}
                                </div>
                            </div>
                            
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <span 
                                    className={`badge ${pa.isActive ? 'badge-success' : 'badge-secondary'}`}
                                    style={{ padding: '5px 10px' }}
                                >
                                    {/* {pa.isActive ? 'Active' : 'Inactive'} */}
                                </span>
                                
                                <button 
                                    className="btn btn-warning btn-sm" 
                                    onClick={() => handleEdit(pa)}
                                    style={{ marginRight: '5px' }}
                                >
                                    Edit
                                </button>
                                <button 
                                    className="btn btn-danger btn-sm" 
                                    onClick={() => handleDelete(pa._id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PAManagement;
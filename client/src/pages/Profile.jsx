import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { FaUserCircle, FaHistory, FaPlus, FaExternalLinkAlt } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

const Profile = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || {});
    const [activeTab, setActiveTab] = useState('details');
    const [complaints, setComplaints] = useState([]);
    const { t } = useLanguage();

    useEffect(() => {
        if (activeTab === 'complaints') {
            fetchComplaints();
        }
    }, [activeTab]);

    const fetchComplaints = async () => {
        try {
            const res = await api.get('/complaints/my');
            setComplaints(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="container section-padding">
            <h1 className="text-center" style={{ marginBottom: '2rem' }}>{t('My Profile', 'എന്റെ പ്രൊഫൈൽ')}</h1>

            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                {/* Sidebar */}
                <div className="card" style={{ flex: '1 0 250px', height: 'fit-content', padding: '0' }}>
                    <div className="text-center" style={{ padding: '2rem' }}>
                        <FaUserCircle size={80} color="var(--text-muted)" />
                        <h3 style={{ marginTop: '1rem', color: 'var(--primary-blue)' }}>{user.fullName}</h3>
                        <p style={{ color: 'var(--text-muted)' }}>{user.role?.toUpperCase()}</p>
                    </div>
                    <div style={{ borderTop: '1px solid #eee' }}>
                        <button
                            onClick={() => setActiveTab('details')}
                            style={{
                                width: '100%', padding: '15px 20px', textAlign: 'left',
                                background: activeTab === 'details' ? 'var(--accent-blue)' : 'white',
                                border: 'none', borderBottom: '1px solid #eee',
                                color: activeTab === 'details' ? 'var(--primary-blue)' : 'inherit',
                                fontWeight: '500', cursor: 'pointer'
                            }}
                        >
                            My Details
                        </button>
                        <button
                            onClick={() => setActiveTab('complaints')}
                            style={{
                                width: '100%', padding: '15px 20px', textAlign: 'left',
                                background: activeTab === 'complaints' ? 'var(--accent-blue)' : 'white',
                                border: 'none',
                                color: activeTab === 'complaints' ? 'var(--primary-blue)' : 'inherit',
                                fontWeight: '500', cursor: 'pointer'
                            }}
                        >
                            My Complaints
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div style={{ flex: '3 0 400px' }}>
                    {activeTab === 'details' && (
                        <div className="card">
                            <h3 className="card-header">Personal Information</h3>
                            <div style={{ display: 'grid', gap: '1.5rem', marginTop: '1rem' }}>
                                <div>
                                    <label>Full Name</label>
                                    <input type="text" value={user.fullName} readOnly style={{ background: '#f8f9fa' }} />
                                </div>
                                <div>
                                    <label>Email</label>
                                    <input type="text" value={user.email || user.username} readOnly style={{ background: '#f8f9fa' }} />
                                </div>
                                <div className="alert" style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                                    To update your details, please contact administrator.
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'complaints' && (
                        <div>
                            <div className="card" style={{ marginBottom: '2rem', textAlign: 'center', padding: '30px' }}>
                                <h3>Manage Grievances</h3>
                                <p style={{ marginBottom: '20px', color: 'var(--text-muted)' }}>
                                    Submit new complaints and track their status in the dedicated portal.
                                </p>
                                <Link to="/complaints" className="btn btn-primary">
                                    <FaExternalLinkAlt style={{ marginRight: '8px' }} /> Go to Complaint Portal
                                </Link>
                            </div>

                            <h3 style={{ marginBottom: '1rem' }}>Recent History</h3>
                            {complaints.length === 0 ? <p>No complaints found.</p> : (
                                <div style={{ display: 'grid', gap: '1rem' }}>
                                    {complaints.map(c => (
                                        <div key={c._id} className="card" style={{ padding: '1.5rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                                <h4 style={{ margin: 0 }}>{c.title}</h4>
                                                <span style={{
                                                    padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem',
                                                    background: c.status === 'Resolved' ? '#d4edda' : (c.status === 'In Review' ? '#fff3cd' : '#e2e3e5'),
                                                    color: c.status === 'Resolved' ? '#155724' : (c.status === 'In Review' ? '#856404' : '#383d41'),
                                                    fontWeight: '600'
                                                }}>
                                                    {c.status}
                                                </span>
                                            </div>
                                            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{c.description}</p>
                                            <div style={{ marginTop: '10px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                                Submitted on: {new Date(c.createdAt).toLocaleDateString()}
                                            </div>
                                            {c.adminResponse && (
                                                <div style={{ marginTop: '1rem', padding: '10px', background: 'var(--bg-light)', borderRadius: '5px', borderLeft: '3px solid var(--primary-blue)' }}>
                                                    <strong>Admin Response:</strong> {c.adminResponse}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;

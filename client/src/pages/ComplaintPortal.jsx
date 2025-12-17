import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useLanguage } from '../context/LanguageContext';
import { FaPaperPlane, FaHistory, FaCheckCircle, FaHourglassHalf, FaExclamationCircle } from 'react-icons/fa';

const ComplaintPortal = () => {
    const [activeTab, setActiveTab] = useState('new'); // 'new' or 'history'
    const [complaints, setComplaints] = useState([]);
    const [formData, setFormData] = useState({ title: '', description: '' });
    const [loading, setLoading] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error'
    const { t } = useLanguage();

    useEffect(() => {
        if (activeTab === 'history') {
            fetchComplaints();
        }
    }, [activeTab]);

    const fetchComplaints = async () => {
        try {
            setLoading(true);
            const res = await api.get('/complaints/my');
            setComplaints(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitStatus(null);
        try {
            setLoading(true);
            await api.post('/complaints', formData);
            setSubmitStatus('success');
            setFormData({ title: '', description: '' });
            setTimeout(() => {
                setActiveTab('history');
                setSubmitStatus(null);
            }, 1500);
        } catch (err) {
            console.error(err);
            setSubmitStatus('error');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Resolved': return 'var(--success)';
            case 'In Review': return 'var(--warning)';
            default: return 'var(--text-muted)';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Resolved': return <FaCheckCircle />;
            case 'In Review': return <FaHourglassHalf />;
            default: return <FaExclamationCircle />;
        }
    }

    return (
        <div className="container section-padding">
            <h2 style={{ marginBottom: '20px' }}>{t('Public Grievance Redressal', 'പൊതു പരാതി പരിഹാരം')}</h2>

            <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ display: 'flex', borderBottom: '1px solid #eee', background: '#f8f9fa' }}>
                    <button
                        className={`btn ${activeTab === 'new' ? '' : 'btn-outline'}`}
                        style={{
                            flex: 1,
                            borderRadius: 0,
                            background: activeTab === 'new' ? 'var(--white)' : 'transparent',
                            borderBottom: activeTab === 'new' ? '3px solid var(--primary-blue)' : 'none',
                            fontWeight: activeTab === 'new' ? '600' : '400'
                        }}
                        onClick={() => setActiveTab('new')}
                    >
                        <FaPaperPlane style={{ marginRight: '8px' }} /> {t('File New Complaint', 'പുതിയ പരാതി നൽകുക')}
                    </button>
                    <button
                        className={`btn ${activeTab === 'history' ? '' : 'btn-outline'}`}
                        style={{
                            flex: 1,
                            borderRadius: 0,
                            background: activeTab === 'history' ? 'var(--white)' : 'transparent',
                            borderBottom: activeTab === 'history' ? '3px solid var(--primary-blue)' : 'none',
                            fontWeight: activeTab === 'history' ? '600' : '400'
                        }}
                        onClick={() => setActiveTab('history')}
                    >
                        <FaHistory style={{ marginRight: '8px' }} /> {t('My Complaints History', 'എന്റെ പരാതി ചരിത്രം')}
                    </button>
                </div>

                <div style={{ padding: '30px' }}>
                    {activeTab === 'new' ? (
                        <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto' }}>
                            <div style={{ marginBottom: '20px' }}>
                                <label>{t('Subject / Category', 'വിഷയം / വിഭാഗം')}</label>
                                <input
                                    type="text"
                                    placeholder="e.g., Road Repair, Water Supply"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label>{t('Description', 'വിശദീകരണം')}</label>
                                <textarea
                                    rows="5"
                                    placeholder="Describe your grievance in detail..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                ></textarea>
                            </div>

                            {submitStatus === 'success' && (
                                <div style={{ padding: '10px', background: '#d4edda', color: '#155724', borderRadius: '5px', marginBottom: '15px' }}>
                                    Complaint submitted successfully! Redirecting...
                                </div>
                            )}
                            {submitStatus === 'error' && (
                                <div style={{ padding: '10px', background: '#f8d7da', color: '#721c24', borderRadius: '5px', marginBottom: '15px' }}>
                                    Error submitting complaint. Please try again.
                                </div>
                            )}

                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? 'Submitting...' : t('Submit Complaint', 'പരാതി സമർപ്പിക്കുക')}
                            </button>
                        </form>
                    ) : (
                        <div>
                            {loading ? <p>Loading history...</p> : (
                                complaints.length > 0 ? (
                                    <div style={{ display: 'grid', gap: '20px' }}>
                                        {complaints.map((c) => (
                                            <div key={c._id} style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' }}>
                                                <div>
                                                    <h4 style={{ marginBottom: '5px' }}>{c.title}</h4>
                                                    <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '5px' }}>{c.description}</p>
                                                    <small style={{ color: '#999' }}>Submitted on: {new Date(c.createdAt).toLocaleDateString()}</small>
                                                    {c.adminResponse && (
                                                        <div style={{ marginTop: '10px', padding: '10px', background: '#f1f1f1', borderRadius: '5px', fontSize: '0.9rem' }}>
                                                            <strong>Admin Response:</strong> {c.adminResponse}
                                                        </div>
                                                    )}
                                                </div>
                                                <div style={{ textAlign: 'right', minWidth: '120px' }}>
                                                    <span style={{
                                                        display: 'inline-flex', alignItems: 'center', gap: '5px',
                                                        padding: '5px 10px',
                                                        borderRadius: '20px',
                                                        background: getStatusColor(c.status) + '20', // 20% opacity 
                                                        color: getStatusColor(c.status),
                                                        fontWeight: '600',
                                                        fontSize: '0.9rem'
                                                    }}>
                                                        {getStatusIcon(c.status)} {c.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center" style={{ color: '#999' }}>No complaints found.</p>
                                )
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ComplaintPortal;

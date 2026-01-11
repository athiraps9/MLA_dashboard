//import React, { useEffect, useState } from 'react';
//import api from '../utils/api';
//import Card from '../components/Card';
//import Button from '../components/Button';
//import '../styles/variables.css';
//import { FaClipboardList, FaCheckCircle, FaProjectDiagram, FaStar } from 'react-icons/fa';

import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import Card from '../components/Card';
import Button from '../components/Button';
import '../styles/variables.css';
import { FaClipboardList, FaCheckCircle, FaProjectDiagram, FaStar, FaSave, FaTimes } from 'react-icons/fa';

import ProjectRating from '../components/ProjectRating';
import AvatarUpload from '../components/AvatarUpload';
import { SERVER_URL } from '../utils/api';

const UserDashboard = () => {
    const [activeSection, setActiveSection] = useState('dashboard');
    const [user, setUser] = useState({});
    const [myComplaints, setMyComplaints] = useState([]);
    const [projects, setProjects] = useState([]); // All approved projects
    const [loading, setLoading] = useState(true);

    // Complaint Form
    const [complaintForm, setComplaintForm] = useState({ title: '', description: '' });

    // Profile State
    const [previewUrl, setPreviewUrl] = useState('');
    const [isEditingName, setIsEditingName] = useState(false);
    const [editName, setEditName] = useState('');

    useEffect(() => {
        const u = JSON.parse(localStorage.getItem('user'));
        setUser(u || {});
        if (u) {
            setPreviewUrl(u.avatar ? `${SERVER_URL}${u.avatar}` : null);
            setEditName(u.fullName || '');
        }
        fetchUserData();
        fetchProjects();
    }, []);

    const fetchUserData = async () => {
        try {
            const res = await api.get('/complaints/my');
            setMyComplaints(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchProjects = async () => {
        try {
            const res = await api.get('/public/dashboard'); // Helper to get projects
            setProjects(res.data.projects);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleComplaintSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/complaints', complaintForm);
            alert('Complaint Submitted');
            setComplaintForm({ title: '', description: '' });
            fetchUserData();
        } catch (err) {
            alert('Failed to submit');
        }
    };

    const handleFileSelect = async (file) => {
        try {
            const formData = new FormData();
            formData.append('avatar', file);
            setPreviewUrl(URL.createObjectURL(file)); // Optimistic
            const res = await api.put('/auth/profile', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

            const updatedUser = { ...user, ...res.data };
            localStorage.setItem('user', JSON.stringify({ ...JSON.parse(localStorage.getItem('user')), ...updatedUser }));
            setUser(updatedUser);
        } catch (err) { alert('Upload failed'); console.error(err); }
    };

    const handleSaveName = async () => {
        try {
            const formData = new FormData();
            formData.append('fullName', editName);
            const res = await api.put('/auth/profile', formData);

            const updatedUser = { ...user, ...res.data };
            localStorage.setItem('user', JSON.stringify({ ...JSON.parse(localStorage.getItem('user')), ...updatedUser }));
            setUser(updatedUser);
            setIsEditingName(false);
        } catch (err) { alert('Update name failed'); }
    };

    const styles = {
        container: { display: 'flex', minHeight: 'calc(100vh - 80px)' },
        sidebar: { width: '250px', background: '#f8f9fa', padding: '20px', borderRight: '1px solid #ddd' },
        content: { flex: 1, padding: '30px' },
        menuItem: active => ({ padding: '12px', cursor: 'pointer', borderRadius: '5px', background: active ? 'var(--primary-color)' : 'transparent', color: active ? 'white' : 'black', marginBottom: '5px' }),
        kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div style={styles.container}>
            {/* Sidebar */}
            <div style={styles.sidebar}>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <div style={{ width: '80px', height: '80px', margin: '0 auto 10px', borderRadius: '50%', overflow: 'hidden' }}>
                        {user.avatar ? (
                            <img src={`${SERVER_URL}${user.avatar}`} alt="Pro" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <div style={{ width: '100%', height: '100%', background: '#ddd' }}></div>
                        )}
                    </div>
                    <h4>{user.fullName}</h4>
                    <p style={{ fontSize: '0.8rem', color: '#666' }}>Citizen</p>
                </div>
                <div style={styles.menuItem(activeSection === 'dashboard')} onClick={() => setActiveSection('dashboard')}>Dashboard</div>
                <div style={styles.menuItem(activeSection === 'projects')} onClick={() => setActiveSection('projects')}>Active Projects</div>
                <div style={styles.menuItem(activeSection === 'complaints')} onClick={() => setActiveSection('complaints')}>My Complaints</div>
                <div style={styles.menuItem(activeSection === 'profile')} onClick={() => setActiveSection('profile')}>Profile</div>
            </div>

            {/* Main Content */}
            <div style={styles.content}>
                {activeSection === 'dashboard' && (
                    <>
                        <h2>Welcome Back, {user.fullName}</h2>
                        <div style={styles.kpiGrid}>
                            <Card>
                                <FaClipboardList size={24} color="var(--primary-color)" />
                                <h3>{myComplaints.length}</h3>
                                <p>My Complaints</p>
                            </Card>
                            <Card>
                                <FaCheckCircle size={24} color="green" />
                                <h3>{myComplaints.filter(c => c.status === 'Resolved').length}</h3>
                                <p>Resolved</p>
                            </Card>
                            <Card>
                                <FaProjectDiagram size={24} color="orange" />
                                <h3>{projects.length}</h3>
                                <p>Active Projects</p>
                            </Card>
                        </div>
                    </>
                )}

                {activeSection === 'projects' && (
                    <>
                        <h2>Ongoing Projects</h2>
                        <div style={{ display: 'grid', gap: '20px', marginTop: '20px' }}>
                            {projects.map(p => (
                                <Card key={p._id} title={p.title}>
                                    <p>{p.description}</p>
                                    <p><strong>Status:</strong> {p.status}</p>
                                    <p><strong>Invested:</strong> ₹{p.fundsAllocated?.toLocaleString()}</p>

                                    <ProjectRating projectId={p._id} onRate={fetchProjects} />

                                    {p.ratings && p.ratings.length > 0 && (
                                        <div style={{ marginTop: '15px', background: '#f9f9f9', padding: '10px', borderRadius: '5px' }}>
                                            <h5>Community Reviews ({p.ratings.length})</h5>
                                            {p.ratings.slice(0, 3).map((r, i) => (
                                                <div key={i} style={{ borderBottom: '1px solid #eee', padding: '5px 0', fontSize: '0.9rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                        <FaStar color="#ffc107" size={12} /> {r.rating}
                                                        <span style={{ color: '#aaa', fontSize: '0.8rem' }}> - {new Date(r.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                    {r.comment && <p style={{ margin: '5px 0 0' }}>"{r.comment}"</p>}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </Card>
                            ))}
                        </div>
                    </>
                )}

                {activeSection === 'complaints' && (
                    <>
                        <h2>My Complaints</h2>
                        <Card title="Submit New Complaint" style={{ marginBottom: '20px' }}>
                            <form onSubmit={handleComplaintSubmit} style={{ display: 'grid', gap: '15px' }}>
                                <input placeholder="Title" value={complaintForm.title} onChange={e => setComplaintForm({ ...complaintForm, title: e.target.value })} required style={{ padding: '10px' }} />
                                <textarea placeholder="Description" value={complaintForm.description} onChange={e => setComplaintForm({ ...complaintForm, description: e.target.value })} required style={{ padding: '10px', height: '100px' }} />
                                <Button type="submit">Submit Complaint</Button>
                            </form>
                        </Card>

                        <div style={{ display: 'grid', gap: '15px' }}>
                            {myComplaints.map(c => (
                                <div key={c._id} className="card p-3">
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <h4>{c.title}</h4>
                                        <span className={`badge badge-${c.status === 'Resolved' ? 'success' : 'warning'}`}>{c.status}</span>
                                    </div>
                                    <p>{c.description}</p>
                                    {c.adminResponse && <div className="bg-light p-2 mt-2"><strong>Response:</strong> {c.adminResponse}</div>}
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {activeSection === 'profile' && (
                    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                        <h2>My Profile</h2>
                        <Card title="Edit Profile">
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <AvatarUpload src={previewUrl} onFileSelect={handleFileSelect} editable={true} />
                                <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '2rem' }}>Click photo to update</p>

                                <div style={{ width: '100%', maxWidth: '400px' }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Name</label>
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        {isEditingName ? (
                                            <>
                                                <input
                                                    value={editName} onChange={e => setEditName(e.target.value)}
                                                    style={{ flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                                                />
                                                <Button onClick={handleSaveName}><FaSave /></Button>
                                                <Button variant="danger" onClick={() => setIsEditingName(false)}>X</Button>
                                            </>
                                        ) : (
                                            <>
                                                <div style={{ flex: 1, padding: '10px', fontSize: '1.1rem', borderBottom: '1px solid #eee' }}>{user.fullName}</div>
                                                <span style={{ cursor: 'pointer', color: 'blue' }} onClick={() => setIsEditingName(true)}>✏️ Edit</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div style={{ width: '100%', maxWidth: '400px', marginTop: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email</label>
                                    <input value={user.email || user.username} readOnly style={{ width: '100%', padding: '10px', background: '#eee', border: '1px solid #ccc', borderRadius: '4px' }} />
                                </div>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserDashboard;

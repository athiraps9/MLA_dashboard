
import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import Card from '../components/Card';
import Button from '../components/Button';
import AdminLandingCMS from '../components/AdminLandingCMS';
import PAManagement from '../components/PAManagement'; // Import PA Management
import AvatarUpload from '../components/AvatarUpload';
import { SERVER_URL } from '../utils/api';
import { FaUserCircle, FaSave, FaUser } from 'react-icons/fa';
import '../styles/variables.css';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('verification');
    const [pending, setPending] = useState({ projects: [], attendance: [] });
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(null); // ID of project being edited
    const [editData, setEditData] = useState({});

    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || {});
    const [previewUrl, setPreviewUrl] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState('');

    useEffect(() => {
        fetchPending();
        if (user) {
            setPreviewUrl(user.avatar ? `${SERVER_URL}${user.avatar}` : null);
            setEditName(user.fullName || '');
        }
    }, [user]);

    const fetchPending = async () => {
        try {
            const res = await api.get('/admin/pending');
            const pendingComplaints = await api.get('/complaints/all'); // Keep this, assuming route exists/is updated
            setPending({ ...res.data, complaints: pendingComplaints.data });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPending();
    }, []);

    const handleProjectAction = async (id, status) => {
        try {
            const remarks = prompt("Enter remarks (optional):", status === 'approved' ? 'Verified by Admin' : 'Rejected');
            if (remarks === null) return;
            await api.put(`/admin/project/${id}`, { status, remarks });
            fetchPending();
        } catch (err) {
            console.error(err);
            alert('Action failed');
        }
    };

    const handleDeleteProject = async (id) => {
        if (!window.confirm("Are you sure you want to PERMANENTLY DELETE this project?")) return;
        try {
            await api.delete(`/admin/project/${id}`);
            fetchPending();
        } catch (err) {
            console.error(err);
            alert('Delete failed');
        }
    };

    const startEdit = (project) => {
        setEditMode(project._id);
        setEditData({ ...project });
    };

    const saveEdit = async () => {
        try {
            await api.put(`/admin/project/${editMode}`, editData);
            setEditMode(null);
            fetchPending();
        } catch (err) {
            alert('Update failed');
        }
    };

    const handleAttendanceAction = async (id, isVerified) => {
        try {
            await api.put(`/admin/attendance/${id}`, { isVerified, remarks: isVerified ? 'Verified' : 'Rejected' });
            fetchPending();
        } catch (err) {
            console.error(err);
            alert('Action failed');
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
            setLoading(true);
            const formData = new FormData();
            formData.append('fullName', editName);
            const res = await api.put('/auth/profile', formData);

            const updatedUser = { ...user, ...res.data };
            localStorage.setItem('user', JSON.stringify({ ...JSON.parse(localStorage.getItem('user')), ...updatedUser }));
            setUser(updatedUser);
            setIsEditing(false);
            alert('Name updated!');
        } catch (err) {
            alert('Update failed');
        } finally {
            setLoading(false);
        }
    };


    if (loading) return <div className="text-center mt-lg">Loading Admin Panel...</div>;

    const styles = {
        tabContainer: { display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px', overflowX: 'auto' },
        tab: { padding: '10px 20px', cursor: 'pointer', border: 'none', background: 'transparent', fontSize: '1.1rem', whiteSpace: 'nowrap' },
        activeTab: { borderBottom: '3px solid var(--primary-color)', fontWeight: 'bold', color: 'var(--primary-color)' }
    };

    return (
        <div className="container mt-lg">
            <h1 className="text-center" style={{ marginBottom: '30px' }}>Admin Panel</h1>

            <div style={styles.tabContainer}>
                <button
                    style={{ ...styles.tab, ...(activeTab === 'verification' ? styles.activeTab : {}) }}
                    onClick={() => setActiveTab('verification')}
                >
                    Verifications
                </button>
                <button
                    style={{ ...styles.tab, ...(activeTab === 'cms' ? styles.activeTab : {}) }}
                    onClick={() => setActiveTab('cms')}
                >
                    Landing Page CMS
                </button>
                <button
                    style={{ ...styles.tab, ...(activeTab === 'complaints' ? styles.activeTab : {}) }}
                    onClick={() => setActiveTab('complaints')}
                >
                    Complaints
                </button>
                <button
                    style={{ ...styles.tab, ...(activeTab === 'pa_management' ? styles.activeTab : {}) }}
                    onClick={() => setActiveTab('pa_management')}
                >
                    PA Management
                </button>
                <button
                    style={{ ...styles.tab, ...(activeTab === 'profile' ? styles.activeTab : {}) }}
                    onClick={() => setActiveTab('profile')}
                >
                    Profile
                </button>
            </div>

            {activeTab === 'profile' && (
                <div className="card" style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <AvatarUpload src={previewUrl} onFileSelect={handleFileSelect} editable={true} />
                        <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '10px' }}>Update photo</p>

                        <div style={{ width: '100%', maxWidth: '400px', marginTop: '2rem' }}>
                            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Full Name</label>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                {isEditing ? (
                                    <>
                                        <input
                                            className="form-control"
                                            value={editName}
                                            onChange={e => setEditName(e.target.value)}
                                            style={{ flex: 1 }}
                                        />
                                        <Button onClick={handleSaveName} disabled={loading}><FaSave /></Button>
                                        <button className="btn btn-outline-secondary" onClick={() => setIsEditing(false)}>X</button>
                                    </>
                                ) : (
                                    <>
                                        <div style={{ flex: 1, padding: '10px', borderBottom: '1px solid #eee' }}>{user.fullName}</div>
                                        <button className="btn btn-sm btn-outline-primary" onClick={() => setIsEditing(true)}>Edit</button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'pa_management' && <PAManagement />}

            {activeTab === 'cms' && <AdminLandingCMS />}

            {activeTab === 'complaints' && (
                <div>
                    <h2 style={{ borderBottom: '2px solid var(--secondary-color)', paddingBottom: '10px' }}>User Complaints</h2>
                    <div style={{ display: 'grid', gap: '1rem', marginTop: '20px' }}>
                        {pending.complaints?.length === 0 ? <p>No complaints found.</p> : pending.complaints?.map(c => (
                            <div key={c._id} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <h4 style={{ margin: 0 }}>{c.title}</h4>
                                    <span style={{
                                        padding: '2px 8px', borderRadius: '10px', fontSize: '0.8rem',
                                        background: c.status === 'Resolved' ? '#d4edda' : '#fff3cd',
                                        color: c.status === 'Resolved' ? '#155724' : '#856404'
                                    }}>
                                        {c.status}
                                    </span>
                                </div>
                                <p style={{ fontSize: '0.9rem', color: '#666' }}>By: {c.user?.fullName} ({c.user?.email})</p>
                                <p>{c.description}</p>
                                {c.adminResponse && <p style={{ background: '#f8f9fa', padding: '10px' }}><strong>Admin Response:</strong> {c.adminResponse}</p>}
                                {c.paResponse && <p style={{ background: '#f8f9fa', padding: '10px' }}><strong>PA Response:</strong> {c.paResponse}</p>}

                                {c.status !== 'Resolved' && (
                                    <div style={{ marginTop: '10px' }}>
                                        <Button
                                            variant="success"
                                            onClick={async () => {
                                                const resp = prompt("Enter resolution response:");
                                                if (resp) {
                                                    await api.put(`/complaints/${c._id}`, { status: 'Resolved', adminResponse: resp });
                                                    fetchPending();
                                                }
                                            }}
                                        >
                                            Mark as Resolved
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'verification' && (
                <>
                    <h2 style={{ borderBottom: '2px solid var(--secondary-color)', paddingBottom: '10px' }}>Pending Projects</h2>
                    {pending.projects.length === 0 ? <p className="mt-lg">No pending projects.</p> : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '20px', marginTop: '20px' }}>
                            {pending.projects.map(p => (
                                <Card key={p._id} title={editMode === p._id ? 'Editing Project' : p.title}>
                                    {editMode === p._id ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                            <input value={editData.title} onChange={e => setEditData({ ...editData, title: e.target.value })} placeholder="Title" style={{ padding: '5px' }} />
                                            <textarea value={editData.description} onChange={e => setEditData({ ...editData, description: e.target.value })} placeholder="Description" style={{ padding: '5px' }} />
                                            <input type="number" value={editData.fundsAllocated} onChange={e => setEditData({ ...editData, fundsAllocated: e.target.value })} placeholder="Funds" style={{ padding: '5px' }} />
                                            <div className="flex gap-md">
                                                <Button onClick={saveEdit}>Save</Button>
                                                <Button variant="danger" onClick={() => setEditMode(null)}>Cancel</Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <p><strong>MLA:</strong> {p.mla?.fullName}</p>
                                            <p><strong>Desc:</strong> {p.description}</p>
                                            <p><strong>Funds:</strong> ₹{p.fundsAllocated.toLocaleString()}</p>
                                            <div className="flex gap-md" style={{ marginTop: '15px', flexWrap: 'wrap' }}>
                                                <Button variant="success" onClick={() => handleProjectAction(p._id, 'approved')}>Approve</Button>
                                                <Button variant="danger" onClick={() => handleProjectAction(p._id, 'rejected')}>Reject</Button>
                                                <Button onClick={() => startEdit(p)} style={{ backgroundColor: '#ecc94b', color: 'black' }}>Edit</Button>
                                                <Button variant="danger" onClick={() => handleDeleteProject(p._id)} style={{ backgroundColor: '#c53030' }}>Delete</Button>
                                            </div>
                                        </>
                                    )}
                                </Card>
                            ))}
                        </div>
                    )}

                    <h2 style={{ borderBottom: '2px solid var(--secondary-color)', paddingBottom: '10px', marginTop: '40px' }}>Pending Attendance</h2>
                    <div style={{ marginTop: '20px' }}>
                        {pending.attendance.length === 0 ? <p>No pending attendance records.</p> : (
                            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
                                <thead>
                                    <tr style={{ backgroundColor: 'var(--primary-color)', color: 'white', textAlign: 'left' }}>
                                        <th style={{ padding: '10px' }}>Season</th>
                                        <th style={{ padding: '10px' }}>Date</th>
                                        <th style={{ padding: '10px' }}>MLA</th>
                                        <th style={{ padding: '10px' }}>Status</th>
                                        <th style={{ padding: '10px' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pending.attendance.map(a => (
                                        <tr key={a._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                            <td style={{ padding: '10px' }}>{a.season || 'N/A'}</td>
                                            <td style={{ padding: '10px' }}>{new Date(a.date).toLocaleDateString()}</td>
                                            <td style={{ padding: '10px' }}>{a.mlaName || 'MLA'}</td>
                                            <td style={{ padding: '10px' }}>{a.present ? 'Present' : 'Absent'}</td>
                                            <td style={{ padding: '10px' }}>
                                                <Button variant="success" onClick={() => handleAttendanceAction(a._id, true)} style={{ marginRight: '5px', fontSize: '0.8rem', padding: '4px 8px' }}>Verify</Button>
                                                <Button variant="danger" onClick={() => handleAttendanceAction(a._id, false)} style={{ fontSize: '0.8rem', padding: '4px 8px' }}>Reject</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminDashboard;

import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import Card from '../components/Card';
import Button from '../components/Button';
import AvatarUpload from '../components/AvatarUpload';
import { SERVER_URL } from '../utils/api';
import { FaUserCircle, FaSave } from 'react-icons/fa';
import '../styles/variables.css';

const PADashboard = () => {
    const [stats, setStats] = useState({});
    const [activeTab, setActiveTab] = useState('dashboard');
    const [loading, setLoading] = useState(true);

    // Attendance State
    const [attendanceForm, setAttendanceForm] = useState({ season: 'Season 1', date: '', present: true, remarks: '' });
    const [pendingAttendance, setPendingAttendance] = useState([]);

    // Project State
    const [projects, setProjects] = useState([]);

    // Complaints State
    const [complaints, setComplaints] = useState([]);

    // Profile State
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || {});
    const [previewUrl, setPreviewUrl] = useState('');
    // Inline Name Edit
    const [isEditingName, setIsEditingName] = useState(false);
    const [editName, setEditName] = useState('');

    useEffect(() => {
        fetchDashboardData();
        if (user) {
            setPreviewUrl(user.avatar ? `${SERVER_URL}${user.avatar}` : null);
            setEditName(user.fullName || '');
        }
    }, [user]);

    const fetchDashboardData = async () => {
        try {
            const res = await api.get('/pa/dashboard');
            setStats(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchAttendance = async () => {
        try {
            const res = await api.get('/pa/attendance/pending');
            setPendingAttendance(res.data);
        } catch (err) { console.error(err); }
    };

    const fetchProjects = async () => {
        try {
            const res = await api.get('/pa/projects');
            setProjects(res.data);
        } catch (err) { console.error(err); }
    };

    const fetchComplaints = async () => {
        try {
            const res = await api.get('/pa/complaints');
            setComplaints(res.data);
        } catch (err) { console.error(err); }
    };

    // Tab Handler
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab === 'attendance') fetchAttendance();
        if (tab === 'projects') fetchProjects();
        if (tab === 'complaints') fetchComplaints();
    };

    // Attendance Handler
    const handleAttendanceSubmit = async (e) => {
        e.preventDefault();
        try {
            // Assume MLA ID is available from context or user object. For now, fetching first MLA or hardcoding if using context in future
            // A PA usually works for one MLA.
            const user = JSON.parse(localStorage.getItem('user'));
            // Fetch associated MLA ID ... for now assume we pass it or backend handles if linked
            // Note: In real app, PA would be linked to MLA. Let's create a temporary workaround:
            // Since backend expects MLA ID for creating attendance, we need a way to get it.
            // For now, let's just use the current user ID if they were an MLA, but they are PA.
            // Backend update required to infer MLA from PA or pass it. 
            // Workaround: Get list of MLAs and select one (Admin style) or assume single MLA context.
            // Let's assume mlaId is passed in body. We need to fetch it.

            // Simplified: Fetch an MLA to assign to. 
            const mlaRes = await api.get('/mla-directory'); // Assume this exists public/auth
            const mlaId = mlaRes.data[0]?._id; // Just pick first for demo if not linked

            await api.post('/pa/attendance', { ...attendanceForm, mlaId });
            alert('Attendance added');
            fetchAttendance();
        } catch (err) {
            alert('Error adding attendance: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleProjectUpdate = async (id, status) => {
        try {
            await api.put(`/pa/project/${id}`, { status });
            fetchProjects();
        } catch (err) { alert('Failed'); }
    };

    const handleComplaintUpdate = async (id, status, response) => {
        try {
            await api.put(`/pa/complaint/${id}`, { status, paResponse: response });
            fetchComplaints();
        } catch (err) { alert('Failed'); }
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


    if (loading) return <div>Loading...</div>;

    const styles = {
        container: { padding: '2rem' },
        nav: { display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #ccc' },
        navItem: (active) => ({ padding: '10px 20px', cursor: 'pointer', borderBottom: active ? '2px solid blue' : 'none', color: active ? 'blue' : 'black' }),
        grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' },
        statCard: { padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }
    };

    return (
        <div style={styles.container}>
            <h1>PA Dashboard</h1>

            <div style={styles.nav}>
                {['dashboard', 'attendance', 'projects', 'complaints', 'profile'].map(tab => (
                    <div key={tab} style={styles.navItem(activeTab === tab)} onClick={() => handleTabChange(tab)}>
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </div>
                ))}
            </div>

            {activeTab === 'dashboard' && (
                <div style={styles.grid}>
                    <div style={styles.statCard}><h3>Attendance Records</h3><p>{stats.attendanceRecords}</p></div>
                    <div style={styles.statCard}><h3>Pending Verification</h3><p>{stats.pendingVerification}</p></div>
                    <div style={styles.statCard}><h3>Projects Active</h3><p>{stats.projectsUpdated}</p></div>
                </div>
            )}

            {activeTab === 'attendance' && (
                <div>
                    <Card title="Add Daily Attendance">
                        <form onSubmit={handleAttendanceSubmit} style={{ display: 'grid', gap: '15px', maxWidth: '500px' }}>
                            <select value={attendanceForm.season} onChange={e => setAttendanceForm({ ...attendanceForm, season: e.target.value })} style={{ padding: '8px' }}>
                                <option>Season 1</option><option>Season 2</option><option>Season 3</option><option>Season 4</option>
                            </select>
                            <input type="date" value={attendanceForm.date} onChange={e => setAttendanceForm({ ...attendanceForm, date: e.target.value })} required style={{ padding: '8px' }} />
                            <label>
                                <input type="checkbox" checked={attendanceForm.present} onChange={e => setAttendanceForm({ ...attendanceForm, present: e.target.checked })} /> Present
                            </label>
                            <textarea placeholder="Remarks" value={attendanceForm.remarks} onChange={e => setAttendanceForm({ ...attendanceForm, remarks: e.target.value })} style={{ padding: '8px' }} />
                            <Button type="submit">Add Entry</Button>
                        </form>
                    </Card>

                    <h3 className="mt-lg">Pending Verification</h3>
                    {pendingAttendance.map(p => (
                        <div key={p._id} className="card p-3 mb-2">
                            <strong>{new Date(p.date).toLocaleDateString()}</strong> - {p.season} - {p.present ? 'Present' : 'Absent'}
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'projects' && (
                <div>
                    <h3>Project Updates</h3>
                    {projects.map(p => (
                        <Card key={p._id} title={p.title}>
                            <p>Status: {p.status}</p>
                            <Button onClick={() => handleProjectUpdate(p._id, 'in-progress')}>Mark In Progress</Button>
                            <Button onClick={() => handleProjectUpdate(p._id, 'completed')}>Mark Completed</Button>
                        </Card>
                    ))}
                </div>
            )}

            {activeTab === 'complaints' && (
                <div>
                    <h3>Complaint Management</h3>
                    {complaints.map(c => (
                        <div key={c._id} className="card p-3 mb-3">
                            <h4>{c.title}</h4>
                            <p>{c.description}</p>
                            <p>Status: <strong>{c.status}</strong></p>
                            {c.adminResponse && <p>Admin: {c.adminResponse}</p>}
                            <div className="flex gap-2">
                                <Button onClick={() => handleComplaintUpdate(c._id, 'In Progress', prompt('Enter update:'))}>Update Status</Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'profile' && (
                <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <Card title="My Profile">
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
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default PADashboard;

import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import Card from '../components/Card';
import Button from '../components/Button';
import '../styles/variables.css';

const MLADashboard = ({ user }) => {
    const [data, setData] = useState({ projects: [], attendance: [] });
    const [view, setView] = useState('dashboard'); // 'dashboard', 'add-project', 'add-attendance'

    // Forms
    const [projectForm, setProjectForm] = useState({ title: '', description: '', fundsAllocated: '', beneficiaries: '' });
    const [attendanceForm, setAttendanceForm] = useState({ date: '', type: 'presentation', description: '' });

    const fetchData = async () => {
        try {
            const res = await api.get('/mla/my-data');
            setData(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleProjectSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/mla/project', projectForm);
            alert('Project added! Waiting for approval.');
            setProjectForm({ title: '', description: '', fundsAllocated: '', beneficiaries: '' });
            setView('dashboard');
            fetchData();
        } catch (err) {
            alert('Error adding project');
        }
    };

    const handleAttendanceSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/mla/attendance', attendanceForm);
            alert('Attendance recorded! Waiting for verification.');
            setAttendanceForm({ date: '', type: 'presentation', description: '' });
            setView('dashboard');
            fetchData();
        } catch (err) {
            alert('Error adding attendance');
        }
    };

    const renderDashboard = () => (
        <>
            <div className="flex justify-between items-center mb-lg" style={{ marginBottom: '20px' }}>
                <h2>Welcome, {user.fullName}</h2>
                <div className="flex gap-md">
                    <Button onClick={() => setView('add-project')}>+ New Project</Button>
                    <Button onClick={() => setView('add-attendance')} variant="secondary">+ Log Activity</Button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 2fr) minmax(300px, 1fr)', gap: '20px' }}>
                <div>
                    <h3>My Projects</h3>
                    {data.projects.map(p => (
                        <Card key={p._id} style={{ borderLeft: p.status === 'approved' ? '4px solid var(--success-color)' : '4px solid var(--warning-color)' }}>
                            <div className="flex justify-between">
                                <h4>{p.title}</h4>
                                <span style={{
                                    color: p.status === 'approved' ? 'var(--success-color)' : 'var(--warning-color)',
                                    fontWeight: 'bold',
                                    textTransform: 'uppercase',
                                    fontSize: '0.8rem'
                                }}>{p.status}</span>
                            </div>
                            <p>{p.description}</p>
                            <p>Funds: ₹{p.fundsAllocated}</p>
                        </Card>
                    ))}
                </div>
                <div>
                    <h3>Recent Activity</h3>
                    {data.attendance.map(a => (
                        <Card key={a._id} style={{ padding: '15px' }}>
                            <p><strong>{new Date(a.date).toLocaleDateString()}</strong> - {a.type}</p>
                            <p>{a.description}</p>
                            <p style={{ fontSize: '0.8rem', color: a.isVerified ? 'var(--success-color)' : 'var(--text-secondary)' }}>
                                {a.isVerified ? 'Verified' : 'Pending Verification'}
                            </p>
                        </Card>
                    ))}
                </div>
            </div>
        </>
    );

    const renderProjectForm = () => (
        <Card title="Add New Development Project" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <form onSubmit={handleProjectSubmit} className="flex-col gap-md">
                <input className="p-sm" placeholder="Project Title" value={projectForm.title} onChange={e => setProjectForm({ ...projectForm, title: e.target.value })} required style={{ padding: '10px', width: '100%' }} />
                <textarea placeholder="Description" value={projectForm.description} onChange={e => setProjectForm({ ...projectForm, description: e.target.value })} required style={{ padding: '10px', width: '100%', minHeight: '100px' }} />
                <input type="number" placeholder="Funds Allocated (INR)" value={projectForm.fundsAllocated} onChange={e => setProjectForm({ ...projectForm, fundsAllocated: e.target.value })} required style={{ padding: '10px', width: '100%' }} />
                <input placeholder="Beneficiaries (e.g., 'Residents of Ward 5')" value={projectForm.beneficiaries} onChange={e => setProjectForm({ ...projectForm, beneficiaries: e.target.value })} style={{ padding: '10px', width: '100%' }} />

                <div className="flex gap-md">
                    <Button type="submit">Submit for Approval</Button>
                    <Button variant="secondary" onClick={() => setView('dashboard')}>Cancel</Button>
                </div>
            </form>
        </Card>
    );

    const renderAttendanceForm = () => (
        <Card title="Log Daily Activity/Attendance" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <form onSubmit={handleAttendanceSubmit} className="flex-col gap-md">
                <input type="date" value={attendanceForm.date} onChange={e => setAttendanceForm({ ...attendanceForm, date: e.target.value })} required style={{ padding: '10px', width: '100%' }} />
                <select value={attendanceForm.type} onChange={e => setAttendanceForm({ ...attendanceForm, type: e.target.value })} style={{ padding: '10px', width: '100%' }}>
                    <option value="presentation">Assembly Presentation</option>
                    <option value="question">Question Raised</option>
                    <option value="committee">Committee Meeting</option>
                    <option value="other">Public Event/Other</option>
                </select>
                <textarea placeholder="Description of activity..." value={attendanceForm.description} onChange={e => setAttendanceForm({ ...attendanceForm, description: e.target.value })} required style={{ padding: '10px', width: '100%', minHeight: '100px' }} />

                <div className="flex gap-md">
                    <Button type="submit">Log Activity</Button>
                    <Button variant="secondary" onClick={() => setView('dashboard')}>Cancel</Button>
                </div>
            </form>
        </Card>
    );

    return (
        <div className="container mt-lg">
            {view === 'dashboard' && renderDashboard()}
            {view === 'add-project' && renderProjectForm()}
            {view === 'add-attendance' && renderAttendanceForm()}
        </div>
    );
};

export default MLADashboard;

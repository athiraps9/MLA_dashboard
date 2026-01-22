import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import Card from '../components/Card';
import Button from '../components/Button';
import AvatarUpload from '../components/AvatarUpload';
import AttendanceTree from '../components/AttendanceTree';
import SimpleCalendar from '../components/SimpleCalendar';
import ScheduleCard from '../components/ScheduleCard';
import { SERVER_URL } from '../utils/api';
import { FaUserCircle, FaSave, FaUser, FaLock, FaTrash, FaPlus } from 'react-icons/fa';
import '../styles/variables.css';

const PADashboard = () => {
    const [stats, setStats] = useState({});
    const [activeTab, setActiveTab] = useState('dashboard');
    const [loading, setLoading] = useState(true);

    // Attendance State
    const [seasons, setSeasons] = useState([]);
    const [attendanceForm, setAttendanceForm] = useState({ seasonId: '', date: '', status: 'Present', remarks: '', mlaId: '' });
    const [pendingAttendance, setPendingAttendance] = useState([]);
    const [allAttendance, setAllAttendance] = useState([]);

    // Scheduling State
    const [schedules, setSchedules] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [scheduleForm, setScheduleForm] = useState({ date: '', time: '', venue: '', scheduleType: '', description: '', adminId: '' });
    const [selectedDate, setSelectedDate] = useState(null);
    const [availability, setAvailability] = useState(null);
    const [busyDates, setBusyDates] = useState([]);

    // Project State
    const [projects, setProjects] = useState([]);
    const [projectForm, setProjectForm] = useState({ title: '', description: '', fundsAllocated: '', startDate: '', endDate: '', mlaId: '' });

    // Schemes State
    const [schemes, setSchemes] = useState([]);
    const [schemeForm, setSchemeForm] = useState({ date: '', time: '', location: '', category: '', description: '' });

    // Events State
    const [events, setEvents] = useState([]);
    const [eventForm, setEventForm] = useState({ date: '', time: '', location: '', category: '', description: '' });

    // Complaints State
    const [complaints, setComplaints] = useState([]);

    // Profile State
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || {});
    const [previewUrl, setPreviewUrl] = useState('');
    const [editData, setEditData] = useState({
        username: '',
        email: '',
        password: '',
        fullName: '',
        phoneNumber: '',
        dateOfBirth: '',
        gender: '',
        constituency: '',
        address: '',
        education: []
    });
    const [searchConstituency, setSearchConstituency] = useState('');
    const [showConstituencySuggestions, setShowConstituencySuggestions] = useState(false);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchDashboardData();
        if (user) {
            setPreviewUrl(user.avatar ? `${SERVER_URL}${user.avatar}` : null);
            setEditData({
                username: user.username || '',
                email: user.email || '',
                password: '',
                fullName: user.fullName || '',
                phoneNumber: user.phoneNumber || '',
                dateOfBirth: user.dateOfBirth || '',
                gender: user.gender || 'Male',
                constituency: user.constituency || '',
                address: user.address || '',
                education: user.education || [{ qualification: '', institution: '', passingYear: '' }]
            });
            setSearchConstituency(user.constituency || '');
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

    const fetchSchemes = async () => {
        try {
            const res = await api.get('/pa/schemes');
            setSchemes(res.data);
        } catch (err) { console.error(err); }
    };

    const fetchEvents = async () => {
        try {
            const res = await api.get('/pa/events');
            setEvents(res.data);
        } catch (err) { console.error(err); }
    };

    // Tab Handler
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab === 'attendance') {
            fetchSeasons();
            fetchAttendance();
            fetchAllAttendance();
        }
        if (tab === 'scheduling') {
            fetchSchedules();
            fetchAdmins();
        }
        if (tab === 'projects') fetchProjects();
        if (tab === 'complaints') fetchComplaints();
        if (tab === 'schemes') fetchSchemes();
        if (tab === 'events') fetchEvents();
    };

    // Fetch Seasons
    const fetchSeasons = async () => {
        try {
            const res = await api.get('/pa/seasons');
            setSeasons(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    // Fetch All Attendance for Tree View
    const fetchAllAttendance = async () => {
        try {
            const res = await api.get('/pa/attendance/all');
            setAllAttendance(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    // Fetch Schedules
    const fetchSchedules = async () => {
        try {
            const res = await api.get('/pa/schedules');
            setSchedules(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    // Fetch Admins and set default
    const fetchAdmins = async () => {
        try {
            const res = await api.get('/pa/admins');
            setAdmins(res.data);
            if (res.data.length > 0) {
                const defaultAdminId = res.data[0]._id;
                setScheduleForm(prev => ({ ...prev, adminId: defaultAdminId }));
                fetchBusyDates(defaultAdminId);
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Fetch Busy Dates for Admin
    const fetchBusyDates = async (adminId) => {
        try {
            const res = await api.get(`/pa/admin-busy-dates/${adminId}`);
            setBusyDates(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    // Check Availability
    const checkAvailability = async (adminId, date) => {
        try {
            const formattedDate = new Date(date).toISOString().split('T')[0];
            const res = await api.get(`/pa/availability/${adminId}/${formattedDate}`);
            setAvailability(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    // Attendance Handler
    const handleAttendanceSubmit = async (e) => {
        e.preventDefault();
        try {
            // Get MLA ID - for demo, fetch first MLA
            const mlaRes = await api.get('/mla-directory');
            const mlaId = attendanceForm.mlaId || mlaRes.data[0]?._id;

            if (!mlaId) {
                alert('No MLA found. Please ensure an MLA exists in the system.');
                return;
            }

            await api.post('/pa/attendance', { ...attendanceForm, mlaId });
            alert('Attendance added successfully!');
            setAttendanceForm({ seasonId: '', date: '', status: 'Present', remarks: '', mlaId: '' });
            fetchAttendance();
            fetchAllAttendance();
        } catch (err) {
            alert('Error adding attendance: ' + (err.response?.data?.message || err.message));
        }
    };

    // Schedule Handler
    const handleScheduleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/pa/schedule', scheduleForm);
            alert('Schedule created successfully!');
            setScheduleForm({ date: '', time: '', venue: '', scheduleType: '', description: '', adminId: '' });
            fetchSchedules();
        } catch (err) {
            alert('Error creating schedule: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleProjectUpdate = async (id, status) => {
        try {
            await api.put(`/pa/project/${id}`, { status });
            fetchProjects();
        } catch (err) { alert('Failed'); }
    };

    const handleProjectSubmit = async (e) => {
        e.preventDefault();
        try {
            const mlaRes = await api.get('/pa/admins'); // Reusing to find a user, or wait, mla-directory?
            // Actually let's assume the user knows the MLA ID or we fetch it.
            // For now, let's use a simpler approach or fetch from directory
            const mlaRes2 = await api.get('/mla-directory');
            const mlaId = projectForm.mlaId || mlaRes2.data[0]?._id;

            await api.post('/pa/project', { ...projectForm, mlaId });
            alert('Project created!');
            setProjectForm({ title: '', description: '', fundsAllocated: '', startDate: '', endDate: '', mlaId: '' });
            fetchProjects();
        } catch (err) { alert('Failed to create project'); }
    };

    const handleSchemeSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/pa/scheme', schemeForm);
            alert('Scheme submitted for verification!');
            setSchemeForm({ date: '', time: '', location: '', category: '', description: '' });
            fetchSchemes();
        } catch (err) { alert('Failed to submit scheme'); }
    };

    const handleEventSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/pa/event', eventForm);
            alert('Event submitted for verification!');
            setEventForm({ date: '', time: '', location: '', category: '', description: '' });
            fetchEvents();
        } catch (err) { alert('Failed to submit event'); }
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

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    };

    const handleEducationChange = (index, e) => {
        const { name, value } = e.target;
        const newEdu = [...editData.education];
        newEdu[index][name] = value;
        setEditData(prev => ({ ...prev, education: newEdu }));
    };

    const addEducation = () => {
        setEditData(prev => ({
            ...prev,
            education: [...prev.education, { qualification: '', institution: '', passingYear: '' }]
        }));
    };

    const removeEducation = (index) => {
        const newEdu = editData.education.filter((_, i) => i !== index);
        setEditData(prev => ({ ...prev, education: newEdu }));
    };

    const handleProfileSave = async () => {
        setError('');
        setLoading(true);
        try {
            const formData = new FormData();
            Object.keys(editData).forEach(key => {
                if (key === 'education') {
                    formData.append(key, JSON.stringify(editData[key]));
                } else if (editData[key] !== undefined && editData[key] !== null) {
                    formData.append(key, editData[key]);
                }
            });

            const res = await api.put('/auth/profile', formData);

            const updatedUser = { ...user, ...res.data };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            setIsEditing(false);
            alert('Profile updated successfully!');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    const styles = {
        container: { padding: '2rem' },
        nav: { display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #ccc' },
        navItem: (active) => ({ padding: '10px 20px', cursor: 'pointer', borderBottom: active ? '2px solid blue' : 'none', color: active ? 'blue' : 'black' }),
        grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' },
        statCard: {
            padding: '24px',
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            boxShadow: '0 8px 32px rgba(31, 38, 135, 0.07)',
            transition: 'transform 0.3s ease'
        },
        inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
        label: { fontWeight: '700', fontSize: '0.9rem', color: '#1a365d', marginBottom: '4px' },
        input: {
            padding: '12px',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
            fontSize: '1rem',
            width: '100%',
            background: 'rgba(255,255,255,0.8)',
            transition: 'border-color 0.2s ease'
        }
    };

    return (
        <div style={styles.container}>
            <h1>PA Dashboard</h1>

            <div style={styles.nav}>
                {['dashboard', 'attendance', 'scheduling', 'projects', 'schemes', 'events', 'complaints', 'profile'].map(tab => (
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
                    <div style={styles.statCard}><h3>Total Schemes</h3><p>{stats.totalSchemes || 0}</p></div>
                    <div style={styles.statCard}><h3>Total Events</h3><p>{stats.totalEvents || 0}</p></div>
                </div>
            )}

            {activeTab === 'attendance' && (
                <div>
                    <Card title="Add Daily Attendance">
                        <form onSubmit={handleAttendanceSubmit} style={{ display: 'grid', gap: '15px', maxWidth: '600px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Season</label>
                                <select
                                    className="form-control"
                                    value={attendanceForm.seasonId}
                                    onChange={e => setAttendanceForm({ ...attendanceForm, seasonId: e.target.value })}
                                    required
                                >
                                    <option value="">Select Season</option>
                                    {seasons.map(season => (
                                        <option key={season._id} value={season._id}>{season.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={attendanceForm.date}
                                    onChange={e => setAttendanceForm({ ...attendanceForm, date: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Status</label>
                                <select
                                    className="form-control"
                                    value={attendanceForm.status}
                                    onChange={e => setAttendanceForm({ ...attendanceForm, status: e.target.value })}
                                >
                                    <option value="Present">Present</option>
                                    <option value="Absent">Absent</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Remarks</label>
                                <textarea
                                    className="form-control"
                                    placeholder="Optional remarks"
                                    value={attendanceForm.remarks}
                                    onChange={e => setAttendanceForm({ ...attendanceForm, remarks: e.target.value })}
                                    rows="3"
                                />
                            </div>
                            <Button type="submit">Add Attendance</Button>
                        </form>
                    </Card>

                    <h3 style={{ marginTop: '30px', marginBottom: '15px' }}>Attendance Tree View</h3>
                    <AttendanceTree attendance={allAttendance} isAdmin={false} />

                    <h3 style={{ marginTop: '30px', marginBottom: '15px' }}>Pending Verification</h3>
                    {pendingAttendance.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>No pending attendance records.</p>
                    ) : (
                        <div style={{ display: 'grid', gap: '10px' }}>
                            {pendingAttendance.map(p => (
                                <div key={p._id} className="card" style={{ padding: '1rem' }}>
                                    <strong>{p.season?.name || 'Unknown Season'}</strong>
                                    <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '5px' }}>
                                        {new Date(p.date).toLocaleDateString()} - {p.status}
                                    </div>
                                    {p.remarks && (
                                        <div style={{ fontSize: '0.85rem', color: '#555', marginTop: '5px' }}>{p.remarks}</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'scheduling' && (
                <div>
                    <h2 style={{ marginBottom: '20px' }}>Schedule Management</h2>

                    {/* Create Schedule Form */}
                    <Card title="Create New Schedule">
                        <form onSubmit={handleScheduleSubmit} style={{ display: 'grid', gap: '15px', maxWidth: '600px' }}>
                            {admins.length > 0 && (
                                <div style={{ padding: '10px', background: '#f0f4f8', borderRadius: '8px', border: '1px solid #d1d9e6', color: '#2d3748', fontSize: '0.9rem', fontWeight: '500' }}>
                                    Schedule with: <strong>{admins[0].fullName}</strong>
                                </div>
                            )}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={scheduleForm.date}
                                        onChange={e => {
                                            setScheduleForm({ ...scheduleForm, date: e.target.value });
                                            if (scheduleForm.adminId && e.target.value) {
                                                checkAvailability(scheduleForm.adminId, e.target.value);
                                            }
                                        }}
                                        required
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Time</label>
                                    <input
                                        type="time"
                                        className="form-control"
                                        value={scheduleForm.time}
                                        onChange={e => setScheduleForm({ ...scheduleForm, time: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Availability Indicator */}
                            {availability && (
                                <div style={{
                                    padding: '10px',
                                    borderRadius: '6px',
                                    backgroundColor: availability.isAvailable ? '#d4edda' : '#f8d7da',
                                    color: availability.isAvailable ? '#155724' : '#721c24',
                                    fontSize: '0.9rem'
                                }}>
                                    {availability.isAvailable ? '✓ Admin is available on this date' : '✗ Admin has existing schedules on this date'}
                                </div>
                            )}

                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Venue</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={scheduleForm.venue}
                                    onChange={e => setScheduleForm({ ...scheduleForm, venue: e.target.value })}
                                    required
                                    placeholder="e.g., Assembly Hall"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Schedule Type</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={scheduleForm.scheduleType}
                                    onChange={e => setScheduleForm({ ...scheduleForm, scheduleType: e.target.value })}
                                    required
                                    placeholder="e.g., Meeting, Event, Session"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Description</label>
                                <textarea
                                    className="form-control"
                                    value={scheduleForm.description}
                                    onChange={e => setScheduleForm({ ...scheduleForm, description: e.target.value })}
                                    rows="3"
                                    placeholder="Optional description"
                                />
                            </div>
                            <Button type="submit">Create Schedule</Button>
                        </form>
                    </Card>

                    {/* Calendar View */}
                    <h3 style={{ marginTop: '40px', marginBottom: '20px' }}>Calendar View</h3>
                    <SimpleCalendar
                        schedules={schedules}
                        busyDates={busyDates}
                        onDateClick={(date) => {
                            setSelectedDate(date);
                            const formattedDate = date.toISOString().split('T')[0];
                            setScheduleForm(prev => ({ ...prev, date: formattedDate }));
                            if (scheduleForm.adminId) {
                                checkAvailability(scheduleForm.adminId, formattedDate);
                            }
                        }}
                    />

                    {/* My Schedules */}
                    <h3 style={{ marginTop: '40px', marginBottom: '20px' }}>My Schedules</h3>
                    {schedules.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>No schedules created yet.</p>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
                            {schedules.map(schedule => (
                                <ScheduleCard key={schedule._id} schedule={schedule} />
                            ))}
                        </div>
                    )}
                </div>
            )
            }

            {
                activeTab === 'projects' && (
                    <div style={{ display: 'grid', gap: '2rem' }}>
                        <Card title="Create New Project">
                            <form onSubmit={handleProjectSubmit} style={{ display: 'grid', gap: '15px' }}>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Title</label>
                                    <input style={styles.input} value={projectForm.title} onChange={e => setProjectForm({ ...projectForm, title: e.target.value })} required />
                                </div>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Description</label>
                                    <textarea style={styles.input} value={projectForm.description} onChange={e => setProjectForm({ ...projectForm, description: e.target.value })} required />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>Start Date</label>
                                        <input type="date" style={styles.input} value={projectForm.startDate} onChange={e => setProjectForm({ ...projectForm, startDate: e.target.value })} required />
                                    </div>
                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>End Date</label>
                                        <input type="date" style={styles.input} value={projectForm.endDate} onChange={e => setProjectForm({ ...projectForm, endDate: e.target.value })} required />
                                    </div>
                                </div>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Budget Allocation</label>
                                    <input type="number" style={styles.input} value={projectForm.fundsAllocated} onChange={e => setProjectForm({ ...projectForm, fundsAllocated: e.target.value })} required />
                                </div>
                                <Button type="submit">Create Project</Button>
                            </form>
                        </Card>

                        <div>
                            <h3>Project Status Management</h3>
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                {projects.map(p => (
                                    <Card key={p._id} title={p.title}>
                                        <div style={{ marginBottom: '1rem' }}>
                                            <span style={{
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                fontSize: '0.8rem',
                                                background: p.status === 'approved' ? '#C6F6D5' : p.status === 'pending' ? '#FEEBC8' : '#FED7D7',
                                                color: p.status === 'approved' ? '#22543D' : p.status === 'pending' ? '#744210' : '#822727'
                                            }}>
                                                {p.status.toUpperCase()}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <Button variant="outline" size="small" onClick={() => handleProjectUpdate(p._id, 'in-progress')}>Mark In Progress</Button>
                                            <Button variant="outline" size="small" onClick={() => handleProjectUpdate(p._id, 'completed')}>Mark Completed</Button>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                )
            }

            {
                activeTab === 'schemes' && (
                    <div style={{ display: 'grid', gap: '2rem' }}>
                        <Card title="Submit New Scheme">
                            <form onSubmit={handleSchemeSubmit} style={{ display: 'grid', gap: '15px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>Date</label>
                                        <input type="date" style={styles.input} value={schemeForm.date} onChange={e => setSchemeForm({ ...schemeForm, date: e.target.value })} required />
                                    </div>
                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>Time</label>
                                        <input type="time" style={styles.input} value={schemeForm.time} onChange={e => setSchemeForm({ ...schemeForm, time: e.target.value })} required />
                                    </div>
                                </div>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Location</label>
                                    <input style={styles.input} value={schemeForm.location} onChange={e => setSchemeForm({ ...schemeForm, location: e.target.value })} required />
                                </div>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Category</label>
                                    <input style={styles.input} value={schemeForm.category} onChange={e => setSchemeForm({ ...schemeForm, category: e.target.value })} required />
                                </div>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Description</label>
                                    <textarea style={styles.input} value={schemeForm.description} onChange={e => setSchemeForm({ ...schemeForm, description: e.target.value })} required />
                                </div>
                                <Button type="submit">Submit Scheme</Button>
                            </form>
                        </Card>

                        <div>
                            <h3>Submitted Schemes</h3>
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                {schemes.map(s => (
                                    <Card key={s._id} title={s.category}>
                                        <p style={{ fontSize: '0.9rem', color: '#666' }}>{new Date(s.date).toLocaleDateString()} | {s.time} | {s.location}</p>
                                        <p>{s.description}</p>
                                        <div>
                                            <span style={{
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                fontSize: '0.8rem',
                                                background: s.status === 'approved' ? '#C6F6D5' : s.status === 'pending' ? '#FEEBC8' : '#FED7D7',
                                                color: s.status === 'approved' ? '#22543D' : s.status === 'pending' ? '#744210' : '#822727'
                                            }}>
                                                {s.status.toUpperCase()}
                                            </span>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                )
            }

            {
                activeTab === 'events' && (
                    <div style={{ display: 'grid', gap: '2rem' }}>
                        <Card title="Submit New Event">
                            <form onSubmit={handleEventSubmit} style={{ display: 'grid', gap: '15px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>Date</label>
                                        <input type="date" style={styles.input} value={eventForm.date} onChange={e => setEventForm({ ...eventForm, date: e.target.value })} required />
                                    </div>
                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>Time</label>
                                        <input type="time" style={styles.input} value={eventForm.time} onChange={e => setEventForm({ ...eventForm, time: e.target.value })} required />
                                    </div>
                                </div>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Location</label>
                                    <input style={styles.input} value={eventForm.location} onChange={e => setEventForm({ ...eventForm, location: e.target.value })} required />
                                </div>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Category</label>
                                    <input style={styles.input} value={eventForm.category} onChange={e => setEventForm({ ...eventForm, category: e.target.value })} required />
                                </div>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Description</label>
                                    <textarea style={styles.input} value={eventForm.description} onChange={e => setEventForm({ ...eventForm, description: e.target.value })} required />
                                </div>
                                <Button type="submit">Submit Event</Button>
                            </form>
                        </Card>

                        <div>
                            <h3>Submitted Events</h3>
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                {events.map(ev => (
                                    <Card key={ev._id} title={ev.category}>
                                        <p style={{ fontSize: '0.9rem', color: '#666' }}>{new Date(ev.date).toLocaleDateString()} | {ev.time} | {ev.location}</p>
                                        <p>{ev.description}</p>
                                        <div>
                                            <span style={{
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                fontSize: '0.8rem',
                                                background: ev.status === 'approved' ? '#C6F6D5' : ev.status === 'pending' ? '#FEEBC8' : '#FED7D7',
                                                color: ev.status === 'approved' ? '#22543D' : ev.status === 'pending' ? '#744210' : '#822727'
                                            }}>
                                                {ev.status.toUpperCase()}
                                            </span>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                )
            }

            {
                activeTab === 'complaints' && (
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
                )
            }

            {
                activeTab === 'profile' && (
                    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                        <Card title="My Profile">
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <AvatarUpload src={previewUrl} onFileSelect={handleFileSelect} editable={true} />
                                <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '2rem' }}>Click photo to update</p>

                                <div style={{ width: '100%', maxWidth: '400px' }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Name</label>
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        {isEditing ? (
                                            <>
                                                <input
                                                    value={editData.fullName}
                                                    onChange={e => setEditData({ ...editData, fullName: e.target.value })}
                                                    style={{ flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                                                />
                                                <Button onClick={handleProfileSave}><FaSave /></Button>
                                                <Button variant="danger" onClick={() => setIsEditing(false)}>X</Button>
                                            </>
                                        ) : (
                                            <>
                                                <div style={{ flex: 1, padding: '10px', fontSize: '1.1rem', borderBottom: '1px solid #eee' }}>{user.fullName}</div>
                                                <span style={{ cursor: 'pointer', color: 'blue' }} onClick={() => setIsEditing(true)}>✏️ Edit</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                )
            }
        </div >
    );
};

export default PADashboard;

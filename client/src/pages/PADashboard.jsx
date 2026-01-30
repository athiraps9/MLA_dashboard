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
    const [projectForm, setProjectForm] = useState({ title: '', description: '', fundsAllocated: '', startDate: '', endDate: '', mlaId: '', image: null });

    // Schemes State
    const [schemes, setSchemes] = useState([]);
    const [schemeForm, setSchemeForm] = useState({ date: '', time: '', location: '', category: '', description: '', image: null });

    // Events State
    const [events, setEvents] = useState([]);
    const [eventForm, setEventForm] = useState({ date: '', time: '', location: '', category: '', description: '', image: null });

    // Helper for file change
    const handleFileChange = (e, setForm, fieldName = 'image') => {
        setForm(prev => ({ ...prev, [fieldName]: e.target.files[0] }));
    };

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
            // const mlaRes = await api.get('/mla-directory');
            // const mlaId = attendanceForm.mlaId || mlaRes.data[0]?._id;

            // if (!mlaId) {
            //     alert('No MLA found. Please ensure an MLA exists in the system.');
            //     return;
            // }

            await api.post('/pa/attendance', { ...attendanceForm });
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


            const formData = new FormData();
            Object.keys(projectForm).forEach(key => {
                if (key === 'image' && projectForm[key]) formData.append('image', projectForm[key]);
                else if (projectForm[key]) formData.append(key, projectForm[key]);
            });


            await api.post('/pa/project', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            alert('Project created!');
            setProjectForm({ title: '', description: '', fundsAllocated: '', startDate: '', endDate: '', mlaId: '', image: null });
            fetchProjects();
        } catch (err) { alert('Failed to create project'); }
    };

    const handleSchemeSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            Object.keys(schemeForm).forEach(key => {
                if (key === 'image' && schemeForm[key]) formData.append('image', schemeForm[key]);
                else if (schemeForm[key]) formData.append(key, schemeForm[key]);
            });

            await api.post('/pa/scheme', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            alert('Scheme submitted for verification!');
            setSchemeForm({ date: '', time: '', location: '', category: '', description: '', image: null });
            fetchSchemes();
        } catch (err) { alert('Failed to submit scheme'); }
    };

    const handleEventSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            Object.keys(eventForm).forEach(key => {
                if (key === 'image' && eventForm[key]) formData.append('image', eventForm[key]);
                else if (eventForm[key]) formData.append(key, eventForm[key]);
            });

            await api.post('/pa/event', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            alert('Event submitted for verification!');
            setEventForm({ date: '', time: '', location: '', category: '', description: '', image: null });
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

      const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
    };

   
    //if (loading) return <div style={{ textAlign: 'center', marginTop: '40px' }}>Loading...</div>;

    const getTabTitle = () => {
        const titles = {
            dashboard: 'Dashboard Overview',
            attendance: 'Attendance Management',
            scheduling: 'Schedule Management',
            projects: 'Project Management',
            schemes: 'Schemes',
            events: 'Events',
            complaints: 'Complaint Management',
            profile: 'My Profile'
        };
        return titles[activeTab] || 'Dashboard';
    };

    return (

        <div  style={{ display: 'flex', backgroundColor: '#F8F9FD', minHeight: '100vh', fontFamily: "'Outfit', sans-serif", color: '#131019' }}>
            {/* Sidebar */}
             <aside style={{ width: '256px', height: '100vh', backgroundColor: '#FFFFFF', borderRight: '1px solid #E0E7FF', display: 'flex', flexDirection: 'column', position: 'fixed' }}>
                <div style={{ padding: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6366F1' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '30px', fontWeight: 'bold' }}>admin_panel_settings</span>
                        <span style={{ fontWeight: 800, fontSize: '20px', letterSpacing: '-0.5px' }}>PA PORTAL</span>
                    </div>
                </div>
                <nav style={{ flex: 1, marginTop: '16px', overflowY: 'auto' }}>
                    <ul style={{ listStyle: 'none', padding: '0 16px', margin: 0 }}>
                        {[
                            { key: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
                            { key: 'attendance', icon: 'how_to_reg', label: 'Attendance', fetch: () => { fetchSeasons(); fetchAttendance(); fetchAllAttendance(); } },
                            { key: 'scheduling', icon: 'calendar_month', label: 'Scheduling', fetch: () => { fetchSchedules(); fetchAdmins(); } },
                            { key: 'projects', icon: 'work', label: 'Projects', fetch: fetchProjects },
                            { key: 'schemes', icon: 'description', label: 'Schemes', fetch: fetchSchemes },
                            { key: 'events', icon: 'event', label: 'Events', fetch: fetchEvents },
                            { key: 'complaints', icon: 'report', label: 'Complaints', fetch: fetchComplaints },
                            { key: 'profile', icon: 'account_circle', label: 'Profile' }
                        ].map(tab => (
                            <li key={tab.key} style={{ marginBottom: '8px' }}>
                                <a
                                    onClick={() => {
                                        setActiveTab(tab.key);
                                        tab.fetch && tab.fetch();
                                    }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '12px 16px',
                                        color: activeTab === tab.key ? '#6366F1' : '#64748B',
                                        backgroundColor: activeTab === tab.key ? '#EEF2FF' : 'transparent',
                                        borderRadius: '12px',
                                        fontWeight: activeTab === tab.key ? 700 : 600,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <span className="material-symbols-outlined" style={{ fontVariationSettings: activeTab === tab.key ? "'FILL' 1" : "'FILL' 0" }}>{tab.icon}</span>
                                    <span>{tab.label}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div style={{ padding: '32px', borderTop: '1px solid #F1F5F9' }}>
                    <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#64748B', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 600, padding: '0 16px', width: '100%', fontFamily: 'inherit' }}>
                        <span className="material-symbols-outlined">logout</span>
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
       

        <main style={{ flex: 1, marginLeft: '256px', height: '100vh', overflowY: 'auto' }}>
                <header style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #E0E7FF', position: 'sticky', top: 0, zIndex: 20, padding: '24px 40px' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#1E1B4B', margin: 0 }}>{getTabTitle()}</h1>
                            <div style={{ display: 'flex', marginTop: '4px', fontSize: '14px', fontWeight: 500, color: '#94A3B8' }}>
                                <span style={{ cursor: 'pointer' }} onClick={() => setActiveTab('dashboard')}>Dashboard</span>
                                <span style={{ margin: '0 8px' }}>/</span>
                                <span style={{ color: '#6366F1' }}>{getTabTitle()}</span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                            <button style={{ padding: '10px', color: '#64748B', border: 'none', background: 'none', cursor: 'pointer', position: 'relative' }}>
                                <span className="material-symbols-outlined">notifications</span>
                                <span style={{ position: 'absolute', top: '8px', right: '8px', width: '8px', height: '8px', backgroundColor: '#EF4444', borderRadius: '50%', border: '2px solid #FFFFFF' }}></span>
                            </button>
                            <div style={{ height: '44px', width: '44px', borderRadius: '50%', backgroundColor: '#6366F1', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px', boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.2)' }}>
                                PA
                            </div>
                        </div>
                    </div>
                    
                </header>
                        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px' }}>
                            {activeTab === 'dashboard' && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
                            {[
                                { title: 'Attendance Records', value: stats.attendanceRecords || 0, icon: 'how_to_reg', bg: '#EEF2FF', color: '#6366F1' },
                                { title: 'Pending Verification', value: stats.pendingVerification || 0, icon: 'pending_actions', bg: '#FEF3C7', color: '#F59E0B' },
                                { title: 'Projects Active', value: stats.projectsUpdated || 0, icon: 'work', bg: '#D1FAE5', color: '#10B981' },
                                { title: 'Total Schemes', value: stats.totalSchemes || 0, icon: 'description', bg: '#DBEAFE', color: '#3B82F6' },
                                { title: 'Total Events', value: stats.totalEvents || 0, icon: 'event', bg: '#FCE7F3', color: '#EC4899' }
                            ].map((stat, idx) => (
                                <div key={idx} style={{ padding: '32px', backgroundColor: '#FFFFFF', borderRadius: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #E0E7FF' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <div style={{ padding: '12px', backgroundColor: stat.bg, borderRadius: '12px' }}>
                                            <span className="material-symbols-outlined" style={{ fontSize: '28px', color: stat.color }}>{stat.icon}</span>
                                        </div>
                                        <div>
                                            <p style={{ margin: 0, fontSize: '14px', color: '#64748B', fontWeight: 600 }}>{stat.title}</p>
                                            <h3 style={{ margin: '4px 0 0 0', fontSize: '32px', fontWeight: 900, color: '#1E1B4B' }}>{stat.value}</h3>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'attendance' && (
                        <div>
                            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '32px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '32px' }}>
                                <h3 style={{ margin: '0 0 24px 0', fontSize: '20px', fontWeight: 700, color: '#1E1B4B' }}>Add Daily Attendance</h3>
                                <form onSubmit={handleAttendanceSubmit} style={{ display: 'grid', gap: '20px', maxWidth: '600px' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#475569', fontSize: '14px' }}>Season</label>
                                        <select value={attendanceForm.seasonId} onChange={e => setAttendanceForm({ ...attendanceForm, seasonId: e.target.value })} required style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '14px' }}>
                                            <option value="">Select Season</option>
                                            {seasons.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#475569', fontSize: '14px' }}>Date</label>
                                        <input type="date" value={attendanceForm.date} onChange={e => setAttendanceForm({ ...attendanceForm, date: e.target.value })} required style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '14px' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#475569', fontSize: '14px' }}>Status</label>
                                        <select value={attendanceForm.status} onChange={e => setAttendanceForm({ ...attendanceForm, status: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '14px' }}>
                                            <option value="Present">Present</option>
                                            <option value="Absent">Absent</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#475569', fontSize: '14px' }}>Remarks</label>
                                        <textarea value={attendanceForm.remarks} onChange={e => setAttendanceForm({ ...attendanceForm, remarks: e.target.value })} rows="3" placeholder="Optional remarks" style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '14px', resize: 'vertical' }} />
                                    </div>
                                    <button type="submit" style={{ padding: '14px 24px', backgroundColor: '#6366F1', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>Add Attendance</button>
                                </form>
                            </div>

                            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1E1B4B', marginBottom: '20px' }}>Attendance Tree View</h3>
                            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '32px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '32px' }}>
                                {allAttendance.length === 0 ? (
                                    <p style={{ textAlign: 'center', color: '#64748B', padding: '20px' }}>No attendance records.</p>
                                ) : (
                                    <div style={{ color: '#64748B' }}>AttendanceTree component would render here</div>
                                )}
                            </div>

                            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1E1B4B', marginBottom: '20px' }}>Pending Verification</h3>
                            {pendingAttendance.length === 0 ? (
                                <p style={{ textAlign: 'center', color: '#64748B', padding: '40px', backgroundColor: '#FFFFFF', borderRadius: '20px' }}>No pending attendance.</p>
                            ) : (
                                <div style={{ display: 'grid', gap: '16px' }}>
                                    {pendingAttendance.map(p => (
                                        <div key={p._id} style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                            <strong style={{ color: '#1E1B4B' }}>{p.season?.name || 'Unknown Season'}</strong>
                                            <div style={{ fontSize: '14px', color: '#64748B', marginTop: '8px' }}>
                                                {new Date(p.date).toLocaleDateString()} - {p.status}
                                            </div>
                                            {p.remarks && <div style={{ fontSize: '13px', color: '#475569', marginTop: '8px' }}>{p.remarks}</div>}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                        </div>


                </main>


                 </div>
        


       
    );
};

export default PADashboard;
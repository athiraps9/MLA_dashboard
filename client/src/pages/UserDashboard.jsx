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
import { FaClipboardList, FaCheckCircle, FaProjectDiagram, FaStar, FaSave, FaTimes, FaUser, FaLock, FaMapMarkerAlt, FaGraduationCap, FaTrash, FaSearch, FaArrowRight, FaPlus, FaChevronDown, FaSignOutAlt } from 'react-icons/fa';
import ProjectRating from '../components/ProjectRating';
import AvatarUpload from '../components/AvatarUpload';
import { SERVER_URL } from '../utils/api';
import { KERALA_CONSTITUENCIES } from '../utils/constituencies';
import { useLocation } from 'react-router-dom';

const UserDashboard = () => {
    const [activeSection, setActiveSection] = useState('dashboard');
    const [user, setUser] = useState({});
    const [myComplaints, setMyComplaints] = useState([]);
    const [projects, setProjects] = useState([]); // All approved projects
    const [schemes, setSchemes] = useState([]); // All approved schemes
    const [events, setEvents] = useState([]); // All approved events
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const location = useLocation();

    // Complaint Form
    const [complaintForm, setComplaintForm] = useState({ title: '', description: '', image: null });

    // Helper for file change
    const handleFileChange = (e, setForm, fieldName = 'image') => {
        setForm(prev => ({ ...prev, [fieldName]: e.target.files[0] }));
    };


    // Profile State
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

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const section = params.get('section');

        if (section) {
            setActiveSection(section);
        }
    }, [location]);

    useEffect(() => {





        const u = JSON.parse(localStorage.getItem('user'));
        if (u) {
            setUser(u);
            setPreviewUrl(u.avatar ? `${SERVER_URL}${u.avatar}` : null);
            setEditData({
                username: u.username || '',
                email: u.email || '',
                password: '',
                fullName: u.fullName || '',
                phoneNumber: u.phoneNumber || '',
                dateOfBirth: u.dateOfBirth || '',
                gender: u.gender || 'Male',
                constituency: u.constituency || '',
                address: u.address || '',
                education: u.education || [{ qualification: '', institution: '', passingYear: '' }]
            });
            setSearchConstituency(u.constituency || '');
        }
        fetchUserData();
        fetchData();
    }, []);

    const fetchUserData = async () => {
        try {
            const res = await api.get('/complaints/my');
            setMyComplaints(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchData = async () => {
        try {
            const res = await api.get('/data/public/dashboard');
            setProjects(res.data.projects);
            setSchemes(res.data.schemes || []);
            setEvents(res.data.events || []);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleComplaintSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            Object.keys(complaintForm).forEach(key => {
                if (key === 'image' && complaintForm[key]) formData.append('image', complaintForm[key]);
                else if (complaintForm[key]) formData.append(key, complaintForm[key]);
            });

            await api.post('/complaints', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            alert('Complaint Submitted');
            setComplaintForm({ title: '', description: '', image: null });
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
            setIsEditing(false); // Switch back to view mode
            alert('Profile updated successfully!');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
    };

    const renderProfileView = () => (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>My Profile</h2>
                <Button onClick={() => setIsEditing(true)}>
                    Edit Profile
                </Button>
            </div>

            <Card title="Account Details">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
                    <div style={{ width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', border: '3px solid #eee' }}>
                        {user.avatar ? (
                            <img src={`${SERVER_URL}${user.avatar}`} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <div style={{ width: '100%', height: '100%', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <FaUser size={50} color="#ccc" />
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Username</label>
                        <p style={{ padding: '10px', background: '#f8f9fa', borderRadius: '4px' }}>{user.username}</p>
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email Address</label>
                        <p style={{ padding: '10px', background: '#f8f9fa', borderRadius: '4px' }}>{user.email}</p>
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Full Name</label>
                        <p style={{ padding: '10px', background: '#f8f9fa', borderRadius: '4px' }}>{user.fullName}</p>
                    </div>
                </div>
            </Card>

            <Card title="Personal Information" style={{ marginTop: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Phone Number</label>
                        <p style={{ padding: '10px', background: '#f8f9fa', borderRadius: '4px' }}>{user.phoneNumber || 'Not provided'}</p>
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Date of Birth</label>
                        <p style={{ padding: '10px', background: '#f8f9fa', borderRadius: '4px' }}>{user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'Not provided'}</p>
                    </div>
                    <div style={{ ...styles.inputGroup, gridColumn: 'span 2' }}>
                        <label style={styles.label}>Gender</label>
                        <p style={{ padding: '10px', background: '#f8f9fa', borderRadius: '4px' }}>{user.gender || 'Not provided'}</p>
                    </div>
                </div>
            </Card>

            <Card title="Location Details" style={{ marginTop: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Constituency</label>
                        <p style={{ padding: '10px', background: '#f8f9fa', borderRadius: '4px' }}>{user.constituency || 'Not provided'}</p>
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Address</label>
                        <p style={{ padding: '10px', background: '#f8f9fa', borderRadius: '4px', minHeight: '60px' }}>{user.address || 'Not provided'}</p>
                    </div>
                </div>
            </Card>

            <Card title="Education Details" style={{ marginTop: '20px' }}>
                {user.education && user.education.length > 0 ? (
                    user.education.map((edu, index) => (
                        <div key={index} style={{ marginBottom: '15px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                                <div>
                                    <label style={{ fontSize: '0.8rem', color: '#666' }}>Qualification</label>
                                    <p style={{ fontWeight: 'bold' }}>{edu.qualification}</p>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem', color: '#666' }}>Institution</label>
                                    <p>{edu.institution}</p>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem', color: '#666' }}>Year of Passing</label>
                                    <p>{edu.passingYear}</p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No education details provided.</p>
                )}
            </Card>
        </div>
    );

    const styles = {
        container: { display: 'flex', minHeight: 'calc(100vh - 80px)' },
        sidebar: { width: '250px', background: '#f8f9fa', padding: '20px', borderRight: '1px solid #ddd' },
        content: { flex: 1, padding: '30px' },
        menuItem: active => ({ padding: '12px', cursor: 'pointer', borderRadius: '5px', background: active ? 'var(--primary-color)' : 'transparent', color: active ? 'white' : 'black', marginBottom: '5px' }),
        kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' },
        inputGroup: { display: 'flex', flexDirection: 'column', gap: '5px' },
        label: { fontWeight: 'bold', fontSize: '0.9rem', color: '#1a365d' },
        input: { padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e0', fontSize: '1rem', width: '100%' },
        sidebarHeader: { position: 'relative', textAlign: 'center', marginBottom: '20px', cursor: 'pointer', padding: '10px', borderRadius: '10px', transition: 'background 0.2s' },
        sidebarDropdown: { position: 'absolute', top: '100%', left: '0', right: '0', background: 'white', boxShadow: '0 5px 20px rgba(0,0,0,0.1)', borderRadius: '12px', overflow: 'hidden', zIndex: 1000, marginTop: '5px' },
        dropdownItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', cursor: 'pointer', transition: 'background 0.2s', fontSize: '0.9rem', color: '#333', textAlign: 'left' }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div style={styles.container}>
            {/* Sidebar */}
            <div style={styles.sidebar}>
                <div
                    style={{ ...styles.sidebarHeader, background: isDropdownOpen ? '#eee' : 'transparent' }}
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                    <div style={{ width: '80px', height: '80px', margin: '0 auto 10px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--primary-color)' }}>
                        {user.avatar ? (
                            <img src={`${SERVER_URL}${user.avatar}`} alt="Pro" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <div style={{ width: '100%', height: '100%', background: '#ddd' }}></div>
                        )}
                    </div>
                    <h4>{user.fullName} <FaChevronDown size={12} color="#888" style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} /></h4>
                    <p style={{ fontSize: '0.8rem', color: '#666' }}>Citizen</p>

                    {isDropdownOpen && (
                        <div style={styles.sidebarDropdown}>
                            <div
                                style={styles.dropdownItem}
                                onClick={(e) => { e.stopPropagation(); setActiveSection('dashboard'); setIsDropdownOpen(false); }}
                                onMouseEnter={e => e.currentTarget.style.background = '#f8f9fa'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                                <FaProjectDiagram size={14} /> Dashboard
                            </div>
                            <div
                                style={styles.dropdownItem}
                                onClick={(e) => { e.stopPropagation(); setActiveSection('profile'); setIsDropdownOpen(false); }}
                                onMouseEnter={e => e.currentTarget.style.background = '#f8f9fa'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                                <FaUser size={14} /> My Profile
                            </div>
                            <div
                                style={{ ...styles.dropdownItem, borderTop: '1px solid #eee', color: '#c53030' }}
                                onClick={(e) => { e.stopPropagation(); handleLogout(); }}
                                onMouseEnter={e => e.currentTarget.style.background = '#fff5f5'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                                <FaSignOutAlt size={14} /> Logout
                            </div>
                        </div>
                    )}
                </div>
                <div style={styles.menuItem(activeSection === 'dashboard')} onClick={() => setActiveSection('dashboard')}>Dashboard</div>
                <div style={styles.menuItem(activeSection === 'projects')} onClick={() => setActiveSection('projects')}>Active Projects</div>
                <div style={styles.menuItem(activeSection === 'schemes')} onClick={() => setActiveSection('schemes')}>Active Schemes</div>
                <div style={styles.menuItem(activeSection === 'events')} onClick={() => setActiveSection('events')}>Active Events</div>
                <div style={styles.menuItem(activeSection === 'complaints')} onClick={() => setActiveSection('complaints')}>My Complaints</div>
                <div style={styles.menuItem(activeSection === 'profile')} onClick={() => setActiveSection('profile')}>Profile</div>
            </div>

            {/* Main Content */}
            <div style={styles.content}>
                <div style={{ padding: '30px' }}>
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
                                        {p.imageUrl && <img src={`${SERVER_URL}${p.imageUrl}`} alt={p.title} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' }} />}
                                        <p>{p.description}</p>
                                        <p><strong>Status:</strong> {p.status}</p>
                                        <p><strong>Invested:</strong> ₹{p.fundsAllocated?.toLocaleString()}</p>

                                        <ProjectRating projectId={p._id} onRate={fetchData} type="projects" />

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

                    {activeSection === 'schemes' && (
                        <>
                            <h2>Government Schemes</h2>
                            <div style={{ display: 'grid', gap: '20px', marginTop: '20px' }}>
                                {schemes.length === 0 ? <p>No active schemes at the moment.</p> : schemes.map(s => (
                                    <Card key={s._id} title={s.category}>
                                        {s.imageUrl && <img src={`${SERVER_URL}${s.imageUrl}`} alt={s.category} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' }} />}
                                        <p style={{ fontSize: '0.9rem', color: '#666' }}>{new Date(s.date).toLocaleDateString()} | {s.time} | {s.location}</p>
                                        <p>{s.description}</p>
                                        <p style={{ fontSize: '0.8rem', color: '#999' }}>Verified by Authority</p>

                                        <ProjectRating projectId={s._id} onRate={fetchData} type="schemes" />

                                        {s.ratings && s.ratings.length > 0 && (
                                            <div style={{ marginTop: '15px', background: '#f9f9f9', padding: '10px', borderRadius: '5px' }}>
                                                <h5>Community Reviews ({s.ratings.length})</h5>
                                                {s.ratings.slice(0, 3).map((r, i) => (
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

                    {activeSection === 'events' && (
                        <>
                            <h2>Upcoming Events</h2>
                            <div style={{ display: 'grid', gap: '20px', marginTop: '20px' }}>
                                {events.length === 0 ? <p>No upcoming events at the moment.</p> : events.map(ev => (
                                    <Card key={ev._id} title={ev.category}>
                                        {ev.imageUrl && <img src={`${SERVER_URL}${ev.imageUrl}`} alt={ev.category} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' }} />}
                                        <p style={{ fontSize: '0.9rem', color: '#666' }}>{new Date(ev.date).toLocaleDateString()} | {ev.time} | {ev.location}</p>
                                        <p>{ev.description}</p>
                                        <p style={{ fontSize: '0.8rem', color: '#999' }}>Verified by Authority</p>

                                        <ProjectRating projectId={ev._id} onRate={fetchData} type="events" />

                                        {ev.ratings && ev.ratings.length > 0 && (
                                            <div style={{ marginTop: '15px', background: '#f9f9f9', padding: '10px', borderRadius: '5px' }}>
                                                <h5>Community Reviews ({ev.ratings.length})</h5>
                                                {ev.ratings.slice(0, 3).map((r, i) => (
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
                                    <input type="file" accept="image/*" onChange={e => handleFileChange(e, setComplaintForm)} style={{ padding: '10px' }} />
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
                                        {c.imageUrl && <img src={`${SERVER_URL}${c.imageUrl}`} alt="Complaint" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', marginTop: '10px' }} />}
                                        <p>{c.description}</p>
                                        {c.adminResponse && <div className="bg-light p-2 mt-2"><strong>Response:</strong> {c.adminResponse}</div>}
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {activeSection === 'profile' && !isEditing && renderProfileView()}

                    {activeSection === 'profile' && isEditing && (
                        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h2>Edit Profile</h2>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <Button variant="secondary" onClick={() => setIsEditing(false)}>Cancel</Button>
                                    <Button onClick={handleProfileSave} disabled={loading}>
                                        <FaSave style={{ marginRight: '8px' }} /> Save Changes
                                    </Button>
                                </div>
                            </div>

                            {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}

                            <Card title="Account Details">
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
                                    <AvatarUpload src={previewUrl} onFileSelect={handleFileSelect} editable={true} />
                                    <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '10px' }}>Click photo to update</p>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>Username</label>
                                        <input name="username" value={editData.username} onChange={handleEditChange} style={styles.input} />
                                    </div>
                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>Email Address</label>
                                        <input name="email" value={editData.email} onChange={handleEditChange} style={styles.input} />
                                    </div>
                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>Full Name</label>
                                        <input name="fullName" value={editData.fullName} onChange={handleEditChange} style={styles.input} />
                                    </div>
                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>New Password (leave blank to keep current)</label>
                                        <input type="password" name="password" value={editData.password} onChange={handleEditChange} style={styles.input} placeholder="••••••••" />
                                    </div>
                                </div>
                            </Card>

                            <Card title="Personal Information" style={{ marginTop: '20px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>Phone Number</label>
                                        <input name="phoneNumber" value={editData.phoneNumber} onChange={handleEditChange} style={styles.input} />
                                    </div>
                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>Date of Birth</label>
                                        <input type="date" name="dateOfBirth" value={editData.dateOfBirth?.split('T')[0]} onChange={handleEditChange} style={styles.input} />
                                    </div>
                                    <div style={{ ...styles.inputGroup, gridColumn: 'span 2' }}>
                                        <label style={styles.label}>Gender</label>
                                        <div style={{ display: 'flex', gap: '20px' }}>
                                            {['Male', 'Female', 'Other'].map(g => (
                                                <label key={g} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                    <input type="radio" name="gender" value={g} checked={editData.gender === g} onChange={handleEditChange} /> {g}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            <Card title="Location Details" style={{ marginTop: '20px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div style={{ position: 'relative' }}>
                                        <label style={styles.label}>Constituency</label>
                                        <div style={{ position: 'relative' }}>
                                            <FaSearch style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
                                            <input
                                                placeholder="Search constituency..."
                                                value={searchConstituency || editData.constituency}
                                                onChange={(e) => {
                                                    setSearchConstituency(e.target.value);
                                                    setShowConstituencySuggestions(true);
                                                }}
                                                onFocus={() => setShowConstituencySuggestions(true)}
                                                style={{ ...styles.input, paddingLeft: '35px' }}
                                            />
                                            {showConstituencySuggestions && (
                                                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid #ddd', borderRadius: '4px', zIndex: 10, maxHeight: '200px', overflowY: 'auto', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                                                    {KERALA_CONSTITUENCIES.filter(c => c.toLowerCase().includes(searchConstituency.toLowerCase())).map(c => (
                                                        <div key={c} onClick={() => { setEditData(p => ({ ...p, constituency: c })); setSearchConstituency(c); setShowConstituencySuggestions(false); }} style={{ padding: '8px 12px', cursor: 'pointer', borderBottom: '1px solid #eee' }}>{c}</div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>Address</label>
                                        <textarea name="address" value={editData.address} onChange={handleEditChange} style={{ ...styles.input, height: '80px', resize: 'none' }} />
                                    </div>
                                </div>
                            </Card>

                            <Card title="Education Details" style={{ marginTop: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
                                    <Button onClick={addEducation} size="sm"><FaPlus /> Add Education</Button>
                                </div>
                                {editData.education?.map((edu, index) => (
                                    <div key={index} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px 40px', gap: '15px', marginBottom: '10px', background: '#f8f9fa', padding: '10px', borderRadius: '4px', alignItems: 'end' }}>
                                        <div style={styles.inputGroup}>
                                            <label style={styles.label}>Qualification</label>
                                            <select name="qualification" value={edu.qualification} onChange={(e) => handleEducationChange(index, e)} style={styles.input}>
                                                <option value="">Select Degree</option>
                                                <option value="Undergraduate">Undergraduate</option>
                                                <option value="Postgraduate">Postgraduate</option>
                                                <option value="PhD">PhD</option>
                                                <option value="Diploma">Diploma</option>
                                                <option value="SSLC">SSLC</option>
                                                <option value="Plus Two">Plus Two</option>
                                            </select>
                                        </div>
                                        <div style={styles.inputGroup}>
                                            <label style={styles.label}>Institution</label>
                                            <input name="institution" value={edu.institution} onChange={(e) => handleEducationChange(index, e)} style={styles.input} placeholder="College / School" />
                                        </div>
                                        <div style={styles.inputGroup}>
                                            <label style={styles.label}>Year</label>
                                            <input name="passingYear" value={edu.passingYear} onChange={(e) => handleEducationChange(index, e)} style={styles.input} placeholder="YYYY" />
                                        </div>
                                        <button onClick={() => removeEducation(index)} style={{ padding: '8px', color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>
                                            <FaTrash />
                                        </button>
                                    </div>
                                ))}
                            </Card>
                        </div>
                    )}
                </div>
            </div >
        </div >
    );
};

export default UserDashboard;

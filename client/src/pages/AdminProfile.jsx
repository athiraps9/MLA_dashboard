import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { SERVER_URL } from '../utils/api';

const AdminProfile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || {});
    const [loading, setLoading] = useState(false);

    // Form States for different sections
    const [editMode, setEditMode] = useState({
        basic: false,
        constituency: false,
        contact: false,
        social: false
    });

    const [profileData, setProfileData] = useState({
        fullName: user.fullName || 'Najeeb Kanthapuram',
        constituency: user.constituency || 'Perinthalmanna',
        assemblyNumber: user.assemblyNumber || '38',
        officeAddress: user.officeAddress || 'MLA Office, Perinthalmanna, Malappuram District, Kerala - 679322',
        phoneNumber: user.phoneNumber || '+91 94470 12345',
        facebook: user.facebook || '/najeeb.mla',
        twitter: user.twitter || '@najeeb_mla',
        instagram: user.instagram || '@kanthapuram_official'
    });

    const [previewUrl, setPreviewUrl] = useState(user.avatar ? `${SERVER_URL}${user.avatar}` : null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const toggleEdit = (section) => {
        setEditMode(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const handleSave = async (section) => {
        try {
            setLoading(true);
            const formData = new FormData();

            // Mapping local state to your backend fields
            if (section === 'basic') {
                formData.append('fullName', profileData.fullName);
            } else if (section === 'constituency') {
                formData.append('constituency', profileData.constituency);
                formData.append('assemblyNumber', profileData.assemblyNumber);
            } else if (section === 'contact') {
                formData.append('officeAddress', profileData.officeAddress);
                formData.append('phoneNumber', profileData.phoneNumber);
            } else if (section === 'social') {
                formData.append('facebook', profileData.facebook);
                formData.append('twitter', profileData.twitter);
                formData.append('instagram', profileData.instagram);
            }

            const res = await api.put('/auth/profile', formData);
            const updatedUser = { ...user, ...res.data };

            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            toggleEdit(section);
        } catch (err) {
            console.error(err);
            alert('Update failed');
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('avatar', file);

            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);

            const res = await api.put('/auth/profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const updatedUser = { ...user, ...res.data };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            setPreviewUrl(`${SERVER_URL}${res.data.avatar}`);
        } catch (err) {
            console.error(err);
            alert('Failed to upload image');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
    };

    return (
        <div style={{ display: 'flex', backgroundColor: '#F8F9FD', minHeight: '100vh', fontFamily: "'Outfit', sans-serif", color: '#131019', width: '100%' }}>
            {/* Sidebar */}
            <aside style={{ width: '256px', height: '100vh', backgroundColor: '#FFFFFF', borderRight: '1px solid #E0E7FF', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
                <div style={{ padding: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6366F1' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '30px', fontWeight: 'bold' }}>account_balance</span>
                        <span style={{ fontWeight: 800, fontSize: '20px', letterSpacing: '-0.5px' }}>LEGISTRA</span>
                    </div>
                </div>
                <nav style={{ flex: 1, marginTop: '16px' }}>
                    <ul style={{ listStyle: 'none', padding: '0 16px' }}>
                        <li style={{ marginBottom: '8px' }}>
                            <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', color: '#64748B', textDecoration: 'none', borderRadius: '12px', fontWeight: 600 }}>
                                <span className="material-symbols-outlined">dashboard</span>
                                <span>Dashboard</span>
                            </Link>
                        </li>
                        <li style={{ marginBottom: '8px' }}>
                            <Link to="/admin/profile" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', backgroundColor: '#EEF2FF', color: '#6366F1', textDecoration: 'none', borderRadius: '12px', fontWeight: 700 }}>
                                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
                                <span>Profile</span>
                            </Link>
                        </li>
                        {/* <li style={{ marginBottom: '8px' }}>
                            <Link to="/settings" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', color: '#64748B', textDecoration: 'none', borderRadius: '12px', fontWeight: 600 }}>
                                <span className="material-symbols-outlined">settings</span>
                                <span>Settings</span>
                            </Link>
                        </li> */}


                    </ul>
                </nav>
                <div style={{ padding: '32px', borderTop: '1px solid #F1F5F9' }}>
                    <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#64748B', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 600, padding: '0 16px', width: '100%' }}>
                        <span className="material-symbols-outlined">logout</span>
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, height: '100vh', overflowY: 'auto', position: 'relative' }}>
                <header style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #E0E7FF', position: 'sticky', top: 0, zIndex: 20, padding: '24px 40px' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#1E1B4B', margin: 0 }}>Profile Management</h1>
                            <div style={{ display: 'flex', marginTop: '4px', fontSize: '14px', fontWeight: 500, color: '#94A3B8' }}>
                                <span style={{ cursor: 'pointer' }} onClick={() => navigate('/admin')}>Dashboard</span>
                                <span style={{ margin: '0 8px' }}>/</span>
                                <span style={{ color: '#6366F1' }}>Profile Management</span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                            <button style={{ padding: '10px', color: '#64748B', border: 'none', background: 'none', cursor: 'pointer', position: 'relative', borderRadius: '50%' }}>
                                <span className="material-symbols-outlined">notifications</span>
                                <span style={{ position: 'absolute', top: '8px', right: '8px', width: '8px', height: '8px', backgroundColor: '#EF4444', borderRadius: '50%', border: '2px solid #FFFFFF' }}></span>
                            </button>
                            <div style={{ height: '44px', width: '44px', borderRadius: '50%', backgroundColor: '#6366F1', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontWeight: 'bold', fontSize: '18px', shadow: '0 10px 15px -3px rgba(99, 102, 241, 0.2)', textTransform: 'uppercase' }}>
                                <span style={{ margin: 'auto' }}>{profileData.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}</span>
                            </div>
                        </div>
                    </div>
                </header>

                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '40px' }}>
                        {/* Profile Card (Left) */}
                        <div style={{ gridColumn: 'span 4' }}>
                            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '32px', boxShadow: '0 10px 30px rgba(99, 102, 241, 0.05)', border: '1px solid rgba(224, 231, 255, 0.5)', padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'sticky', top: '144px' }}>
                                <div style={{ position: 'relative' }}>
                                    <div style={{ height: '208px', width: '208px', borderRadius: '50%', padding: '12px', backgroundColor: '#F5F7FF', border: '4px solid #FFFFFF', boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)', overflow: 'hidden' }}>
                                        {previewUrl ? (
                                            <img src={previewUrl} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', backgroundColor: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <span className="material-symbols-outlined" style={{ fontSize: '72px', color: '#C7D2FE' }}>person</span>
                                            </div>
                                        )}
                                    </div>
                                    <label style={{ position: 'absolute', bottom: '8px', right: '8px', backgroundColor: '#6366F1', color: '#FFFFFF', height: '48px', width: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', shadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', border: '4px solid #FFFFFF' }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>photo_camera</span>
                                        <input type="file" style={{ display: 'none' }} onChange={handleFileSelect} accept="image/*" />
                                    </label>
                                    <div style={{ position: 'absolute', top: '24px', right: '24px', height: '24px', width: '24px', backgroundColor: '#22C55E', borderRadius: '50%', border: '4px solid #FFFFFF' }}></div>
                                </div>

                                <div style={{ marginTop: '32px', textAlign: 'center', width: '100%' }}>
                                    {editMode.basic ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={profileData.fullName}
                                                onChange={handleInputChange}
                                                style={{ width: '100%', padding: '16px', border: '1px solid #E2E8F0', borderRadius: '16px', textAlign: 'center', fontWeight: 'bold', fontSize: '20px', backgroundColor: '#F8FAFC', outline: 'none' }}
                                                placeholder="Enter Full Name"
                                            />
                                            <div style={{ display: 'flex', gap: '12px' }}>
                                                <button onClick={() => handleSave('basic')} style={{ flex: 1, backgroundColor: '#6366F1', color: '#FFFFFF', padding: '14px', borderRadius: '16px', border: 'none', fontSize: '14px', fontWeight: 900, cursor: 'pointer' }}>SAVE</button>
                                                <button onClick={() => toggleEdit('basic')} style={{ flex: 1, backgroundColor: '#F1F5F9', color: '#475569', padding: '14px', borderRadius: '16px', border: 'none', fontSize: '14px', fontWeight: 900, cursor: 'pointer' }}>CANCEL</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <h2 style={{ fontSize: '30px', fontWeight: 900, color: '#1E1B4B', margin: 0, letterSpacing: '-0.5px' }}>{profileData.fullName}</h2>
                                            <p style={{ color: '#6366F1', fontWeight: 800, fontSize: '12px', marginTop: '12px', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Member of Legislative Assembly</p>
                                        </>
                                    )}

                                    <div style={{ marginTop: '32px', display: 'inline-flex', alignItems: 'center', padding: '8px 20px', borderRadius: '100px', backgroundColor: '#F0FDF4', color: '#166534', fontSize: '12px', fontWeight: 900, letterSpacing: '-0.2px', border: '1px solid #DCFCE7' }}>
                                        <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#22C55E', marginRight: '10px' }}></span>
                                        ACTIVE MEMBER
                                    </div>
                                </div>

                                {!editMode.basic && (
                                    <div style={{ width: '100%', marginTop: '40px' }}>
                                        <button onClick={() => toggleEdit('basic')} style={{ width: '100%', backgroundColor: '#6366F1', color: '#FFFFFF', fontWeight: 900, padding: '18px', borderRadius: '16px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', boxShadow: '0 20px 25px -5px rgba(99, 102, 241, 0.2)' }}>
                                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>edit</span>
                                            <span>Edit Basic Info</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Details (Right) */}
                        <div style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                            {/* Constituency Details */}
                            <section style={{ backgroundColor: '#FFFFFF', borderRadius: '32px', boxShadow: '0 10px 20px rgba(99, 102, 241, 0.03)', border: '1px solid rgba(224, 231, 255, 0.5)', overflow: 'hidden' }}>
                                <div style={{ padding: '32px 40px', borderBottom: '1px solid #F8FAFC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h3 style={{ fontSize: '20px', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '16px', color: '#1E1B4B', margin: 0 }}>
                                        <div style={{ padding: '10px', backgroundColor: '#EEF2FF', borderRadius: '12px', color: '#6366F1' }}>
                                            <span className="material-symbols-outlined" style={{ fontWeight: 'bold' }}>account_balance</span>
                                        </div>
                                        Constituency Details
                                    </h3>
                                    <button onClick={() => editMode.constituency ? handleSave('constituency') : toggleEdit('constituency')} style={{ color: '#6366F1', fontSize: '14px', fontWeight: 900, textTransform: 'uppercase', border: 'none', background: 'none', cursor: 'pointer' }}>
                                        {editMode.constituency ? 'Save Changes' : 'Update'}
                                    </button>
                                </div>
                                <div style={{ padding: '40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                        <div style={{ height: '56px', width: '56px', borderRadius: '16px', backgroundColor: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E2E8F0' }}>
                                            <span className="material-symbols-outlined" style={{ color: '#6366F1' }}>location_city</span>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>Assembly Name</p>
                                            {editMode.constituency ? (
                                                <input name="constituency" value={profileData.constituency} onChange={handleInputChange} style={{ width: '100%', border: 'none', borderBottom: '2px solid #6366F1', fontWeight: 900, fontSize: '18px', padding: '4px 0', outline: 'none', marginTop: '4px', background: 'transparent' }} />
                                            ) : (
                                                <p style={{ fontSize: '20px', fontWeight: 900, color: '#1E1B4B', margin: '4px 0 0 0' }}>{profileData.constituency}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                        <div style={{ height: '56px', width: '56px', borderRadius: '16px', backgroundColor: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E2E8F0' }}>
                                            <span className="material-symbols-outlined" style={{ color: '#6366F1' }}>pin_drop</span>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>Assembly Number</p>
                                            {editMode.constituency ? (
                                                <input name="assemblyNumber" value={profileData.assemblyNumber} onChange={handleInputChange} style={{ width: '100%', border: 'none', borderBottom: '2px solid #6366F1', fontWeight: 900, fontSize: '18px', padding: '4px 0', outline: 'none', marginTop: '4px', background: 'transparent' }} />
                                            ) : (
                                                <p style={{ fontSize: '20px', fontWeight: 900, color: '#1E1B4B', margin: '4px 0 0 0' }}>{profileData.assemblyNumber}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Contact Information */}
                            <section style={{ backgroundColor: '#FFFFFF', borderRadius: '32px', boxShadow: '0 10px 20px rgba(99, 102, 241, 0.03)', border: '1px solid rgba(224, 231, 255, 0.5)', overflow: 'hidden' }}>
                                <div style={{ padding: '32px 40px', borderBottom: '1px solid #F8FAFC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h3 style={{ fontSize: '20px', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '16px', color: '#1E1B4B', margin: 0 }}>
                                        <div style={{ padding: '10px', backgroundColor: '#EEF2FF', borderRadius: '12px', color: '#6366F1' }}>
                                            <span className="material-symbols-outlined" style={{ fontWeight: 'bold' }}>contact_mail</span>
                                        </div>
                                        Contact Information
                                    </h3>
                                    <button onClick={() => editMode.contact ? handleSave('contact') : toggleEdit('contact')} style={{ color: '#6366F1', fontSize: '14px', fontWeight: 900, textTransform: 'uppercase', border: 'none', background: 'none', cursor: 'pointer' }}>
                                        {editMode.contact ? 'Save Changes' : 'Update'}
                                    </button>
                                </div>
                                <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '40px' }}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
                                        <div style={{ height: '56px', width: '56px', borderRadius: '16px', backgroundColor: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E2E8F0', flexShrink: 0 }}>
                                            <span className="material-symbols-outlined" style={{ color: '#6366F1' }}>corporate_fare</span>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>Office Address</p>
                                            {editMode.contact ? (
                                                <textarea name="officeAddress" value={profileData.officeAddress} onChange={handleInputChange} style={{ width: '100%', backgroundColor: '#F8FAFC', border: '2px solid #E2E8F0', borderRadius: '16px', padding: '16px', marginTop: '12px', fontWeight: 'bold', color: '#475569', outline: 'none', resize: 'none', fontFamily: 'inherit' }} rows="3" />
                                            ) : (
                                                <p style={{ fontSize: '16px', fontWeight: 700, color: '#475569', marginTop: '12px', lineHeight: 1.8, maxWidth: '448px' }}>{profileData.officeAddress}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                        <div style={{ height: '56px', width: '56px', borderRadius: '16px', backgroundColor: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E2E8F0' }}>
                                            <span className="material-symbols-outlined" style={{ color: '#6366F1' }}>call</span>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>Direct Phone Number</p>
                                            {editMode.contact ? (
                                                <input name="phoneNumber" value={profileData.phoneNumber} onChange={handleInputChange} style={{ width: '100%', border: 'none', borderBottom: '2px solid #6366F1', fontWeight: 900, fontSize: '18px', padding: '4px 0', outline: 'none', marginTop: '4px', background: 'transparent' }} />
                                            ) : (
                                                <p style={{ fontSize: '20px', fontWeight: 900, color: '#1E1B4B', margin: '4px 0 0 0' }}>{profileData.phoneNumber}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Social Presence */}
                            <section style={{ backgroundColor: '#FFFFFF', borderRadius: '32px', boxShadow: '0 10px 20px rgba(99, 102, 241, 0.03)', border: '1px solid rgba(224, 231, 255, 0.5)', overflow: 'hidden' }}>
                                <div style={{ padding: '32px 40px', borderBottom: '1px solid #F8FAFC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h3 style={{ fontSize: '20px', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '16px', color: '#1E1B4B', margin: 0 }}>
                                        <div style={{ padding: '10px', backgroundColor: '#EEF2FF', borderRadius: '12px', color: '#6366F1' }}>
                                            <span className="material-symbols-outlined" style={{ fontWeight: 'bold' }}>share</span>
                                        </div>
                                        Social Presence
                                    </h3>
                                    <button onClick={() => editMode.social ? handleSave('social') : toggleEdit('social')} style={{ backgroundColor: 'rgba(99, 102, 241, 0.05)', color: '#6366F1', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px', padding: '10px 20px', borderRadius: '12px', cursor: 'pointer', border: 'none' }}>
                                        {editMode.social ? 'Save All Links' : 'Edit All Links'}
                                    </button>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    {/* Facebook */}
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '32px 40px', borderBottom: '1px solid #F8FAFC' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1 }}>
                                            <div style={{ height: '56px', width: '56px', borderRadius: '16px', backgroundColor: 'rgba(59, 89, 152, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3B5998', border: '1px solid rgba(59, 89, 152, 0.2)' }}>
                                                <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>social_leaderboard</span>
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <p style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>Facebook</p>
                                                {editMode.social ? (
                                                    <input name="facebook" value={profileData.facebook} onChange={handleInputChange} style={{ width: '100%', border: 'none', borderBottom: '2px solid #6366F1', fontWeight: 700, fontSize: '16px', padding: '4px 0', outline: 'none', marginTop: '4px', background: 'transparent' }} />
                                                ) : (
                                                    <p style={{ fontSize: '16px', fontWeight: 700, color: '#1E1B4B', margin: '4px 0 0 0' }}>{profileData.facebook}</p>
                                                )}
                                            </div>
                                        </div>
                                        {!editMode.social && (
                                            <Link to="#" style={{ color: '#CBD5E1' }}><span className="material-symbols-outlined" style={{ fontSize: '20px' }}>open_in_new</span></Link>
                                        )}
                                    </div>
                                    {/* Twitter */}
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '32px 40px', borderBottom: '1px solid #F8FAFC' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1 }}>
                                            <div style={{ height: '56px', width: '56px', borderRadius: '16px', backgroundColor: 'rgba(0, 0, 0, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000000', border: '1px solid rgba(0, 0, 0, 0.1)' }}>
                                                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>close</span>
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <p style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>X (Twitter)</p>
                                                {editMode.social ? (
                                                    <input name="twitter" value={profileData.twitter} onChange={handleInputChange} style={{ width: '100%', border: 'none', borderBottom: '2px solid #6366F1', fontWeight: 700, fontSize: '16px', padding: '4px 0', outline: 'none', marginTop: '4px', background: 'transparent' }} />
                                                ) : (
                                                    <p style={{ fontSize: '16px', fontWeight: 700, color: '#1E1B4B', margin: '4px 0 0 0' }}>{profileData.twitter}</p>
                                                )}
                                            </div>
                                        </div>
                                        {!editMode.social && (
                                            <Link to="#" style={{ color: '#CBD5E1' }}><span className="material-symbols-outlined" style={{ fontSize: '20px' }}>open_in_new</span></Link>
                                        )}
                                    </div>
                                    {/* Instagram */}
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '32px 40px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1 }}>
                                            <div style={{ height: '56px', width: '56px', borderRadius: '16px', backgroundColor: 'rgba(228, 64, 95, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E4405F', border: '1px solid rgba(228, 64, 95, 0.2)' }}>
                                                <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>camera_alt</span>
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <p style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>Instagram</p>
                                                {editMode.social ? (
                                                    <input name="instagram" value={profileData.instagram} onChange={handleInputChange} style={{ width: '100%', border: 'none', borderBottom: '2px solid #6366F1', fontWeight: 700, fontSize: '16px', padding: '4px 0', outline: 'none', marginTop: '4px', background: 'transparent' }} />
                                                ) : (
                                                    <p style={{ fontSize: '16px', fontWeight: 700, color: '#1E1B4B', margin: '4px 0 0 0' }}>{profileData.instagram}</p>
                                                )}
                                            </div>
                                        </div>
                                        {!editMode.social && (
                                            <Link to="#" style={{ color: '#CBD5E1' }}><span className="material-symbols-outlined" style={{ fontSize: '20px' }}>open_in_new</span></Link>
                                        )}
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminProfile;

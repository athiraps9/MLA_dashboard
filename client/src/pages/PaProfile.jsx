import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { SERVER_URL } from '../utils/api';

const PaProfile = () => {
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

    // Initialize profileData with ALL user fields
    const [profileData, setProfileData] = useState({
        fullName: user.fullName || '',
        constituency: user.constituency || '',
        assemblyNumber: user.assemblyNumber || '',
        officeAddress: user.officeAddress || '',
        phoneNumber: user.phoneNumber || ''
    });

    const [previewUrl, setPreviewUrl] = useState(user.avatar ? `${SERVER_URL}${user.avatar}` : null);

    // Sync profileData when user changes
    useEffect(() => {
        console.log('User updated:', user);
        setProfileData({
            fullName: user.fullName || '',
            constituency: user.constituency || '',
            assemblyNumber: user.assemblyNumber || '',
            officeAddress: user.officeAddress || '',
            phoneNumber: user.phoneNumber || ''
        });
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const toggleEdit = (section) => {
        if (editMode[section]) {
            setProfileData({
                fullName: user.fullName || '',
                constituency: user.constituency || '',
                assemblyNumber: user.assemblyNumber || '',
                officeAddress: user.officeAddress || '',
                phoneNumber: user.phoneNumber || ''
            });
        }
        setEditMode(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const handleSave = async (section) => {
        try {
            setLoading(true);
            
            // Build update object as JSON
            const updateData = {};
            
            if (section === 'basic') {
                updateData.fullName = profileData.fullName;
                console.log('Updating basic info:', updateData);
            } else if (section === 'constituency') {
                updateData.constituency = profileData.constituency;
                updateData.assemblyNumber = profileData.assemblyNumber;
                console.log('Updating constituency info:', updateData);
            } else if (section === 'contact') {
                updateData.officeAddress = profileData.officeAddress;
                updateData.phoneNumber = profileData.phoneNumber;
                console.log('Updating contact info:', updateData);
            }

            console.log('Sending update data:', updateData);
            console.log('Section:', section);

            // Send as JSON with proper headers
            const res = await api.put('/auth/profile', updateData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('Response from server:', res.data);
            
            // Update user state with response data
            const updatedUser = { ...user, ...res.data };
            
            console.log('Updated user:', updatedUser);
            
            // Update localStorage
            localStorage.setItem('user', JSON.stringify(updatedUser));
            
            // Update state
            setUser(updatedUser);
            
            // Turn off edit mode
            setEditMode(prev => ({ ...prev, [section]: false }));
            
            alert('Profile updated successfully!');
        } catch (err) {
            console.error('Update error:', err);
            console.error('Error response:', err.response?.data);
            console.error('Error status:', err.response?.status);
            alert(err.response?.data?.message || 'Update failed. Please try again.');
            
            setProfileData({
                fullName: user.fullName || '',
                constituency: user.constituency || '',
                assemblyNumber: user.assemblyNumber || '',
                officeAddress: user.officeAddress || '',
                phoneNumber: user.phoneNumber || ''
            });
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        console.log('Selected file:', file);

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB');
            return;
        }

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('avatar', file);

            console.log('FormData contents:');
            for (let pair of formData.entries()) {
                console.log(pair[0], pair[1]);
            }

            // Show preview immediately
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);

            // Don't set Content-Type - let browser handle it
            const res = await api.put('/auth/profile', formData);

            console.log('Upload response:', res.data);

            // Update user with response
            const updatedUser = { ...user, ...res.data };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            
            // Update preview with server URL
            if (res.data.avatar) {
                setPreviewUrl(`${SERVER_URL}${res.data.avatar}`);
            }
            
            // Clean up object URL
            URL.revokeObjectURL(objectUrl);
            
            alert('Profile picture updated successfully!');
        } catch (err) {
            console.error('Upload error:', err);
            console.error('Error response:', err.response?.data);
            alert(err.response?.data?.message || 'Failed to upload image');
            setPreviewUrl(user.avatar ? `${SERVER_URL}${user.avatar}` : null);
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
            
            {/* Main Content */}
            <main style={{ flex: 1, height: '100vh', position: 'relative' }}>
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
                                        <input type="file" style={{ display: 'none' }} onChange={handleFileSelect} accept="image/*" disabled={loading} />
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
                                                disabled={loading}
                                            />
                                            <div style={{ display: 'flex', gap: '12px' }}>
                                                <button 
                                                    onClick={() => handleSave('basic')} 
                                                    disabled={loading}
                                                    style={{ flex: 1, backgroundColor: '#6366F1', color: '#FFFFFF', padding: '14px', borderRadius: '16px', border: 'none', fontSize: '14px', fontWeight: 900, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}
                                                >
                                                    {loading ? 'SAVING...' : 'SAVE'}
                                                </button>
                                                <button 
                                                    onClick={() => toggleEdit('basic')} 
                                                    disabled={loading}
                                                    style={{ flex: 1, backgroundColor: '#F1F5F9', color: '#475569', padding: '14px', borderRadius: '16px', border: 'none', fontSize: '14px', fontWeight: 900, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}
                                                >
                                                    CANCEL
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <h2 style={{ fontSize: '30px', fontWeight: 900, color: '#1E1B4B', margin: 0, letterSpacing: '-0.5px' }}>{profileData.fullName || 'Not Set'}</h2>
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
                                        <button 
                                            onClick={() => toggleEdit('basic')} 
                                            disabled={loading}
                                            style={{ width: '100%', backgroundColor: '#6366F1', color: '#FFFFFF', fontWeight: 900, padding: '18px', borderRadius: '16px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', boxShadow: '0 20px 25px -5px rgba(99, 102, 241, 0.2)', opacity: loading ? 0.6 : 1 }}
                                        >
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
                                    <button 
                                        onClick={() => editMode.constituency ? handleSave('constituency') : toggleEdit('constituency')} 
                                        disabled={loading}
                                        style={{ color: '#6366F1', fontSize: '14px', fontWeight: 900, textTransform: 'uppercase', border: 'none', background: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}
                                    >
                                        {editMode.constituency ? (loading ? 'Saving...' : 'Save Changes') : 'Update'}
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
                                                <input 
                                                    name="constituency" 
                                                    value={profileData.constituency} 
                                                    onChange={handleInputChange} 
                                                    disabled={loading}
                                                    style={{ width: '100%', border: 'none', borderBottom: '2px solid #6366F1', fontWeight: 900, fontSize: '18px', padding: '4px 0', outline: 'none', marginTop: '4px', background: 'transparent' }} 
                                                />
                                            ) : (
                                                <p style={{ fontSize: '20px', fontWeight: 900, color: '#1E1B4B', margin: '4px 0 0 0' }}>{profileData.constituency || 'Not Set'}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                        {/* <div style={{ height: '56px', width: '56px', borderRadius: '16px', backgroundColor: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E2E8F0' }}>
                                            <span className="material-symbols-outlined" style={{ color: '#6366F1' }}>pin_drop</span>
                                        </div> */}
                                        <div style={{ flex: 1 }}>
                                            {/* <p style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>Assembly Number</p> */}
                                            {/* {editMode.constituency ? (
                                                <input 
                                                    name="assemblyNumber" 
                                                    value={profileData.assemblyNumber} 
                                                    onChange={handleInputChange} 
                                                    disabled={loading}
                                                    style={{ width: '100%', border: 'none', borderBottom: '2px solid #6366F1', fontWeight: 900, fontSize: '18px', padding: '4px 0', outline: 'none', marginTop: '4px', background: 'transparent' }} 
                                                />
                                            ) : (
                                                <p style={{ fontSize: '20px', fontWeight: 900, color: '#1E1B4B', margin: '4px 0 0 0' }}>{profileData.assemblyNumber || 'Not Set'}</p>
                                            )} */}
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
                                    <button 
                                        onClick={() => editMode.contact ? handleSave('contact') : toggleEdit('contact')} 
                                        disabled={loading}
                                        style={{ color: '#6366F1', fontSize: '14px', fontWeight: 900, textTransform: 'uppercase', border: 'none', background: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}
                                    >
                                        {editMode.contact ? (loading ? 'Saving...' : 'Save Changes') : 'Update'}
                                    </button>
                                </div>
                                <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '40px' }}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
                                        {/* <div style={{ height: '56px', width: '56px', borderRadius: '16px', backgroundColor: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E2E8F0', flexShrink: 0 }}>
                                            <span className="material-symbols-outlined" style={{ color: '#6366F1' }}>corporate_fare</span>
                                        </div> */}
                                        {/* <div style={{ flex: 1 }}>
                                            <p style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>Office Address</p>
                                            {editMode.contact ? (
                                                <textarea 
                                                    name="officeAddress" 
                                                    value={profileData.officeAddress} 
                                                    onChange={handleInputChange} 
                                                    disabled={loading}
                                                    style={{ width: '100%', backgroundColor: '#F8FAFC', border: '2px solid #E2E8F0', borderRadius: '16px', padding: '16px', marginTop: '12px', fontWeight: 'bold', color: '#475569', outline: 'none', resize: 'none', fontFamily: 'inherit' }} 
                                                    rows="3" 
                                                />
                                            ) : (
                                                <p style={{ fontSize: '16px', fontWeight: 700, color: '#475569', marginTop: '12px', lineHeight: 1.8, maxWidth: '448px' }}>{profileData.officeAddress || 'Not Set'}</p>
                                            )}
                                        </div> */}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                        <div style={{ height: '56px', width: '56px', borderRadius: '16px', backgroundColor: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E2E8F0' }}>
                                            <span className="material-symbols-outlined" style={{ color: '#6366F1' }}>call</span>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>Direct Phone Number</p>
                                            {editMode.contact ? (
                                                <input 
                                                    name="phoneNumber" 
                                                    value={profileData.phoneNumber} 
                                                    onChange={handleInputChange} 
                                                    disabled={loading}
                                                    style={{ width: '100%', border: 'none', borderBottom: '2px solid #6366F1', fontWeight: 900, fontSize: '18px', padding: '4px 0', outline: 'none', marginTop: '4px', background: 'transparent' }} 
                                                />
                                            ) : (
                                                <p style={{ fontSize: '20px', fontWeight: 900, color: '#1E1B4B', margin: '4px 0 0 0' }}>{profileData.phoneNumber || 'Not Set'}</p>
                                            )}
                                        </div>
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

export default PaProfile;
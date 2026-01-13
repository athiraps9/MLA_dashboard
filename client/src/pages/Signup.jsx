import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import Card from '../components/Card';
import Button from '../components/Button';
import { FaUser, FaLock, FaMapMarkerAlt, FaGraduationCap, FaTrash, FaSearch, FaArrowRight, FaPlus } from 'react-icons/fa';
import { KERALA_CONSTITUENCIES } from '../utils/constituencies';
import '../styles/variables.css';

const Signup = ({ onLogin }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        dateOfBirth: '',
        gender: 'Male',
        constituency: '',
        address: '',
        education: [{ qualification: '', institution: '', passingYear: '' }]
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [showConstituencyList, setShowConstituencyList] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const filteredConstituencies = KERALA_CONSTITUENCIES.filter(c =>
        c.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEducationChange = (index, e) => {
        const { name, value } = e.target;
        const newEducation = [...formData.education];
        newEducation[index][name] = value;
        setFormData(prev => ({ ...prev, education: newEducation }));
    };

    const addEducation = () => {
        setFormData(prev => ({
            ...prev,
            education: [...prev.education, { qualification: '', institution: '', passingYear: '' }]
        }));
    };

    const removeEducation = (index) => {
        if (formData.education.length === 1) return;
        const newEducation = formData.education.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, education: newEducation }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (!formData.constituency) {
            setError('Please select a constituency');
            return;
        }

        setLoading(true);
        try {
            const res = await api.post('/auth/signup', formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            if (onLogin) onLogin(res.data.user);
            navigate('/user');
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed. Please check your details.');
        } finally {
            setLoading(false);
        }
    };

    const styles = {
        pageContainer: {
            background: 'var(--background-color)',
            minHeight: '100vh',
            padding: '40px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        },
        formCard: {
            backgroundColor: 'var(--surface-color)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)',
            width: '100%',
            maxWidth: '850px',
            padding: '40px',
            position: 'relative'
        },
        header: {
            textAlign: 'left',
            marginBottom: '30px'
        },
        title: {
            fontSize: '2.2rem',
            fontWeight: '800',
            color: 'var(--text-primary)',
            margin: '0 0 5px 0'
        },
        subtitle: {
            color: 'var(--text-secondary)',
            fontSize: '1rem',
            margin: '0'
        },
        loginLink: {
            position: 'absolute',
            top: '40px',
            right: '40px',
            fontSize: '0.9rem',
            color: 'var(--text-secondary)'
        },
        section: {
            marginBottom: '40px'
        },
        sectionHeader: {
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '1.1rem',
            fontWeight: '700',
            color: 'var(--text-primary)',
            marginBottom: '20px',
            borderBottom: '1px solid #f0f0f0',
            paddingBottom: '10px'
        },
        icon: {
            color: 'var(--primary-color)'
        },
        grid: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px'
        },
        inputGroup: {
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            marginBottom: '15px'
        },
        label: {
            fontWeight: '600',
            fontSize: '0.9rem',
            color: 'var(--text-primary)'
        },
        input: {
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            fontSize: '0.95rem',
            outline: 'none',
            transition: 'border-color 0.2s',
            width: '100%'
        },
        textarea: {
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            fontSize: '0.95rem',
            minHeight: '100px',
            gridColumn: 'span 2',
            resize: 'vertical'
        },
        genderGroup: {
            display: 'flex',
            gap: '20px',
            marginTop: '5px'
        },
        radioLabel: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.95rem',
            cursor: 'pointer'
        },
        constituencyContainer: {
            position: 'relative',
            gridColumn: '1 / 2'
        },
        searchIcon: {
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-secondary)'
        },
        dropdown: {
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: 'white',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            maxHeight: '200px',
            overflowY: 'auto',
            zIndex: 10,
            boxShadow: 'var(--shadow-md)',
            marginTop: '5px'
        },
        dropdownItem: {
            padding: '10px 15px',
            cursor: 'pointer',
            borderBottom: '1px solid #f0f0f0'
        },
        educationHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '15px'
        },
        addBtn: {
            color: 'var(--primary-color)',
            background: 'none',
            border: 'none',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            cursor: 'pointer',
            fontSize: '0.95rem'
        },
        eduRow: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 120px 40px',
            gap: '15px',
            alignItems: 'end',
            marginBottom: '10px',
            padding: '15px',
            backgroundColor: '#f8f9fa',
            borderRadius: 'var(--radius-md)'
        },
        deleteBtn: {
            color: 'var(--danger-color)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        submitBtn: {
            width: '100%',
            padding: '15px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--primary-color)',
            color: 'white',
            border: 'none',
            fontSize: '1.1rem',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            marginTop: '20px',
            transition: 'opacity 0.2s'
        },
        errorMsg: {
            color: 'var(--danger-color)',
            backgroundColor: '#fff5f5',
            padding: '12px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '20px',
            fontSize: '0.9rem',
            border: '1px solid #feb2b2'
        }
    };

    return (
        <div style={styles.pageContainer}>
            <div style={styles.formCard}>
                <div style={styles.loginLink}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: '600' }}>Login</Link>
                </div>

                <div style={styles.header}>
                    <h1 style={styles.title}>Create Your Account</h1>
                    <p style={styles.subtitle}>Register for Perinthalmanna E-Governance Services</p>
                </div>

                {error && <div style={styles.errorMsg}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    {/* Account Details */}
                    <div style={styles.section}>
                        <div style={styles.sectionHeader}>
                            <FaLock style={styles.icon} /> <span>Account Details</span>
                        </div>
                        <div style={styles.grid}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Username *</label>
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Enter your username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    style={styles.input}
                                    required
                                />
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Email Address *</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="name@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    style={styles.input}
                                    required
                                />
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Password *</label>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Create a password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    style={styles.input}
                                    required
                                />
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Confirm Password *</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Re-enter password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    style={styles.input}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Personal Information */}
                    <div style={styles.section}>
                        <div style={styles.sectionHeader}>
                            <FaUser style={styles.icon} /> <span>Personal Information</span>
                        </div>
                        <div style={styles.grid}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Phone Number *</label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    placeholder="+91 XXXXX XXXXX"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    style={styles.input}
                                    required
                                />
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Date of Birth</label>
                                <input
                                    type="date"
                                    name="dateOfBirth"
                                    value={formData.dateOfBirth}
                                    onChange={handleChange}
                                    style={styles.input}
                                />
                            </div>
                            <div style={{ ...styles.inputGroup, gridColumn: 'span 2' }}>
                                <label style={styles.label}>Gender</label>
                                <div style={styles.genderGroup}>
                                    {['Male', 'Female', 'Other'].map(g => (
                                        <label key={g} style={styles.radioLabel}>
                                            <input
                                                type="radio"
                                                name="gender"
                                                value={g}
                                                checked={formData.gender === g}
                                                onChange={handleChange}
                                            />
                                            {g}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Location Details */}
                    <div style={styles.section}>
                        <div style={styles.sectionHeader}>
                            <FaMapMarkerAlt style={styles.icon} /> <span>Location Details</span>
                        </div>
                        <div style={styles.grid}>
                            <div style={styles.constituencyContainer}>
                                <label style={styles.label}>Constituency *</label>
                                <div style={{ position: 'relative' }}>
                                    <FaSearch style={styles.searchIcon} />
                                    <input
                                        type="text"
                                        placeholder="Search constituency..."
                                        value={searchTerm || formData.constituency}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value);
                                            setShowConstituencyList(true);
                                        }}
                                        onFocus={() => setShowConstituencyList(true)}
                                        style={{ ...styles.input, paddingLeft: '40px' }}
                                    />
                                    {showConstituencyList && (
                                        <div style={styles.dropdown}>
                                            {filteredConstituencies.length > 0 ? (
                                                filteredConstituencies.map(c => (
                                                    <div
                                                        key={c}
                                                        style={styles.dropdownItem}
                                                        onClick={() => {
                                                            setFormData(p => ({ ...p, constituency: c }));
                                                            setSearchTerm(c);
                                                            setShowConstituencyList(false);
                                                        }}
                                                        onMouseEnter={(e) => e.target.style.backgroundColor = '#f1f5f9'}
                                                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                                    >
                                                        {c}
                                                    </div>
                                                ))
                                            ) : (
                                                <div style={{ ...styles.dropdownItem, color: '#94a3b8' }}>No results found</div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '5px' }}>Start typing to filter constituencies</p>
                            </div>
                            <div style={{ ...styles.inputGroup, gridColumn: '2 / 3' }}>
                                <label style={styles.label}>Address</label>
                                <textarea
                                    name="address"
                                    placeholder="Enter your full residential address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    style={{ ...styles.input, minHeight: '80px', resize: 'none' }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Education Details */}
                    <div style={styles.section}>
                        <div style={styles.educationHeader}>
                            <div style={styles.sectionHeader}>
                                <FaGraduationCap style={styles.icon} /> <span>Education Details</span>
                            </div>
                            <button type="button" onClick={addEducation} style={styles.addBtn}>
                                <FaPlus size={12} /> Add Education
                            </button>
                        </div>

                        {formData.education.map((edu, index) => (
                            <div key={index} style={styles.eduRow}>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Qualification</label>
                                    <select
                                        name="qualification"
                                        value={edu.qualification}
                                        onChange={(e) => handleEducationChange(index, e)}
                                        style={styles.input}
                                    >
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
                                    <input
                                        type="text"
                                        name="institution"
                                        placeholder="College / School"
                                        value={edu.institution}
                                        onChange={(e) => handleEducationChange(index, e)}
                                        style={styles.input}
                                    />
                                </div>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Year of Passing</label>
                                    <input
                                        type="text"
                                        name="passingYear"
                                        placeholder="YYYY"
                                        value={edu.passingYear}
                                        onChange={(e) => handleEducationChange(index, e)}
                                        style={styles.input}
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeEducation(index)}
                                    style={styles.deleteBtn}
                                    disabled={formData.education.length === 1}
                                >
                                    <FaTrash size={16} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <button type="submit" style={styles.submitBtn} disabled={loading}>
                        {loading ? 'Registering...' : <>Register <FaArrowRight /></>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Signup;

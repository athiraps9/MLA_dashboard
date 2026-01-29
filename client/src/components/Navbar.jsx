import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { FaGlobe, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { SERVER_URL } from '../utils/api';

const Navbar = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const { language, toggleLanguage, t } = useLanguage();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        onLogout();
        navigate('/login');
    };

    const getDashboardLink = () => {
        if (!user) return '/login';
        if (user.role === 'admin' || user.role === 'mla') return '/admin';
        if (user.role === 'pa') return '/pa';
        return '/user';
    };

    const getProfileLink = () => {
        if (!user) return '/login';
        if (user.role === 'admin' || user.role === 'mla') return '/admin/profile';
        if (user.role === 'pa') return '/pa/profile';
        // Pass activeSection as URL parameter for regular users
        return '/user?section=profile';
    };



    return (
        <nav className="navbar" style={{ background: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', padding: '15px 0' }}>
            <div className="container nav-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/" className="nav-logo" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#023e8a', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span role="img" aria-label="flag" style={{ fontSize: '2rem' }}>🇮🇳</span>
                    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1' }}>
                        <span>MLA Portal</span>
                        <span style={{ fontSize: '0.8rem', color: '#666', fontWeight: 'normal' }}>Perinthalmanna Constituency</span>
                    </div>
                </Link>

                <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
                    <Link to="/" className="nav-link" style={{ color: '#333', fontWeight: '500' }}>{t('Home', 'ഹോം')}</Link>
                    {/* <Link to="/mla-directory" className="nav-link" style={{ color: '#333', fontWeight: '500' }}>{t('MLA Directory', 'എംഎൽഎ ഡയറക്ടറി')}</Link> */}


                    {/* Language Toggle */}
                    {/* <button
                        className="btn-text"
                        onClick={toggleLanguage}
                        style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#0077b6', fontWeight: '600' }}
                    >
                        <FaGlobe /> {language === 'en' ? 'മലയാളം' : 'English'}
                    </button> */}

                    {!user ? (
                        <>
                            <Link to="/login" className="nav-link" style={{ color: '#333', fontWeight: '500' }}>{t('Login', 'ലോഗിൻ')}</Link>
                            <Link to="/signup" className="btn btn-primary btn-sm" style={{ padding: '8px 20px', borderRadius: '20px' }}>{t('Sign Up', 'സൈൻ അപ്പ്')}</Link>
                        </>
                    ) : (
                        <div style={{ position: 'relative' }}>
                            <div
                                style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            >
                                <span style={{ fontWeight: '600', color: '#023e8a' }}>{user.fullName || user.username}</span>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e9ecef', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#023e8a', border: '1px solid #ddd' }}>
                                    {user.avatar ? (
                                        <img src={`http://localhost:5000${user.avatar}`} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <FaUserCircle size={25} />
                                    )}
                                </div>
                            </div>

                            {isMenuOpen && (
                                <div style={{
                                    position: 'absolute', top: '50px', right: '0', background: 'white',
                                    boxShadow: '0 5px 15px rgba(0,0,0,0.1)', borderRadius: '10px', width: '200px',
                                    overflow: 'hidden', zIndex: 1000
                                }}>
                                    <Link
                                        to={getDashboardLink()}
                                        className="dropdown-item"
                                        style={{ display: 'block', padding: '12px 20px', color: '#333', textDecoration: 'none', borderBottom: '1px solid #f8f9fa' }}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Dashboard
                                    </Link>
                                    <Link
                                        to={getProfileLink()}
                                        className="dropdown-item"
                                        style={{ display: 'block', padding: '12px 20px', color: '#333', textDecoration: 'none', borderBottom: '1px solid #f8f9fa' }}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        My Profile
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        style={{ width: '100%', textAlign: 'left', padding: '12px 20px', background: 'none', border: 'none', color: '#c53030', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                                    >
                                        <FaSignOutAlt /> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

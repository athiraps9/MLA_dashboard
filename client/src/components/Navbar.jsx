import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { FaGlobe } from 'react-icons/fa';

const Navbar = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const { language, toggleLanguage, t } = useLanguage();

    const handleLogout = () => {
        onLogout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="container nav-content">
                <Link to="/" className="nav-logo">
                    <span role="img" aria-label="flag">🇮🇳</span> MLA Public Portal
                </Link>

                <div className="nav-links">
                    <Link to="/" className="nav-link">{t('Home', 'ഹോം')}</Link>

                    {user?.role === 'public' && (
                        <>
                            <Link to="/dashboard" className="nav-link">{t('Dashboard', 'ഡാഷ്ബോർഡ്')}</Link>
                            <Link to="/complaints" className="nav-link">{t('Complaints', 'പരാതികൾ')}</Link>
                        </>
                    )}

                    <Link to="/mla-directory" className="nav-link">{t('MLA Directory', 'എംഎൽഎ ഡയറക്ടറി')}</Link>

                    {/* Language Toggle */}
                    <button
                        className="btn btn-outline btn-sm"
                        onClick={toggleLanguage}
                        style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                    >
                        <FaGlobe /> {language === 'en' ? 'മലയാളം' : 'English'}
                    </button>

                    {!user ? (
                        <>
                            <Link to="/login" className="nav-link">{t('Login', 'ലോഗിൻ')}</Link>
                            <Link to="/signup" className="btn btn-primary btn-sm">{t('Sign Up', 'സൈൻ അപ്പ്')}</Link>
                        </>
                    ) : (
                        <>
                            {user.role === 'mla' && <Link to="/mla-portal" className="nav-link">My Portal</Link>}
                            {user.role === 'admin' && <Link to="/admin" className="nav-link">Admin Panel</Link>}

                            <Link to="/profile" className="nav-link">{user.name}</Link>
                            <button onClick={handleLogout} className="btn btn-outline btn-sm">Logout</button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

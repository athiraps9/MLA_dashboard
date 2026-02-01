import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';





const Footer = ({}) => {
   
    return (
        <footer className="footer">
            <div className="container">
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '2rem' }}>

                    {/* Column 1: About */}
                    <div style={{ flex: '1 1 300px' }}>
                        <h4 style={{ color: 'white' }}>MLA Public Portal</h4>
                        <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>
                            A Perinthalmanna constituency of Kerala Initiative style portal for transparency and public engagement.
                            Bridge the gap between you and your elected representative.
                        </p>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div style={{ flex: '1 1 200px' }}>
                        <h4 style={{ color: 'white' }}>Quick Links</h4>
                        <div className="footer-links">
                            <Link to="/">Home</Link>
                            <Link to="/mla-directory">MLA Directory</Link>
                            <Link to="/login">Login</Link>
                            <Link to="/signup">Register</Link>
                        </div>
                    </div>

                    {/* Column 3: Contact/Social */}
                    <div style={{ flex: '1 1 200px' }}>
                        <h4 style={{ color: 'white' }}>Connect With Us</h4>
                        <p style={{ opacity: 0.8, fontSize: '0.9rem', marginBottom: '1rem' }}>
                            Legislative Assembly Complex,<br />
                            Perinthalmanna, Kerala
                        </p>
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <a href="#" style={{ color: 'white' }}><FaFacebook size={20} /></a>
                            <a href="#" style={{ color: 'white' }}><FaTwitter size={20} /></a>
                            <a href="#" style={{ color: 'white' }}><FaInstagram size={20} /></a>
                        </div>
                    </div>

                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '30px', paddingTop: '20px', textAlign: 'center', fontSize: '0.85rem', opacity: 0.7 }}>
                    &copy; 2025 MLA Public Insight Portal. All Rights Reserved. | Perinthalmanna MLA
                </div>
            </div>
        </footer>
    );
};

export default Footer;

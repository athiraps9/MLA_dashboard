import React, { useEffect, useState, useRef } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import {
    FaLandmark, FaUserTie, FaHandHoldingUsd, FaFileSignature,
    FaUsers, FaChartLine, FaCheckCircle, FaProjectDiagram, FaArrowRight
} from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';
import Footer from '../components/Footer';

const LandingPage = () => {
    const [data, setData] = useState(null);
    const navigate = useNavigate();
    const { t } = useLanguage();
    const observerRef = useRef(null);

    useEffect(() => {
        const fetchLandingData = async () => {
            try {
                const res = await api.get('/landing');
                setData(res.data);
            } catch (err) { console.error(err); }
        };
        fetchLandingData();
    }, []);

    const styles = {
        hero: {
            background: 'linear-gradient(135deg, #023e8a 0%, #0077b6 100%)',
            color: 'white',
            padding: '140px 0 120px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            clipPath: 'polygon(0 0, 100% 0, 100% 90%, 0 100%)'
        },
        heroTitle: {
            fontSize: '4rem',
            fontWeight: '900',
            marginBottom: '20px',
            lineHeight: '1.2',
            textShadow: '0 4px 6px rgba(0,0,0,0.1)'
        },
        heroTagline: {
            fontSize: '1.6rem',
            fontWeight: '300',
            marginBottom: '50px',
            opacity: '0.95',
            maxWidth: '700px',
            margin: '0 auto 50px'
        },
        btnRound: {
            borderRadius: '50px',
            padding: '18px 45px',
            border: 'none',
            fontSize: '1.1rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontWeight: '700',
            boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
        },
        section: {
            padding: '100px 0',
            position: 'relative'
        },
        card: {
            background: 'white',
            borderRadius: '20px',
            padding: '40px 30px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
            textAlign: 'center',
            height: '100%',
            transition: 'transform 0.3s ease',
            border: '1px solid rgba(0,0,0,0.05)'
        },
        stepCircle: {
            width: '70px', height: '70px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #0077b6, #00b4d8)',
            color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.8rem', margin: '0 auto 25px', fontWeight: 'bold',
            boxShadow: '0 10px 20px rgba(0,180,216,0.3)'
        },
        statsRow: {
            display: 'flex', justifyContent: 'center', gap: '50px', marginTop: '-80px', position: 'relative', zIndex: 10, flexWrap: 'wrap'
        },
        statCard: {
            background: 'white', padding: '30px', borderRadius: '15px',
            boxShadow: '0 15px 30px rgba(0,0,0,0.1)', textAlign: 'center', minWidth: '200px'
        }
    };

    return (
        <div className="landing-page">
            {/* Hero Section */}
            <header style={styles.hero}>
                <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                    <h1 style={styles.heroTitle}>Transforming Governance</h1>
                    <p style={styles.heroTagline}>
                        Experience the future of citizen-centric administration. <br />
                        Professional. Transparent. Efficient.
                    </p>

                    <div style={{ display: 'flex', gap: '25px', justifyContent: 'center' }}>
                        <button
                            onClick={() => navigate('/login')}
                            style={{ ...styles.btnRound, background: 'white', color: '#023e8a' }}
                            onMouseOver={e => e.target.style.transform = 'translateY(-3px)'}
                            onMouseOut={e => e.target.style.transform = 'translateY(0)'}
                        >
                            Login to Portal
                        </button>
                        <button
                            onClick={() => navigate('/signup')}
                            style={{ ...styles.btnRound, background: 'rgba(255,255,255,0.15)', color: 'white', border: '2px solid rgba(255,255,255,0.8)', backdropFilter: 'blur(5px)' }}
                            onMouseOver={e => { e.target.style.background = 'white'; e.target.style.color = '#023e8a' }}
                            onMouseOut={e => { e.target.style.background = 'rgba(255,255,255,0.15)'; e.target.style.color = 'white' }}
                        >
                            Citizen Signup
                        </button>
                    </div>
                </div>
            </header>

            {/* Stats Overlay */}
            <div className="container" style={styles.statsRow}>
                <div style={styles.statCard}>
                    <h2 style={{ fontSize: '2.5rem', color: '#0077b6', margin: 0 }}>{data?.stats?.averageAttendance || 0}%</h2>
                    <p style={{ margin: 0, color: '#666', fontWeight: '500' }}>Attendance</p>
                </div>
                <div style={styles.statCard}>
                    <h2 style={{ fontSize: '2.5rem', color: '#0077b6', margin: 0 }}>₹{(data?.stats?.totalUtilized / 10000000).toFixed(1)}Cr+</h2>
                    <p style={{ margin: 0, color: '#666', fontWeight: '500' }}>Funds Utilized</p>
                </div>
                <div style={styles.statCard}>
                    <h2 style={{ fontSize: '2.5rem', color: '#0077b6', margin: 0 }}>{data?.stats?.totalProjects || 0}+</h2>
                    <p style={{ margin: 0, color: '#666', fontWeight: '500' }}>Projects Completed</p>
                </div>
            </div>

            {/* How to Use This Portal */}
            <section style={{ ...styles.section, background: '#f8f9fa', paddingBottom: '120px' }}>
                <div className="container text-center">
                    <h2 style={{ fontSize: '3rem', marginBottom: '15px', color: '#023e8a', fontWeight: '800' }}>How it Works</h2>
                    <p style={{ marginBottom: '60px', fontSize: '1.2rem', color: '#666' }}>Your gateway to participatory democracy in 3 simple steps.</p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>

                        <div style={styles.card}>
                            <div style={styles.stepCircle}>1</div>
                            <h3 style={{ marginBottom: '15px' }}>Register</h3>
                            <p style={{ color: '#666', lineHeight: '1.6' }}>Create your citizen account securely to access detailed reports and features.</p>
                        </div>

                        <div style={styles.card}>
                            <div style={styles.stepCircle}>2</div>
                            <h3 style={{ marginBottom: '15px' }}>View Projects</h3>
                            <p style={{ color: '#666', lineHeight: '1.6' }}>Explore ongoing infrastructure developments, view progress, and fund allocation.</p>
                        </div>

                        <div style={styles.card}>
                            <div style={styles.stepCircle}>3</div>
                            <h3 style={{ marginBottom: '15px' }}>Interact</h3>
                            <p style={{ color: '#666', lineHeight: '1.6' }}>Rate completed projects, submit grievances, and track their resolution status.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Preview */}
            <section style={styles.section}>
                <div className="container">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '80px', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1 }}>
                            <h2 style={{ fontSize: '3rem', marginBottom: '25px', color: '#023e8a', fontWeight: '800' }}>Empowering Citizens</h2>
                            <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: '#555', marginBottom: '40px' }}>
                                This portal serves as a direct bridge between the MLA and the people of Perinthalmanna.
                                By leveraging digital governance technology, we ensure that every query is heard, every project is transparent, and trust is built through action.
                            </p>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                <li style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '15px', fontSize: '1.1rem', fontWeight: '500' }}>
                                    <FaCheckCircle color="#00b4d8" size={24} /> Real-time Project Analysis
                                </li>
                                <li style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '15px', fontSize: '1.1rem', fontWeight: '500' }}>
                                    <FaCheckCircle color="#00b4d8" size={24} /> Verified MLA Attendance
                                </li>
                                <li style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '15px', fontSize: '1.1rem', fontWeight: '500' }}>
                                    <FaCheckCircle color="#00b4d8" size={24} /> Digital Complaint Redressal
                                </li>
                            </ul>
                        </div>
                        <div style={{ flex: 1, minWidth: '350px' }}>
                            <div style={{ background: 'linear-gradient(135deg, #caf0f8, #ade8f4)', height: '450px', borderRadius: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
                                <FaLandmark size={150} color="#0077b6" style={{ opacity: 0.8 }} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer/>
        </div>
    );
};

export default LandingPage;

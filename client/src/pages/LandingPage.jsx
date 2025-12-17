import React, { useEffect, useState, useRef } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import {
    FaLandmark, FaUniversity, FaHandHoldingUsd, FaFileSignature,
    FaUsers, FaChartLine, FaCheckCircle, FaProjectDiagram, FaArrowRight, FaVolumeUp
} from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

const LandingPage = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { t } = useLanguage();
    const observerRef = useRef(null);

    useEffect(() => {
        const fetchLandingData = async () => {
            try {
                const res = await api.get('/landing');
                setData(res.data);
            } catch (err) {
                console.error('Error loading landing page:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchLandingData();

        // Scroll animation observer
        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('scroll-fade-in');
                    }
                });
            },
            { threshold: 0.1 }
        );

        // Observe all sections
        const sections = document.querySelectorAll('.animate-on-scroll');
        sections.forEach((section) => observerRef.current.observe(section));

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, []);

    // Fallback Content
    const content = data?.content || {
        aboutText: "Welcome to the Official MLA Public Insight Portal. This platform ensures transparency, accountability, and public participation in the constituency's development.",
        featureCards: [],
        usageSteps: []
    };
    const stats = data?.stats || { totalMLAs: 0, totalBudget: 0, totalUtilized: 0, averageAttendance: 0 };

    // Placeholder Features if API empty
    const features = content.featureCards.length > 0 ? content.featureCards : [
        { title: "Project Tracking", desc: "Monitor ongoing infrastructure projects.", icon: <FaProjectDiagram /> },
        { title: "Fund Utilization", desc: "Transparent records of spending.", icon: <FaHandHoldingUsd /> },
        { title: "Public Grievances", desc: "Submit complaints directly.", icon: <FaFileSignature /> },
        { title: "Assembly Performance", desc: "View MLA attendance and questions.", icon: <FaUniversity /> },
        { title: "Public Feedback", desc: "Rate and review development works.", icon: <FaUsers /> }
    ];

    return (
        <div className="landing-page">
            {/* Hero Section */}
            <header className="hero-section" style={{
                background: 'linear-gradient(135deg, #0369A1 0%, #0D9488 40%, #06B6D4 80%, #0EA5E9 100%)',
                color: 'var(--white)',
                padding: '140px 0 180px',
                clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0 100%)',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(6, 182, 212, 0.3)'
            }}>
                {/* Animated Background Overlay */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.2) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(56, 189, 248, 0.2) 0%, transparent 50%)',
                    animation: 'pulse 8s ease-in-out infinite',
                    zIndex: 0
                }}></div>

                <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                    {/* Sound Wave Badge */}
                    <div className="badge-pill sound-wave-icon" style={{
                        marginBottom: '24px', display: 'inline-flex', alignItems: 'center',
                        padding: '12px 28px', background: 'rgba(255,255,255,0.25)',
                        borderRadius: '50px', backdropFilter: 'blur(10px)',
                        border: '2px solid rgba(255,255,255,0.4)',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
                        position: 'relative'
                    }}>
                        <FaVolumeUp style={{ marginRight: '12px', fontSize: '1.2rem', animation: 'pulse 2s ease-in-out infinite' }} />
                        <span style={{ fontWeight: '600', fontSize: '1.05rem' }}>
                            {t('Official Public Relations Portal', 'ഔദ്യോഗിക പൊതുജനസമ്പർക്ക പോർട്ടൽ')}
                        </span>
                    </div>

                    {/* Hero Heading - Pure White for Maximum Readability */}
                    <h1 style={{
                        fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                        marginBottom: '32px',
                        color: '#003D5C',
                        fontWeight: '900',
                        lineHeight: '1.1',
                        textShadow: '0 2px 4px rgba(255,255,255,0.3), 0 4px 8px rgba(255,255,255,0.2), 0 0 30px rgba(255,255,255,0.4)',
                        letterSpacing: '-0.02em'
                    }}>
                        {t('Transforming Governance', 'ഭരണം പരിവർത്തനം ചെയ്യുന്നു')} <br /> {t('through Transparency', 'സുതാര്യതയിലൂടെ')}
                    </h1>

                    {/* Description with Better Contrast */}
                    <p style={{
                        fontSize: '1.35rem',
                        maxWidth: '850px',
                        margin: '0 auto 48px',
                        color: '#FFFFFF',
                        fontWeight: '400',
                        lineHeight: '1.7',
                        textShadow: '0 2px 8px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.2)'
                    }}>
                        {t(content.aboutText, 'ഔദ്യോഗിക എംഎൽഎ പൊതു ഉൾക്കാഴ്ച പോർട്ടലിലേക്ക് സ്വാഗതം. ഈ പ്ലാറ്റ്ഫോം മണ്ഡലത്തിന്റെ വികസനത്തിൽ സുതാര്യത, ഉത്തരവാദിത്തം, പൊതു പങ്കാളിത്തം എന്നിവ ഉറപ്പാക്കുന്നു.')}
                    </p>
                    <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button onClick={() => navigate('/login')} className="btn" style={{
                            background: 'var(--white)',
                            color: 'var(--primary-teal)',
                            padding: '18px 44px',
                            fontWeight: '700',
                            fontSize: '1.1rem',
                            boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                            border: 'none'
                        }}>
                            {t('Login', 'ലോഗിൻ')}
                        </button>
                        <button onClick={() => navigate('/mla-directory')} className="btn" style={{
                            background: 'rgba(255,255,255,0.15)',
                            backdropFilter: 'blur(10px)',
                            border: '2px solid rgba(255,255,255,0.8)',
                            color: 'var(--white)',
                            padding: '18px 44px',
                            fontWeight: '700',
                            fontSize: '1.1rem'
                        }}>
                            {t('Find Your MLA', 'നിങ്ങളുടെ എംഎൽഎയെ കണ്ടെത്തുക')}
                        </button>
                    </div>
                </div>
            </header>

            {/* Stats Section */}
            <section className="container animate-on-scroll" style={{ marginTop: '-120px', position: 'relative', zIndex: 10 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '28px' }}>
                    <div className="card stat-card" style={{ textAlign: 'center', padding: '48px 24px', background: 'rgba(255,255,255,0.95)' }}>
                        <div className="gradient-text" style={{ fontSize: '3.5rem', marginBottom: '8px', fontWeight: '800' }}>{stats.totalMLAs}</div>
                        <div style={{ fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '1.5px' }}>{t('Constituencies', 'മണ്ഡലങ്ങൾ')}</div>
                    </div>
                    <div className="card stat-card" style={{ textAlign: 'center', padding: '48px 24px', background: 'rgba(255,255,255,0.95)' }}>
                        <div style={{ color: 'var(--emerald)', fontSize: '3.5rem', marginBottom: '8px', fontWeight: '800' }}>
                            ₹{(stats.totalUtilized / 10000000).toFixed(1)}Cr
                        </div>
                        <div style={{ fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '1.5px' }}>{t('Funds Utilized', 'ഉപയോഗിച്ച ഫണ്ട്')}</div>
                    </div>
                    <div className="card stat-card" style={{ textAlign: 'center', padding: '48px 24px', background: 'rgba(255,255,255,0.95)' }}>
                        <div style={{ color: 'var(--warning)', fontSize: '3.5rem', marginBottom: '8px', fontWeight: '800' }}>
                            {stats.averageAttendance}%
                        </div>
                        <div style={{ fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '1.5px' }}>{t('Avg. Attendance', 'ശരാശരി ഹാജർ')}</div>
                    </div>
                    <div className="card stat-card" style={{ textAlign: 'center', padding: '48px 24px', background: 'rgba(255,255,255,0.95)' }}>
                        <div className="gradient-text" style={{ fontSize: '3.5rem', marginBottom: '8px', fontWeight: '800' }}>
                            {stats.totalProjects || 120}+
                        </div>
                        <div style={{ fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '1.5px' }}>{t('Completed Projects', 'പൂർത്തിയായ പദ്ധതികൾ')}</div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="section-padding container animate-on-scroll">
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '15px' }}>{t('Key Features', 'പ്രധാന സവിശേഷതകൾ')}</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                        {t('Empowering citizens with data, direct access, and streamlined services.', 'ഡാറ്റ, നേരിട്ടുള്ള ആക്സസ്, സുഗമമായ സേവനങ്ങൾ എന്നിവയിലൂടെ പൗരന്മാരെ ശാക്തീകരിക്കുന്നു.')}
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
                    {features.map((feature, idx) => (
                        <div key={idx} className="card feature-card" style={{ textAlign: 'center', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', padding: '40px 28px' }}>
                            <div className="card-icon float-animation" style={{
                                fontSize: '2.8rem', margin: '0 auto 28px',
                                width: '90px', height: '90px', borderRadius: '50%',
                                background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)',
                                color: 'var(--primary-cyan)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                border: '3px solid rgba(6, 182, 212, 0.2)',
                                boxShadow: '0 4px 12px rgba(6, 182, 212, 0.15)',
                                animationDelay: `${idx * 0.2}s`
                            }}>
                                {feature.icon || <FaCheckCircle />}
                            </div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '16px', color: 'var(--primary-teal)' }}>{feature.title}</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.7' }}>{feature.desc || feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Ongoing Projects (Preview) */}
            <section className="section-padding" style={{
                background: 'linear-gradient(135deg, rgba(204, 251, 241, 0.4) 0%, rgba(224, 242, 254, 0.4) 100%)',
                clipPath: 'polygon(0 8%, 100% 0, 100% 92%, 0 100%)',
                padding: '120px 0',
                position: 'relative'
            }}>
                <div className="container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '60px', flexWrap: 'wrap', gap: '20px' }}>
                        <div>
                            <h2 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>{t('Ongoing Projects', 'നടന്നുകൊണ്ടിരിക്കുന്ന പദ്ധതികൾ')}</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>{t('Live transparency in infrastructure development.', 'അടിസ്ഥാന സൗകര്യ വികസനത്തിൽ തത്സമയ സുതാര്യത.')}</p>
                        </div>
                        <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
                            {t('View All Projects', 'എല്ലാ പദ്ധതികളും കാണുക')} <FaArrowRight style={{ marginLeft: '8px' }} />
                        </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '32px' }}>
                        {[
                            {
                                id: 1,
                                img: '/src/../.gemini/antigravity/brain/f97c7087-a68b-491a-9b47-f8c39aae0d1a/mla_working_illustration_1766003962366.png',
                                alt: t('MLA Working', 'എംഎൽഎ പ്രവർത്തിക്കുന്നു')
                            },
                            {
                                id: 2,
                                img: '/src/../.gemini/antigravity/brain/f97c7087-a68b-491a-9b47-f8c39aae0d1a/budget_tracking_illustration_1766003979848.png',
                                alt: t('Budget Tracking', 'ബജറ്റ് ട്രാക്കിംഗ്')
                            },
                            {
                                id: 3,
                                img: '/src/../.gemini/antigravity/brain/f97c7087-a68b-491a-9b47-f8c39aae0d1a/data_transparency_1766002820881.png',
                                alt: t('Data Analytics', 'ഡാറ്റാ അനലിറ്റിക്സ്')
                            }
                        ].map((project) => (
                            <div key={project.id} className="card project-card" style={{
                                padding: 0,
                                overflow: 'hidden',
                                border: 'none',
                                boxShadow: '0 12px 28px rgba(6, 182, 212, 0.15)',
                                background: 'rgba(255,255,255,0.95)'
                            }}>
                                {/* Project Image */}
                                <div style={{
                                    height: '220px',
                                    overflow: 'hidden',
                                    borderBottom: '3px solid var(--primary-cyan)'
                                }}>
                                    <img
                                        src={project.img}
                                        alt={project.alt}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                    />
                                </div>
                                <div style={{ padding: '28px' }}>
                                    <span style={{
                                        fontSize: '0.8rem',
                                        fontWeight: '700',
                                        letterSpacing: '0.5px',
                                        background: 'var(--gradient-primary)',
                                        color: 'var(--white)',
                                        padding: '8px 14px',
                                        borderRadius: '6px',
                                        textTransform: 'uppercase'
                                    }}>
                                        Infrastructure
                                    </span>
                                    <h4 style={{ margin: '18px 0 12px', fontSize: '1.35rem', color: 'var(--primary-teal)' }}>
                                        {t('Road Development Phase', 'റോഡ് വികസന ഘട്ടം')} {project.id}
                                    </h4>
                                    <p style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '24px', lineHeight: '1.6' }}>
                                        Renovation of main arterial roads in the district to improve connectivity.
                                    </p>
                                    <div style={{ width: '100%', background: 'rgba(6, 182, 212, 0.1)', height: '10px', borderRadius: '5px', marginBottom: '16px', overflow: 'hidden' }}>
                                        <div style={{
                                            width: '60%',
                                            background: 'var(--gradient-primary)',
                                            height: '100%',
                                            borderRadius: '5px',
                                            boxShadow: '0 0 10px rgba(6, 182, 212, 0.4)'
                                        }}></div>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-dark)', fontWeight: '600' }}>
                                        <span>Status: In Progress</span>
                                        <span className="gradient-text">60%</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="section-padding container" style={{ paddingTop: '80px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '60px' }}>
                    <div style={{ flex: '1 1 500px' }}>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>{t('How to Use This Portal', 'ഈ പോർട്ടൽ എങ്ങനെ ഉപയോഗിക്കാം')}</h2>
                        <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', marginBottom: '40px', lineHeight: '1.7' }}>
                            {t('We have simplified the process of citizen engagement. Follow these simple steps to get involved and track ongoing developments in your area.', 'ഞങ്ങൾ പൗര പങ്കാളിത്തത്തിന്റെ പ്രക്രിയ ലളിതമാക്കിയിരിക്കുന്നു. നിങ്ങളുടെ പ്രദേശത്തെ നടന്നുകൊണ്ടിരിക്കുന്ന വികസനങ്ങൾ ട്രാക്ക് ചെയ്യാൻ ഈ ലളിതമായ ഘട്ടങ്ങൾ പിന്തുടരുക.')}
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                            {[
                                { en: 'Register with your Email', ml: 'നിങ്ങളുടെ ഇമെയിൽ ഉപയോഗിച്ച് രജിസ്റ്റർ ചെയ്യുക' },
                                { en: 'Verify your Profile', ml: 'നിങ്ങളുടെ പ്രൊഫൈൽ സ്ഥിരീകരിക്കുക' },
                                { en: 'Browse Projects & Utilization', ml: 'പദ്ധതികളും ഉപയോഗവും ബ്രൗസ് ചെയ്യുക' },
                                { en: 'Submit Complaints or Reviews', ml: 'പരാതികളോ അവലോകനങ്ങളോ സമർപ്പിക്കുക' }
                            ].map((step, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
                                    <div style={{
                                        width: '50px', height: '50px', borderRadius: '50%',
                                        background: 'linear-gradient(135deg, var(--primary-blue), var(--secondary-blue))',
                                        color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontWeight: '700', fontSize: '1.2rem', boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                                    }}>
                                        {i + 1}
                                    </div>
                                    <span style={{ fontSize: '1.2rem', fontWeight: '500', color: 'var(--text-dark)' }}>{t(step.en, step.ml)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Governance Illustration */}
                    <div style={{ flex: '1 1 400px', borderRadius: '30px', overflow: 'hidden', boxShadow: 'var(--shadow-xl)' }}>
                        <img
                            src="/src/../.gemini/antigravity/brain/f97c7087-a68b-491a-9b47-f8c39aae0d1a/governance_illustration_1766002783980.png"
                            alt={t('Governance Illustration', 'ഭരണ ചിത്രീകരണം')}
                            style={{ width: '100%', height: 'auto', display: 'block' }}
                        />
                    </div>
                </div>
            </section>

            {/* New Content Section: Why Choose This Portal */}
            <section className="section-padding" style={{
                background: 'linear-gradient(135deg, rgba(224, 242, 254, 0.5) 0%, rgba(255, 255, 255, 0.8) 100%)',
                position: 'relative'
            }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '15px' }}>{t('Why Choose This Portal?', 'എന്തുകൊണ്ട് ഈ പോർട്ടൽ തിരഞ്ഞെടുക്കണം?')}</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto' }}>
                            {t('Experience a new era of transparent governance with real-time data, citizen engagement, and accountability.', 'തത്സമയ ഡാറ്റ, പൗര പങ്കാളിത്തം, ഉത്തരവാദിത്തം എന്നിവയോടെ സുതാര്യമായ ഭരണത്തിന്റെ ഒരു പുതിയ യുഗം അനുഭവിക്കുക.')}
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px', alignItems: 'center' }}>
                        {/* Community Engagement Image */}
                        <div style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
                            <img
                                src="/src/../.gemini/antigravity/brain/f97c7087-a68b-491a-9b47-f8c39aae0d1a/community_engagement_1766002805030.png"
                                alt={t('Community Engagement', 'കമ്മ്യൂണിറ്റി ഇടപെടൽ')}
                                style={{ width: '100%', height: 'auto', display: 'block' }}
                            />
                        </div>

                        {/* Benefits List */}
                        <div>
                            <h3 style={{ fontSize: '2rem', marginBottom: '30px', color: 'var(--primary-teal)' }}>
                                {t('Citizen-Centric Benefits', 'പൗരകേന്ദ്രിത ആനുകൂല്യങ്ങൾ')}
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {[
                                    { en: '24/7 Access to Government Data', ml: 'സർക്കാർ ഡാറ്റയിലേക്ക് 24/7 ആക്സസ്' },
                                    { en: 'Direct Communication with MLAs', ml: 'എംഎൽഎമാരുമായി നേരിട്ടുള്ള ആശയവിനിമയം' },
                                    { en: 'Real-time Project Tracking', ml: 'തത്സമയ പ്രോജക്ട് ട്രാക്കിംഗ്' },
                                    { en: 'Transparent Fund Utilization', ml: 'സുതാര്യമായ ഫണ്ട് വിനിയോഗം' },
                                    { en: 'Easy Complaint Resolution', ml: 'എളുപ്പമുള്ള പരാതി പരിഹാരം' }
                                ].map((benefit, idx) => (
                                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <div style={{
                                            width: '40px', height: '40px', borderRadius: '50%',
                                            background: 'var(--gradient-primary)', color: 'white',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            flexShrink: 0
                                        }}>
                                            <FaCheckCircle size={20} />
                                        </div>
                                        <span style={{ fontSize: '1.1rem', fontWeight: '500' }}>{t(benefit.en, benefit.ml)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Data Transparency Section */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px', alignItems: 'center', marginTop: '80px' }}>
                        {/* Text Content */}
                        <div>
                            <h3 style={{ fontSize: '2rem', marginBottom: '20px', color: 'var(--primary-cyan)' }}>
                                {t('Data-Driven Transparency', 'ഡാറ്റാധിഷ്ഠിത സുതാര്യത')}
                            </h3>
                            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '25px' }}>
                                {t('Access comprehensive analytics and visualizations of government performance, budget allocation, and development progress. Every rupee spent is tracked and displayed for public scrutiny.', 'സർക്കാർ പ്രകടനം, ബജറ്റ് വിഹിതം, വികസന പുരോഗതി എന്നിവയുടെ സമഗ്രമായ വിശകലനങ്ങളും ദൃശ്യവൽക്കരണങ്ങളും ആക്സസ് ചെയ്യുക. ചെലവഴിക്കുന്ന ഓരോ രൂപയും ട്രാക്ക് ചെയ്യുകയും പൊതു പരിശോധനയ്ക്കായി പ്രദർശിപ്പിക്കുകയും ചെയ്യുന്നു.')}
                            </p>
                            <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
                                {t('Explore Dashboard', 'ഡാഷ്ബോർഡ് പര്യവേക്ഷണം ചെയ്യുക')} <FaArrowRight style={{ marginLeft: '8px' }} />
                            </button>
                        </div>

                        {/* Data Transparency Image */}
                        <div style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
                            <img
                                src="/src/../.gemini/antigravity/brain/f97c7087-a68b-491a-9b47-f8c39aae0d1a/data_transparency_1766002820881.png"
                                alt={t('Data Transparency', 'ഡാറ്റാ സുതാര്യത')}
                                style={{ width: '100%', height: 'auto', display: 'block' }}
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;

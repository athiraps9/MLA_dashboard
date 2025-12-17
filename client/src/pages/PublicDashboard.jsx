import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import api from '../utils/api';
import Card from '../components/Card';
import { Link } from 'react-router-dom';
import { FaProjectDiagram, FaRupeeSign, FaUsers, FaClipboardList, FaArrowRight } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const PublicDashboard = () => {
    const [data, setData] = useState({ projects: [], attendance: [] });
    const [loading, setLoading] = useState(true);
    const { t } = useLanguage();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/public/dashboard');
                setData(res.data);
            } catch (err) {
                console.error('Error fetching public data', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="text-center section-padding">Loading Dashboard...</div>;

    const totalFunds = data.projects.reduce((acc, p) => acc + p.fundsAllocated, 0);
    const utilizedFunds = data.projects.reduce((acc, p) => acc + p.fundsUtilized, 0);
    const utilizationPercentage = totalFunds > 0 ? ((utilizedFunds / totalFunds) * 100).toFixed(1) : 0;

    // Recent Items
    const recentProjects = [...data.projects].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

    // Charts
    const pieData = {
        labels: ['Utilized', 'Remaining'],
        datasets: [{
            data: [utilizedFunds, totalFunds - utilizedFunds],
            backgroundColor: ['#28a745', '#e9ecef'],
            borderColor: ['#28a745', '#dee2e6'],
            borderWidth: 1,
        }],
    };

    // MLA Funds Bar Chart
    const mlaFunds = {};
    data.projects.forEach(p => {
        const name = p.mla?.fullName || 'Unknown';
        if (!mlaFunds[name]) mlaFunds[name] = 0;
        mlaFunds[name] += p.fundsAllocated;
    });

    const barData = {
        labels: Object.keys(mlaFunds),
        datasets: [{
            label: 'Funds Allocated (INR)',
            data: Object.values(mlaFunds),
            backgroundColor: '#0056b3'
        }]
    };

    const KPICard = ({ title, value, subtext, icon: Icon, color }) => (
        <div className="card" style={{ display: 'flex', alignItems: 'center', padding: '1.5rem', borderLeft: `4px solid ${color}` }}>
            <div style={{ marginRight: '1.5rem', padding: '15px', borderRadius: '50%', background: `${color}15`, color: color }}>
                <Icon size={24} />
            </div>
            <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '5px', fontWeight: '500' }}>{title}</p>
                <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text-dark)' }}>{value}</h3>
                {subtext && <p style={{ fontSize: '0.8rem', color: 'var(--success)', marginTop: '5px' }}>{subtext}</p>}
            </div>
        </div>
    );

    return (
        <div className="container section-padding">
            <div style={{ margin: '0 0 2rem' }}>
                <h1 style={{ fontSize: '2rem' }}>{t('Public Insight Dashboard', 'പൊതു വിവര ഡാഷ്ബോർഡ്')}</h1>
                <p style={{ color: 'var(--text-muted)' }}>Overview of MLA activities and development projects.</p>
            </div>

            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <KPICard title="Total Projects" value={data.projects.length} subtext={`${recentProjects.length} new this month`} icon={FaProjectDiagram} color="#007bff" />
                <KPICard title="Budget Utilized" value={`₹${(utilizedFunds / 100000).toFixed(1)}L`} subtext={`${utilizationPercentage}% Utilization`} icon={FaRupeeSign} color="#28a745" />
                <KPICard title="Active MLAs" value={Object.keys(mlaFunds).length} icon={FaUsers} color="#fd7e14" />
                <KPICard title="Avg Attendance" value="85%" subtext="Last Session" icon={FaClipboardList} color="#6f42c1" />
            </div>

            {/* Quick Links */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                <Link to="/mla-directory" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>View All MLAs <FaArrowRight size={12} /></Link>
                <Link to="/profile" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>My Profile <FaArrowRight size={12} /></Link>
            </div>

            {/* Charts Section */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                <div className="card">
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Fund Utilization Status</h3>
                    <div style={{ height: '300px', display: 'flex', justifyContent: 'center' }}>
                        <Pie data={pieData} />
                    </div>
                </div>
                <div className="card">
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Allocation by MLA</h3>
                    <div style={{ height: '300px' }}>
                        <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false }} />
                    </div>
                </div>
            </div>

            {/* Recent Projects */}
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>{t('Recent Projects', 'പുതിയ പദ്ധതികൾ')}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                {recentProjects.map(project => (
                    <div className="card" key={project._id} title={project.title}>
                        <h4 style={{ marginBottom: '10px' }}>{project.title}</h4>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.95rem' }}>{project.description}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-dark)' }}>
                            <span><strong>₹{project.fundsAllocated.toLocaleString()}</strong> allocated</span>
                            <span style={{ color: 'var(--success)' }}>Approved</span>
                        </div>
                        <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            MLA: {project.mla?.fullName}
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default PublicDashboard;

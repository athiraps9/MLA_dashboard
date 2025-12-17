import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import api from '../utils/api';
import Card from '../components/Card';
import '../styles/variables.css';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const MLADetail = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await api.get(`/mla/${id}`);
                setData(res.data);
            } catch (err) {
                console.error('Error fetching MLA detail', err);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    if (loading) return <div className="text-center mt-lg">Loading Profile...</div>;
    if (!data) return <div className="text-center mt-lg">MLA Not Found</div>;

    const { profile, projects, attendance, stats } = data;

    const chartData = {
        labels: ['Utilized', 'Remaining'],
        datasets: [
            {
                data: [stats.utilizedFunds, stats.totalFunds - stats.utilizedFunds],
                backgroundColor: ['#48bb78', '#e2e8f0'],
                borderColor: ['#38a169', '#cbd5e0'],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="container mt-lg">
            {/* Header Profile */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 'bold', margin: '0 auto 1rem auto' }}>
                    {profile.fullName.charAt(0)}
                </div>
                <h1 style={{ color: 'var(--primary-color)' }}>{profile.fullName}</h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>MLA, {profile.district} Constituency</p>
            </div>

            {/* Stats Overview */}
            <div className="flex gap-md" style={{ flexWrap: 'wrap', marginBottom: '2rem' }}>
                <div style={{ flex: 1, minWidth: '300px' }}>
                    <Card title="Fund Utilization">
                        <div style={{ height: '250px', display: 'flex', justifyContent: 'center' }}>
                            <Pie data={chartData} />
                        </div>
                        <div className="text-center mt-lg">
                            <p><strong>Allocated:</strong> ₹{stats.totalFunds.toLocaleString()}</p>
                            <p><strong>Utilized:</strong> ₹{stats.utilizedFunds.toLocaleString()}</p>
                        </div>
                    </Card>
                </div>
                <div style={{ flex: 1, minWidth: '300px' }}>
                    <Card title="Performance Summary">
                        <div style={{ padding: '1rem' }}>
                            <p style={{ marginBottom: '1rem' }}><strong>Projects Approved:</strong> {stats.projectCount}</p>
                            <p style={{ marginBottom: '1rem' }}><strong>Verified Activities:</strong> {attendance.length}</p>
                            {/* Detailed breakdown could go here */}
                            <div style={{ background: '#f0fff4', padding: '15px', borderRadius: '8px', color: '#2f855a' }}>
                                This profile verifies that {profile.fullName} has been active in {attendance.length} official assembly/constituency activities.
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Attendance Table */}
            <h2 style={{ borderBottom: '2px solid var(--secondary-color)', paddingBottom: '10px', marginBottom: '20px' }}>
                Verified Activities & Attendance
            </h2>
            <div style={{ overflowX: 'auto', marginBottom: '3rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}>
                    <thead>
                        <tr style={{ backgroundColor: 'var(--primary-color)', color: 'white', textAlign: 'left' }}>
                            <th style={{ padding: '12px' }}>Date</th>
                            <th style={{ padding: '12px' }}>Type</th>
                            <th style={{ padding: '12px' }}>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendance.length === 0 ? <tr><td colSpan="3" style={{ padding: '12px', textAlign: 'center' }}>No verified records found.</td></tr> : attendance.map(item => (
                            <tr key={item._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <td style={{ padding: '12px' }}>{new Date(item.date).toLocaleDateString()}</td>
                                <td style={{ padding: '12px', textTransform: 'capitalize' }}>{item.type}</td>
                                <td style={{ padding: '12px' }}>{item.description}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Approved Projects */}
            <h2 style={{ borderBottom: '2px solid var(--secondary-color)', paddingBottom: '10px', marginBottom: '20px' }}>
                Approved Development Projects
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {projects.length === 0 ? <p>No approved projects found.</p> : projects.map(project => (
                    <Card key={project._id} title={project.title}>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '10px' }}>{project.description}</p>
                        <div style={{ fontSize: '0.9rem' }}>
                            <p><strong>Allocated:</strong> ₹{project.fundsAllocated.toLocaleString()}</p>
                            <p><strong>Utilized:</strong> ₹{project.fundsUtilized.toLocaleString()}</p>
                            <p><strong>Beneficiaries:</strong> {project.beneficiaries || 'N/A'}</p>
                        </div>
                    </Card>
                ))}
            </div>

            <div style={{ height: '50px' }}></div>
        </div>
    );
};

export default MLADetail;

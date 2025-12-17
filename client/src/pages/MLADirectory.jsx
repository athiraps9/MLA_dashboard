import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Card from '../components/Card';
import '../styles/variables.css';

const MLADirectory = () => {
    const [mlas, setMlas] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMLAs = async () => {
            try {
                const res = await api.get('/mla');
                setMlas(res.data);
            } catch (err) {
                console.error('Failed to fetch MLAs', err);
            } finally {
                setLoading(false);
            }
        };
        fetchMLAs();
    }, []);

    if (loading) return <div className="text-center mt-lg">Loading Directory...</div>;

    const styles = {
        grid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '2rem',
            marginTop: '2rem'
        },
        cardHeader: {
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1rem'
        },
        avatar: {
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'var(--primary-color)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            fontWeight: 'bold'
        },
        name: {
            fontSize: '1.2rem',
            fontWeight: 'bold',
            color: 'var(--text-primary)'
        },
        district: {
            color: 'var(--text-secondary)',
            fontSize: '0.9rem'
        },
        viewButton: {
            display: 'block',
            width: '100%',
            padding: '10px',
            textAlign: 'center',
            background: 'var(--secondary-color)',
            color: 'white',
            borderRadius: '4px',
            textDecoration: 'none',
            marginTop: '1rem',
            cursor: 'pointer',
            border: 'none'
        }
    };

    return (
        <div className="container mt-lg">
            <h1 className="text-center" style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>MLA Directory</h1>
            <p className="text-center" style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
                Find your elected representatives and view their performance, verified project data, and attendance records.
            </p>

            <div style={styles.grid}>
                {mlas.length === 0 ? <p className="text-center">No MLAs found.</p> : mlas.map(mla => (
                    <Card key={mla._id}>
                        <div style={styles.cardHeader}>
                            <div style={styles.avatar}>{mla.fullName.charAt(0)}</div>
                            <div>
                                <div style={styles.name}>{mla.fullName}</div>
                                <div style={styles.district}>{mla.district} Constituency</div>
                            </div>
                        </div>
                        <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
                            View detailed reports on fund utilization and assembly attendance.
                        </p>
                        <button onClick={() => navigate(`/mla-directory/${mla._id}`)} style={styles.viewButton}>
                            View Profile
                        </button>
                    </Card>
                ))}
            </div>

            <div style={{ height: '50px' }}></div>
        </div>
    );
};

export default MLADirectory;

import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Card from './Card';
import Button from './Button';

const AdminLandingCMS = () => {
    const [data, setData] = useState({
        aboutText: '',
        usageSteps: [],
        featureCards: [],
        featuredProjectIds: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await api.get('/landing');
            // Extract IDs if populated, or handle populated objects
            // The API returns populated featuredProjectIds. For editing, we might need IDs or we can just manage the list.
            // Let's assume we just want to add/remove IDs.
            // But wait, the API returns objects.
            const content = res.data.content;
            setData({
                ...content,
                featuredProjectIds: content.featuredProjectIds.map(p => p._id || p) // Ensure we have IDs
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            await api.put('/landing', data);
            alert('Landing page content updated!');
        } catch (err) {
            alert('Failed to update content');
            console.error(err);
        }
    };

    const handleStepChange = (index, value) => {
        const newSteps = [...data.usageSteps];
        newSteps[index] = value;
        setData({ ...data, usageSteps: newSteps });
    };

    const addStep = () => setData({ ...data, usageSteps: [...data.usageSteps, ''] });
    const removeStep = (index) => {
        const newSteps = data.usageSteps.filter((_, i) => i !== index);
        setData({ ...data, usageSteps: newSteps });
    };

    const handleCardChange = (index, field, value) => {
        const newCards = [...data.featureCards];
        newCards[index][field] = value;
        setData({ ...data, featureCards: newCards });
    };

    const addCard = () => setData({ ...data, featureCards: [...data.featureCards, { title: '', description: '', imageUrl: '' }] });
    const removeCard = (index) => {
        const newCards = data.featureCards.filter((_, i) => i !== index);
        setData({ ...data, featureCards: newCards });
    };

    if (loading) return <div>Loading CMS...</div>;

    const styles = {
        section: { marginBottom: '2rem' },
        label: { display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' },
        input: { width: '100%', padding: '0.5rem', marginBottom: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' },
        textarea: { width: '100%', padding: '0.5rem', minHeight: '100px', borderRadius: '4px', border: '1px solid #ccc' },
        row: { display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.5rem' }
    };

    return (
        <div>
            <h2 style={{ marginBottom: '1rem' }}>Landing Page Content Management</h2>

            <Card title="Hero Section">
                <div style={styles.section}>
                    <label style={styles.label}>About Text (Hero Description)</label>
                    <textarea
                        style={styles.textarea}
                        value={data.aboutText}
                        onChange={(e) => setData({ ...data, aboutText: e.target.value })}
                    />
                </div>
            </Card>

            <div style={{ height: '20px' }}></div>

            <Card title="How to Use Steps">
                {data.usageSteps.map((step, index) => (
                    <div key={index} style={styles.row}>
                        <span style={{ fontWeight: 'bold' }}>{index + 1}.</span>
                        <input
                            style={styles.input}
                            value={step}
                            onChange={(e) => handleStepChange(index, e.target.value)}
                        />
                        <Button variant="danger" onClick={() => removeStep(index)}>X</Button>
                    </div>
                ))}
                <Button onClick={addStep}>+ Add Step</Button>
            </Card>

            <div style={{ height: '20px' }}></div>

            <Card title="Feature Cards">
                {data.featureCards.map((card, index) => (
                    <div key={index} style={{ borderBottom: '1px solid #eee', paddingBottom: '1rem', marginBottom: '1rem' }}>
                        <div style={styles.row}>
                            <input
                                style={{ ...styles.input, fontWeight: 'bold' }}
                                placeholder="Title"
                                value={card.title}
                                onChange={(e) => handleCardChange(index, 'title', e.target.value)}
                            />
                            <Button variant="danger" onClick={() => removeCard(index)}>Delete Card</Button>
                        </div>
                        <input
                            style={styles.input}
                            placeholder="Description"
                            value={card.description}
                            onChange={(e) => handleCardChange(index, 'description', e.target.value)}
                        />
                        {/* Image URL editing skipped for brevity, defaults used */}
                    </div>
                ))}
                <Button onClick={addCard}>+ Add Feature Card</Button>
            </Card>

            <div style={{ height: '20px' }}></div>

            <Card title="Featured Project IDs (Highlight on Landing Page)">
                {data.featuredProjectIds.map((id, index) => (
                    <div key={index} style={styles.row}>
                        <input
                            style={styles.input}
                            placeholder="Project ID"
                            value={id}
                            onChange={(e) => {
                                const newIds = [...data.featuredProjectIds];
                                newIds[index] = e.target.value;
                                setData({ ...data, featuredProjectIds: newIds });
                            }}
                        />
                        <Button variant="danger" onClick={() => {
                            const newIds = data.featuredProjectIds.filter((_, i) => i !== index);
                            setData({ ...data, featuredProjectIds: newIds });
                        }}>Remove</Button>
                    </div>
                ))}
                <Button onClick={() => setData({ ...data, featuredProjectIds: [...data.featuredProjectIds, ''] })}>+ Add Project ID</Button>
            </Card>

            <div style={{ marginTop: '20px' }}>
                <Button variant="success" onClick={handleSave} style={{ fontSize: '1.2rem', padding: '10px 20px', width: '100%' }}>Save All Changes</Button>
            </div>
        </div>
    );
};

export default AdminLandingCMS;

import React, { useState } from 'react';
import { FaRobot, FaTimes, FaCommentDots } from 'react-icons/fa';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleChat = () => setIsOpen(!isOpen);

    const helpOptions = [
        { q: "How to register?", a: "Click on Signup, enter your email and password to create an account." },
        { q: "How to register a complaint?", a: "Go to 'My Profile' > 'My Complaints' and submit the form." },
        { q: "Is this data verified?", a: "Yes, all project data is verified by the MLAs and Admins." },
    ];

    return (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
            {isOpen && (
                <div className="card" style={{ width: '300px', marginBottom: '10px', padding: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <h4 style={{ margin: 0 }}>Help Assistant</h4>
                        <FaTimes style={{ cursor: 'pointer' }} onClick={toggleChat} />
                    </div>
                    <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        <p style={{ fontSize: '0.9rem', marginBottom: '10px' }}>Hi! How can I help you today?</p>
                        {helpOptions.map((opt, i) => (
                            <details key={i} style={{ marginBottom: '8px', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>
                                <summary style={{ cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}>{opt.q}</summary>
                                <p style={{ fontSize: '0.85rem', margin: '5px 0 0 10px', color: '#555' }}>{opt.a}</p>
                            </details>
                        ))}
                    </div>
                </div>
            )}
            <button
                onClick={toggleChat}
                style={{
                    backgroundColor: 'var(--primary-color)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '60px',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    boxShadow: 'var(--shadow-lg)'
                }}
            >
                {isOpen ? <FaTimes /> : <FaRobot />}
            </button>
        </div>
    );
};

export default Chatbot;

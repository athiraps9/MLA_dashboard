import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useLanguage } from '../context/LanguageContext';
import {
    FaPaperPlane,
    FaHistory,
    FaCheckCircle,
    FaHourglassHalf,
    FaExclamationCircle,
    FaArrowLeft,
    FaTimes,
    FaCalendarAlt,
    FaTag,
    FaAlignLeft,
    FaUserShield,
} from 'react-icons/fa';

const ComplaintPortal = () => {

    const [activeTab, setActiveTab] = useState('history');

    const [complaints, setComplaints] = useState([]);
    const [formData, setFormData] = useState({ title: '', description: '' });
    const [loading, setLoading] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    // --- View More state ---
    const [selectedComplaint, setSelectedComplaint] = useState(null);

    const { t } = useLanguage();

    useEffect(() => {
        if (activeTab === 'history') {
            fetchComplaints();
        }
    }, [activeTab]);

    const fetchComplaints = async () => {
        try {
            setLoading(true);
            const res = await api.get('/complaints/my');
            setComplaints(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitStatus(null);

        try {
            setLoading(true);
            await api.post('/complaints', formData);
            setSubmitStatus('success');
            setFormData({ title: '', description: '' });
            setTimeout(() => {
                setActiveTab('history');
                setSubmitStatus(null);
            }, 1500);
        } catch (err) {
            console.error(err);
            setSubmitStatus('error');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Resolved':   return 'var(--success)';
            case 'In Review':  return 'var(--warning)';
            default:           return 'var(--text-muted)';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Resolved':   return <FaCheckCircle />;
            case 'In Review':  return <FaHourglassHalf />;
            default:           return <FaExclamationCircle />;
        }
    };

    /* ---------- TABLE STYLES ---------- */
    const thStyle = {
        padding: "12px",
        borderBottom: "2px solid #eee",
        fontWeight: "600",
        fontSize: "0.95rem",
        textAlign: "left"
    };

    const tdStyle = {
        padding: "12px",
        borderBottom: "1px solid #eee",
        fontSize: "0.9rem",
        verticalAlign: "top"
    };

    /* ---------- DETAIL CARD STYLES ---------- */
    const detailCardStyle = {
        background: "#FFFFFF",
        borderRadius: "12px",
        padding: "24px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
        border: "1px solid #E5E7EB",
    };

    const detailCardTitle = {
        margin: "0 0 6px 0",
        fontSize: "13px",
        fontWeight: 600,
        color: "#6B7280",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        display: "flex",
        alignItems: "center",
        gap: "6px",
    };

    const detailCardValue = {
        margin: 0,
        fontSize: "20px",
        fontWeight: 700,
        color: "#111827",
    };

    /* ============================================================
       FULL-SCREEN VIEW MORE OVERLAY
    ============================================================ */
    if (selectedComplaint) {
        const c = selectedComplaint;

        return (
            <div
                style={{
                    position: "fixed",
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: "#F9FAFB",
                    zIndex: 1000,
                    overflowY: "auto",
                }}
            >
                {/* ---- STICKY HEADER ---- */}
                <div
                    style={{
                        position: "sticky",
                        top: 0,
                        backgroundColor: "#FFFFFF",
                        borderBottom: "1px solid #E5E7EB",
                        zIndex: 10,
                        padding: "16px 24px",
                    }}
                >
                    <div
                        style={{
                            maxWidth: "1400px",
                            margin: "0 auto",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        {/* Back button */}
                        <div style={{ flex: 1 }}>
                            <button
                                onClick={() => setSelectedComplaint(null)}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    padding: "8px 16px",
                                    backgroundColor: "transparent",
                                    border: "1px solid #E5E7EB",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    fontSize: "14px",
                                    fontWeight: 500,
                                    color: "#374151",
                                }}
                            >
                                <FaArrowLeft size={14} />
                                Back
                            </button>
                        </div>

                        {/* Close (X) button */}
                        <button
                            onClick={() => setSelectedComplaint(null)}
                            style={{
                                padding: "8px",
                                backgroundColor: "transparent",
                                border: "none",
                                borderRadius: "8px",
                                cursor: "pointer",
                                color: "#6B7280",
                            }}
                        >
                            <FaTimes size={20} />
                        </button>
                    </div>
                </div>

                {/* ---- CONTENT ---- */}
                <div
                    style={{
                        maxWidth: "1400px",
                        margin: "0 auto",
                        padding: "24px",
                    }}
                >
                    {/* Page title + status badge */}
                    <div
                        style={{
                            marginBottom: "24px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                            gap: "12px",
                        }}
                    >
                        <h2
                            style={{
                                margin: 0,
                                fontSize: "24px",
                                fontWeight: 700,
                                color: "#0369A1",
                            }}
                        >
                            {c.title}
                        </h2>

                        <span
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                padding: "6px 14px",
                                borderRadius: "20px",
                                background: getStatusColor(c.status) + "20",
                                color: getStatusColor(c.status),
                                fontWeight: "600",
                                fontSize: "0.9rem",
                            }}
                        >
                            {getStatusIcon(c.status)}
                            {c.status}
                        </span>
                    </div>

                    {/* ---- STATS / INFO GRID ---- */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                            gap: "16px",
                            marginBottom: "24px",
                        }}
                    >
                        {/* Submitted Date */}
                        <div style={detailCardStyle}>
                            <h4 style={detailCardTitle}>
                                <FaCalendarAlt /> Submitted Date
                            </h4>
                            <p style={detailCardValue}>
                                {new Date(c.createdAt).toLocaleDateString(undefined, {
                                    year: 'numeric', month: 'long', day: 'numeric'
                                })}
                            </p>
                        </div>

                        {/* Status */}
                        <div style={detailCardStyle}>
                            <h4 style={detailCardTitle}>
                                <FaTag /> Status
                            </h4>
                            <p style={{ ...detailCardValue, color: getStatusColor(c.status) }}>
                                {c.status}
                            </p>
                        </div>

                        {/* Admin Response indicator */}
                        {/* <div style={detailCardStyle}>
                            <h4 style={detailCardTitle}>
                                <FaUserShield /> Admin Response
                            </h4>
                            <p style={detailCardValue}>
                                {c.adminResponse ? 'Received' : 'Pending'}
                            </p>
                        </div> */}
                    </div>

                    {/* ---- DESCRIPTION CARD ---- */}
                    <div style={{ ...detailCardStyle, marginBottom: "16px" }}>
                        <h4 style={{ ...detailCardTitle, marginBottom: "12px" }}>
                            <FaAlignLeft /> Description
                        </h4>
                        <p
                            style={{
                                margin: 0,
                                fontSize: "15px",
                                color: "#374151",
                                lineHeight: "1.7",
                                whiteSpace: "pre-wrap",
                            }}
                        >
                            {c.description}
                        </p>
                    </div>

                    {/* ---- ADMIN RESPONSE CARD (only if present) ---- */}
                    {c.adminResponse && (
                        <div
                            style={{
                                ...detailCardStyle,
                                borderLeft: "4px solid #0369A1",
                                background: "#EFF6FF",
                            }}
                        >
                            {/* <h4 style={{ ...detailCardTitle, color: "#0369A1", marginBottom: "12px" }}>
                                <FaUserShield /> Admin Response
                            </h4> */}
                            <p
                                style={{
                                    margin: 0,
                                    fontSize: "15px",
                                    color: "#1E40AF",
                                    lineHeight: "1.7",
                                    whiteSpace: "pre-wrap",
                                }}
                            >
                                {c.adminResponse}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    /* ============================================================
       MAIN TABLE VIEW
    ============================================================ */
    return (
        <div className="container section-padding">
            <h2 style={{ marginBottom: '20px' }}>
                {t('My Complaints')}
            </h2>

            <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ padding: '30px' }}>

                    {loading ? (
                        <p>Loading history...</p>
                    ) : complaints.length > 0 ? (

                        <div style={{ overflowX: "auto" }}>
                            <table
                                style={{
                                    width: "100%",
                                    borderCollapse: "collapse",
                                    background: "#fff"
                                }}
                            >
                                <thead>
                                    <tr style={{ background: "#f8f9fa" }}>
                                        <th style={thStyle}>Title</th>
                                        <th style={thStyle}>Description</th>
                                        <th style={thStyle}>Status</th>
                                        <th style={thStyle}>Submitted Date</th>
                                        {/* <th style={thStyle}>Admin Response</th> */}
                                    </tr>
                                </thead>

                                <tbody>
                                    {complaints.map((c) => (
                                        <tr key={c._id}>

                                            <td style={{ ...tdStyle, width: "20%" }}>
                                                {c.title}
                                            </td>

                                            <td style={{ ...tdStyle, width: "30%" }}>
                                                <span
                                                    style={{
                                                        color: "#666",
                                                        display: "-webkit-box",
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: "vertical",
                                                        overflow: "hidden",
                                                    }}
                                                >
                                                    {c.description}
                                                </span>
                                            </td>

                                            <td style={{ ...tdStyle, width: "12%" }}>
                                                <span
                                                    style={{
                                                        display: "inline-flex",
                                                        alignItems: "center",
                                                        gap: "6px",
                                                        padding: "5px 10px",
                                                        borderRadius: "20px",
                                                        background: getStatusColor(c.status) + "20",
                                                        color: getStatusColor(c.status),
                                                        fontWeight: "600",
                                                        fontSize: "0.85rem"
                                                    }}
                                                >
                                                    {getStatusIcon(c.status)}
                                                    {c.status}
                                                </span>
                                            </td>

                                            <td style={{ ...tdStyle, width: "13%" }}>
                                                {new Date(c.createdAt).toLocaleDateString()}
                                            </td>

                                            {/* <td style={{ ...tdStyle, width: "25%" }}>
                                                {c.adminResponse ? (
                                                    <div
                                                        style={{
                                                            background: "#f1f1f1",
                                                            padding: "8px",
                                                            borderRadius: "5px",
                                                            display: "-webkit-box",
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: "vertical",
                                                            overflow: "hidden",
                                                        }}
                                                    >
                                                        {c.adminResponse}
                                                    </div>
                                                ) : (
                                                    <span style={{ color: "#999", fontSize: "0.85rem" }}>
                                                        No response yet
                                                    </span>
                                                )}
                                            </td> */}

                                            {/* View More cell */}
                                            <td style={{ ...tdStyle, width: "10%", textAlign: "center" }}>
                                                <button
                                                    onClick={() => setSelectedComplaint(c)}
                                                    style={{
                                                        padding: "6px 14px",
                                                        backgroundColor: "#0369A1",
                                                        color: "#fff",
                                                        border: "none",
                                                        borderRadius: "6px",
                                                        cursor: "pointer",
                                                        fontSize: "0.82rem",
                                                        fontWeight: 600,
                                                        whiteSpace: "nowrap",
                                                    }}
                                                >
                                                    View More
                                                </button>
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                    ) : (
                        <p className="text-center" style={{ color: "#999" }}>
                            No complaints found.
                        </p>
                    )}

                </div>
            </div>
        </div>
    );
};

export default ComplaintPortal;
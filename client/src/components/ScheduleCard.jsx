import React from 'react';
import { FaClock, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';

const ScheduleCard = ({ schedule, onApprove, onCancel, showActions = false }) => {
    const getStatusStyle = (status) => {
        switch (status) {
            case 'Approved':
                return {
                    bg: 'linear-gradient(135deg, #f0fff4 0%, #c6f6d5 100%)',
                    color: '#22543d',
                    border: 'rgba(72, 187, 120, 0.2)'
                };
            case 'Cancelled':
                return {
                    bg: 'linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%)',
                    color: '#822727',
                    border: 'rgba(245, 101, 101, 0.2)'
                };
            case 'Pending':
            default:
                return {
                    bg: 'linear-gradient(135deg, #fffaf0 0%, #feebc8 100%)',
                    color: '#744210',
                    border: 'rgba(237, 137, 54, 0.2)'
                };
        }
    };

    const statusStyle = getStatusStyle(schedule.status);

    const styles = {
        card: {
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(12px)',
            borderRadius: '16px',
            padding: '1.5rem',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            boxShadow: '0 8px 32px rgba(31, 38, 135, 0.07)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            overflow: 'hidden',
            fontFamily: "'Inter', sans-serif"
        },
        badge: {
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            background: statusStyle.bg,
            color: statusStyle.color,
            border: `1px solid ${statusStyle.border}`
        },
        title: {
            fontSize: '1.15rem',
            fontWeight: '800',
            color: '#1a365d',
            marginBottom: '0.25rem',
            letterSpacing: '-0.5px'
        },
        row: {
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            margin: '8px 0',
            color: '#4a5568',
            fontSize: '0.9rem'
        },
        icon: {
            color: '#718096',
            opacity: 0.8
        },
        description: {
            marginTop: '1.25rem',
            padding: '12px',
            background: 'rgba(247, 250, 252, 0.5)',
            borderRadius: '12px',
            fontSize: '0.85rem',
            color: '#4a5568',
            lineHeight: '1.6',
            border: '1px solid rgba(226, 232, 240, 0.5)'
        },
        footer: {
            marginTop: '1.5rem',
            paddingTop: '1rem',
            borderTop: '1px solid rgba(226, 232, 240, 0.6)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
        },
        btnGroup: {
            display: 'flex',
            gap: '10px'
        },
        button: (type) => ({
            flex: 1,
            padding: '10px',
            borderRadius: '10px',
            border: 'none',
            fontSize: '0.85rem',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            backgroundColor: type === 'approve' ? '#48bb78' : '#f56565',
            color: 'white',
            boxShadow: `0 4px 6px ${type === 'approve' ? 'rgba(72,187,120,0.2)' : 'rgba(245,101,101,0.2)'}`
        })
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div
            style={styles.card}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(31, 38, 135, 0.12)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.85)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(31, 38, 135, 0.07)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.7)';
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                    <h3 style={styles.title}>{schedule.scheduleType}</h3>
                    <div style={{ fontSize: '0.85rem', color: '#718096', fontWeight: '500' }}>
                        Admin: {schedule.admin?.fullName || 'N/A'}
                    </div>
                </div>
                <span style={styles.badge}>{schedule.status}</span>
            </div>

            <div style={styles.row}>
                <FaCalendarAlt style={styles.icon} size={14} />
                <span style={{ fontWeight: '600' }}>{formatDate(schedule.date)}</span>
            </div>
            <div style={styles.row}>
                <FaClock style={styles.icon} size={14} />
                <span>{schedule.time}</span>
            </div>
            <div style={styles.row}>
                <FaMapMarkerAlt style={styles.icon} size={14} />
                <span>{schedule.venue}</span>
            </div>

            {schedule.description && (
                <div style={styles.description}>
                    {schedule.description}
                </div>
            )}

            {(schedule.createdBy || (showActions && schedule.status === 'Pending')) && (
                <div style={styles.footer}>
                    {schedule.createdBy && (
                        <div style={{ fontSize: '0.75rem', color: '#a0aec0', fontStyle: 'italic' }}>
                            Proposed by {schedule.createdBy.fullName}
                        </div>
                    )}

                    {showActions && schedule.status === 'Pending' && (
                        <div style={styles.btnGroup}>
                            <button
                                style={styles.button('approve')}
                                onClick={() => onApprove && onApprove(schedule._id)}
                                onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
                                onMouseLeave={(e) => e.currentTarget.style.filter = 'none'}
                            >
                                Approve
                            </button>
                            <button
                                style={styles.button('cancel')}
                                onClick={() => onCancel && onCancel(schedule._id)}
                                onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
                                onMouseLeave={(e) => e.currentTarget.style.filter = 'none'}
                            >
                                Reject
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ScheduleCard;

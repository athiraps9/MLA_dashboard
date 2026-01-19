import React, { useState } from 'react';
import { FaChevronDown, FaChevronRight, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const AttendanceTree = ({ attendance, onVerify, onReject, isAdmin = false }) => {
    const [expandedSeasons, setExpandedSeasons] = useState({});
    const [expandedDates, setExpandedDates] = useState({});

    // Group attendance by season
    const groupedBySeasonFunction = () => {
        const grouped = {};
        attendance.forEach(record => {
            const seasonId = record.season?._id || 'unknown';
            const seasonName = record.season?.name || 'Unknown Season';

            if (!grouped[seasonId]) {
                grouped[seasonId] = {
                    name: seasonName,
                    records: []
                };
            }
            grouped[seasonId].records.push(record);
        });
        return grouped;
    };

    const groupedBySeason = groupedBySeasonFunction();

    // Group records by date within a season
    const groupByDate = (records) => {
        const grouped = {};
        records.forEach(record => {
            const dateKey = new Date(record.date).toLocaleDateString();
            if (!grouped[dateKey]) {
                grouped[dateKey] = [];
            }
            grouped[dateKey].push(record);
        });
        return grouped;
    };

    const toggleSeason = (seasonId) => {
        setExpandedSeasons(prev => ({
            ...prev,
            [seasonId]: !prev[seasonId]
        }));
    };

    const toggleDate = (dateKey) => {
        setExpandedDates(prev => ({
            ...prev,
            [dateKey]: !prev[dateKey]
        }));
    };

    const styles = {
        container: {
            fontFamily: "'Inter', sans-serif",
            fontSize: '14px',
            color: '#2d3748'
        },
        seasonHeader: {
            padding: '14px 18px',
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '12px',
            marginBottom: '12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontWeight: '700',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease'
        },
        dateHeader: {
            padding: '12px 16px',
            background: 'rgba(237, 242, 247, 0.6)',
            backdropFilter: 'blur(8px)',
            marginLeft: '24px',
            marginBottom: '8px',
            borderRadius: '10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontWeight: '600',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            transition: 'all 0.2s ease'
        },
        recordItem: {
            padding: '12px 20px',
            marginLeft: '48px',
            marginBottom: '8px',
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            borderRadius: '10px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
            transition: 'transform 0.2s ease'
        },
        statusBadge: (status) => ({
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            backgroundColor: status === 'Present' ? '#c6f6d5' : '#fed7d7',
            color: status === 'Present' ? '#22543d' : '#822727'
        }),
        verifiedBadge: (isVerified) => ({
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: isVerified ? '#bee3f8' : '#feebc8',
            color: isVerified ? '#2a4365' : '#744210'
        }),
        actionBtn: (type) => ({
            padding: '6px 12px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            backgroundColor: type === 'verify' ? '#48bb78' : '#f56565',
            color: 'white',
            marginLeft: '8px'
        })
    };

    if (!attendance || attendance.length === 0) {
        return (
            <div style={{
                padding: '40px',
                textAlign: 'center',
                background: 'rgba(255,255,255,0.5)',
                borderRadius: '16px',
                border: '1px dashed #cbd5e0',
                color: '#718096'
            }}>
                No attendance records found.
            </div>
        );
    }

    return (
        <div style={styles.container}>
            {Object.entries(groupedBySeason).map(([seasonId, seasonData]) => {
                const isSeasonExpanded = expandedSeasons[seasonId];
                const dateGroups = groupByDate(seasonData.records);

                return (
                    <div key={seasonId} style={{ marginBottom: '16px' }}>
                        <div
                            style={styles.seasonHeader}
                            onClick={() => toggleSeason(seasonId)}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.9)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
                            }}
                        >
                            {isSeasonExpanded ? <FaChevronDown color="#4a5568" /> : <FaChevronRight color="#4a5568" />}
                            <span style={{ fontSize: '16px' }}>{seasonData.name}</span>
                            <span style={{ fontSize: '12px', color: '#718096', fontWeight: '500' }}>
                                — {seasonData.records.length} records
                            </span>
                        </div>

                        {isSeasonExpanded && (
                            <div style={{ paddingBottom: '8px' }}>
                                {Object.entries(dateGroups).map(([dateKey, records]) => {
                                    const isDateExpanded = expandedDates[dateKey];

                                    return (
                                        <div key={dateKey}>
                                            <div
                                                style={styles.dateHeader}
                                                onClick={() => toggleDate(dateKey)}
                                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(237, 242, 247, 0.9)'}
                                                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(237, 242, 247, 0.6)'}
                                            >
                                                {isDateExpanded ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}
                                                <span>{dateKey}</span>
                                            </div>

                                            {isDateExpanded && (
                                                <div style={{ marginTop: '4px' }}>
                                                    {records.map(record => (
                                                        <div
                                                            key={record._id}
                                                            style={styles.recordItem}
                                                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
                                                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                                                        >
                                                            <div style={{ flex: 1 }}>
                                                                <div style={{ fontWeight: '700', color: '#1a365d' }}>
                                                                    {record.mla?.fullName || 'Unknown MLA'}
                                                                </div>
                                                                {record.remarks && (
                                                                    <div style={{ fontSize: '12px', color: '#718096', marginTop: '4px', fontStyle: 'italic' }}>
                                                                        "{record.remarks}"
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                                                <span style={styles.statusBadge(record.status)}>
                                                                    {record.status}
                                                                </span>

                                                                {isAdmin && !record.isVerified ? (
                                                                    <div style={{ display: 'flex' }}>
                                                                        <button
                                                                            style={styles.actionBtn('verify')}
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                onVerify && onVerify(record._id);
                                                                            }}
                                                                        >
                                                                            Verify
                                                                        </button>
                                                                        <button
                                                                            style={styles.actionBtn('reject')}
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                onReject && onReject(record._id);
                                                                            }}
                                                                        >
                                                                            Reject
                                                                        </button>
                                                                    </div>
                                                                ) : (
                                                                    <span style={styles.verifiedBadge(record.isVerified)}>
                                                                        {record.isVerified ? (
                                                                            <><FaCheckCircle size={12} /> Verified</>
                                                                        ) : (
                                                                            <><FaTimesCircle size={12} /> Pending</>
                                                                        )}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default AttendanceTree;

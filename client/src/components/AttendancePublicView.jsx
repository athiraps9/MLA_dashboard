import React from 'react';
import Card from './Card';

const AttendancePublicView = ({ attendanceData }) => {
    // Expects aggregated data: { totalPresent, totalDays, percentage }

    // Fallback if data not ready
    if (!attendanceData) return null;

    const styles = {
        container: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px' },
        statBox: { textAlign: 'center' },
        percentage: { fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary-color)' },
        label: { color: '#666' }
    };

    return (
        <Card title="MLA Attendance Overview">
            <div style={styles.container}>
                <div style={styles.statBox}>
                    <div style={styles.percentage}>{attendanceData.percentage}%</div>
                    <div style={styles.label}>Overall Attendance</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <p><strong>{attendanceData.totalPresent}</strong> Days Present</p>
                    <p>Out of <strong>{attendanceData.totalDays}</strong> Session Days</p>
                    <small className="text-muted">Verified Records</small>
                </div>
            </div>
        </Card>
    );
};

export default AttendancePublicView;

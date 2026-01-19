import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const SimpleCalendar = ({ schedules = [], busyDates = [], onDateClick, highlightToday = true }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month, 1).getDay();
    };

    const previousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const isToday = (day) => {
        const today = new Date();
        return (
            day === today.getDate() &&
            currentDate.getMonth() === today.getMonth() &&
            currentDate.getFullYear() === today.getFullYear()
        );
    };

    const hasSchedule = (day) => {
        const dateString = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0];
        return schedules.some(schedule => {
            const scheduleDate = new Date(schedule.date).toISOString().split('T')[0];
            return scheduleDate === dateString;
        });
    };

    const isBusy = (day) => {
        const dateString = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0];
        return busyDates.includes(dateString);
    };

    const handleDateClick = (day) => {
        const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        if (onDateClick) {
            onDateClick(selectedDate);
        }
    };

    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const styles = {
        container: {
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(12px)',
            borderRadius: '20px',
            padding: '1.5rem',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
            maxWidth: '100%',
            margin: '0 auto',
            fontFamily: "'Inter', sans-serif"
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem'
        },
        monthYear: {
            fontSize: '1.25rem',
            fontWeight: '800',
            color: '#1a365d',
            letterSpacing: '-0.5px'
        },
        navButton: {
            background: 'rgba(255, 255, 255, 0.8)',
            border: '1px solid rgba(0,0,0,0.05)',
            cursor: 'pointer',
            padding: '10px',
            borderRadius: '12px',
            color: '#4a5568',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
        },
        dayNames: {
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '8px',
            marginBottom: '10px'
        },
        dayName: {
            textAlign: 'center',
            fontSize: '0.75rem',
            fontWeight: '700',
            color: '#718096',
            textTransform: 'uppercase',
            letterSpacing: '1px'
        },
        daysGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '8px'
        },
        day: {
            aspectRatio: '1',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '14px',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: '600',
            transition: 'all 0.2s ease',
            position: 'relative',
            border: '1px solid transparent',
            color: '#4a5568'
        },
        emptyDay: {
            cursor: 'default',
            pointerEvents: 'none'
        },
        todayDay: {
            background: 'linear-gradient(135deg, #ebf8ff 0%, #bee3f8 100%)',
            border: '1px solid #90cdf4',
            color: '#2b6cb0',
            boxShadow: '0 4px 6px -1px rgba(66, 153, 225, 0.2)'
        },
        dotContainer: {
            display: 'flex',
            gap: '3px',
            position: 'absolute',
            bottom: '6px'
        },
        scheduleDot: {
            width: '5px',
            height: '5px',
            borderRadius: '50%',
            backgroundColor: '#48bb78'
        },
        busyDot: {
            width: '5px',
            height: '5px',
            borderRadius: '50%',
            backgroundColor: '#f56565'
        }
    };

    // Create array of days
    const days = [];
    for (let i = 0; i < firstDay; i++) {
        days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <button
                    style={styles.navButton}
                    onClick={previousMonth}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateX(-2px)';
                        e.currentTarget.style.backgroundColor = '#fff';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateX(0)';
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
                    }}
                >
                    <FaChevronLeft size={14} />
                </button>
                <div style={styles.monthYear}>
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </div>
                <button
                    style={styles.navButton}
                    onClick={nextMonth}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateX(2px)';
                        e.currentTarget.style.backgroundColor = '#fff';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateX(0)';
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
                    }}
                >
                    <FaChevronRight size={14} />
                </button>
            </div>

            <div style={styles.dayNames}>
                {dayNames.map(name => (
                    <div key={name} style={styles.dayName}>{name}</div>
                ))}
            </div>

            <div style={styles.daysGrid}>
                {days.map((day, index) => {
                    if (day === null) {
                        return <div key={`empty-${index}`} style={{ ...styles.day, ...styles.emptyDay }} />;
                    }

                    const today = highlightToday && isToday(day);
                    const hasSched = hasSchedule(day);
                    const busy = isBusy(day);

                    let dayStyle = { ...styles.day };
                    if (today) {
                        dayStyle = { ...dayStyle, ...styles.todayDay };
                    }

                    return (
                        <div
                            key={day}
                            style={dayStyle}
                            onClick={() => handleDateClick(day)}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = today ? '#ebf8ff' : '#edf2f7';
                                e.currentTarget.style.transform = 'scale(1.05)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = today ? '' : 'transparent';
                                e.currentTarget.style.transform = 'scale(1)';
                            }}
                        >
                            {day}
                            <div style={styles.dotContainer}>
                                {hasSched && <div style={styles.scheduleDot} title="Has Schedule" />}
                                {busy && <div style={styles.busyDot} title="Admin Busy" />}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SimpleCalendar;

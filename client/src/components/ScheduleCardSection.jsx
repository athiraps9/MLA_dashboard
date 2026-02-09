import React, { useState } from 'react';
import { Eye, ChevronRight, Calendar, Clock, MapPin, CheckCircle } from 'lucide-react';
import DetailedView from './DetailedView';
import ViewMoreModal from './ViewMoreModal';

/**
 * SCHEDULE CARD SECTION COMPONENT
 * Shows ALL schedules (no filtering)
 */
const ScheduleCardSection = ({ data }) => {
  // State management
  const [viewMode, setViewMode] = useState('grid');
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [showViewMore, setShowViewMore] = useState(false);

  // Process schedules - ALL SCHEDULES
  const schedules = data?.schedules || [];
  const sortedSchedules = [...schedules].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  // Show ALL schedules
  const displayedSchedules = sortedSchedules;
  const hasMoreSchedules = false;

  // Handlers
  const handleViewDetails = (schedule) => {
    setSelectedSchedule(schedule);
    setViewMode('detailed');
  };

  const handleViewMore = () => {
    setShowViewMore(true);
  };

  const handleBackToGrid = () => {
    setViewMode('grid');
    setSelectedSchedule(null);
    setShowViewMore(false);
  };

  // Render Schedule Card
  const renderScheduleCard = (schedule, showViewButton = true) => (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        padding: '20px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        transition: 'all 0.2s',
        cursor: showViewButton ? 'default' : 'pointer',
        height: '100%',
        border: '2px solid #10B981',
      }}
      onClick={() => !showViewButton && handleViewDetails(schedule)}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)';
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.borderColor = '#059669';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = '#10B981';
      }}
    >
      {/* Status Badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span
          style={{
            padding: '4px 10px',
            borderRadius: '8px',
            fontSize: '0.75rem',
            fontWeight: 500,
            backgroundColor: 
              schedule.status === 'Approved' ? '#D1FAE5' :
              schedule.status === 'Pending' ? '#FEF3C7' :
              '#FEE2E2',
            color: 
              schedule.status === 'Approved' ? '#065F46' :
              schedule.status === 'Pending' ? '#92400E' :
              '#991B1B',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <CheckCircle size={14} />
          {schedule.status}
        </span>
      </div>

      {/* Title */}
      <h4 style={{ 
        margin: 0, 
        fontSize: '18px', 
        fontWeight: 600, 
        color: '#111827',
        display: '-webkit-box',
        WebkitLineClamp: 4,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        lineHeight: '1.4',
        height: '100px',
      }}>
        {schedule.title}
      </h4>

      {/* Date & Time */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        paddingTop: '4px',
        borderTop: '1px solid #E5E7EB'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={16} color="#10B981" />
          <span style={{ fontSize: '14px', color: '#374151', fontWeight: 500 }}>
            {new Date(schedule.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={16} color="#059669" />
          <span style={{ fontSize: '14px', color: '#374151' }}>
            {schedule.time}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MapPin size={16} color="#EF4444" />
          <span style={{ 
            fontSize: '14px', 
            color: '#374151',
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {schedule.venue}
          </span>
        </div>
      </div>

      {/* Schedule Type Badge */}
      <span
        style={{
          alignSelf: 'flex-start',
          padding: '4px 10px',
          borderRadius: '8px',
          fontSize: '0.75rem',
          fontWeight: 500,
          backgroundColor: '#ECFDF5',
          color: '#047857',
          textTransform: 'capitalize'
        }}
      >
        {schedule.scheduleType}
      </span>

      {/* Description */}
      {schedule.description && (
        <p style={{
          margin: 0,
          color: '#6B7280',
          fontSize: '0.9rem',
          lineHeight: '1.6',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          height: '69px',
        }}>
          {schedule.description}
        </p>
      )}

      {/* View Details Button */}
      {showViewButton && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleViewDetails(schedule);
          }}
          style={{
            marginTop: 'auto',
            padding: '10px 16px',
            backgroundColor: '#10B981',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#059669';
            e.currentTarget.style.transform = 'scale(1.02)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#10B981';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <Eye size={16} />
          View Details
        </button>
      )}
    </div>
  );

  // Render Detailed Schedule Content
  const renderDetailedContent = (schedule) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
          <span
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: 500,
              backgroundColor: 
                schedule.status === 'Approved' ? '#D1FAE5' :
                schedule.status === 'Pending' ? '#FEF3C7' :
                '#FEE2E2',
              color: 
                schedule.status === 'Approved' ? '#065F46' :
                schedule.status === 'Pending' ? '#92400E' :
                '#991B1B',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <CheckCircle size={16} />
            {schedule.status}
          </span>
        </div>
        <h1 style={{
          margin: '0 0 16px 0',
          fontSize: '32px',
          fontWeight: 700,
          color: '#111827'
        }}>
          {schedule.title}
        </h1>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: 500,
              backgroundColor: '#ECFDF5',
              color: '#047857',
              textTransform: 'capitalize'
            }}
          >
            {schedule.scheduleType}
          </span>
        </div>
      </div>

      {/* Schedule Details Card */}
      <div style={{
        padding: '24px',
        backgroundColor: '#F0FDF4',
        borderRadius: '12px',
        border: '2px solid #86EFAC'
      }}>
        <h3 style={{
          margin: '0 0 16px 0',
          fontSize: '14px',
          fontWeight: 500,
          color: '#047857',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          📅 Schedule Information
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          <div>
            <div style={{
              fontSize: '12px',
              fontWeight: 500,
              color: '#059669',
              marginBottom: '4px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Date
            </div>
            <div style={{ 
              fontSize: '18px', 
              fontWeight: 600, 
              color: '#065F46',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Calendar size={20} color="#10B981" />
              {new Date(schedule.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>

          <div>
            <div style={{
              fontSize: '12px',
              fontWeight: 500,
              color: '#059669',
              marginBottom: '4px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Time
            </div>
            <div style={{ 
              fontSize: '18px', 
              fontWeight: 600, 
              color: '#065F46',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Clock size={20} color="#10B981" />
              {schedule.time}
            </div>
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <div style={{
              fontSize: '12px',
              fontWeight: 500,
              color: '#059669',
              marginBottom: '4px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Venue
            </div>
            <div style={{ 
              fontSize: '18px', 
              fontWeight: 600, 
              color: '#065F46',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <MapPin size={20} color="#10B981" />
              {schedule.venue}
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      {schedule.description && (
        <div>
          <h3 style={{
            margin: '0 0 12px 0',
            fontSize: '18px',
            fontWeight: 600,
            color: '#111827'
          }}>
            Schedule Description
          </h3>
          <p style={{
            margin: 0,
            fontSize: '16px',
            lineHeight: '1.7',
            color: '#374151'
          }}>
            {schedule.description}
          </p>
        </div>
      )}

      {/* Status Information */}
      {schedule.status === 'Approved' && (
        <div style={{
          padding: '20px',
          backgroundColor: '#DBEAFE',
          borderRadius: '12px',
          border: '1px solid #93C5FD'
        }}>
          <h3 style={{
            margin: '0 0 12px 0',
            fontSize: '16px',
            fontWeight: 600,
            color: '#1E40AF'
          }}>
            ✅ Approval Details
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
            fontSize: '14px',
            color: '#1E3A8A'
          }}>
            <div>
              <strong>Status:</strong> {schedule.status}
            </div>
            {schedule.approvedAt && (
              <div>
                <strong>Approved On:</strong> {new Date(schedule.approvedAt).toLocaleDateString()}
              </div>
            )}
            <div>
              <strong>Schedule Type:</strong> {schedule.scheduleType}
            </div>
          </div>
        </div>
      )}

      {/* Additional Information */}
      <div style={{
        padding: '20px',
        backgroundColor: '#FEF3C7',
        borderRadius: '12px',
        border: '1px solid #FDE68A'
      }}>
        <h3 style={{
          margin: '0 0 12px 0',
          fontSize: '16px',
          fontWeight: 600,
          color: '#92400E'
        }}>
          📋 Quick Details
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px',
          fontSize: '14px',
          color: '#78350F'
        }}>
          <div>
            <strong>Schedule ID:</strong> {schedule._id}
          </div>
          <div>
            <strong>Created:</strong> {new Date(schedule.createdAt).toLocaleDateString()}
          </div>
          <div>
            <strong>Status:</strong> {new Date(schedule.date) > new Date() ? 'Upcoming' : 'Completed'}
          </div>
        </div>
      </div>
    </div>
  );

  // If in detailed view mode, show DetailedView component
  if (viewMode === 'detailed' && selectedSchedule) {
    return (
      <DetailedView
        item={selectedSchedule}
        onBack={handleBackToGrid}
        breadcrumbs={[
          { label: 'Dashboard', path: '/' },
          { label: 'Schedules', path: '/schedules' },
          { label: selectedSchedule.title, path: '#' }
        ]}
        renderContent={renderDetailedContent}
        enableComments={true}
        enableRating={true}
        type="schedule"
      />
    );
  }

  // Main Grid View
  return (
    <>
      {/* Schedule Grid - Shows ALL */}
      <div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '16px',
          }}
        >
          {displayedSchedules.length === 0 ? (
            <div
              style={{
                background: '#fff',
                padding: '40px 20px',
                borderRadius: '12px',
                textAlign: 'center',
                gridColumn: '1 / -1',
                color: '#6B7280'
              }}
            >
              <p style={{ margin: 0, fontSize: '16px' }}>No schedules found</p>
            </div>
          ) : (
            displayedSchedules.map((schedule) => (
              <div key={schedule._id}>
                {renderScheduleCard(schedule, true)}
              </div>
            ))
          )}
        </div>

        {/* View More Button - Hidden since showing all */}
        {hasMoreSchedules && (
          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <button
              onClick={handleViewMore}
              style={{
                padding: '12px 24px',
                backgroundColor: '#FFFFFF',
                color: '#10B981',
                border: '2px solid #10B981',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#10B981';
                e.currentTarget.style.color = '#FFFFFF';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.color = '#10B981';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              View More Schedules ({sortedSchedules.length - 2} more)
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* View More Modal */}
      <ViewMoreModal
        items={sortedSchedules}
        isOpen={showViewMore}
        onClose={handleBackToGrid}
        breadcrumbs={[
          { label: 'Dashboard', path: '/' },
          { label: 'All Schedules', path: '/schedules' }
        ]}
        title="All Schedules"
        renderCard={(schedule) => renderScheduleCard(schedule, false)}
        onCardClick={handleViewDetails}
      />
    </>
  );
};

export default ScheduleCardSection;
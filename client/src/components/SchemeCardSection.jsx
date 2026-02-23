import React, { useState } from 'react';
import { Eye, ChevronRight, Calendar, Clock, MapPin } from 'lucide-react';
import DetailedView from './DetailedView';
import ViewMoreModal from './ViewMoreModal';

/**
 * EVENT CARD SECTION COMPONENT
 * Same pattern as ProjectCardSection but for Scheme
 */
const SchemeCardSection = ({ data }) => {
  // State management
  const [viewMode, setViewMode] = useState('grid');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showViewMore, setShowViewMore] = useState(false);

  // Process scheme
  const scheme = data?.schemes || [];
  const sortedScheme = [...scheme].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  // Show only first 2 schemes in main view
  const displayedScheme = sortedScheme.slice(0, 4);
  const hasMoreScheme = sortedScheme.length > 4;

  // Handlers
  const handleViewDetails = (scheme) => {
    setSelectedEvent(scheme);
    setViewMode('detailed');
  };

  const handleViewMore = () => {
    setShowViewMore(true);
  };

  const handleBackToGrid = () => {
    setViewMode('grid');
    setSelectedEvent(null);
    setShowViewMore(false);
  };

  // Render Event Card
  const renderEventCard = (scheme, showViewButton = true) => (
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
      }}
      onClick={() => !showViewButton && handleViewDetails(scheme)}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
       <div >
        <img src={`${scheme.imageUrl}` } style={{
    width: "100%",
    height: "180px",
    objectFit: "cover",
    borderRadius: "8px",
    marginBottom: "10px",
    display: "block",
  }}/>
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
        {scheme.description}
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
          <Calendar size={16} color="#3B82F6" />
          <span style={{ fontSize: '14px', color: '#374151', fontWeight: 500 }}>
            {new Date(scheme.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={16} color="#8B5CF6" />
          <span style={{ fontSize: '14px', color: '#374151' }}>
            {scheme.time}
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
            {scheme.venue}
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
          backgroundColor: '#EDE9FE',
          color: '#6B21A8',
          textTransform: 'capitalize'
        }}
      >
        {scheme.scheduleType}
      </span>

      {/* Description */}
      {scheme.description && (
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
          {scheme.description}
        </p>
      )}

      {/* View Details Button */}
      {showViewButton && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleViewDetails(scheme);
          }}
          style={{
            marginTop: 'auto',
            padding: '10px 16px',
            backgroundColor: '#8B5CF6',
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
            e.currentTarget.style.backgroundColor = '#7C3AED';
            e.currentTarget.style.transform = 'scale(1.02)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#8B5CF6';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <Eye size={16} />
          View Details
        </button>
      )}
    </div>
  );

  // Render Detailed Event Content
  const renderDetailedContent = (scheme) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <h1 style={{
          margin: '0 0 16px 0',
          fontSize: '32px',
          fontWeight: 700,
          color: '#111827'
        }}>
          {scheme.title}
        </h1>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: 500,
              backgroundColor: '#EDE9FE',
              color: '#6B21A8',
              textTransform: 'capitalize'
            }}
          >
            {scheme.scheduleType}
          </span>
        </div>
      </div>

      {/* Event Details Card */}
      <div style={{
        padding: '24px',
        backgroundColor: '#F5F3FF',
        borderRadius: '12px',
        border: '2px solid #DDD6FE'
      }}>
        <h3 style={{
          margin: '0 0 16px 0',
          fontSize: '14px',
          fontWeight: 500,
          color: '#6B21A8',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          📅 Event Information
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
              color: '#7C3AED',
              marginBottom: '4px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Date
            </div>
            <div style={{ 
              fontSize: '18px', 
              fontWeight: 600, 
              color: '#5B21B6',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Calendar size={20} color="#7C3AED" />
              {new Date(scheme.date).toLocaleDateString('en-US', {
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
              color: '#7C3AED',
              marginBottom: '4px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Time
            </div>
            <div style={{ 
              fontSize: '18px', 
              fontWeight: 600, 
              color: '#5B21B6',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Clock size={20} color="#7C3AED" />
              {scheme.time}
            </div>
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <div style={{
              fontSize: '12px',
              fontWeight: 500,
              color: '#7C3AED',
              marginBottom: '4px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Venue
            </div>
            <div style={{ 
              fontSize: '18px', 
              fontWeight: 600, 
              color: '#5B21B6',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <MapPin size={20} color="#7C3AED" />
              {scheme.venue}
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      {scheme.description && (
        <div>
          <h3 style={{
            margin: '0 0 12px 0',
            fontSize: '18px',
            fontWeight: 600,
            color: '#111827'
          }}>
            Event Description
          </h3>
          <p style={{
            margin: 0,
            fontSize: '16px',
            lineHeight: '1.7',
            color: '#374151'
          }}>
            {scheme.description}
          </p>
        </div>
      )}

      {/* Additional Information */}
      <div style={{
        padding: '20px',
        backgroundColor: '#FEF3C7',
        borderRadius: '12px',
        border: '1px solid #FDE68A',
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
            <strong>Schedule Type:</strong> {scheme.scheduleType}
          </div>
          <div>
            <strong>Event ID:</strong> {scheme._id}
          </div>
          <div>
            <strong>Status:</strong> {new Date(scheme.date) > new Date() ? 'Upcoming' : 'Completed'}
          </div>
        </div>
      </div>
    </div>
  );

  // If in detailed view mode, show DetailedView component
  if (viewMode === 'detailed' && selectedEvent) {
    return (
      <DetailedView
        item={selectedEvent}
        onBack={handleBackToGrid}
        breadcrumbs={[
          { label: 'Dashboard', path: '/' },
          { label: 'Scheme', path: '/schemes' },
          { label: selectedEvent.title, path: '#' }
        ]}
        renderContent={renderDetailedContent}
        enableComments={true}
        enableRating={true}
        type="scheme"
      />
    );
  }

  // Main Grid View
  return (
    <>
      {/* Event Grid - Shows only first 2 */}
      <div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '16px',
          }}
        >
          {displayedScheme.length === 0 ? (
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
              <p style={{ margin: 0, fontSize: '16px' }}>No schemes found</p>
            </div>
          ) : (
            displayedScheme.map((scheme) => (
              <div key={scheme._id}>
                {renderEventCard(scheme, true)}
              </div>
            ))
          )}
        </div>

        {/* View More Button */}
        {hasMoreScheme && (
          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <button
              onClick={handleViewMore}
              style={{
                padding: '12px 24px',
                backgroundColor: '#FFFFFF',
                color: '#8B5CF6',
                border: '2px solid #8B5CF6',
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
                e.currentTarget.style.backgroundColor = '#8B5CF6';
                e.currentTarget.style.color = '#FFFFFF';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.color = '#8B5CF6';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              View More Scheme ({sortedScheme.length - 2} more)
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* View More Modal */}
      <ViewMoreModal
        items={sortedScheme}
        isOpen={showViewMore}
        onClose={handleBackToGrid}
        breadcrumbs={[
          { label: 'Dashboard', path: '/' },
          { label: 'All Scheme', path: '/schemes' }
        ]}
        title="All Scheme"
        renderCard={(scheme) => renderEventCard(scheme, false)}
        onCardClick={handleViewDetails}
      />
    </>
  );
};

export default SchemeCardSection;
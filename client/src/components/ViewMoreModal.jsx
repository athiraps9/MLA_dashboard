import React from 'react';
import { ArrowLeft, X } from 'lucide-react';

/**
 * Reusable ViewMore Component (Modal/Full Screen)
 * Props:
 * - items: Array of items to display
 * - isOpen: Boolean to control visibility
 * - onClose: Function to call when closing
 * - breadcrumbs: Array of breadcrumb items
 * - title: Title for the view
 * - renderCard: Function to render each card
 * - onCardClick: Function to handle card click
 */
const ViewMoreModal = ({
  items = [],
  isOpen,
  onClose,
  breadcrumbs = [],
  title = 'All Items',
  renderCard,
  onCardClick
}) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#F9FAFB',
      zIndex: 1000,
      overflowY: 'auto'
    }}>
      {/* Header */}
      <div style={{
        position: 'sticky',
        top: 0,
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E5E7EB',
        zIndex: 10,
        padding: '16px 24px'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ flex: 1 }}>
            {/* Back Button */}
            <button
              onClick={onClose}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                backgroundColor: 'transparent',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 500,
                color: '#374151',
                marginBottom: '12px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F3F4F6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <ArrowLeft size={16} />
              Back
            </button>

            {/* Breadcrumb */}
            <nav style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              color: '#6B7280'
            }}>
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <span>/</span>}
                  <span style={{
                    color: index === breadcrumbs.length - 1 ? '#111827' : '#6B7280',
                    fontWeight: index === breadcrumbs.length - 1 ? 600 : 400
                  }}>
                    {crumb.label}
                  </span>
                </React.Fragment>
              ))}
            </nav>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            style={{
              padding: '8px',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              color: '#6B7280',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F3F4F6';
              e.currentTarget.style.color = '#111827';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#6B7280';
            }}
          >
            <X size={24} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '24px'
      }}>
        {/* Title */}
        <div style={{
          marginBottom: '24px'
        }}>
          <h2 style={{
            margin: '0 0 8px 0',
            fontSize: '24px',
            fontWeight: 700,
            color: '#111827'
          }}>
            {title}
          </h2>
          <p style={{
            margin: 0,
            fontSize: '14px',
            color: '#6B7280'
          }}>
            Showing {items.length} item{items.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '16px'
        }}>
          {items.length === 0 ? (
            <div style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              padding: '48px',
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              color: '#6B7280'
            }}>
              No items found
            </div>
          ) : (
            items.map((item, index) => (
              <div
                key={item._id || index}
                onClick={() => onCardClick && onCardClick(item)}
                style={{ cursor: onCardClick ? 'pointer' : 'default' }}
              >
                {renderCard(item)}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewMoreModal;
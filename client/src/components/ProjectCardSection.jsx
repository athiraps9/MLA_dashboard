import React, { useState } from 'react';
import { Eye, ChevronRight } from 'lucide-react';
import DetailedView from './DetailedView'; // Your existing component
import ViewMoreModal from './ViewMoreModal'; // Your existing component

/**
 * UPDATED PROJECT SECTION COMPONENT
 * Replace your existing project display code with this
 */
const ProjectCardSection = ({ data }) => {
  // State management
  const [viewMode, setViewMode] = useState('grid'); // 'grid', 'detailed'
  const [selectedProject, setSelectedProject] = useState(null);
  const [showViewMore, setShowViewMore] = useState(false);

  console.log("project section *****",data,'****');
  // Process projects
  const projects = data?.projects || [];
  
  const sortedProjects = [...projects].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  // Show only first 2 projects in main view
  const displayedProjects = sortedProjects.slice(0, 2);
  const hasMoreProjects = sortedProjects.length > 2;

  // Handlers
  const handleViewDetails = (project) => {
    setSelectedProject(project);
    setViewMode('detailed');
  };

  const handleViewMore = () => {
    setShowViewMore(true);
  };

  const handleBackToGrid = () => {
    setViewMode('grid');
    setSelectedProject(null);
    setShowViewMore(false);
  };

  // Render Project Card
  const renderProjectCard = (project, showViewButton = true) => (
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
        cursor: showViewButton ? 'default' : 'pointer'
      }}
      onClick={() => !showViewButton && handleViewDetails(project)}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Title */}
      <h4 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#111827' }}>
        {project.title}
      </h4>

      {/* Description */}
      <p style={{
        margin: 0,
        color: '#6B7280',
        fontSize: '0.9rem',
        lineHeight: '1.5',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
      }}>
        {project.description}
      </p>

      {/* Allocated */}
      <div style={{ fontWeight: 600, fontSize: '20px', color: '#111827' }}>
        ₹{(project.fundsAllocated || 0).toLocaleString()}
      </div>

      {/* Status */}
      <span
        style={{
          alignSelf: 'flex-start',
          padding: '4px 10px',
          borderRadius: '8px',
          fontSize: '0.75rem',
          fontWeight: 500,
          backgroundColor:
            project.status === 'approved'
              ? '#DCFCE7'
              : project.status === 'pending'
              ? '#FEF3C7'
              : '#FEE2E2',
          color:
            project.status === 'approved'
              ? '#166534'
              : project.status === 'pending'
              ? '#92400E'
              : '#991B1B',
        }}
      >
        {project.status}
      </span>

      {/* Dates */}
      <div
        style={{
          fontSize: '0.8rem',
          color: '#6B7280',
          display: 'flex',
          justifyContent: 'space-between',
          paddingTop: '8px',
          borderTop: '1px solid #E5E7EB'
        }}
      >
        <span>
          Start:{' '}
          {project.startDate
            ? new Date(project.startDate).toLocaleDateString()
            : '-'}
        </span>
        <span>
          Created:{' '}
          {new Date(project.createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* View Details Button */}
      {showViewButton && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleViewDetails(project);
          }}
          style={{
            marginTop: '8px',
            padding: '10px 16px',
            backgroundColor: '#3B82F6',
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
            e.currentTarget.style.backgroundColor = '#2563EB';
            e.currentTarget.style.transform = 'scale(1.02)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#3B82F6';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <Eye size={16} />
          View Details
        </button>
      )}
    </div>
  );

  // Render Detailed Project Content
  const renderDetailedContent = (project) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <h1 style={{
          margin: '0 0 12px 0',
          fontSize: '32px',
          fontWeight: 700,
          color: '#111827'
        }}>
          {project.title}
        </h1>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: 500,
              backgroundColor:
                project.status === 'approved'
                  ? '#DCFCE7'
                  : project.status === 'pending'
                  ? '#FEF3C7'
                  : '#FEE2E2',
              color:
                project.status === 'approved'
                  ? '#166534'
                  : project.status === 'pending'
                  ? '#92400E'
                  : '#991B1B',
            }}
          >
            {project.status.toUpperCase()}
          </span>
          <span style={{ fontSize: '14px', color: '#6B7280' }}>
            Created: {new Date(project.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        </div>
      </div>

      {/* Funding Information */}
      <div style={{
        padding: '24px',
        backgroundColor: '#F0F9FF',
        borderRadius: '12px',
        border: '2px solid #BFDBFE'
      }}>
        <h3 style={{
          margin: '0 0 8px 0',
          fontSize: '14px',
          fontWeight: 500,
          color: '#1E40AF',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          Allocated Funds
        </h3>
        <div style={{
          fontSize: '36px',
          fontWeight: 700,
          color: '#1E3A8A'
        }}>
          ₹{(project.fundsAllocated || 0).toLocaleString('en-IN')}
        </div>
      </div>

      {/* Description */}
      <div>
        <h3 style={{
          margin: '0 0 12px 0',
          fontSize: '18px',
          fontWeight: 600,
          color: '#111827'
        }}>
          Project Description
        </h3>
        <p style={{
          margin: 0,
          fontSize: '16px',
          lineHeight: '1.7',
          color: '#374151'
        }}>
          {project.description}
        </p>
      </div>

      {/* Timeline */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px'
      }}>
        <div style={{
          padding: '16px',
          backgroundColor: '#F9FAFB',
          borderRadius: '12px',
          border: '1px solid #E5E7EB'
        }}>
          <div style={{
            fontSize: '12px',
            fontWeight: 500,
            color: '#6B7280',
            marginBottom: '4px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Start Date
          </div>
          <div style={{ fontSize: '16px', fontWeight: 600, color: '#111827' }}>
            {project.startDate
              ? new Date(project.startDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })
              : 'Not specified'}
          </div>
        </div>

        <div style={{
          padding: '16px',
          backgroundColor: '#F9FAFB',
          borderRadius: '12px',
          border: '1px solid #E5E7EB'
        }}>
          <div style={{
            fontSize: '12px',
            fontWeight: 500,
            color: '#6B7280',
            marginBottom: '4px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Project ID
          </div>
          <div style={{ fontSize: '16px', fontWeight: 600, color: '#111827' }}>
            {project._id}
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div style={{
        padding: '20px',
        backgroundColor: '#FFFBEB',
        borderRadius: '12px',
        border: '1px solid #FDE68A'
      }}>
        <h3 style={{
          margin: '0 0 12px 0',
          fontSize: '16px',
          fontWeight: 600,
          color: '#92400E'
        }}>
          📋 Project Information
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px',
          fontSize: '14px',
          color: '#78350F'
        }}>
          <div>
            <strong>Status:</strong> {project.status}
          </div>
          <div>
            <strong>Budget:</strong> ₹{(project.fundsAllocated || 0).toLocaleString('en-IN')}
          </div>
          <div>
            <strong>Duration:</strong> {project.startDate ? 'In Progress' : 'Not Started'}
          </div>
        </div>
      </div>
    </div>
  );

  // If in detailed view mode, show DetailedView component
  if (viewMode === 'detailed' && selectedProject) {
    return (
      <DetailedView
        item={selectedProject}
        onBack={handleBackToGrid}
        breadcrumbs={[
          { label: 'Dashboard', path: '/' },
          { label: 'Projects', path: '/projects' },
          { label: selectedProject.title, path: '#' }
        ]}
        renderContent={renderDetailedContent}
        enableComments={true}
        enableRating={true}
        type="project"
      />
    );
  }

  // Main Grid View
  return (
    <>
      {/* Project Grid - Shows only first 2 */}
      <div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '16px',
          }}
        >
          {displayedProjects.length === 0 ? (
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
              <p style={{ margin: 0, fontSize: '16px' }}>No projects found</p>
            </div>
          ) : (
            displayedProjects.map((project) => (
              <div key={project._id}>
                {renderProjectCard(project, true)}
              </div>
            ))
          )}
        </div>

        {/* View More Button */}
        {hasMoreProjects && (
          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <button
              onClick={handleViewMore}
              style={{
                padding: '12px 24px',
                backgroundColor: '#FFFFFF',
                color: '#3B82F6',
                border: '2px solid #3B82F6',
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
                e.currentTarget.style.backgroundColor = '#3B82F6';
                e.currentTarget.style.color = '#FFFFFF';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.color = '#3B82F6';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              View More Projects ({sortedProjects.length - 2} more)
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* View More Modal */}
      <ViewMoreModal
        items={sortedProjects}
        isOpen={showViewMore}
        onClose={handleBackToGrid}
        breadcrumbs={[
          { label: 'Dashboard', path: '/' },
          { label: 'All Projects', path: '/projects' }
        ]}
        title="All Projects"
        renderCard={(project) => renderProjectCard(project, false)}
        onCardClick={handleViewDetails}
      />
    </>
  );
};

export default ProjectCardSection;
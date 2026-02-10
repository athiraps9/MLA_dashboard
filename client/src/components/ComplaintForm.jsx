import React, { useState } from 'react';
import { Send } from 'lucide-react';

/**
 * SIMPLE COMPLAINT FORM
 * Inline form for PublicDashboard - Title, Description, Submit Button
 */
const ComplaintForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    // Clear success message when editing
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  // Validate form
  const validate = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    setErrors({});
    
    try {
      await onSubmit({
        title: formData.title.trim(),
        description: formData.description.trim()
      });
      
      // Reset form on success
      setFormData({ title: '', description: '' });
      setSuccessMessage('✅ Complaint submitted successfully!');
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      
    } catch (error) {
      console.error('Error submitting complaint:', error);
      setErrors({ submit: 'Failed to submit complaint. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      {/* Header */}
      <h2 style={{
        margin: '0 0 8px 0',
        fontSize: '24px',
        fontWeight: 700,
        color: '#111827'
      }}>
        Submit a Complaint
      </h2>
      <p style={{
        margin: '0 0 24px 0',
        fontSize: '14px',
        color: '#6B7280'
      }}>
        Have an issue or concern? Let us know and we'll address it.
      </p>

      {/* Success Message */}
      {successMessage && (
        <div style={{
          padding: '12px 16px',
          marginBottom: '20px',
          backgroundColor: '#D1FAE5',
          border: '1px solid #6EE7B7',
          borderRadius: '8px',
          color: '#065F46',
          fontSize: '14px',
          fontWeight: 500
        }}>
          {successMessage}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        {/* Title Field */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '14px',
            fontWeight: 500,
            color: '#374151'
          }}>
            Title <span style={{ color: '#EF4444' }}>*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter complaint title"
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '14px',
              border: `1px solid ${errors.title ? '#EF4444' : '#D1D5DB'}`,
              borderRadius: '8px',
              outline: 'none',
              transition: 'all 0.2s',
              fontFamily: 'inherit',
              backgroundColor: isSubmitting ? '#F9FAFB' : '#FFFFFF'
            }}
            onFocus={(e) => {
              if (!errors.title) {
                e.currentTarget.style.borderColor = '#3B82F6';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = errors.title ? '#EF4444' : '#D1D5DB';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
          {errors.title && (
            <p style={{
              margin: '4px 0 0 0',
              fontSize: '12px',
              color: '#EF4444'
            }}>
              {errors.title}
            </p>
          )}
        </div>

        {/* Description Field */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '14px',
            fontWeight: 500,
            color: '#374151'
          }}>
            Description <span style={{ color: '#EF4444' }}>*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your complaint in detail..."
            rows={5}
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '14px',
              border: `1px solid ${errors.description ? '#EF4444' : '#D1D5DB'}`,
              borderRadius: '8px',
              outline: 'none',
              transition: 'all 0.2s',
              fontFamily: 'inherit',
              resize: 'vertical',
              backgroundColor: isSubmitting ? '#F9FAFB' : '#FFFFFF'
            }}
            onFocus={(e) => {
              if (!errors.description) {
                e.currentTarget.style.borderColor = '#3B82F6';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = errors.description ? '#EF4444' : '#D1D5DB';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
          {errors.description && (
            <p style={{
              margin: '4px 0 0 0',
              fontSize: '12px',
              color: '#EF4444'
            }}>
              {errors.description}
            </p>
          )}
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div style={{
            padding: '12px 16px',
            marginBottom: '20px',
            backgroundColor: '#FEE2E2',
            border: '1px solid #FCA5A5',
            borderRadius: '8px',
            color: '#991B1B',
            fontSize: '14px'
          }}>
            {errors.submit}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: '100%',
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: 600,
            color: '#FFFFFF',
            backgroundColor: isSubmitting ? '#9CA3AF' : '#EF4444',
            border: 'none',
            borderRadius: '8px',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
          onMouseEnter={(e) => {
            if (!isSubmitting) {
              e.currentTarget.style.backgroundColor = '#DC2626';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = isSubmitting ? '#9CA3AF' : '#EF4444';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {isSubmitting ? (
            <>
              <div style={{
                width: '16px',
                height: '16px',
                border: '2px solid #FFFFFF',
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              Submitting...
            </>
          ) : (
            <>
              <Send size={20} />
              Submit Complaint
            </>
          )}
        </button>
      </form>

      {/* Spinner Animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ComplaintForm;
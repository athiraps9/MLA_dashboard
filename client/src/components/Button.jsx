import React from 'react';
import '../styles/variables.css';

const Button = ({ children, onClick, variant = 'primary', type = 'button', disabled = false, style = {} }) => {
    const getBackgroundColor = () => {
        if (disabled) return 'var(--text-secondary)';
        switch (variant) {
            case 'secondary': return 'transparent';
            case 'danger': return 'var(--danger-color)';
            case 'success': return 'var(--success-color)';
            default: return 'var(--primary-color)';
        }
    };

    const getTextColor = () => {
        if (variant === 'secondary') return 'var(--primary-color)';
        return 'white';
    };

    const buttonStyle = {
        padding: 'var(--spacing-sm) var(--spacing-md)',
        borderRadius: 'var(--radius-sm)',
        border: variant === 'secondary' ? '1px solid var(--primary-color)' : 'none',
        backgroundColor: getBackgroundColor(),
        color: getTextColor(),
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.7 : 1,
        fontSize: '1rem',
        fontWeight: 500,
        transition: 'opacity 0.2s',
        ...style
    };

    return (
        <button type={type} onClick={onClick} disabled={disabled} style={buttonStyle}>
            {children}
        </button>
    );
};

export default Button;

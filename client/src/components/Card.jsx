import React from 'react';
import '../styles/variables.css';

const styles = {
    card: {
        backgroundColor: 'var(--surface-color)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-md)',
        padding: 'var(--spacing-lg)',
        border: '1px solid var(--border-color)',
        marginBottom: 'var(--spacing-md)'
    },
    title: {
        marginBottom: 'var(--spacing-md)',
        borderBottom: '1px solid var(--secondary-color)',
        paddingBottom: 'var(--spacing-sm)',
        fontSize: '1.25rem'
    }
};

const Card = ({ title, children, style = {} }) => {
    return (
        <div style={{ ...styles.card, ...style }}>
            {title && <h3 style={styles.title}>{title}</h3>}
            {children}
        </div>
    );
};

export default Card;

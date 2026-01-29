import React from 'react';
import { Construction } from 'lucide-react';

const PlaceholderScreen = ({ name }) => {
    return (
        <div className="card fade-in" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px 20px',
            textAlign: 'center'
        }}>
            <div style={{
                width: '64px',
                height: '64px',
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px'
            }}>
                <Construction size={32} />
            </div>
            <h2 style={{ marginBottom: '12px' }}>{name} Page</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '400px' }}>
                We're currently working on the <strong>{name}</strong> screen. This feature will be available in the next update or can be customized as per requirements.
            </p>
        </div>
    );
};

export default PlaceholderScreen;

import React from 'react';
import { testSupabaseConnection } from '../utils/supabaseTest';
import { Database } from 'lucide-react';

const SupabaseTestButton = () => {
    return (
        <button
            onClick={testSupabaseConnection}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                backgroundColor: '#3ECF8E', // Supabase Green
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                transition: 'all 0.2s ease',
                fontSize: '14px'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
            <Database size={16} />
            Test Supabase Connection
        </button>
    );
};

export default SupabaseTestButton;

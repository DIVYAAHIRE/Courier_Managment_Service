import React, { useState } from 'react';
import {
    Plus,
    Search,
    Filter,
    Download,
    Clock,
    ExternalLink,
    CheckCircle2,
    Clock4
} from 'lucide-react';
import './DispatchEntry.css';

const DispatchEntry = () => {
    // Mock DB simulating data from Cash/Account Entry
    const MOCK_DB = {
        'DT123456789': { weight: '500 gm', date: '2026-01-28', service: 'Standard' },
        'DT987654321': { weight: '2 kg', date: '2026-01-27', service: 'Standard' },
        'ACC8822001': { weight: '250 gm', date: '2026-01-28', service: 'DTDC' },
        'ACC8822002': { weight: '1.5 kg', date: '2026-01-27', service: 'Blue Dart' },
        'ACC8822003': { weight: '100 gm', date: '2026-01-26', service: 'Professional' }
    };

    const [docketNo, setDocketNo] = useState('');
    const [fetchedData, setFetchedData] = useState({ weight: '', date: '', service: '' });
    const [dispatchTime, setDispatchTime] = useState('Noon');
    const [isConfirming, setIsConfirming] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    // Sample existing data mapped to new structure
    const [dispatches, setDispatches] = useState([
        { date: '2026-01-28', docket: 'DT123456789', weight: '500 gm', service: 'Standard', time: 'Noon' },
        { date: '2026-01-27', docket: 'DT987654321', weight: '2.0 kg', service: 'Standard', time: 'Night' },
        { date: '2026-01-28', docket: 'ACC8822001', weight: '250 gm', service: 'DTDC', time: 'Noon' },
        { date: '2026-01-27', docket: 'ACC8822002', weight: '1.5 kg', service: 'Blue Dart', time: 'Night' },
        { date: '2026-01-26', docket: 'ACC8822003', weight: '100 gm', service: 'Professional', time: 'Noon' },
        { date: '2026-01-28', docket: 'DK-2045', weight: '2.5 kg', service: 'Express', time: 'Night' },
        { date: '2026-01-28', docket: 'DK-2046', weight: '0.5 kg', service: 'Standard', time: 'Noon' },
    ]);

    const handleDocketChange = (e) => {
        const val = e.target.value;
        setDocketNo(val);
        if (MOCK_DB[val]) {
            setFetchedData(MOCK_DB[val]);
        } else {
            setFetchedData({ weight: '', date: '', service: '' });
        }
    };

    const handleConfirmDispatch = () => {
        // Validation
        if (!docketNo || !fetchedData.weight || !fetchedData.service) {
            alert("Please enter a valid Docket No to fetch details.");
            return;
        }

        setIsConfirming(true);

        // Simulate API call / Processing delay
        setTimeout(() => {
            const newDispatch = {
                date: fetchedData.date,
                docket: docketNo,
                weight: fetchedData.weight,
                service: fetchedData.service,
                time: dispatchTime
            };

            // Add to table (Locking row)
            setDispatches(prev => [newDispatch, ...prev]);

            // Clear inputs
            setDocketNo('');
            setFetchedData({ weight: '', date: '', service: '' });
            setDispatchTime('Noon');

            // Success Feedback
            setSuccessMsg('Dispatch confirmed successfully');
            setIsConfirming(false);

            // Hide success message after 3 seconds
            setTimeout(() => setSuccessMsg(''), 3000);
        }, 800);
    };

    return (
        <div className="dispatch-container fade-in">
            <div className="page-header">
                <div className="header-info">
                    <h2>Dispatch Management</h2>
                    <p>Monitor and manage daily dispatch operations</p>
                </div>
                <div className="header-actions" style={{ position: 'relative' }}>
                    {successMsg && (
                        <div className="success-toast fade-in" style={{
                            position: 'absolute',
                            right: '100%',
                            marginRight: '15px',
                            background: '#dcfce7',
                            color: '#166534',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            fontSize: '13px',
                            fontWeight: '600',
                            whiteSpace: 'nowrap',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                        }}>
                            <CheckCircle2 size={14} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '5px' }} />
                            {successMsg}
                        </div>
                    )}
                    <button
                        className="btn btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: isConfirming ? 0.7 : 1 }}
                        onClick={handleConfirmDispatch}
                        disabled={isConfirming}
                    >
                        {isConfirming ? <Clock size={18} className="spin-anim" /> : <CheckCircle2 size={18} />}
                        Confirm Dispatch
                    </button>
                </div>
            </div>

            {/* Input Section */}
            <div className="card" style={{ marginBottom: '20px', padding: '24px' }}>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    <div className="input-group" style={{ flex: '1 1 180px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px', color: '#1e293b' }}>Docket No</label>
                        <div className="search-box" style={{ margin: 0, height: '42px' }}>
                            <Search size={18} />
                            <input
                                type="text"
                                placeholder="Enter Docket No"
                                value={docketNo}
                                onChange={handleDocketChange}
                                style={{ height: '100%' }}
                            />
                        </div>
                    </div>

                    <div className="input-group" style={{ flex: '1 1 150px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px', color: '#1e293b' }}>Weight</label>
                        <input
                            type="text"
                            style={{ width: '100%', height: '42px', padding: '0 12px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '14px' }}
                            value={fetchedData.weight}
                            readOnly
                            placeholder="Auto-fetch"
                        />
                    </div>

                    <div className="input-group" style={{ flex: '1 1 150px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px', color: '#1e293b' }}>Date</label>
                        <input
                            type="text"
                            style={{ width: '100%', height: '42px', padding: '0 12px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '14px' }}
                            value={fetchedData.date}
                            readOnly
                            placeholder="Auto-fetch"
                        />
                    </div>

                    <div className="input-group" style={{ flex: '1 1 180px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px', color: '#1e293b' }}>Service Name</label>
                        <input
                            type="text"
                            style={{ width: '100%', height: '42px', padding: '0 12px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '14px' }}
                            value={fetchedData.service}
                            readOnly
                            placeholder="Auto-fetch"
                        />
                    </div>

                    <div className="input-group" style={{ flex: '1 1 150px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px', color: '#1e293b' }}>Dispatch Time</label>
                        <select
                            style={{ width: '100%', height: '42px', padding: '0 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', backgroundColor: '#fff' }}
                            value={dispatchTime}
                            onChange={(e) => setDispatchTime(e.target.value)}
                        >
                            <option value="Noon">Noon</option>
                            <option value="Night">Night</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="card table-card">
                <table className="dispatch-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Docket No</th>
                            <th>Weight</th>
                            <th>Service Name</th>
                            <th>Dispatch Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dispatches.map((item, idx) => (
                            <tr key={idx}>
                                <td>{item.date}</td>
                                <td className="docket-no">{item.docket}</td>
                                <td>{item.weight}</td>
                                <td>
                                    <span className={`service-tag ${item.service.toLowerCase().replace(' ', '-')}`}>
                                        {item.service}
                                    </span>
                                </td>
                                <td>
                                    <div className="time-info">
                                        <Clock size={14} />
                                        {item.time}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DispatchEntry;

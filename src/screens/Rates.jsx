import React, { useState } from 'react';
import {
    Plus,
    Save,
    Trash2,
    X,
    BadgePercent,
    Search,
    Hash,
    User,
    MapPin,
    Scale,
    IndianRupee
} from 'lucide-react';
import './Rates.css';

const Rates = () => {
    // Mock master data for parties (In real app, fetch from API/Context)
    const MOCK_PARTIES = [
        { id: '101', name: 'ABC Logistics', state: 'Maharashtra' },
        { id: '102', name: 'XYZ Traders', state: 'Maharashtra' },
        { id: '103', name: 'Global Exports', state: 'Maharashtra' },
        { id: '104', name: 'Delhi Traders', state: 'Delhi' }
    ];

    // Mock Data for Rates
    const [rates, setRates] = useState([
        { id: 1, serialNo: 'RT001', partyId: '101', partyName: 'ABC Logistics', state: 'Maharashtra', weight: '500 gm', rate: '50' },
        { id: 2, serialNo: 'RT002', partyId: '102', partyName: 'XYZ Traders', state: 'Maharashtra', weight: '1 kg', rate: '80' }
    ]);

    const [formData, setFormData] = useState({
        id: null,
        serialNo: '',
        partyId: '',
        partyName: '',
        state: '',
        weight: 'Select Weight',
        rate: ''
    });

    const [isFormVisible, setIsFormVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePartyChange = (e) => {
        const selectedPartyId = e.target.value;
        const party = MOCK_PARTIES.find(p => p.id === selectedPartyId);

        if (party) {
            setFormData(prev => ({
                ...prev,
                partyId: party.id,
                partyName: party.name,
                state: party.state
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                partyId: '',
                partyName: '',
                state: ''
            }));
        }
    };

    const handleNew = () => {
        setFormData({
            id: null,
            serialNo: '',
            partyId: '',
            partyName: '',
            state: '',
            weight: 'Select Weight',
            rate: ''
        });
        setIsFormVisible(true);
    };

    // "New" button inside form - clears form but stays in form view
    const handleClearForm = () => {
        setFormData({
            id: null,
            serialNo: '',
            partyId: '',
            partyName: '',
            state: '',
            weight: 'Select Weight',
            rate: ''
        });
    };

    const handleSave = () => {
        if (!formData.serialNo || !formData.partyId || !formData.rate) {
            alert('Serial No, Party and Rate are required!');
            return;
        }

        // Check if Serial No already exists to determine Update vs Create
        const existingIndex = rates.findIndex(r => r.serialNo === formData.serialNo);

        if (existingIndex >= 0) {
            // Update existing based on Serial No
            const updatedRates = [...rates];
            updatedRates[existingIndex] = { ...formData, id: rates[existingIndex].id }; // Keep original ID
            setRates(updatedRates);
        } else {
            // Create new
            const newId = rates.length > 0 ? Math.max(...rates.map(r => r.id)) + 1 : 1;
            setRates(prev => [...prev, { ...formData, id: newId }]);
        }
    };

    const handleRemove = () => {
        if (!formData.serialNo) return;

        if (window.confirm('Are you sure you want to remove this Rate?')) {
            setRates(prev => prev.filter(r => r.serialNo !== formData.serialNo));
            handleClose(); // Close form after delete
        }
    };

    const handleClose = () => {
        setIsFormVisible(false);
        handleClearForm();
    };

    const handleRowClick = (rateItem) => {
        setFormData(rateItem);
        setIsFormVisible(true);
    };

    const filteredRates = rates.filter(item =>
        item.partyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.serialNo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="rates-container fade-in">
            <div className="page-header">
                <div className="header-info">
                    <h2>Rate Management</h2>
                    <p>Define rates for parties based on weight and region</p>
                </div>
                {!isFormVisible && (
                    <button className="btn btn-primary" onClick={handleNew}>
                        <Plus size={18} />
                        Add Rate
                    </button>
                )}
            </div>

            <div className="content-wrapper">
                {isFormVisible ? (
                    <div className="form-card fade-in">
                        <div className="form-header">
                            <h3>{formData.serialNo ? 'Edit Rate Details' : 'New Rate Entry'}</h3>
                            <button className="icon-btn" onClick={handleClose}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className="form-grid">
                            <div className="input-group">
                                <label>
                                    <Hash size={14} /> Serial No
                                </label>
                                <input
                                    type="text"
                                    name="serialNo"
                                    value={formData.serialNo}
                                    onChange={handleInputChange}
                                    placeholder="Enter serial number"
                                />
                            </div>

                            <div className="input-group">
                                <label>
                                    <User size={14} /> Party Name
                                </label>
                                <select
                                    name="partyId"
                                    value={formData.partyId}
                                    onChange={handlePartyChange}
                                    className="select-input"
                                >
                                    <option value="">Select Party</option>
                                    {MOCK_PARTIES.map(p => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="input-group">
                                <label>
                                    <MapPin size={14} /> State
                                </label>
                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleInputChange}
                                    placeholder="Auto-filled or Enter State"
                                />
                            </div>

                            <div className="input-group">
                                <label>
                                    <Scale size={14} /> Weight
                                </label>
                                <select
                                    name="weight"
                                    value={formData.weight}
                                    onChange={handleInputChange}
                                    className="select-input"
                                >
                                    <option value="Select Weight">Select Weight</option>
                                    <option value="250 gm">250 gm</option>
                                    <option value="500 gm">500 gm</option>
                                    <option value="1 kg">1 kg</option>
                                    <option value="2 kg">2 kg</option>
                                    <option value="5 kg">5 kg</option>
                                    <option value="10 kg">10 kg</option>
                                </select>
                            </div>

                            <div className="input-group">
                                <label>
                                    <IndianRupee size={14} /> Rate
                                </label>
                                <input
                                    type="number"
                                    name="rate"
                                    value={formData.rate}
                                    onChange={handleInputChange}
                                    placeholder="Enter rate amount"
                                />
                            </div>
                        </div>

                        <div className="form-actions">
                            <button className="btn btn-outline" onClick={handleClearForm}>
                                <Plus size={16} /> New
                            </button>
                            <button className="btn btn-primary" onClick={handleSave}>
                                <Save size={16} /> Save
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={handleRemove}
                                disabled={!formData.serialNo} // Disabled if new entry (no serial no saved yet technically, or just rely on input)
                            >
                                <Trash2 size={16} /> Remove
                            </button>
                            <button className="btn btn-secondary" onClick={handleClose}>
                                <X size={16} /> Close
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="table-card fade-in">
                        <div className="table-header-actions">
                            <div className="search-box">
                                <Search size={18} />
                                <input
                                    type="text"
                                    placeholder="Search party or serial..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '100px' }}>Serial No</th>
                                    <th>Party Name</th>
                                    <th>State</th>
                                    <th>Weight</th>
                                    <th>Rate (₹)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRates.length > 0 ? (
                                    filteredRates.map(item => (
                                        <tr
                                            key={item.id}
                                            onClick={() => handleRowClick(item)}
                                            className={formData.serialNo === item.serialNo ? 'selected-row' : ''}
                                        >
                                            <td style={{ fontWeight: '600', color: 'var(--primary)' }}>{item.serialNo}</td>
                                            <td>{item.partyName}</td>
                                            <td>{item.state}</td>
                                            <td>{item.weight}</td>
                                            <td style={{ fontWeight: '600' }}>₹{item.rate}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
                                            No Rates found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Rates;

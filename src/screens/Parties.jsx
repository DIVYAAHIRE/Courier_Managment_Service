import React, { useState } from 'react';
import {
    Plus,
    Save,
    Trash2,
    X,
    User,
    Phone,
    MapPin,
    Hash,
    Search,
    Building2
} from 'lucide-react';
import './Parties.css';

const Parties = () => {
    // Mock Data
    const [parties, setParties] = useState([
        { id: '101', name: 'xyx chsjsks', phone: '98765', address: '12, Industrial Area, Mumbai 400001', pincode: '400001', gst: '27ABCDE1234F1Z5' },
        { id: '102', name: 'XYZ Traders', phone: '9123456789', address: '56, Market Road, Pune 411001', pincode: '411001', gst: '27XYZDE128' },
        { id: '103', name: 'Global Exports', phone: '9988776655', address: '89, Port Road, Navi Mumbai 400703', pincode: '400703', gst: '27GLOBA1234F1Z2' }
    ]);

    const [formData, setFormData] = useState({
        id: '',
        name: '',
        phone: '',
        address: '',
        pincode: '',
        gst: ''
    });

    const [isFormVisible, setIsFormVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        let newFormData = { ...formData, [name]: value };

        // Auto-fetch Pin Code from Address
        if (name === 'address') {
            const pinMatch = value.match(/\b\d{6}\b/);
            if (pinMatch) {
                newFormData.pincode = pinMatch[0];
            }
        }

        setFormData(newFormData);
    };

    const handleNew = () => {
        setFormData({
            id: '',
            name: '',
            phone: '',
            address: '',
            pincode: '',
            gst: ''
        });
        setIsFormVisible(true);
    };

    const handleSave = () => {
        if (!formData.name || !formData.phone) {
            alert('Name and Phone are required!');
            return;
        }

        if (formData.id) {
            // Update existing
            setParties(prev => prev.map(p => p.id === formData.id ? { ...formData } : p));
        } else {
            // Create new
            const newId = parties.length > 0 ? (parseInt(Math.max(...parties.map(p => parseInt(p.id)))) + 1).toString() : '101';
            const newParty = { ...formData, id: newId };
            setParties(prev => [...prev, newParty]);
            setFormData(newParty); // Update form with new ID
        }
    };

    const handleDelete = () => {
        if (!formData.id) return;

        if (window.confirm('Are you sure you want to delete this Party?')) {
            setParties(prev => prev.filter(p => p.id !== formData.id));
            handleClose(); // Close form after delete
        }
    };

    const handleClose = () => {
        setIsFormVisible(false);
        setFormData({
            id: '',
            name: '',
            phone: '',
            address: '',
            pincode: '',
            gst: ''
        });
    };

    const handleRowClick = (party) => {
        setFormData(party);
        setIsFormVisible(true);
    };

    const filteredParties = parties.filter(party =>
        party.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        party.phone.includes(searchTerm) ||
        party.gst.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="parties-container fade-in">
            <div className="page-header">
                <div className="header-info">
                    <h2>Registered Parties & Clients</h2>
                    <p>Manage list of registered parties and clients</p>
                </div>
                {!isFormVisible && (
                    <button className="btn btn-primary" onClick={handleNew}>
                        <Plus size={18} />
                        Add Party
                    </button>
                )}
            </div>

            <div className="content-wrapper">
                {isFormVisible ? (
                    <div className="form-card fade-in">
                        <div className="form-header">
                            <h3>{formData.id ? 'Edit Party Details' : 'New Party Registration'}</h3>
                            <button className="icon-btn" onClick={handleClose}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className="form-grid">
                            <div className="input-group">
                                <label>
                                    <User size={14} /> Party Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Enter party name"
                                />
                            </div>
                            <div className="input-group">
                                <label>
                                    <Phone size={14} /> Phone Number
                                </label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="Enter phone number"
                                />
                            </div>
                            <div className="input-group full-width">
                                <label>
                                    <MapPin size={14} /> Address
                                </label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    placeholder="Enter full address (e.g. 123 Street, City 400001)"
                                />
                            </div>
                            <div className="input-group">
                                <label>
                                    <Hash size={14} /> Pin Code
                                </label>
                                <input
                                    type="text"
                                    name="pincode"
                                    value={formData.pincode}
                                    onChange={handleInputChange}
                                    placeholder="Enter pin code"
                                />
                            </div>
                            <div className="input-group">
                                <label>
                                    <Building2 size={14} /> GST Number
                                </label>
                                <input
                                    type="text"
                                    name="gst"
                                    value={formData.gst}
                                    onChange={handleInputChange}
                                    placeholder="Enter GST number"
                                />
                            </div>
                        </div>

                        <div className="form-actions">
                            <button className="btn btn-primary" onClick={handleSave}>
                                <Save size={16} /> Save
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={handleDelete}
                                disabled={!formData.id}
                            >
                                <Trash2 size={16} /> Delete
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
                                    placeholder="Search party, phone, GST..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '80px' }}>ID</th>
                                    <th>Party Name</th>
                                    <th>Phone Number</th>
                                    <th>Address</th>
                                    <th>Pin Code</th>
                                    <th>GST Number</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredParties.length > 0 ? (
                                    filteredParties.map(party => (
                                        <tr
                                            key={party.id}
                                            onClick={() => handleRowClick(party)}
                                            className={formData.id === party.id ? 'selected-row' : ''}
                                        >
                                            <td>{party.id}</td>
                                            <td style={{ fontWeight: '500' }}>{party.name}</td>
                                            <td>{party.phone}</td>
                                            <td className="truncate-text" title={party.address}>{party.address}</td>
                                            <td>{party.pincode}</td>
                                            <td>{party.gst}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
                                            No Parties found
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

export default Parties;

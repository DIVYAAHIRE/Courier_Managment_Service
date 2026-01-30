import React, { useState } from 'react';
import {
    Plus,
    Save,
    Trash2,
    X,
    Server,
    Search,
    Hash,
    Type
} from 'lucide-react';
import './Services.css';

const Services = () => {
    // Mock Data
    const [services, setServices] = useState([
        { id: 1, serialNo: 'SRV001', name: 'Standard Delivery' },
        { id: 2, serialNo: 'SRV002', name: 'Express Cargo' },
        { id: 3, serialNo: 'SRV003', name: 'Secure Document' }
    ]);

    const [formData, setFormData] = useState({
        id: null,
        serialNo: '',
        name: ''
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

    const handleNew = () => {
        setFormData({
            id: null,
            serialNo: '',
            name: ''
        });
        setIsFormVisible(true);
    };

    const handleSave = () => {
        if (!formData.serialNo || !formData.name) {
            alert('Serial No and Name are required!');
            return;
        }

        if (formData.id) {
            // Update existing
            setServices(prev => prev.map(s => s.id === formData.id ? { ...formData } : s));
        } else {
            // Create new
            const newId = services.length > 0 ? Math.max(...services.map(s => s.id)) + 1 : 1;
            setServices(prev => [...prev, { ...formData, id: newId }]);
            // Keep form open with new ID as if editing
            setFormData(prev => ({ ...prev, id: newId }));
        }
    };

    const handleRemove = () => {
        if (!formData.id) return;

        if (window.confirm('Are you sure you want to remove this Service?')) {
            setServices(prev => prev.filter(s => s.id !== formData.id));
            handleClose(); // Close form after delete
        }
    };

    const handleClose = () => {
        setIsFormVisible(false);
        setFormData({
            id: null,
            serialNo: '',
            name: ''
        });
    };

    const handleRowClick = (service) => {
        setFormData(service);
        setIsFormVisible(true);
    };

    const filteredServices = services.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.serialNo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="services-container fade-in">
            <div className="page-header">
                <div className="header-info">
                    <h2>Services Management</h2>
                    <p>Manage list of available courier services</p>
                </div>
                {!isFormVisible && (
                    <button className="btn btn-primary" onClick={handleNew}>
                        <Plus size={18} />
                        Add Service
                    </button>
                )}
            </div>

            <div className="content-wrapper">
                {isFormVisible ? (
                    <div className="form-card fade-in">
                        <div className="form-header">
                            <h3>{formData.id ? 'Edit Service' : 'New Service'}</h3>
                            <button className="icon-btn" onClick={handleClose}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className="form-grid">
                            <div className="input-group">
                                <label>
                                    <Hash size={14} /> Service Serial No
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
                                    <Type size={14} /> Service Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Enter service name"
                                />
                            </div>
                        </div>

                        <div className="form-actions">
                            <button className="btn btn-primary" onClick={handleSave}>
                                <Save size={16} /> Save
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={handleRemove}
                                disabled={!formData.id}
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
                                    placeholder="Search service..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '120px' }}>ID</th>
                                    <th>Serial No</th>
                                    <th>Service Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredServices.length > 0 ? (
                                    filteredServices.map(service => (
                                        <tr
                                            key={service.id}
                                            onClick={() => handleRowClick(service)}
                                            className={formData.id === service.id ? 'selected-row' : ''}
                                        >
                                            <td>{service.id}</td>
                                            <td style={{ fontWeight: '600', color: 'var(--primary)' }}>{service.serialNo}</td>
                                            <td>{service.name}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
                                            No Services found
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

export default Services;

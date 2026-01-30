import React, { useState } from 'react';
import {
    Plus,
    Save,
    Trash2,
    X,
    User,
    Phone,
    MapPin,
    Search
} from 'lucide-react';
import './PickupBoys.css';

const PickupBoys = () => {
    // Mock Data
    const [boys, setBoys] = useState([
        { id: 1, name: 'Rahul Kumar', phone: '9876543210', address: '123, MG Road, Mumbai' },
        { id: 2, name: 'Amit Singh', phone: '9123456789', address: '45, Linking Road, Bandra' },
        { id: 3, name: 'Vijay Patil', phone: '9988776655', address: '78, Dadar West, Mumbai' }
    ]);

    const [formData, setFormData] = useState({
        id: null,
        name: '',
        phone: '',
        address: ''
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
            name: '',
            phone: '',
            address: ''
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
            setBoys(prev => prev.map(boy => boy.id === formData.id ? { ...formData } : boy));
        } else {
            // Create new
            const newId = boys.length > 0 ? Math.max(...boys.map(b => b.id)) + 1 : 1;
            setBoys(prev => [...prev, { ...formData, id: newId }]);
        }

        // Don't close, just reset for new entry or keep as is? 
        // User req: "Save updates existing entry if ID exists; otherwise, creates new entry."
        // User req: "New clears the form but does not delete any data."
        // I will keep the form open and populated with the saved data (acting like an update now)
        if (!formData.id) {
            // If it was new, now it has an ID
            const newId = boys.length > 0 ? Math.max(...boys.map(b => b.id)) + 1 : 1;
            setFormData(prev => ({ ...prev, id: newId }));
        }
    };

    const handleDelete = () => {
        if (!formData.id) return;

        if (window.confirm('Are you sure you want to delete this Pickup Boy?')) {
            setBoys(prev => prev.filter(boy => boy.id !== formData.id));
            handleNew(); // Reset form
        }
    };

    const handleClose = () => {
        setIsFormVisible(false);
        setFormData({
            id: null,
            name: '',
            phone: '',
            address: ''
        });
    };

    const handleRowClick = (boy) => {
        setFormData(boy);
        setIsFormVisible(true);
    };

    const filteredBoys = boys.filter(boy =>
        boy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        boy.phone.includes(searchTerm)
    );

    return (
        <div className="pickup-container fade-in">
            <div className="page-header">
                <div className="header-info">
                    <h2>Pickup Executive Management</h2>
                    <p>Manage pickup boys details</p>
                </div>
                {!isFormVisible && (
                    <button className="btn btn-primary" onClick={handleNew}>
                        <Plus size={18} />
                        Add Pickup Boy
                    </button>
                )}
            </div>

            <div className="content-wrapper">
                {isFormVisible && (
                    <div className="form-card fade-in">
                        <div className="form-header">
                            <h3>{formData.id ? 'Edit Pickup Boy' : 'New Pickup Boy'}</h3>
                            <button className="icon-btn" onClick={handleClose}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className="form-grid">
                            <div className="input-group">
                                <label>
                                    <User size={14} /> Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Enter full name"
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
                                    placeholder="Enter full address"
                                />
                            </div>
                        </div>

                        <div className="form-actions">
                            <button className="btn btn-outline" onClick={handleNew}>
                                <Plus size={16} /> New
                            </button>
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
                )}

                {!isFormVisible && (
                    <div className="table-card fade-in">
                        <div className="table-header-actions">
                            <div className="search-box">
                                <Search size={18} />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '60px' }}>ID</th>
                                    <th>Name</th>
                                    <th>Phone Number</th>
                                    <th>Address</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBoys.length > 0 ? (
                                    filteredBoys.map(boy => (
                                        <tr
                                            key={boy.id}
                                            onClick={() => handleRowClick(boy)}
                                            className={formData.id === boy.id ? 'selected-row' : ''}
                                        >
                                            <td>{boy.id}</td>
                                            <td>{boy.name}</td>
                                            <td>{boy.phone}</td>
                                            <td>{boy.address}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
                                            No Pickup Boys found
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

export default PickupBoys;

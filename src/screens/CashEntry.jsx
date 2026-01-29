import React, { useState, useRef, useEffect } from 'react';
import {
    User,
    MapPin,
    Package,
    ChevronRight,
    ChevronLeft,
    Hash,
    CreditCard,
    Check,
    Wallet,
    Maximize2,
    Search,
    Plus,
    Table as TableIcon
} from 'lucide-react';
import './CashEntry.css';

const CashEntry = () => {
    const docketRef = useRef(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [completedSteps, setCompletedSteps] = useState([]);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [modalType, setModalType] = useState('sender'); // 'sender' or 'receiver'
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'form'

    const initialState = {
        // Step 1: Primary
        shipmentType: 'Domestic',
        shipmentCategory: 'Document',
        customerMobile: '',

        // Step 2: Shipment Details (Sender & Receiver)
        senderName: '',
        senderMobile: '',
        senderPincode: '',
        senderAddress1: '',
        senderAddress2: '',
        senderCity: '',
        senderState: '',
        senderEmail: '',

        receiverName: '',
        receiverMobile: '',
        receiverPincode: '',
        receiverAddress1: '',
        receiverAddress2: '',
        receiverCity: '',
        receiverState: '',
        receiverEmail: '',

        // Step 3: Item Details
        docketNumber: '',
        itemWeight: '',
        length: '',
        width: '',
        height: '',
        volumetricWeight: '',
        weightDescription: '',
        content: '',
        parcelValue: '',
        selectedService: 'Standard', // Default to Standard

        // Step 5: Payment
        paymentMode: 'Cash'
    };

    const [formData, setFormData] = useState(initialState);
    const [errors, setErrors] = useState({});

    // Dummy records data
    const [records] = useState([
        {
            id: 1,
            date: '2026-01-28',
            docket_no: 'DT123456789',
            type: 'Document',
            from_center: 'Mumbai Hub',
            to_center: 'Delhi Hub',
            sender_name: 'John Doe',
            sender_mobile: '9876543210',
            sender_pincode: '400001',
            pickup_address: 'Flat 101, Sea View, Worli',
            receiver_name: 'Alice Smith',
            receiver_mobile: '9988776655',
            receiver_pincode: '110001',
            delivery_address: 'House 45, Karol Bagh',
            pickup_boy: 'Rajesh',
            item_weight: '500 gm',
            volumetric_weight: '-',
            weight_description: 'Envelope',
            content: 'Legal Docs',
            parcel_value: '100',
            total_amount: '69',
            payment_mode: 'Cash',
            payment_status: 'Paid',
            created_at: '2026-01-28 10:15:22'
        },
        {
            id: 2,
            date: '2026-01-27',
            docket_no: 'DT987654321',
            type: 'Non-Document',
            from_center: 'Bangalore Hub',
            to_center: 'Pune Hub',
            sender_name: 'Tech Corp',
            sender_mobile: '8877665544',
            sender_pincode: '560001',
            pickup_address: 'IT Park, Koramangala',
            receiver_name: 'Vertex Solutions',
            receiver_mobile: '7766554433',
            receiver_pincode: '411001',
            delivery_address: 'MG Road, Camp',
            pickup_boy: 'Amit',
            item_weight: '2 kg',
            volumetric_weight: '2.4',
            weight_description: 'Box',
            content: 'Electronics',
            parcel_value: '5000',
            total_amount: '189',
            payment_mode: 'Online',
            payment_status: 'Paid',
            created_at: '2026-01-27 15:42:10'
        }
    ]);

    const weightOptionsList = [
        "100 gm", "250 gm", "500 gm", "1 kg", "2 kg", "3 kg", "4 kg", "5 kg", "6 kg", "7 kg",
        "8 kg", "9 kg", "10 kg", "15 kg", "20 kg", "25 kg", "30 kg", "35 kg", "40 kg",
        "45 kg", "50 kg", "60 kg", "70 kg", "75 kg", "80 kg", "90 kg", "100 kg"
    ];

    const contentOptionsList = [
        "Documents", "Legal Papers", "Books/Stationary", "Apparel/Clothes",
        "Electronics", "Computer Parts", "Handicrafts", "Corporate Gifts",
        "Personal Effects", "Spare Parts"
    ];

    const [isWeightOpen, setIsWeightOpen] = useState(false);
    const [isContentOpen, setIsContentOpen] = useState(false);
    const weightRef = useRef(null);
    const contentRef = useRef(null);

    const filteredWeights = weightOptionsList.filter(opt =>
        opt.toLowerCase().includes((formData.itemWeight || '').toLowerCase())
    );

    const filteredContents = contentOptionsList.filter(opt =>
        opt.toLowerCase().includes((formData.content || '').toLowerCase())
    );



    // Outside click to close dropdowns
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (weightRef.current && !weightRef.current.contains(event.target)) {
                setIsWeightOpen(false);
            }
            if (contentRef.current && !contentRef.current.contains(event.target)) {
                setIsContentOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const steps = [
        { id: 1, title: 'Primary', icon: <User size={14} /> },
        { id: 2, title: 'Shipment', icon: <MapPin size={14} /> },
        { id: 3, title: 'Details', icon: <Package size={14} /> },
        { id: 4, title: 'Summary', icon: <CreditCard size={14} /> },
        { id: 5, title: 'Payment', icon: <Wallet size={14} /> },
        { id: 6, title: 'Done', icon: <Check size={14} /> }
    ];

    const requiredFields = {
        1: ['shipmentType', 'shipmentCategory', 'customerMobile'],
        2: ['senderName', 'senderPincode', 'senderAddress1', 'senderMobile', 'receiverName', 'receiverPincode', 'receiverAddress1', 'receiverMobile'],
        3: ['docketNumber', 'itemWeight', 'parcelValue', 'selectedService', 'content'],
        5: ['paymentMode']
    };

    useEffect(() => {
        if (currentStep === 2 && docketRef.current) {
            docketRef.current.focus();
        }
    }, [currentStep]);

    const handleBack = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const validateMobile = (number) => {
        const regex = /^[0-9]{10}$/;
        return regex.test(number);
    };

    const handleNext = () => {
        const currentRequired = requiredFields[currentStep];
        if (!currentRequired) {
            setCurrentStep(prev => Math.min(prev + 1, 6));
            return;
        }

        const newErrors = {};
        let hasErrors = false;

        // Check required fields
        currentRequired.forEach(field => {
            if (!formData[field] || formData[field].toString().trim() === '') {
                newErrors[field] = 'Required';
                hasErrors = true;
            }
        });

        // Mobile validation for specific steps
        if (currentStep === 1) {
            if (formData.customerMobile && !validateMobile(formData.customerMobile)) {
                newErrors.customerMobile = 'Invalid 10-digit number';
                hasErrors = true;
            }
        } else if (currentStep === 2) {
            if (formData.senderMobile && !validateMobile(formData.senderMobile)) {
                newErrors.senderMobile = 'Invalid 10-digit number';
                hasErrors = true;
            }
            if (formData.receiverMobile && !validateMobile(formData.receiverMobile)) {
                newErrors.receiverMobile = 'Invalid 10-digit number';
                hasErrors = true;
            }
        }

        if (hasErrors) {
            setErrors(newErrors);
        } else {
            setCompletedSteps(prev => [...new Set([...prev, currentStep])]);
            setCurrentStep(prev => Math.min(prev + 1, 6));
            setErrors({});
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const updated = { ...prev, [name]: value };

            // Volumetric Logic
            if (['length', 'width', 'height', 'shipmentCategory'].includes(name)) {
                if (updated.shipmentCategory === 'Non-Document') {
                    const l = parseFloat(updated.length) || 0;
                    const w = parseFloat(updated.width) || 0;
                    const h = parseFloat(updated.height) || 0;
                    if (l > 0 && w > 0 && h > 0) {
                        updated.volumetricWeight = ((l * w * h) / 5000).toFixed(2);
                    } else {
                        updated.volumetricWeight = '';
                    }
                } else {
                    updated.volumetricWeight = '';
                    updated.length = '';
                    updated.width = '';
                    updated.height = '';
                }
            }
            return updated;
        });
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const selectWeight = (val) => {
        setFormData(prev => ({ ...prev, itemWeight: val }));
        setIsWeightOpen(false);
        if (errors.itemWeight) setErrors(prev => ({ ...prev, itemWeight: '' }));
    };

    const selectContent = (val) => {
        setFormData(prev => ({ ...prev, content: val }));
        setIsContentOpen(false);
        if (errors.content) setErrors(prev => ({ ...prev, content: '' }));
    };

    const handleReset = () => {
        setFormData(initialState);
        setCurrentStep(1);
        setCompletedSteps([]);
        setErrors({});
        setViewMode('table');
    };

    // Auto-navigate to records after completion
    useEffect(() => {
        if (currentStep === 6) {
            const timer = setTimeout(() => {
                handleReset();
            }, 3000);
            return () => clearTimeout(timer);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentStep]);

    const formatAddressSummary = (type) => {
        const addr1 = formData[`${type}Address1`];
        const city = formData[`${type}City`];
        const pin = formData[`${type}Pincode`];
        if (!addr1 && !city) return 'No address set';
        return `${addr1}${city ? `, ${city}` : ''}${pin ? ` - ${pin}` : ''}`;
    };

    const handleOpenAddressModal = (type) => {
        setModalType(type);
        setIsAddressModalOpen(true);
    };

    const renderProgressIndicator = () => {
        const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;

        return (
            <div className="progress-stepper-v6">
                <div className="stepper-top-row">
                    <button
                        className={`step-nav-btn-v6 ${currentStep === 1 ? 'disabled' : ''}`}
                        onClick={handleBack}
                        disabled={currentStep === 1}
                    >
                        <ChevronLeft size={20} />
                    </button>

                    <div className="stepper-labels">
                        {steps.map((step) => (
                            <div key={step.id} className={`step-label-item ${currentStep === step.id ? 'active' : ''}`}>
                                <div className="step-icon-circle">
                                    {completedSteps.includes(step.id) ? <Check size={12} /> : step.id}
                                </div>
                                <span className="step-title-text">{step.title}</span>
                            </div>
                        ))}
                    </div>

                    <button
                        className={`step-nav-btn-v6 ${currentStep === 6 ? 'disabled' : ''}`}
                        onClick={handleNext}
                        disabled={currentStep === 6}
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
                <div className="stepper-bar-container">
                    <div className="stepper-progress-fill" style={{ width: `${progressPercentage}%` }}></div>
                </div>
            </div>
        );
    };

    const renderActions = () => {
        if (currentStep === 6) return null;
        return (
            <div className="v6-actions-bar">
                {currentStep > 1 && (
                    <button className="btn-nav-back" onClick={handleBack}>
                        <ChevronLeft size={16} /> BACK
                    </button>
                )}
                <button className="btn-nav-next" onClick={handleNext}>
                    {currentStep === 4 ? 'ACCEPT & PROCEED' : (currentStep === 5 ? 'FINALIZE BOOKING' : 'CONTINUE')}
                    <ChevronRight size={16} />
                </button>
            </div>
        );
    };

    const renderRecordsTable = () => (
        <div className="table-view-container-outer">
            <div className="table-header-row">
                <button className="btn-new-entry" onClick={() => setViewMode('form')}>
                    <Plus size={18} /> New Entry
                </button>
                <div className="header-info">
                    <div className="header-title-flex">
                        <TableIcon size={20} className="text-primary" />
                        <h2>Cash Entry Records</h2>
                    </div>
                    <p className="subtitle">Overview and management of cash shipments</p>
                </div>
            </div>

            <div className="table-view-container fade-in">
                <div className="table-container-outer">
                    <div className="table-container-scroll">
                        <table className="cash-records-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Date</th>
                                    <th>Docket No</th>
                                    <th>Type</th>
                                    <th>From Center</th>
                                    <th>To Center</th>
                                    <th>Sender Name</th>
                                    <th>Sender Mobile</th>
                                    <th>Sender Pin</th>
                                    <th>Pickup Address</th>
                                    <th>Receiver Name</th>
                                    <th>Receiver Mobile</th>
                                    <th>Receiver Pin</th>
                                    <th>Delivery Address</th>
                                    <th>Pickup Boy</th>
                                    <th>Weight</th>
                                    <th>Volumetric</th>
                                    <th>Description</th>
                                    <th>Content</th>
                                    <th>Value</th>
                                    <th>Amount</th>
                                    <th>Mode</th>
                                    <th>Status</th>
                                    <th>Created At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {records.map(record => (
                                    <tr key={record.id}>
                                        <td>{record.id}</td>
                                        <td>{record.date}</td>
                                        <td className="docket-cell">{record.docket_no}</td>
                                        <td>
                                            <span className={`badge-type ${record.type.toLowerCase()}`}>
                                                {record.type}
                                            </span>
                                        </td>
                                        <td>{record.from_center}</td>
                                        <td>{record.to_center}</td>
                                        <td>{record.sender_name}</td>
                                        <td>{record.sender_mobile}</td>
                                        <td>{record.sender_pincode}</td>
                                        <td className="addr-cell" title={record.pickup_address}>{record.pickup_address}</td>
                                        <td>{record.receiver_name}</td>
                                        <td>{record.receiver_mobile}</td>
                                        <td>{record.receiver_pincode}</td>
                                        <td className="addr-cell" title={record.delivery_address}>{record.delivery_address}</td>
                                        <td>{record.pickup_boy}</td>
                                        <td>{record.item_weight}</td>
                                        <td>{record.volumetric_weight}</td>
                                        <td>{record.weight_description}</td>
                                        <td className="content-cell" title={record.content}>{record.content}</td>
                                        <td>₹{record.parcel_value}</td>
                                        <td className="amount-cell">₹{record.total_amount}</td>
                                        <td>{record.payment_mode}</td>
                                        <td>
                                            <span className={`badge-status ${record.payment_status.toLowerCase()}`}>
                                                {record.payment_status}
                                            </span>
                                        </td>
                                        <td className="time-cell">{record.created_at}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="step-view fade-in">
                        <div className="form-centered">
                            <header className="section-title-premium">Primary Shipment Details</header>

                            <div className="toggle-row">
                                <div className="toggle-pills">
                                    <div className={`toggle-pill ${formData.shipmentType === 'Domestic' ? 'active' : ''}`} onClick={() => setFormData(p => ({ ...p, shipmentType: 'Domestic' }))}>
                                        <Check size={14} style={{ opacity: formData.shipmentType === 'Domestic' ? 1 : 0 }} /> DOMESTIC
                                    </div>
                                    <div className={`toggle-pill ${formData.shipmentType === 'International' ? 'active' : ''}`} onClick={() => setFormData(p => ({ ...p, shipmentType: 'International' }))}>
                                        <Check size={14} style={{ opacity: formData.shipmentType === 'International' ? 1 : 0 }} /> INTERNATIONAL
                                    </div>
                                </div>
                            </div>

                            <div className="compact-grid">
                                <div className="control-group">
                                    <label>Shipment Category *</label>
                                    <div className="input-container">
                                        <select name="shipmentCategory" value={formData.shipmentCategory} onChange={handleChange}>
                                            <option value="Document">DOCUMENT</option>
                                            <option value="Non-Document">NON-DOCUMENT</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="control-group">
                                    <label>Customer Mobile Number *</label>
                                    <div className="input-container">
                                        <input
                                            name="customerMobile"
                                            value={formData.customerMobile || ''}
                                            onChange={handleChange}
                                            placeholder="Mobile Number"
                                        />
                                        {errors.customerMobile && <span className="error-text" style={{ color: '#ef4444', fontSize: '10px' }}>{errors.customerMobile}</span>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="step-view fade-in">
                        <header className="section-title-premium">Consignor & Consignee Information</header>
                        <div className="layout-dual">
                            <div className="form-col">
                                <div className="control-group">
                                    <label>Consignor Pincode</label>
                                    <div className="input-container">
                                        <input name="senderPincode" value={formData.senderPincode} onChange={handleChange} />
                                        {formData.senderPincode && <div className="success-icon"><Check size={8} /></div>}
                                    </div>
                                </div>
                                <div className="control-row">
                                    <div className="control-group">
                                        <label>Consignor's Mobile Number *</label>
                                        <div className="input-container">
                                            <input name="senderMobile" value={formData.senderMobile} onChange={handleChange} />
                                            {formData.senderMobile && <div className="success-icon"><Check size={8} /></div>}
                                        </div>
                                    </div>
                                    <div className="control-group">
                                        <label>Consignor's Name *</label>
                                        <div className="input-container">
                                            <input name="senderName" value={formData.senderName} onChange={handleChange} />
                                            {formData.senderName && <div className="success-icon"><Check size={8} /></div>}
                                        </div>
                                    </div>
                                </div>
                                <div className="control-group">
                                    <label>Pickup Address *</label>
                                    <div className="address-display-box">
                                        <div className="address-text">{formatAddressSummary('sender')}</div>
                                        <button className="btn-edit-inline" onClick={() => handleOpenAddressModal('sender')}>EDIT ADDRESS</button>
                                    </div>
                                </div>
                            </div>

                            <div className="form-col">
                                <div className="control-group">
                                    <label>Consignee Pincode</label>
                                    <div className="input-container">
                                        <input name="receiverPincode" value={formData.receiverPincode} onChange={handleChange} />
                                        {formData.receiverPincode && <div className="success-icon"><Check size={8} /></div>}
                                    </div>
                                </div>
                                <div className="control-row">
                                    <div className="control-group">
                                        <label>Consignee's Mobile Number *</label>
                                        <div className="input-container">
                                            <input name="receiverMobile" value={formData.receiverMobile} onChange={handleChange} />
                                            {formData.receiverMobile && <div className="success-icon"><Check size={8} /></div>}
                                        </div>
                                    </div>
                                    <div className="control-group">
                                        <label>Consignee's Name *</label>
                                        <div className="input-container">
                                            <input name="receiverName" value={formData.receiverName} onChange={handleChange} />
                                            {formData.receiverName && <div className="success-icon"><Check size={8} /></div>}
                                        </div>
                                    </div>
                                </div>
                                <div className="control-group">
                                    <label>Delivery Address</label>
                                    <div className="address-display-box">
                                        <div className="address-text">{formatAddressSummary('receiver')}</div>
                                        <button className="btn-edit-inline" onClick={() => handleOpenAddressModal('receiver')}>EDIT ADDRESS</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="step-view fade-in">
                        <div className="form-centered">
                            <header className="section-title-premium">Item Details</header>

                            <div className="control-row">
                                <div className="control-group">
                                    <label>Docket Number <span className="req">*</span></label>
                                    <div className="input-container">
                                        <input
                                            ref={docketRef}
                                            name="docketNumber"
                                            value={formData.docketNumber}
                                            onChange={handleChange}
                                            placeholder="Tracking Number"
                                        />
                                    </div>
                                </div>
                                <div className="control-group scroll-dropdown-container" ref={weightRef}>
                                    <label>Dead Weight (KG) <span className="req">*</span></label>
                                    <div className="input-container content-search-wrapper">
                                        <input
                                            type="text"
                                            name="itemWeight"
                                            placeholder="Select Weight..."
                                            value={formData.itemWeight}
                                            onFocus={() => setIsWeightOpen(true)}
                                            onChange={(e) => {
                                                handleChange(e);
                                                setIsWeightOpen(true);
                                            }}
                                        />
                                        <Search size={14} className="search-icon-field" />
                                    </div>
                                    {isWeightOpen && (
                                        <div className="custom-content-dropdown">
                                            {filteredWeights.map(opt => (
                                                <div
                                                    key={opt}
                                                    className={`dropdown-item ${formData.itemWeight === opt ? 'selected' : ''}`}
                                                    onClick={() => selectWeight(opt)}
                                                >
                                                    {opt}
                                                </div>
                                            ))}
                                            <div className="dropdown-item" onClick={() => setIsWeightOpen(false)}>Manual entry</div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {formData.shipmentCategory === 'Non-Document' && (
                                <div className="dimension-entry-section fade-in" style={{ marginBottom: '20px' }}>
                                    <header className="card-title-mini" style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Maximize2 size={10} /> Volumetric Weight Calculation (CM)
                                    </header>
                                    <div className="dimension-grid-3">
                                        <div className="dim-input-group">
                                            <label>Length</label>
                                            <input name="length" type="number" value={formData.length} onChange={handleChange} placeholder="L" />
                                        </div>
                                        <div className="dim-input-group">
                                            <label>Width</label>
                                            <input name="width" type="number" value={formData.width} onChange={handleChange} placeholder="W" />
                                        </div>
                                        <div className="dim-input-group">
                                            <label>Height</label>
                                            <input name="height" type="number" value={formData.height} onChange={handleChange} placeholder="H" />
                                        </div>
                                    </div>
                                    <div className="control-group mt-2" style={{ marginTop: '15px' }}>
                                        <div className="read-only-display">
                                            Calculated Vol. Weight: {formData.volumetricWeight ? `${formData.volumetricWeight} KG` : '0.00 KG'}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="control-group scroll-dropdown-container" ref={contentRef} style={{ marginBottom: '25px' }}>
                                <label style={{ marginBottom: '8px', display: 'block' }}>Content Description <span className="req">*</span></label>
                                <div className="input-container content-search-wrapper">
                                    <input
                                        type="text"
                                        name="content"
                                        placeholder="Type or select content..."
                                        value={formData.content}
                                        onFocus={() => setIsContentOpen(true)}
                                        onChange={(e) => {
                                            handleChange(e);
                                            setIsContentOpen(true);
                                        }}
                                    />
                                    <Search size={14} className="search-icon-field" />
                                </div>
                                {isContentOpen && (
                                    <div className="custom-content-dropdown">
                                        {filteredContents.map(opt => (
                                            <div
                                                key={opt}
                                                className={`dropdown-item ${formData.content === opt ? 'selected' : ''}`}
                                                onClick={() => selectContent(opt)}
                                            >
                                                {opt}
                                            </div>
                                        ))}
                                        <div className="dropdown-item" onClick={() => setIsContentOpen(false)}>Manual entry</div>
                                    </div>
                                )}
                            </div>

                            <div className="control-group" style={{ maxWidth: '400px', marginBottom: '25px' }}>
                                <label style={{ marginBottom: '8px', display: 'block' }}>Parcel Value (₹) <span className="req">*</span></label>
                                <input name="parcelValue" value={formData.parcelValue} onChange={handleChange} placeholder="Declared Value" />
                            </div>

                            <div className="control-group" style={{ marginBottom: '25px' }}>
                                <label>Service Options <span className="req">*</span></label>
                                <div className="service-cards">
                                    <div
                                        className={`service-card ${formData.selectedService === 'Premium' ? 'active' : ''}`}
                                        onClick={() => setFormData(p => ({ ...p, selectedService: 'Premium' }))}
                                    >
                                        <div className="service-title" style={{ fontWeight: 800 }}>Premium</div>
                                        <div className="service-time" style={{ fontSize: '11px', color: '#64748b' }}>Next day delivery</div>
                                        <div className="service-rate" style={{ color: '#004b8d', fontWeight: 700 }}>₹189</div>
                                    </div>
                                    <div
                                        className={`service-card ${formData.selectedService === 'Standard' ? 'active' : ''}`}
                                        onClick={() => setFormData(p => ({ ...p, selectedService: 'Standard' }))}
                                    >
                                        <div className="service-title" style={{ fontWeight: 800 }}>Standard</div>
                                        <div className="service-time" style={{ fontSize: '11px', color: '#64748b' }}>1-2 business days</div>
                                        <div className="service-rate" style={{ color: '#004b8d', fontWeight: 700 }}>₹69</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="step-view fade-in">
                        <header className="section-title-premium">Booking Summary Confirmation</header>
                        <div className="summary-cards-container-v2">
                            <div className="summary-card-v2 full-width">
                                <div className="card-header-v2">
                                    <div className="header-left">
                                        <Package size={16} /> SERVICE & SHIPMENT DETAILS
                                    </div>
                                    <span className={`badge-pill-v2 ${formData.selectedService === 'Premium' ? 'premium' : 'standard'}`}>
                                        {formData.selectedService}
                                    </span>
                                </div>
                                <div className="card-body-grid-v2">
                                    <div className="data-item-v2">
                                        <label>DOCKET NUMBER</label>
                                        <span>{formData.docketNumber}</span>
                                    </div>
                                    <div className="data-item-v2">
                                        <label>SHIPMENT CATEGORY</label>
                                        <span>{formData.shipmentCategory}</span>
                                    </div>
                                    <div className="data-item-v2">
                                        <label>SHIPMENT TYPE</label>
                                        <span>{formData.shipmentType}</span>
                                    </div>
                                    <div className="data-item-v2">
                                        <label>PARCEL VALUE</label>
                                        <span>₹{formData.parcelValue}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="summary-card-v2">
                                <div className="card-header-v2">
                                    <div className="header-left"><User size={16} /> CONSIGNOR (FROM)</div>
                                </div>
                                <div className="card-content-v2">
                                    <strong>{formData.senderName}</strong>
                                    <div className="info-row-v2"><Hash size={12} /> {formData.senderMobile}</div>
                                    <div className="address-block-v2">{formatAddressSummary('sender')}</div>
                                </div>
                            </div>

                            <div className="summary-card-v2">
                                <div className="card-header-v2">
                                    <div className="header-left"><MapPin size={16} /> CONSIGNEE (TO)</div>
                                </div>
                                <div className="card-content-v2">
                                    <strong>{formData.receiverName}</strong>
                                    <div className="info-row-v2"><Hash size={12} /> {formData.receiverMobile}</div>
                                    <div className="address-block-v2">{formatAddressSummary('receiver')}</div>
                                </div>
                            </div>

                            <div className="summary-card-v2">
                                <div className="card-header-v2" style={{ marginBottom: '10px' }}>
                                    <div className="header-left"><Maximize2 size={16} /> WEIGHT & DIMENSIONS</div>
                                </div>
                                <div className="card-body-v2" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    <div className="weight-stat-v2" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '15px' }}>
                                        <div className="stat-box-v2">
                                            <label>DEAD WT</label>
                                            <span>{formData.itemWeight}</span>
                                        </div>
                                        <div className="stat-box-v2">
                                            <label>VOL WT</label>
                                            <span>{formData.volumetricWeight || '-'} KG</span>
                                        </div>
                                    </div>
                                    <div className="content-box-v2" style={{ paddingTop: '5px' }}>
                                        <label>CONTENT DESCRIPTION</label>
                                        <p>{formData.content}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="summary-card-v2 highlight">
                                <div className="card-header-v2 no-border" style={{ paddingBottom: '10px' }}>
                                    <div className="header-left" style={{ color: '#fff' }}><CreditCard size={16} /> FINAL PRICING</div>
                                </div>
                                <div className="price-details-v2" style={{ padding: '0 25px 30px' }}>
                                    <div className="price-row-v2" style={{ borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '20px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ fontSize: '15px', color: '#e0f2fe' }}>Selected Service</span>
                                        <span style={{ fontSize: '15px', fontWeight: '600', color: '#fff' }}>{formData.selectedService}</span>
                                    </div>
                                    <div className="total-row-v2" style={{ marginTop: '0', borderTop: 'none', paddingTop: '0', fontSize: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span>Total Amount</span>
                                        <span>₹{formData.selectedService === 'Premium' ? '189.00' : '69.00'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 5:
                return (
                    <div className="step-view fade-in">
                        <div className="form-centered">
                            <header className="section-title-premium">Payment Collection</header>
                            <div className="control-group">
                                <label style={{ marginBottom: '15px', display: 'block' }}>Select Payment Method <span className="req">*</span></label>
                                <div className="radio-group-modern" style={{ gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <label className={`radio-card ${formData.paymentMode === 'Cash' ? 'active' : ''}`} style={{ padding: '20px' }}>
                                        <input type="radio" name="paymentMode" value="Cash" checked={formData.paymentMode === 'Cash'} onChange={handleChange} />
                                        <div className="radio-content">
                                            <span style={{ fontSize: '16px', fontWeight: '700' }}>Cash Payment</span>
                                            <small style={{ fontSize: '13px' }}>Physical cash collection</small>
                                        </div>
                                    </label>
                                    <label className={`radio-card ${formData.paymentMode === 'Online' ? 'active' : ''}`} style={{ padding: '20px' }}>
                                        <input type="radio" name="paymentMode" value="Online" checked={formData.paymentMode === 'Online'} onChange={handleChange} />
                                        <div className="radio-content">
                                            <span style={{ fontSize: '16px', fontWeight: '700' }}>Online (Digital)</span>
                                            <small style={{ fontSize: '13px' }}>UPI, QR, or Card Payment</small>
                                        </div>
                                    </label>
                                </div>
                            </div>
                            <div className="payment-alert-box" style={{ marginTop: '30px', background: '#f0f9ff', borderColor: '#bae6fd' }}>
                                <div className="alert-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                    <label style={{ color: '#0369a1', fontSize: '14px' }}>TOTAL TO COLLECT</label>
                                    <div className="amount-display" style={{ color: '#004b8d', fontSize: '28px' }}>₹{formData.selectedService === 'Premium' ? '189.00' : '69.00'}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 6:
                return (
                    <div className="success-screen fade-in">
                        <div className="success-card">
                            <div className="success-icon-v2">
                                <Check size={40} />
                            </div>
                            <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b', marginBottom: '10px' }}>Booking Confirmed!</h2>
                            <p style={{ color: '#64748b', marginBottom: '30px' }}>
                                Docket <strong>{formData.docketNumber}</strong> has been successfully booked.
                            </p>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className={`v6-stepper-container ${viewMode === 'table' ? 'wide-stepper' : ''}`}>
            {viewMode === 'table' ? (
                renderRecordsTable()
            ) : (
                <>
                    <div className="v6-header">
                        <div className="header-top-row">
                            <button className="btn-back-to-records" onClick={() => setViewMode('table')}>
                                <ChevronLeft size={16} /> BACK TO RECORDS
                            </button>
                            <div className="header-title-main">CASH SHIPMENT BOOKING</div>
                        </div>
                        <div className="header-progress-row">
                            {renderProgressIndicator()}
                        </div>
                    </div>

                    <div className="v6-content">
                        {renderStepContent()}
                    </div>

                    {renderActions()}
                </>
            )}

            <AddressModal
                isOpen={isAddressModalOpen}
                onClose={() => setIsAddressModalOpen(false)}
                type={modalType}
                formData={formData}
                onChange={handleChange}
            />
        </div>
    );
};

const AddressModal = ({ isOpen, onClose, type, formData, onChange }) => {
    if (!isOpen) return null;
    const prefix = type === 'sender' ? 'sender' : 'receiver';

    const savedAddresses = [
        { id: 1, name: 'ANAND HYDRO', address: 'nagpur, xyz, NASIK, MAHARASHTRA, 423203', mobile: '9812345678' },
        { id: 2, name: 'XYZ', address: 'sadguru krupa, MALEGAON, NASIK, MAHARASHTRA, 423203', mobile: '9371655370' },
        { id: 3, name: 'ABC', address: 'Malego, , NASIK, MAHARASHTRA, 423203', mobile: '9371655370' }
    ];

    const handleSelectSaved = (addr) => {
        const updates = {
            [`${prefix}Name`]: addr.name,
            [`${prefix}Address1`]: addr.address,
            [`${prefix}Mobile`]: addr.mobile,
            [`${prefix}City`]: 'NASIK',
            [`${prefix}State`]: 'MAHARASHTRA',
            [`${prefix}Pincode`]: '423203'
        };
        Object.entries(updates).forEach(([name, value]) => {
            onChange({ target: { name, value } });
        });
    };

    return (
        <div className="address-modal-overlay fade-in">
            <div className="address-modal-card">
                <header className="modal-header-custom">
                    <h3>Edit Address</h3>
                    <button className="btn-close-modal" onClick={onClose}><Plus size={18} style={{ transform: 'rotate(45deg)' }} /></button>
                </header>

                <div className="modal-body-split">
                    <div className="modal-form-col">
                        <header className="saved-header">Address for pincode {formData[`${prefix}Pincode`] || '423203'}</header>
                        <div className="control-group">
                            <label>Pincode *</label>
                            <div className="input-container">
                                <input name={`${prefix}Pincode`} value={formData[`${prefix}Pincode`] || ''} onChange={onChange} />
                            </div>
                        </div>
                        <div className="control-row">
                            <div className="control-group">
                                <label>Name *</label>
                                <div className="input-container">
                                    <input name={`${prefix}Name`} value={formData[`${prefix}Name`] || ''} onChange={onChange} />
                                </div>
                            </div>
                            <div className="control-group">
                                <label>Mobile Number *</label>
                                <div className="input-container">
                                    <input name={`${prefix}Mobile`} value={formData[`${prefix}Mobile`] || ''} onChange={onChange} />
                                </div>
                            </div>
                        </div>
                        <div className="control-group">
                            <label>Email</label>
                            <div className="input-container">
                                <input name={`${prefix}Email`} value={formData[`${prefix}Email`] || ''} onChange={onChange} />
                            </div>
                        </div>
                        <div className="control-group">
                            <label>Address Line 1 *</label>
                            <div className="input-container">
                                <input name={`${prefix}Address1`} value={formData[`${prefix}Address1`] || ''} onChange={onChange} />
                            </div>
                        </div>
                        <div className="control-group">
                            <label>Address Line 2</label>
                            <div className="input-container">
                                <input name={`${prefix}Address2`} value={formData[`${prefix}Address2`] || ''} onChange={onChange} placeholder="Address Line 2 (Optional)" />
                            </div>
                        </div>
                        <div className="control-row">
                            <div className="control-group">
                                <label>City *</label>
                                <div className="input-container">
                                    <input name={`${prefix}City`} value={formData[`${prefix}City`] || ''} onChange={onChange} />
                                </div>
                            </div>
                            <div className="control-group">
                                <label>State *</label>
                                <div className="input-container">
                                    <input name={`${prefix}State`} value={formData[`${prefix}State`] || ''} onChange={onChange} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal-saved-col">
                        <header className="saved-header">Saved Addresses</header>
                        <div className="saved-list">
                            {savedAddresses.map(addr => (
                                <div key={addr.id} className="address-card" onClick={() => handleSelectSaved(addr)}>
                                    <div className="card-name" style={{ fontSize: '13px', color: '#1e293b' }}>{addr.name}</div>
                                    <div className="card-detail" style={{ fontSize: '12px', color: '#64748b' }}>{addr.address}</div>
                                    <div className="card-meta" style={{ fontSize: '12px', color: '#94a3b8' }}>{addr.mobile}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="modal-footer-custom">
                    <button className="btn-modal-close" onClick={onClose}>Close</button>
                    <button className="btn-modal-save" onClick={onClose}>Save changes</button>
                </div>
            </div>
        </div>
    );
};

export default CashEntry;

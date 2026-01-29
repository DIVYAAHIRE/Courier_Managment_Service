import React, { useState, useRef, useEffect } from 'react';
import {
    User,
    Package,
    Hash,
    Truck,
    CreditCard,
    Wallet,
    Check,
    ChevronRight,
    ChevronLeft,
    CheckCircle2,
    Printer,
    Save,
    Building2,
    Settings,
    Search,
    Maximize2,
    Plus,
    Table as TableIcon
} from 'lucide-react';
import './AccountEntry.css';

const AccountEntry = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [completedSteps, setCompletedSteps] = useState([]);
    const [errors, setErrors] = useState({});
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'form'

    // Dropdown States
    const [isContentOpen, setIsContentOpen] = useState(false);
    const [contentSearch, setContentSearch] = useState('');
    const contentRef = useRef(null);

    const [isPartyOpen, setIsPartyOpen] = useState(false);
    const [partySearch, setPartySearch] = useState('');
    const partyRef = useRef(null);

    const [isServiceOpen, setIsServiceOpen] = useState(false);
    const [serviceSearch, setServiceSearch] = useState('');
    const serviceRef = useRef(null);

    const [isWeightOpen, setIsWeightOpen] = useState(false);
    const weightRef = useRef(null);

    const initialState = {
        // Step 1: Primary
        partyName: '',
        shipmentType: 'Document',

        // Step 2: Shipment
        serviceName: '',
        toCenter: '',
        pickupBoy: '',

        // Step 3: Item Details
        docketNumber: '',
        itemWeight: '',
        length: '',
        width: '',
        height: '',
        volumetricWeight: '',
        weightDescription: '',
        content: '',
        contentManual: '', // For "Others" selection
        parcelValue: '',
        ewayBillNumber: '',

        // Step 5: Payment
        paymentMode: 'Cash',
        paymentStatus: 'Paid'
    };

    const [formData, setFormData] = useState(initialState);

    // Dummy records data
    const [records, setRecords] = useState([
        {
            date: '2026-01-28',
            docket_no: 'ACC8822001',
            party_name: 'Global Tech Solutions',
            type: 'Document',
            service_name: 'DTDC',
            to_center: 'Pune Hub',
            pickup_boy: 'Rajesh',
            item_weight: '250 gm',
            volumetric_weight: '-',
            weight_description: 'Envelope',
            content: 'Invoices',
            parcel_value: '50',
            eway_bill_no: '-',
            payment_status: 'Paid',
            created_at: '2026-01-28 10:45:00'
        },
        {
            date: '2026-01-27',
            docket_no: 'ACC8822002',
            party_name: 'Vertex Corporation',
            type: 'Non-Document',
            service_name: 'Blue Dart',
            to_center: 'Mumbai Hub',
            pickup_boy: 'Amit',
            item_weight: '1.5 kg',
            volumetric_weight: '1.8',
            weight_description: 'Box',
            content: 'Electronics',
            parcel_value: '1200',
            eway_bill_no: 'EB12345678',
            payment_status: 'Paid',
            created_at: '2026-01-27 15:20:12'
        },
        {
            date: '2026-01-26',
            docket_no: 'ACC8822003',
            party_name: 'Reliance Industries',
            type: 'Document',
            service_name: 'Professional',
            to_center: 'Delhi Hub',
            pickup_boy: 'Rajesh',
            item_weight: '100 gm',
            volumetric_weight: '-',
            weight_description: 'Small Pack',
            content: 'Legal Docs',
            parcel_value: '100',
            eway_bill_no: '-',
            payment_status: 'Pending',
            created_at: '2026-01-26 11:10:05'
        }
    ]);

    // Volumetric Calculation Hook
    useEffect(() => {
        if (formData.shipmentType === 'Non-Document') {
            const l = parseFloat(formData.length) || 0;
            const w = parseFloat(formData.width) || 0;
            const h = parseFloat(formData.height) || 0;
            if (l > 0 && w > 0 && h > 0) {
                const vol = ((l * w * h) / 5000).toFixed(2);
                setFormData(prev => ({ ...prev, volumetricWeight: vol }));
            } else {
                setFormData(prev => ({ ...prev, volumetricWeight: '' }));
            }
        } else {
            // Reset if Document
            if (formData.volumetricWeight !== '') {
                setFormData(prev => ({ ...prev, volumetricWeight: '', length: '', width: '', height: '' }));
            }
        }
    }, [formData.length, formData.width, formData.height, formData.shipmentType]);

    const steps = [
        { id: 1, title: 'Primary', icon: <User size={14} /> },
        { id: 2, title: 'Shipment', icon: <Truck size={14} /> },
        { id: 3, title: 'Item Details', icon: <Package size={14} /> },
        { id: 4, title: 'Summary', icon: <CreditCard size={14} /> },
        { id: 5, title: 'Payment', icon: <Wallet size={14} /> },
        { id: 6, title: 'Complete', icon: <Check size={14} /> }
    ];

    const partyOptions = ['Global Tech Solutions', 'Vertex Corporation', 'Reliance Industries', 'Tata Consultancy', 'Infosys Ltd', 'HDFC Bank', 'ICICI Bank'];
    const serviceOptions = ['DTDC', 'Shree Maruti', 'Blue Dart', 'Delhivery', 'Professional Couriers', 'Trackon', 'First Flight'];
    const contentOptions = [
        "Documents", "Books", "Clothes", "Garments", "Electronics", "Mobile Phone", "Laptop",
        "Computer Accessories", "Printed Materials", "Legal Papers", "Certificates",
        "Invoice Documents", "Medicines", "Medical Equipment", "Cosmetics", "Beauty Products",
        "Footwear", "Bags", "Stationery", "Gift Items", "Home Decor", "Kitchen Items",
        "Plastic Items", "Metal Parts", "Machine Parts", "Spare Parts", "Auto Parts",
        "Electrical Items", "Hardware Items", "Toys", "Sports Goods", "Jewellery (Non-Precious)",
        "Watches", "Perfumes", "Food Items (Packed)", "Dry Fruits", "Samples", "Others"
    ];

    const weightOptionsList = [
        "100 gm", "250 gm", "500 gm", "1 kg", "2 kg", "3 kg", "4 kg", "5 kg", "6 kg", "7 kg",
        "8 kg", "9 kg", "10 kg", "15 kg", "20 kg", "25 kg", "30 kg", "35 kg", "40 kg",
        "45 kg", "50 kg", "60 kg", "70 kg", "75 kg", "80 kg", "90 kg", "100 kg"
    ];

    const filteredContent = contentOptions.filter(opt =>
        opt.toLowerCase().includes(contentSearch.toLowerCase())
    );

    const filteredParties = partyOptions.filter(opt =>
        opt.toLowerCase().includes(partySearch.toLowerCase())
    );

    const filteredServices = serviceOptions.filter(opt =>
        opt.toLowerCase().includes(serviceSearch.toLowerCase())
    );

    const filteredWeights = weightOptionsList.filter(opt =>
        opt.toLowerCase().includes((formData.itemWeight || '').toLowerCase())
    );

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (contentRef.current && !contentRef.current.contains(event.target)) {
                setIsContentOpen(false);
            }
            if (partyRef.current && !partyRef.current.contains(event.target)) {
                setIsPartyOpen(false);
            }
            if (serviceRef.current && !serviceRef.current.contains(event.target)) {
                setIsServiceOpen(false);
            }
            if (weightRef.current && !weightRef.current.contains(event.target)) {
                setIsWeightOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const requiredFields = {
        1: ['partyName', 'shipmentType'],
        2: ['serviceName', 'toCenter', 'pickupBoy'],
        3: ['docketNumber', 'itemWeight', 'content', 'parcelValue'],
        5: ['paymentMode', 'paymentStatus']
    };

    const handleBack = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handleNext = () => {
        const currentRequired = requiredFields[currentStep];
        if (!currentRequired) {
            setCompletedSteps(prev => [...new Set([...prev, currentStep])]);
            setCurrentStep(prev => Math.min(prev + 1, 6));
            return;
        }

        const allFilled = currentRequired.every(field => {
            if (field === 'content' && formData.content === 'Others') {
                return formData.contentManual && formData.contentManual.trim() !== '';
            }
            return formData[field] && formData[field].toString().trim() !== '';
        });

        if (allFilled) {
            setCompletedSteps(prev => [...new Set([...prev, currentStep])]);
            setCurrentStep(prev => Math.min(prev + 1, 6));
            setErrors({});
        } else {
            const newErrors = {};
            currentRequired.forEach(f => {
                if (f === 'content' && formData.content === 'Others' && !formData.contentManual) {
                    newErrors.contentManual = 'Detail required for "Others"';
                } else if (!formData[f]) {
                    newErrors[f] = 'Required';
                }
            });
            setErrors(newErrors);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const selectContent = (val) => {
        setFormData(prev => ({ ...prev, content: val }));
        setContentSearch(val);
        setIsContentOpen(false);
        if (errors.content) setErrors(prev => ({ ...prev, content: '' }));
    };

    const selectParty = (val) => {
        setFormData(prev => ({ ...prev, partyName: val }));
        setPartySearch(val);
        setIsPartyOpen(false);
        if (errors.partyName) setErrors(prev => ({ ...prev, partyName: '' }));
    };

    const selectService = (val) => {
        setFormData(prev => ({ ...prev, serviceName: val }));
        setServiceSearch(val);
        setIsServiceOpen(false);
        if (errors.serviceName) setErrors(prev => ({ ...prev, serviceName: '' }));
    };

    const selectWeight = (val) => {
        setFormData(prev => ({ ...prev, itemWeight: val }));
        setIsWeightOpen(false);
        if (errors.itemWeight) setErrors(prev => ({ ...prev, itemWeight: '' }));
    };

    const handleReset = () => {
        setFormData(initialState);
        setContentSearch('');
        setPartySearch('');
        setServiceSearch('');
        setCurrentStep(1);
        setCompletedSteps([]);
        setErrors({});
        setViewMode('table');
    };

    const renderProgressIndicator = () => (
        <div className="progress-stepper-v6">
            {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                    <div className={`step-node ${currentStep === step.id ? 'active' : ''} ${completedSteps.includes(step.id) || currentStep > step.id ? 'done' : ''}`}>
                        <div className="node-marker">
                            {completedSteps.includes(step.id) || currentStep > step.id ? <Check size={14} /> : step.id}
                        </div>
                        <span className="node-label">{step.title}</span>
                    </div>
                    {index < steps.length - 1 && <div className={`node-line ${completedSteps.includes(step.id) || currentStep > step.id ? 'active' : ''}`} />}
                </React.Fragment>
            ))}
        </div>
    );

    const renderRecordsTable = () => (
        <div className="table-view-container-outer">
            <div className="table-header-row">
                <button className="btn-new-entry" onClick={() => setViewMode('form')}>
                    <Plus size={18} /> New Entry
                </button>
                <div className="header-info">
                    <div className="header-title-flex">
                        <TableIcon size={20} className="text-primary" />
                        <h2>Account Shipment Records</h2>
                    </div>
                    <p className="subtitle">Overview and management of account shipments</p>
                </div>
            </div>

            <div className="table-view-container fade-in">
                <div className="table-container-outer">
                    <div className="table-container-scroll">
                        <table className="cash-records-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Docket No</th>
                                    <th>Party Name</th>
                                    <th>Type</th>
                                    <th>Service</th>
                                    <th>To Center</th>
                                    <th>Pickup Boy</th>
                                    <th>Weight</th>
                                    <th>Volumetric</th>
                                    <th>Description</th>
                                    <th>Content</th>
                                    <th>Value</th>
                                    <th>E-Way Bill</th>
                                    <th>Status</th>
                                    <th>Created At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {records.map((record, idx) => (
                                    <tr key={idx}>
                                        <td>{record.date}</td>
                                        <td className="font-bold text-primary">{record.docket_no}</td>
                                        <td>{record.party_name}</td>
                                        <td>
                                            <span className={`badge-type ${record.type.toLowerCase().replace(' ', '-')}`}>
                                                {record.type}
                                            </span>
                                        </td>
                                        <td>{record.service_name}</td>
                                        <td>{record.to_center}</td>
                                        <td>{record.pickup_boy}</td>
                                        <td>{record.item_weight}</td>
                                        <td>{record.volumetric_weight}</td>
                                        <td>{record.weight_description}</td>
                                        <td>{record.content}</td>
                                        <td>₹{record.parcel_value}</td>
                                        <td>{record.eway_bill_no}</td>
                                        <td>
                                            <span className={`badge-status ${record.payment_status.toLowerCase()}`}>
                                                {record.payment_status}
                                            </span>
                                        </td>
                                        <td className="text-muted text-xs">{record.created_at}</td>
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
                            <header className="col-header"><Hash size={16} /> Primary Details</header>

                            <div className="control-group scroll-dropdown-container" ref={partyRef}>
                                <label>Party Name <span className="req">*</span></label>
                                <div className="content-search-wrapper">
                                    <input
                                        type="text"
                                        placeholder="Select or Search Party..."
                                        value={partySearch}
                                        onFocus={() => setIsPartyOpen(true)}
                                        onChange={(e) => {
                                            setPartySearch(e.target.value);
                                            setIsPartyOpen(true);
                                        }}
                                    />
                                    <Search size={14} className="search-icon-field" />
                                </div>

                                {isPartyOpen && (
                                    <div className="custom-content-dropdown">
                                        {filteredParties.length > 0 ? (
                                            filteredParties.map(opt => (
                                                <div
                                                    key={opt}
                                                    className={`dropdown-item ${formData.partyName === opt ? 'selected' : ''}`}
                                                    onClick={() => selectParty(opt)}
                                                >
                                                    {opt}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="dropdown-no-results">No matches found</div>
                                        )}
                                    </div>
                                )}
                                {errors.partyName && <span className="error-text">{errors.partyName}</span>}
                            </div>

                            <div className="control-group">
                                <label>Shipment Type <span className="req">*</span></label>
                                <select name="shipmentType" value={formData.shipmentType} onChange={handleChange}>
                                    <option value="Document">Document</option>
                                    <option value="Non-Document">Non-Document </option>
                                </select>
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="step-view fade-in">
                        <div className="form-centered">
                            <header className="col-header"><Truck size={16} /> Shipment Details</header>

                            <div className="control-group scroll-dropdown-container" ref={serviceRef}>
                                <label>Service Name <span className="req">*</span></label>
                                <div className="content-search-wrapper">
                                    <input
                                        type="text"
                                        placeholder="Search Service (DTDC, Maruti...)"
                                        value={serviceSearch}
                                        onFocus={() => setIsServiceOpen(true)}
                                        onChange={(e) => {
                                            setServiceSearch(e.target.value);
                                            setIsServiceOpen(true);
                                        }}
                                    />
                                    <Search size={14} className="search-icon-field" />
                                </div>

                                {isServiceOpen && (
                                    <div className="custom-content-dropdown">
                                        {filteredServices.length > 0 ? (
                                            filteredServices.map(opt => (
                                                <div
                                                    key={opt}
                                                    className={`dropdown-item ${formData.serviceName === opt ? 'selected' : ''}`}
                                                    onClick={() => selectService(opt)}
                                                >
                                                    {opt}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="dropdown-no-results">No matches found</div>
                                        )}
                                    </div>
                                )}
                                {errors.serviceName && <span className="error-text">{errors.serviceName}</span>}
                            </div>

                            <div className="control-group">
                                <label>To Center <span className="req">*</span></label>
                                <input name="toCenter" value={formData.toCenter} onChange={handleChange} placeholder="Destination" />
                            </div>
                            <div className="control-group">
                                <label>Pickup Boy <span className="req">*</span></label>
                                <select name="pickupBoy" value={formData.pickupBoy} onChange={handleChange}>
                                    <option value="">Select Personnel...</option>
                                    <option value="Rajesh">Rajesh Kumar</option>
                                    <option value="Amit">Amit Sharma</option>
                                </select>
                            </div>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="step-view fade-in">
                        <div className="form-centered">
                            <header className="col-header"><Package size={16} /> Item Details</header>
                            <div className="control-group">
                                <label>Docket Number <span className="req">*</span></label>
                                <input name="docketNumber" value={formData.docketNumber} onChange={handleChange} placeholder="Required" />
                                {errors.docketNumber && <span className="error-text">{errors.docketNumber}</span>}
                            </div>
                            <div className="control-row">
                                <div className="control-group scroll-dropdown-container" ref={weightRef}>
                                    <label>Weight <span className="req">*</span></label>
                                    <div className="content-search-wrapper">
                                        <input
                                            type="text"
                                            name="itemWeight"
                                            placeholder="Select or Type Weight..."
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
                                            {filteredWeights.length > 0 ? (
                                                filteredWeights.map(opt => (
                                                    <div
                                                        key={opt}
                                                        className={`dropdown-item ${formData.itemWeight === opt ? 'selected' : ''}`}
                                                        onClick={() => selectWeight(opt)}
                                                    >
                                                        {opt}
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="dropdown-no-results">Manual Entry Mode</div>
                                            )}
                                        </div>
                                    )}
                                    {errors.itemWeight && <span className="error-text">{errors.itemWeight}</span>}
                                </div>
                                {formData.shipmentType === 'Non-Document' && (
                                    <div className="control-group">
                                        <label>Volumetric Weight</label>
                                        <div className="read-only-display">
                                            {formData.volumetricWeight ? `${formData.volumetricWeight} KG` : 'Enter dimensions...'}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {formData.shipmentType === 'Non-Document' && (
                                <div className="dimension-entry-section fade-in">
                                    <label className="section-label-mini"><Maximize2 size={10} /> DIMENSIONS (CM)</label>
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
                                </div>
                            )}

                            <div className="control-group">
                                <label>Weight Description</label>
                                <input name="weightDescription" value={formData.weightDescription} onChange={handleChange} placeholder="e.g. 2 Boxes" />
                            </div>

                            <div className="control-group scroll-dropdown-container" ref={contentRef}>
                                <label>Content <span className="req">*</span></label>
                                <div className="content-search-wrapper">
                                    <input
                                        type="text"
                                        placeholder="Search or Select Content..."
                                        value={contentSearch}
                                        onFocus={() => setIsContentOpen(true)}
                                        onChange={(e) => {
                                            setContentSearch(e.target.value);
                                            setIsContentOpen(true);
                                        }}
                                    />
                                    <Search size={14} className="search-icon-field" />
                                </div>

                                {isContentOpen && (
                                    <div className="custom-content-dropdown">
                                        {filteredContent.length > 0 ? (
                                            filteredContent.map(opt => (
                                                <div
                                                    key={opt}
                                                    className={`dropdown-item ${formData.content === opt ? 'selected' : ''}`}
                                                    onClick={() => selectContent(opt)}
                                                >
                                                    {opt}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="dropdown-no-results">No matches found</div>
                                        )}
                                    </div>
                                )}
                                {errors.content && <span className="error-text">{errors.content}</span>}

                                {formData.content === 'Others' && (
                                    <div className="manual-entry-area fade-in" style={{ marginTop: '12px' }}>
                                        <label style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: '700' }}>MANUAL DESCRIPTION *</label>
                                        <input
                                            name="contentManual"
                                            value={formData.contentManual}
                                            onChange={handleChange}
                                            placeholder="Enter specific content details..."
                                            autoFocus
                                        />
                                        {errors.contentManual && <span className="error-text">{errors.contentManual}</span>}
                                    </div>
                                )}
                            </div>

                            <div className="control-row">
                                <div className="control-group">
                                    <label>Parcel Value <span className="req">*</span></label>
                                    <input name="parcelValue" value={formData.parcelValue} onChange={handleChange} placeholder="₹ 0" />
                                </div>
                                <div className="control-group">
                                    <label>E-Way Bill</label>
                                    <input name="ewayBillNumber" value={formData.ewayBillNumber} onChange={handleChange} placeholder="Optional" />
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="step-view fade-in">
                        <div className="form-centered summary-preview">
                            <header className="col-header"><CreditCard size={16} /> Entry Summary</header>
                            <div className="summary-grid">
                                <div className="summary-item">
                                    <label>Docket Number</label>
                                    <span>{formData.docketNumber || 'N/A'}</span>
                                </div>
                                <div className="summary-item">
                                    <label>Party Name</label>
                                    <span>{formData.partyName || 'N/A'}</span>
                                </div>
                                <div className="summary-item">
                                    <label>Shipment Type</label>
                                    <span>{formData.shipmentType}</span>
                                </div>
                                <div className="summary-item">
                                    <label>Service</label>
                                    <span>{formData.serviceName || 'Standard'}</span>
                                </div>
                                <div className="summary-item full">
                                    <label>Destination</label>
                                    <p>{formData.toCenter || 'Not specified'}</p>
                                </div>
                                <div className="summary-item">
                                    <label>Weight</label>
                                    <span>{formData.itemWeight || '0'}</span>
                                </div>
                                {formData.shipmentType === 'Non-Document' && (
                                    <div className="summary-item">
                                        <label>Volumetric</label>
                                        <span>{formData.volumetricWeight || '0'} KG</span>
                                    </div>
                                )}
                                <div className="summary-item">
                                    <label>Content</label>
                                    <span>{formData.content === 'Others' ? formData.contentManual : formData.content}</span>
                                </div>
                            </div>
                            <div className="custom-actions">
                                <button className="btn-nav btn-back" onClick={() => setCurrentStep(3)}>Cancel</button>
                                <button className="btn-nav btn-next" onClick={handleNext}>Save Entry</button>
                            </div>
                        </div>
                    </div>
                );
            case 5:
                return (
                    <div className="step-view fade-in">
                        <div className="form-centered">
                            <header className="col-header"><Wallet size={16} /> Payment & Print</header>
                            <div className="control-group">
                                <label>Payment Mode <span className="req">*</span></label>
                                <select name="paymentMode" value={formData.paymentMode} onChange={handleChange}>
                                    <option value="Cash">Cash</option>
                                    <option value="Online">Online</option>
                                    <option value="UPI">UPI</option>
                                </select>
                            </div>
                            <div className="control-group">
                                <label>Payment Status <span className="req">*</span></label>
                                <select name="paymentStatus" value={formData.paymentStatus} onChange={handleChange}>
                                    <option value="Paid">Paid</option>
                                    <option value="Pending">Pending</option>
                                </select>
                            </div>
                            <div className="custom-actions">
                                <button className="btn-nav btn-secondary" onClick={() => alert('Printing...')}>
                                    <Printer size={18} /> Print
                                </button>
                                <button className="btn-nav btn-next" onClick={handleNext}>Complete Entry</button>
                            </div>
                        </div>
                    </div>
                );
            case 6:
                return (
                    <div className="success-screen fade-in">
                        <div className="success-icon-wrapper">
                            <CheckCircle2 color="var(--success)" size={84} strokeWidth={1.5} />
                        </div>
                        <h2>Successfully saved account entry</h2>
                        <button className="btn-main" onClick={handleReset}>Next Entry</button>
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
                    <button className="btn-text-back-abs" onClick={() => setViewMode('table')}>
                        <ChevronLeft size={16} /> Back to Records
                    </button>

                    <div className="v6-header">
                        {renderProgressIndicator()}
                    </div>

                    <div className="v6-content">
                        {renderStepContent()}
                    </div>

                    {currentStep < 4 && (
                        <div className="v6-actions">
                            <div className="actions-flex">
                                <button className="btn-nav btn-back" onClick={handleBack} disabled={currentStep === 1}>
                                    <ChevronLeft size={18} /> Back
                                </button>
                                <button className="btn-nav btn-next" onClick={handleNext}>
                                    Next <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default AccountEntry;

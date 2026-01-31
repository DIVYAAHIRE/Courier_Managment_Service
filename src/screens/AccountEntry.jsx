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
    TableIcon
} from 'lucide-react';
import './AccountEntry.css';
import './CashEntry.css';
import { supabase } from '../supabaseClient';

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
    // Supabase records data
    const [records, setRecords] = useState([]);

    // Fetch records from Supabase on mount
    useEffect(() => {
        fetchRecords();
    }, []);

    const fetchRecords = async () => {
        try {
            const { data, error } = await supabase
                .from('acc_entry')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error("Error fetching acc_entry:", error);
            } else {
                setRecords(data || []);
            }
        } catch (err) {
            console.error("Unexpected error fetching records:", err);
        }
    };

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
            if (currentStep === 5) {
                submitToSupabase();
            }
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

    const submitToSupabase = async () => {
        try {
            const finalContent = formData.content === 'Others' ? formData.contentManual : formData.content;

            const parseWeightToKg = (str) => {
                if (!str) return 0;
                const s = str.toString().toLowerCase();
                const val = parseFloat(s);
                if (isNaN(val)) return 0;
                if (s.includes('gm')) return val / 1000;
                return val;
            };

            const newRecord = {
                date: new Date().toISOString().split('T')[0],
                docket_no: formData.docketNumber,
                party_name: formData.partyName,
                type: formData.shipmentType,
                service_name: formData.serviceName,
                to_center: formData.toCenter,
                pickup_boy: formData.pickupBoy,
                item_weight: parseWeightToKg(formData.itemWeight),
                volumetric_weight: parseFloat(formData.volumetricWeight) || 0,
                weight_description: formData.weightDescription || '-',
                content: finalContent,
                parcel_value: parseFloat(formData.parcelValue) || 0,
                eway_bill_no: formData.ewayBillNumber || '-',
                payment_status: 'Paid'
            };

            const { error } = await supabase
                .from('acc_entry')
                .insert([newRecord]);

            if (error) {
                console.error("Error inserting to acc_entry:", error);
                alert(`Error saving to database:\n${error.message || JSON.stringify(error)}`);
            } else {
                fetchRecords();
            }
        } catch (err) {
            console.error("Unexpected error submitting to Supabase:", err);
            alert(`Unexpected error:\n${err.message || err}`);
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
                            <header className="section-title-premium">Primary Details</header>

                            <div className="compact-grid">
                                <div className="control-group" ref={partyRef}>
                                    <label>Party Name <span className="req">*</span></label>
                                    <div className="input-container content-search-wrapper">
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
                                    <div className="input-container">
                                        <select name="shipmentType" value={formData.shipmentType} onChange={handleChange}>
                                            <option value="Document">Document</option>
                                            <option value="Non-Document">Non-Document </option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="step-view fade-in">
                        <div className="form-centered">
                            <header className="section-title-premium">Shipment Details</header>

                            <div className="compact-grid">
                                <div className="control-group">
                                    <label>To Center <span className="req">*</span></label>
                                    <div className="input-container">
                                        <input name="toCenter" value={formData.toCenter} onChange={handleChange} placeholder="Destination" />
                                    </div>
                                </div>
                                <div className="control-group">
                                    <label>Pickup Boy <span className="req">*</span></label>
                                    <div className="input-container">
                                        <select name="pickupBoy" value={formData.pickupBoy} onChange={handleChange}>
                                            <option value="">Select Personnel...</option>
                                            <option value="Rajesh">Rajesh Kumar</option>
                                            <option value="Amit">Amit Sharma</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="control-group" style={{ marginTop: '20px' }}>
                                <label>Service Options <span className="req">*</span></label>
                                <div className="service-cards">
                                    <div
                                        className={`service-card ${formData.serviceName === 'Premium' ? 'active' : ''}`}
                                        onClick={() => setFormData(p => ({ ...p, serviceName: 'Premium' }))}
                                    >
                                        <div className="service-title" style={{ fontWeight: 800 }}>Premium</div>
                                        <div className="service-time" style={{ fontSize: '11px', color: '#64748b' }}>Next day delivery</div>
                                        <div className="service-rate" style={{ color: '#004b8d', fontWeight: 700 }}>₹189</div>
                                    </div>
                                    <div
                                        className={`service-card ${formData.serviceName === 'Standard' ? 'active' : ''}`}
                                        onClick={() => setFormData(p => ({ ...p, serviceName: 'Standard' }))}
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
            case 3:
                return (
                    <div className="step-view fade-in">
                        <div className="form-centered">
                            <header className="section-title-premium">Item Details</header>

                            <div className="compact-grid">
                                <div className="control-group">
                                    <label>Docket Number <span className="req">*</span></label>
                                    <div className="input-container">
                                        <input name="docketNumber" value={formData.docketNumber} onChange={handleChange} placeholder="Required" />
                                    </div>
                                    {errors.docketNumber && <span className="error-text">{errors.docketNumber}</span>}
                                </div>
                                <div className="control-group scroll-dropdown-container" ref={weightRef}>
                                    <label>Weight <span className="req">*</span></label>
                                    <div className="input-container content-search-wrapper">
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
                                    <div className="control-group mt-2" style={{ marginTop: '15px' }}>
                                        <div className="read-only-display">
                                            {formData.volumetricWeight ? `${formData.volumetricWeight} KG` : 'Enter dimensions...'}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="control-group" style={{ marginTop: formData.shipmentType === 'Non-Document' ? '20px' : '0' }}>
                                <label>Weight Description</label>
                                <div className="input-container">
                                    <input name="weightDescription" value={formData.weightDescription} onChange={handleChange} placeholder="e.g. 2 Boxes" />
                                </div>
                            </div>

                            <div className="control-group scroll-dropdown-container" ref={contentRef}>
                                <label>Content <span className="req">*</span></label>
                                <div className="input-container content-search-wrapper">
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
                                        <div className="input-container">
                                            <input
                                                name="contentManual"
                                                value={formData.contentManual}
                                                onChange={handleChange}
                                                placeholder="Enter specific content details..."
                                                autoFocus
                                            />
                                        </div>
                                        {errors.contentManual && <span className="error-text">{errors.contentManual}</span>}
                                    </div>
                                )}
                            </div>

                            <div className="compact-grid">
                                <div className="control-group">
                                    <label>Parcel Value <span className="req">*</span></label>
                                    <div className="input-container">
                                        <input name="parcelValue" value={formData.parcelValue} onChange={handleChange} placeholder="₹ 0" />
                                    </div>
                                </div>
                                <div className="control-group">
                                    <label>E-Way Bill</label>
                                    <div className="input-container">
                                        <input name="ewayBillNumber" value={formData.ewayBillNumber} onChange={handleChange} placeholder="Optional" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="step-view fade-in">
                        <header className="section-title-premium">Entry Summary</header>
                        <div className="summary-cards-container-v2">
                            <div className="summary-card-v2 full-width">
                                <div className="card-header-v2">
                                    <div className="header-left">
                                        <Package size={16} /> SERVICE & SHIPMENT DETAILS
                                    </div>
                                    <span className={`badge-pill-v2 ${formData.shipmentType === 'Document' ? 'standard' : 'premium'}`}>
                                        {formData.shipmentType}
                                    </span>
                                </div>
                                <div className="card-body-grid-v2">
                                    <div className="data-item-v2">
                                        <label>DOCKET NUMBER</label>
                                        <span>{formData.docketNumber || 'N/A'}</span>
                                    </div>
                                    <div className="data-item-v2">
                                        <label>SERVICE</label>
                                        <span>{formData.serviceName || 'Standard'}</span>
                                    </div>
                                    <div className="data-item-v2">
                                        <label>DESTINATION</label>
                                        <span>{formData.toCenter || 'N/A'}</span>
                                    </div>
                                    <div className="data-item-v2">
                                        <label>PICKUP BY</label>
                                        <span>{formData.pickupBoy || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="summary-card-v2">
                                <div className="card-header-v2">
                                    <div className="header-left"><User size={16} /> PARTY DETAILS</div>
                                </div>
                                <div className="card-content-v2">
                                    <strong>{formData.partyName}</strong>
                                    <div className="info-row-v2" style={{ marginTop: '5px' }}>
                                        E-Way Bill: {formData.ewayBillNumber || 'N/A'}
                                    </div>
                                    <div className="info-row-v2">
                                        Value: ₹{formData.parcelValue}
                                    </div>
                                </div>
                            </div>

                            <div className="summary-card-v2">
                                <div className="card-header-v2" style={{ marginBottom: '10px' }}>
                                    <div className="header-left"><Maximize2 size={16} /> WEIGHT & CONTENT</div>
                                </div>
                                <div className="card-body-v2" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    <div className="weight-stat-v2" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '15px', paddingTop: '0' }}>
                                        <div className="stat-box-v2">
                                            <label>DEAD WT</label>
                                            <span>{formData.itemWeight}</span>
                                        </div>
                                        {formData.shipmentType === 'Non-Document' && (
                                            <div className="stat-box-v2">
                                                <label>VOL WT</label>
                                                <span>{formData.volumetricWeight || '-'} KG</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="content-box-v2" style={{ paddingTop: '5px' }}>
                                        <label>CONTENT DESCRIPTION</label>
                                        <p>{formData.content === 'Others' ? formData.contentManual : formData.content}</p>
                                        <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>{formData.weightDescription}</p>
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
                                        <span style={{ fontSize: '15px', fontWeight: '600', color: '#fff' }}>{formData.serviceName || 'Standard'}</span>
                                    </div>
                                    <div className="total-row-v2" style={{ marginTop: '0', borderTop: 'none', paddingTop: '0', fontSize: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span>Total Amount</span>
                                        <span>₹{formData.serviceName === 'Premium' ? '189.00' : '69.00'}</span>
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
                                <label style={{ marginBottom: '15px', display: 'block' }}>Payment Mode <span className="req">*</span></label>
                                <div className="radio-group-modern">
                                    <label className={`radio-card ${formData.paymentMode === 'Cash' ? 'active' : ''}`}>
                                        <input
                                            type="radio"
                                            name="paymentMode"
                                            value="Cash"
                                            checked={formData.paymentMode === 'Cash'}
                                            onChange={handleChange}
                                        />
                                        <div className="radio-content">
                                            <span>Cash</span>
                                            <small>Physical Cash</small>
                                        </div>
                                    </label>
                                    <label className={`radio-card ${formData.paymentMode === 'Online' ? 'active' : ''}`}>
                                        <input
                                            type="radio"
                                            name="paymentMode"
                                            value="Online"
                                            checked={formData.paymentMode === 'Online'}
                                            onChange={handleChange}
                                        />
                                        <div className="radio-content">
                                            <span>Online</span>
                                            <small>Digital Payment</small>
                                        </div>
                                    </label>
                                    <label className={`radio-card ${formData.paymentMode === 'UPI' ? 'active' : ''}`}>
                                        <input
                                            type="radio"
                                            name="paymentMode"
                                            value="UPI"
                                            checked={formData.paymentMode === 'UPI'}
                                            onChange={handleChange}
                                        />
                                        <div className="radio-content">
                                            <span>UPI</span>
                                            <small>UPI / QR Scan</small>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div className="control-group" style={{ marginTop: '25px' }}>
                                <label>Payment Status <span className="req">*</span></label>
                                <div className="input-container" style={{ maxWidth: '300px' }}>
                                    <select name="paymentStatus" value={formData.paymentStatus} onChange={handleChange}>
                                        <option value="Paid">Paid</option>
                                        <option value="Pending">Pending</option>
                                    </select>
                                </div>
                            </div>
                        </div>


                    </div>
                );
            case 6:
                return (
                    <div className="success-screen fade-in">
                        <div className="success-card">
                            <div className="success-icon-wrapper">
                                <CheckCircle2 color="var(--success)" size={64} strokeWidth={2} />
                            </div>
                            <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b', marginBottom: '10px' }}>Booking Confirmed!</h2>
                            <p style={{ color: '#64748b', marginBottom: '30px' }}>
                                Docket <strong>{formData.docketNumber}</strong> has been successfully booked.
                            </p>
                            <div className="action-buttons" style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '10px' }}>
                                <button className="btn-nav-next" onClick={() => window.print()}>
                                    <Printer size={18} /> PRINT
                                </button>
                                <button className="btn-main" onClick={handleReset}>NEXT ENTRY</button>
                            </div>
                        </div>

                        {/* Printable Summary (Hidden on Screen) */}
                        <div className="print-only-summary" style={{ textAlign: 'left', marginTop: '40px', maxWidth: '850px', margin: '40px auto 0' }}>
                            <div className="summary-cards-container-v2">
                                <div className="summary-card-v2 full-width">
                                    <div className="card-header-v2">
                                        <div className="header-left">
                                            <Package size={16} /> ACCOUNT & SHIPMENT DETAILS
                                        </div>
                                        <span className={`badge-pill-v2 ${formData.shipmentType === 'Document' ? 'standard' : 'premium'}`}>
                                            {formData.shipmentType}
                                        </span>
                                    </div>
                                    <div className="card-body-grid-v2">
                                        <div className="data-item-v2">
                                            <label>DOCKET NUMBER</label>
                                            <span>{formData.docketNumber || 'N/A'}</span>
                                        </div>
                                        <div className="data-item-v2">
                                            <label>SERVICE</label>
                                            <span>{formData.serviceName || 'Standard'}</span>
                                        </div>
                                        <div className="data-item-v2">
                                            <label>DESTINATION</label>
                                            <span>{formData.toCenter || 'N/A'}</span>
                                        </div>
                                        <div className="data-item-v2">
                                            <label>PICKUP BY</label>
                                            <span>{formData.pickupBoy || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="summary-card-v2">
                                    <div className="card-header-v2">
                                        <div className="header-left"><User size={16} /> PARTY DETAILS</div>
                                    </div>
                                    <div className="card-content-v2">
                                        <strong>{formData.partyName}</strong>
                                        <div className="info-row-v2" style={{ marginTop: '5px' }}>
                                            E-Way Bill: {formData.ewayBillNumber || 'N/A'}
                                        </div>
                                        <div className="info-row-v2">
                                            Value: ₹{formData.parcelValue}
                                        </div>
                                    </div>
                                </div>

                                <div className="summary-card-v2">
                                    <div className="card-header-v2" style={{ marginBottom: '10px' }}>
                                        <div className="header-left"><Maximize2 size={16} /> WEIGHT & CONTENT</div>
                                    </div>
                                    <div className="card-body-v2" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                        <div className="weight-stat-v2" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '15px', paddingTop: '0' }}>
                                            <div className="stat-box-v2">
                                                <label>DEAD WT</label>
                                                <span>{formData.itemWeight}</span>
                                            </div>
                                            {formData.shipmentType === 'Non-Document' && (
                                                <div className="stat-box-v2">
                                                    <label>VOL WT</label>
                                                    <span>{formData.volumetricWeight || '-'} KG</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="content-box-v2" style={{ paddingTop: '5px' }}>
                                            <label>CONTENT DESCRIPTION</label>
                                            <p>{formData.content === 'Others' ? formData.contentManual : formData.content}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="summary-card-v2 highlight">
                                    <div className="card-header-v2 no-border" style={{ paddingBottom: '10px' }}>
                                        <div className="header-left" style={{ color: '#fff' }}><CreditCard size={16} /> FINAL PRICING & STATUS</div>
                                    </div>
                                    <div className="price-details-v2" style={{ padding: '0 25px 30px' }}>
                                        <div className="price-row-v2" style={{ borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '20px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ fontSize: '15px', color: '#e0f2fe' }}>Payment Mode</span>
                                            <span style={{ fontSize: '15px', fontWeight: '600', color: '#fff' }}>{formData.paymentMode} ({formData.paymentStatus})</span>
                                        </div>
                                        <div className="total-row-v2" style={{ marginTop: '0', borderTop: 'none', paddingTop: '0', fontSize: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span>Total Amount</span>
                                            <span>₹{formData.serviceName === 'Premium' ? '189.00' : '69.00'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    const renderActions = () => {
        if (currentStep === 6) return null;

        // Case 5: Payment (Print + Complete)
        if (currentStep === 5) {
            return (
                <div className="v6-actions-bar">
                    <button className="btn-nav-next" onClick={handleNext}>
                        COMPLETE ENTRY <ChevronRight size={16} />
                    </button>
                </div>
            );
        }

        // Case 4: Summary (Back + Save)
        if (currentStep === 4) {
            return (
                <div className="v6-actions-bar">
                    <button className="btn-nav-back" onClick={handleBack}>
                        <ChevronLeft size={16} /> BACK
                    </button>
                    <button className="btn-nav-next" onClick={handleNext}>
                        SAVE ENTRY <ChevronRight size={16} />
                    </button>
                </div>
            );
        }

        // Steps 1, 2, 3
        return (
            <div className="v6-actions-bar">
                {currentStep > 1 && (
                    <button className="btn-nav-back" onClick={handleBack}>
                        <ChevronLeft size={16} /> BACK
                    </button>
                )}
                <button className="btn-nav-next" onClick={handleNext}>
                    CONTINUE <ChevronRight size={16} />
                </button>
            </div>
        );
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
                            <div className="header-title-main">ACCOUNT SHIPMENT BOOKING</div>
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
        </div>
    );
};

export default AccountEntry;

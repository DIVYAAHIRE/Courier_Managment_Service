import React from 'react';
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
    const dispatches = [
        { id: 'DK-2045', weight: '2.5 kg', service: 'Express', time: '11:30 AM', shift: 'Noon', status: 'Dispatched' },
        { id: 'DK-2046', weight: '0.5 kg', service: 'Standard', time: '12:15 PM', shift: 'Noon', status: 'Ready' },
        { id: 'DK-2047', weight: '12.0 kg', service: 'Surface', time: '02:00 PM', shift: 'Night', status: 'Pending' },
        { id: 'DK-2048', weight: '1.2 kg', service: 'Express', time: '02:45 PM', shift: 'Night', status: 'Dispatched' },
        { id: 'DK-2049', weight: '5.0 kg', service: 'Standard', time: '03:10 PM', shift: 'Night', status: 'Ready' },
        { id: 'DK-2050', weight: '0.8 kg', service: 'Express', time: '04:20 PM', shift: 'Night', status: 'Dispatched' },
        { id: 'DK-2051', weight: '4.5 kg', service: 'Surface', time: '05:00 PM', shift: 'Night', status: 'Pending' },
    ];

    return (
        <div className="dispatch-container fade-in">
            <div className="page-header">
                <div className="header-info">
                    <h2>Dispatch Management</h2>
                    <p>Monitor and manage daily dispatch operations for Noon and Night shifts.</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-outline"><Download size={18} /> Export List</button>
                    <button className="btn btn-primary"><Plus size={18} /> New Dispatch</button>
                </div>
            </div>

            <div className="dispatch-filters card">
                <div className="search-box">
                    <Search size={18} />
                    <input type="text" placeholder="Search by Docket No..." />
                </div>
                <div className="filters-group">
                    <div className="filter-item">
                        <label>Shift</label>
                        <select>
                            <option>All Shifts</option>
                            <option>Noon</option>
                            <option>Night</option>
                        </select>
                    </div>
                    <div className="filter-item">
                        <label>Service</label>
                        <select>
                            <option>All Services</option>
                            <option>Express</option>
                            <option>Standard</option>
                            <option>Surface</option>
                        </select>
                    </div>
                    <button className="btn-filter">
                        <Filter size={18} />
                        Filters
                    </button>
                </div>
            </div>

            <div className="card table-card">
                <table className="dispatch-table">
                    <thead>
                        <tr>
                            <th>Docket Number</th>
                            <th>Weight</th>
                            <th>Service Name</th>
                            <th>Dispatch Time</th>
                            <th>Shift</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dispatches.map((item, idx) => (
                            <tr key={idx}>
                                <td className="docket-no">{item.id}</td>
                                <td>{item.weight}</td>
                                <td>
                                    <span className={`service-tag ${item.service.toLowerCase()}`}>
                                        {item.service}
                                    </span>
                                </td>
                                <td>
                                    <div className="time-info">
                                        <Clock size={14} />
                                        {item.time}
                                    </div>
                                </td>
                                <td>
                                    <span className={`shift-tag ${item.shift.toLowerCase()}`}>
                                        {item.shift === 'Noon' ? <CheckCircle2 size={12} /> : <Clock4 size={12} />}
                                        {item.shift}
                                    </span>
                                </td>
                                <td>
                                    <span className={`status-pill ${item.status.toLowerCase()}`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td>
                                    <button className="icon-btn-table">
                                        <ExternalLink size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="table-footer">
                    <span>Showing 7 of 124 entries</span>
                    <div className="pagination">
                        <button disabled>Prev</button>
                        <button className="active">1</button>
                        <button>2</button>
                        <button>3</button>
                        <button>Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DispatchEntry;

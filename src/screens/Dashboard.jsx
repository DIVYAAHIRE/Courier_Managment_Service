import React from 'react';
import {
    Package,
    Wallet,
    UserCircle,
    Sun,
    Moon,
    ArrowUpRight,
    ArrowDownRight,
    MoreVertical
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

const data = [
    { name: 'Mon', count: 45 },
    { name: 'Tue', count: 52 },
    { name: 'Wed', count: 38 },
    { name: 'Thu', count: 65 },
    { name: 'Fri', count: 48 },
    { name: 'Sat', count: 32 },
    { name: 'Sun', count: 12 },
];

const StatCard = ({ title, value, subValue, icon, color, trend }) => (
    <div className="card stat-card fade-in">
        <div className="stat-card-header">
            <div className={`stat-icon ${color}`}>
                {icon}
            </div>
            <div className="stat-trend">
                {trend === 'up' ? <ArrowUpRight size={16} className="text-green" /> : <ArrowDownRight size={16} className="text-red" />}
                <span className={trend === 'up' ? 'text-green' : 'text-red'}>+12.5%</span>
            </div>
        </div>
        <div className="stat-card-body">
            <h3 className="stat-value">{value}</h3>
            <p className="stat-title">{title}</p>
            {subValue && <p className="stat-sub-value">{subValue}</p>}
        </div>
    </div>
);

const Dashboard = () => {
    return (
        <div className="dashboard-content">
            <div className="stats-grid">
                <StatCard
                    title="Total Shipments"
                    value="1,284"
                    icon={<Package size={20} />}
                    color="blue"
                    trend="up"
                />
                <StatCard
                    title="Cash Entries"
                    value="458"
                    icon={<Wallet size={20} />}
                    color="green"
                    trend="up"
                />
                <StatCard
                    title="Account Entries"
                    value="826"
                    icon={<UserCircle size={20} />}
                    color="purple"
                    trend="down"
                />
                <StatCard
                    title="Today Dispatch"
                    value="124"
                    subValue="Noon: 58 | Night: 66"
                    icon={<Sun size={20} />}
                    color="orange"
                    trend="up"
                />
            </div>

            <div className="dashboard-grid">
                <div className="card chart-container fade-in">
                    <div className="card-header">
                        <h3>Shipment Trends</h3>
                        <button className="icon-btn"><MoreVertical size={18} /></button>
                    </div>
                    <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ color: '#4f46e5' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#4f46e5"
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card recents-container fade-in">
                    <div className="card-header">
                        <h3>Recent Activity</h3>
                        <button className="text-btn">View All</button>
                    </div>
                    <div className="activity-list">
                        {[
                            { id: 'DK-2045', party: 'Global Tech', type: 'Account', time: '12:45 PM', status: 'In Transit' },
                            { id: 'DK-2046', party: 'Rahul Sharma', type: 'Cash', time: '01:12 PM', status: 'Delivered' },
                            { id: 'DK-2047', party: 'Mehta Bros', type: 'Account', time: '02:05 PM', status: 'Pending' },
                            { id: 'DK-2048', party: 'Suresh Kumar', type: 'Cash', time: '02:45 PM', status: 'In Transit' },
                            { id: 'DK-2049', party: 'Vertex Corp', type: 'Account', time: '03:20 PM', status: 'Picked Up' },
                        ].map((item, idx) => (
                            <div key={idx} className="activity-item">
                                <div className="activity-info">
                                    <span className="activity-id">{item.id}</span>
                                    <span className="activity-party">{item.party}</span>
                                </div>
                                <div className="activity-meta">
                                    <span className={`status-badge ${item.status.toLowerCase().replace(' ', '-')}`}>{item.status}</span>
                                    <span className="activity-time">{item.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

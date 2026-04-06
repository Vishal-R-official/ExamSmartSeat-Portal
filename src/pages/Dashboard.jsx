import React, { useContext } from 'react';
import {
    Users, Building, UsersIcon, CalendarCheck,
    BarChart3, AlertCircle, TrendingUp, ShieldCheck
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import { AppContext } from '../context/AppContext';
import './Dashboard.css';

const Dashboard = () => {
    const { stats, halls, students, seatingPlan } = useContext(AppContext);

    const statCards = [
        { title: 'Total Students', value: stats.totalStudents, icon: Users, color: 'var(--accent-primary)' },
        { title: 'Available Halls', value: `${stats.availableHalls}/${stats.totalHalls}`, icon: Building, color: 'var(--status-available)' },
        { title: 'Total Capacity', value: stats.totalCapacity, icon: UsersIcon, color: 'var(--accent-secondary)' },
        { title: 'Subjects / Exams', value: stats.examsScheduled, icon: CalendarCheck, color: 'var(--subj-purple)' },
        { title: 'Utilization', value: `${Math.min(stats.utilization, 100)}%`, icon: BarChart3, color: 'var(--status-warning)' },
        { title: 'Absentees', value: stats.absentees, icon: AlertCircle, color: 'var(--status-danger)' },
    ];

    // Dynamic chart data from real halls
    const blockMap = {};
    halls.forEach(h => {
        if (!blockMap[h.blockName]) blockMap[h.blockName] = { totalCapacity: 0, hallCount: 0 };
        blockMap[h.blockName].totalCapacity += h.capacity;
        blockMap[h.blockName].hallCount += 1;
    });
    const utilizationData = Object.entries(blockMap).map(([name, data]) => ({
        name,
        capacity: data.totalCapacity,
        utliz: stats.totalCapacity > 0
            ? Math.round((data.totalCapacity / stats.totalCapacity) * stats.utilization)
            : 0,
    }));

    // Attendance (real vs. absent)
    const attendanceData = [
        { name: 'Present', value: stats.totalStudents - stats.absentees },
        { name: 'Absent', value: stats.absentees },
    ];
    const COLORS = ['var(--status-success)', 'var(--status-danger)'];

    // Department distribution
    const deptMap = {};
    students.forEach(s => {
        deptMap[s.department] = (deptMap[s.department] || 0) + 1;
    });
    const deptData = Object.entries(deptMap).map(([name, value]) => ({ name, value }));
    const DEPT_COLORS = ['var(--accent-primary)', 'var(--accent-secondary)', 'var(--subj-purple)', 'var(--subj-orange)', 'var(--subj-green)'];

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip glass-panel p-3">
                    <p className="label font-bold mb-1">{`${label}`}</p>
                    <p className="intro text-sm" style={{ color: payload[0].fill }}>
                        {`${payload[0].name}: ${payload[0].value}%`}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="dashboard-page animate-fade-in">
            <div className="page-header mb-6">
                <div>
                    <h2 className="text-2xl font-bold">Dashboard Overview</h2>
                    <p className="text-text-secondary mt-1">Real-time system statistics</p>
                </div>
                {seatingPlan && (
                    <div className="status-badge available" aria-label="Active plan status">
                        <ShieldCheck size={16} />
                        <span>Plan Active: {seatingPlan.planId?.slice(0, 15)}...</span>
                    </div>
                )}
            </div>

            {/* Stat Cards */}
            <div className="stats-grid" role="list" aria-label="Statistics">
                {statCards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                        <div key={index} className="stat-card glass-panel animate-slide-up" role="listitem"
                             style={{ animationDelay: `${index * 0.08}s` }}>
                            <div className="stat-icon" style={{ color: card.color, background: `${card.color}15` }}>
                                <Icon size={24} />
                            </div>
                            <div className="stat-info">
                                <p className="stat-label">{card.title}</p>
                                <h3 className="stat-value">{card.value}</h3>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Charts */}
            <div className="charts-grid">
                <div className="chart-card glass-panel animate-slide-up" style={{ animationDelay: '0.3s' }}>
                    <h3 className="chart-title">
                        <TrendingUp size={18} /> Block Utilization
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={utilizationData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                            <XAxis dataKey="name" stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
                            <YAxis stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="utliz" name="Utilization" fill="var(--accent-primary)" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-card glass-panel animate-slide-up" style={{ animationDelay: '0.4s' }}>
                    <h3 className="chart-title">
                        <Users size={18} /> Attendance
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie data={attendanceData} dataKey="value" nameKey="name"
                                 cx="50%" cy="50%" outerRadius={80} innerRadius={50}
                                 label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                 labelLine={false}>
                                {attendanceData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-card glass-panel animate-slide-up" style={{ animationDelay: '0.5s' }}>
                    <h3 className="chart-title">
                        <Building size={18} /> Department Distribution
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie data={deptData} dataKey="value" nameKey="name"
                                 cx="50%" cy="50%" outerRadius={80}
                                 label={({ name, value }) => `${name}: ${value}`}>
                                {deptData.map((_, index) => (
                                    <Cell key={`dept-${index}`} fill={DEPT_COLORS[index % DEPT_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Algorithm Info */}
            {seatingPlan?.algorithmMetadata && (
                <div className="glass-panel p-6 mt-6 animate-slide-up" style={{ animationDelay: '0.6s' }}>
                    <h3 className="chart-title mb-4">
                        <ShieldCheck size={18} /> Algorithm Audit Trail
                    </h3>
                    <div className="audit-grid">
                        <div className="audit-item">
                            <span className="audit-label">Algorithm</span>
                            <span className="audit-value">v{seatingPlan.algorithmMetadata.version}</span>
                        </div>
                        <div className="audit-item">
                            <span className="audit-label">Strategy</span>
                            <span className="audit-value">{seatingPlan.algorithmMetadata.placementStrategy}</span>
                        </div>
                        <div className="audit-item">
                            <span className="audit-label">Seed</span>
                            <span className="audit-value">{seatingPlan.algorithmMetadata.seed}</span>
                        </div>
                        <div className="audit-item">
                            <span className="audit-label">Avg Risk/Seat</span>
                            <span className="audit-value">{seatingPlan.algorithmMetadata.averageRiskPerSeat}</span>
                        </div>
                        <div className="audit-item">
                            <span className="audit-label">Violations</span>
                            <span className="audit-value" style={{
                                color: seatingPlan.algorithmMetadata.totalViolations === 0 ? 'var(--status-success)' : 'var(--status-danger)'
                            }}>
                                {seatingPlan.algorithmMetadata.totalViolations === 0 ? '✓ None' : seatingPlan.algorithmMetadata.totalViolations}
                            </span>
                        </div>
                        <div className="audit-item">
                            <span className="audit-label">Generated</span>
                            <span className="audit-value">{new Date(seatingPlan.algorithmMetadata.generatedAt).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;

import React, { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from '../context/AppContext';
import { AlertCircle, Activity, Users, Clock, AlertTriangle, ShieldCheck, RefreshCw } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from 'recharts';
import { generateSeatingPlan } from '../utils/seatingAlgorithm';
import './Monitoring.css';

const Monitoring = () => {
    const { seatingPlan, setSeatingPlan, students, halls } = useContext(AppContext);
    const [isReallocating, setIsReallocating] = useState(false);
    const [reallocateSuccess, setReallocateSuccess] = useState(false);
    const [timelineData, setTimelineData] = useState([]);
    const [currentTime, setCurrentTime] = useState(new Date());
    const tickRef = useRef(null);

    // Simulate live timeline updates
    useEffect(() => {
        if (!seatingPlan) return;

        const total = seatingPlan.totalStudentsAssigned || 0;
        const initialData = [
            { time: '09:00', occupancy: 0 },
            { time: '09:15', occupancy: Math.floor(total * 0.06) },
            { time: '09:30', occupancy: total },
            { time: '10:00', occupancy: total - Math.floor(total * 0.02) },
            { time: '10:30', occupancy: total - Math.floor(total * 0.02) },
        ];
        setTimelineData(initialData);

        // Add a new point every 10 seconds to simulate live data
        tickRef.current = setInterval(() => {
            setCurrentTime(new Date());
            setTimelineData(prev => {
                const last = prev[prev.length - 1];
                const variation = Math.floor(Math.random() * 4) - 2;
                const newOccupancy = Math.max(0, Math.min(total, (last?.occupancy || total) + variation));
                const now = new Date();
                const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
                return [...prev.slice(-15), { time: timeStr, occupancy: newOccupancy }];
            });
        }, 10000);

        return () => clearInterval(tickRef.current);
    }, [seatingPlan]);

    const handleEmergencyReallocation = () => {
        if (!seatingPlan) return;

        setIsReallocating(true);
        setTimeout(() => {
            // Re-run algorithm excluding the first hall (simulating emergency)
            const availableHalls = halls.filter(h => h.isAvailable);
            if (availableHalls.length > 1) {
                const reducedHalls = availableHalls.slice(1); // Exclude "compromised" hall
                const result = generateSeatingPlan({
                    date: seatingPlan.date,
                    session: seatingPlan.session,
                    subjects: seatingPlan.subjects,
                    studentsPerTable: 2,
                    antiCheatingMode: true,
                    autoSelectHalls: false,
                }, students, reducedHalls);

                if (result.plan) {
                    setSeatingPlan(result.plan);
                }
            }
            setIsReallocating(false);
            setReallocateSuccess(true);
            setTimeout(() => setReallocateSuccess(false), 5000);
        }, 2000);
    };

    if (!seatingPlan) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-12 text-center text-text-secondary">
                <Activity size={48} className="mb-4 opacity-50" />
                <h2 className="text-xl font-bold mb-2">No Active Exams</h2>
                <p>There are currently no active exams to monitor. Generate a seating plan first.</p>
            </div>
        );
    }

    const totalAssigned = seatingPlan.totalStudentsAssigned || 0;
    const currentOccupancy = timelineData.length > 0 ? timelineData[timelineData.length - 1].occupancy : totalAssigned;
    const absentees = totalAssigned - currentOccupancy;
    const metadata = seatingPlan.algorithmMetadata || {};

    return (
        <div className="monitoring-page animate-fade-in">
            <div className="page-header mb-6">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                        <span className="live-indicator" aria-hidden="true"></span> Live Exam Monitoring
                    </h2>
                    <p className="text-text-secondary mt-1">
                        Real-time status of Plan #{seatingPlan.planId?.slice(0, 20)} |
                        Updated: {currentTime.toLocaleTimeString()}
                    </p>
                </div>
                <button
                    className="btn-danger"
                    onClick={handleEmergencyReallocation}
                    disabled={isReallocating}
                    aria-label="Emergency Reallocation"
                >
                    {isReallocating ? (
                        <><RefreshCw size={18} className="spin" /> Reallocating...</>
                    ) : (
                        <><AlertTriangle size={18} /> Emergency Reallocation</>
                    )}
                </button>
            </div>

            {/* Alerts */}
            {reallocateSuccess && (
                <div className="status-alert success mb-4" role="alert">
                    <ShieldCheck size={18} /> Emergency reallocation completed. Students redistributed to remaining halls.
                </div>
            )}

            {/* Quick Stats */}
            <div className="monitor-stats-grid mb-6">
                <div className="monitor-stat glass-panel">
                    <Users size={22} className="text-accent-primary" />
                    <div>
                        <span className="monitor-stat-label">Total Assigned</span>
                        <span className="monitor-stat-value">{totalAssigned}</span>
                    </div>
                </div>
                <div className="monitor-stat glass-panel">
                    <Activity size={22} style={{ color: 'var(--status-success)' }} />
                    <div>
                        <span className="monitor-stat-label">Currently Present</span>
                        <span className="monitor-stat-value">{currentOccupancy}</span>
                    </div>
                </div>
                <div className="monitor-stat glass-panel">
                    <AlertCircle size={22} style={{ color: 'var(--status-danger)' }} />
                    <div>
                        <span className="monitor-stat-label">Absentees</span>
                        <span className="monitor-stat-value">{Math.max(0, absentees)}</span>
                    </div>
                </div>
                <div className="monitor-stat glass-panel">
                    <Clock size={22} style={{ color: 'var(--status-warning)' }} />
                    <div>
                        <span className="monitor-stat-label">Halls Active</span>
                        <span className="monitor-stat-value">{seatingPlan.halls?.length || 0}</span>
                    </div>
                </div>
            </div>

            {/* Algorithm Quality Badge */}
            <div className="glass-panel p-4 mb-6 flex items-center gap-4">
                <ShieldCheck size={24} className={metadata.constraintsSatisfied ? 'text-status-success' : 'text-status-warning'} />
                <div>
                    <strong>Algorithm v{metadata.version || '2.0'}: </strong>
                    <span style={{ color: metadata.constraintsSatisfied ? 'var(--status-success)' : 'var(--status-warning)' }}>
                        {metadata.constraintsSatisfied ? 'All anti-cheating constraints satisfied ✓' : `${metadata.totalViolations} constraint warnings detected`}
                    </span>
                    <span className="text-text-muted ml-3">| Avg Risk/Seat: {metadata.averageRiskPerSeat || 0}</span>
                </div>
            </div>

            {/* Live Chart */}
            <div className="glass-panel p-6 mb-6 animate-slide-up">
                <h3 className="chart-title mb-4">
                    <Activity size={18} /> Occupancy Timeline (Live)
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={timelineData}>
                        <defs>
                            <linearGradient id="occupancyGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="time" stroke="var(--text-muted)" tick={{ fontSize: 11 }} />
                        <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px' }} />
                        <Area type="monotone" dataKey="occupancy" stroke="var(--accent-primary)" strokeWidth={2} fill="url(#occupancyGrad)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Per-Hall Status */}
            <div className="halls-status-grid">
                {seatingPlan.halls?.map((hallData, index) => (
                    <div key={index} className="glass-panel p-5 animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                        <div className="hall-status-header">
                            <h4 className="font-bold">{hallData.hallInfo?.hallNumber || `Hall ${index + 1}`}</h4>
                            <span className="status-badge available">
                                <span className="dot" aria-hidden="true"></span> Active
                            </span>
                        </div>
                        <p className="text-text-secondary text-sm mt-1">{hallData.hallInfo?.blockName}</p>
                        <div className="hall-status-stats mt-3">
                            <span><Users size={14} /> {hallData.studentsAssigned} assigned</span>
                            <span><ShieldCheck size={14} /> Risk: {hallData.hallRiskScore || 0}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Monitoring;

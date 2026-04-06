import React, { useState } from 'react';
import { CheckCircle, Bell, Send, Users, AlertCircle, FileText } from 'lucide-react';
import { mockAssignments } from '../data/studentMockData';
import './AdminWelfare.css';

const AdminWelfare = () => {
    const [assignments, setAssignments] = useState(mockAssignments);
    const [selectedIds, setSelectedIds] = useState([]);
    
    // Notification state
    const [notifTarget, setNotifTarget] = useState('all');
    const [notifTitle, setNotifTitle] = useState('');
    const [notifMessage, setNotifMessage] = useState('');
    const [notifSent, setNotifSent] = useState(false);

    const toggleSelect = (id) => {
        setSelectedIds(prev => 
            prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
        );
    };

    const markSelectedAsComplete = () => {
        setAssignments(prev => prev.map(a => 
            selectedIds.includes(a.id) ? { ...a, status: 'completed' } : a
        ));
        setSelectedIds([]);
    };

    const handleSendNotification = (e) => {
        e.preventDefault();
        if (!notifTitle || !notifMessage) return;
        
        // Simulating sending notification
        setNotifSent(true);
        setTimeout(() => {
            setNotifSent(false);
            setNotifTitle('');
            setNotifMessage('');
        }, 3000);
    };

    return (
        <div className="welfare-page animate-fade-in">
            <div className="page-header mb-6">
                <div>
                    <h2 className="text-2xl font-bold">Student Welfare & Engagement</h2>
                    <p className="text-text-secondary mt-1">Manage bulk assignments and push notifications instantly.</p>
                </div>
            </div>

            <div className="welfare-grid">
                {/* Assignments Panel */}
                <div className="admin-panel glass-panel animate-slide-up">
                    <div className="panel-header">
                        <div className="flex items-center gap-2">
                            <FileText className="text-accent-primary" />
                            <h3 className="text-lg font-semibold">Bulk Assignment Management</h3>
                        </div>
                        {selectedIds.length > 0 && (
                            <button className="btn-primary small-btn flex items-center gap-2" onClick={markSelectedAsComplete}>
                                <CheckCircle size={16} /> Mark {selectedIds.length} as Complete
                            </button>
                        )}
                    </div>

                    <div className="assignments-list">
                        <div className="list-header">
                            <div className="col-checkbox">
                                <input 
                                    type="checkbox" 
                                    onChange={(e) => {
                                        if (e.target.checked) setSelectedIds(assignments.map(a => a.id));
                                        else setSelectedIds([]);
                                    }}
                                    checked={selectedIds.length === assignments.length && assignments.length > 0}
                                />
                            </div>
                            <div className="col-task">Task</div>
                            <div className="col-subject">Subject</div>
                            <div className="col-status">Status</div>
                        </div>
                        
                        <div className="list-body">
                            {assignments.map(a => (
                                <div key={a.id} className={`list-row ${selectedIds.includes(a.id) ? 'selected' : ''}`}>
                                    <div className="col-checkbox">
                                        <input 
                                            type="checkbox" 
                                            checked={selectedIds.includes(a.id)}
                                            onChange={() => toggleSelect(a.id)}
                                        />
                                    </div>
                                    <div className="col-task">
                                        <p className="font-semibold">{a.task}</p>
                                        <p className="text-xs text-text-muted">Due: {new Date(a.deadline).toLocaleDateString()}</p>
                                    </div>
                                    <div className="col-subject">
                                        <span className="badge">{a.code}</span>
                                    </div>
                                    <div className="col-status">
                                        <span className={`status-pill ${a.status === 'completed' ? 'success' : a.status === 'overdue' ? 'danger' : 'warning'}`}>
                                            {a.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Notifications Panel */}
                <div className="admin-panel glass-panel animate-slide-up delay-100">
                    <div className="panel-header">
                        <div className="flex items-center gap-2">
                            <Bell className="text-subj-orange" />
                            <h3 className="text-lg font-semibold">Quick Notifications</h3>
                        </div>
                    </div>

                    <form className="notification-form" onSubmit={handleSendNotification}>
                        <div className="form-group">
                            <label>Target Audience</label>
                            <select value={notifTarget} onChange={e => setNotifTarget(e.target.value)}>
                                <option value="all">All Students</option>
                                <option value="year1">1st Year Students</option>
                                <option value="year2">2nd Year Students</option>
                                <option value="year3">3rd Year Students</option>
                                <option value="year4">4th Year Students</option>
                                <option value="defaulters">Assignment Defaulters</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Notification Title</label>
                            <input 
                                type="text" 
                                placeholder="e.g. Mandatory Assembly Tomorrow"
                                value={notifTitle}
                                onChange={e => setNotifTitle(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Message Content</label>
                            <textarea 
                                placeholder="Enter your detailed notification message..."
                                rows="4"
                                value={notifMessage}
                                onChange={e => setNotifMessage(e.target.value)}
                                required
                            ></textarea>
                        </div>
                        
                        {notifSent && (
                            <div className="success-alert mb-4">
                                <CheckCircle size={18} />
                                <span>Notification sent successfully to selected students.</span>
                            </div>
                        )}

                        <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                            <Send size={18} /> Push Notification
                        </button>
                    </form>
                    
                    <div className="tips-box mt-6 p-4 rounded-lg bg-surface-elevated border border-border-color">
                        <h4 className="flex items-center gap-2 text-sm font-bold mb-2">
                            <AlertCircle size={16} className="text-accent-primary" /> Pro Tips
                        </h4>
                        <ul className="text-xs text-text-secondary pl-5 list-disc space-y-1">
                            <li>Select 'Assignment Defaulters' to automatically remind students with pending or overdue tasks.</li>
                            <li>Bulk mark assignments as complete if they were submitted physically.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminWelfare;

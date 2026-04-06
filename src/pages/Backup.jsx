import React, { useState, useContext, useRef } from 'react';
import { AppContext } from '../context/AppContext';
import { Download, Upload, Database, CheckCircle2, AlertCircle, RefreshCw, Trash2, Clock } from 'lucide-react';
import './Backup.css';

const Backup = () => {
    const { createBackup, restoreBackup, resetAllData, backupHistory, students, halls, seatingPlan } = useContext(AppContext);
    const [isBackingUp, setIsBackingUp] = useState(false);
    const [isRestoring, setIsRestoring] = useState(false);
    const [backupSuccess, setBackupSuccess] = useState(false);
    const [restoreResult, setRestoreResult] = useState(null);
    const fileInputRef = useRef(null);

    const handleBackup = () => {
        setIsBackingUp(true);
        setTimeout(() => {
            createBackup();
            setIsBackingUp(false);
            setBackupSuccess(true);
            setTimeout(() => setBackupSuccess(false), 3000);
        }, 800);
    };

    const handleRestoreFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsRestoring(true);
        const reader = new FileReader();
        reader.onload = (evt) => {
            const result = restoreBackup(evt.target.result);
            setIsRestoring(false);
            setRestoreResult(result);
            setTimeout(() => setRestoreResult(null), 5000);
        };
        reader.readAsText(file);
        e.target.value = '';
    };

    const handleReset = () => {
        if (window.confirm('⚠️ This will reset ALL data (students, halls, seating plans) back to defaults. Are you sure?')) {
            resetAllData();
            setRestoreResult({ success: true, message: 'System reset to defaults successfully.' });
            setTimeout(() => setRestoreResult(null), 3000);
        }
    };

    return (
        <div className="backup-page animate-fade-in">
            <div className="page-header mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gradient">System Continuity</h2>
                    <p className="text-text-secondary mt-1">Manage database backups and system restoration points.</p>
                </div>
            </div>

            {/* Status Alerts */}
            {backupSuccess && (
                <div className="status-alert success mb-4" role="alert">
                    <CheckCircle2 size={18} /> Backup created and downloaded successfully!
                </div>
            )}
            {restoreResult && (
                <div className={`status-alert ${restoreResult.success ? 'success' : 'error'} mb-4`} role="alert">
                    {restoreResult.success ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    {restoreResult.message || (restoreResult.success ? `Restored ${restoreResult.records} records` : restoreResult.error)}
                </div>
            )}

            {/* Current State Summary */}
            <div className="glass-panel p-6 mb-6 animate-slide-up">
                <h3 className="text-lg font-bold mb-3">Current System State</h3>
                <div className="state-grid">
                    <div className="state-item">
                        <span className="state-label">Students</span>
                        <span className="state-value">{students.length}</span>
                    </div>
                    <div className="state-item">
                        <span className="state-label">Halls</span>
                        <span className="state-value">{halls.length}</span>
                    </div>
                    <div className="state-item">
                        <span className="state-label">Active Plan</span>
                        <span className="state-value" style={{ color: seatingPlan ? 'var(--status-success)' : 'var(--text-muted)' }}>
                            {seatingPlan ? '✓ Yes' : '✗ None'}
                        </span>
                    </div>
                    <div className="state-item">
                        <span className="state-label">Storage</span>
                        <span className="state-value">localStorage</span>
                    </div>
                </div>
            </div>

            <div className="backup-grid">
                {/* Backup Card */}
                <div className="glass-panel p-8 flex flex-col items-center text-center animate-slide-up">
                    <div className="icon-ring bg-accent-primary/10 mb-6 border border-accent-primary/20">
                        <Download size={32} className="text-accent-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Create New Backup</h3>
                    <p className="text-text-secondary text-sm mb-6">
                        Downloads a JSON file with all students, halls, and current seating arrangements.
                    </p>
                    <button className="btn-primary w-full" onClick={handleBackup} disabled={isBackingUp}
                            aria-label="Create backup">
                        {isBackingUp ? <><RefreshCw size={18} className="spin" /> Creating...</> : <><Download size={18} /> Export Backup</>}
                    </button>
                </div>

                {/* Restore Card */}
                <div className="glass-panel p-8 flex flex-col items-center text-center animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <div className="icon-ring bg-status-warning/10 mb-6 border border-status-warning/20">
                        <Upload size={32} style={{ color: 'var(--status-warning)' }} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Restore from Backup</h3>
                    <p className="text-text-secondary text-sm mb-6">
                        Upload a previously exported JSON backup file to restore your data.
                    </p>
                    <input ref={fileInputRef} type="file" accept=".json" style={{ display: 'none' }}
                           onChange={handleRestoreFile} aria-label="Select backup file" />
                    <button className="btn-warning w-full" onClick={() => fileInputRef.current?.click()}
                            disabled={isRestoring} aria-label="Restore from backup">
                        {isRestoring ? <><RefreshCw size={18} className="spin" /> Restoring...</> : <><Upload size={18} /> Import Backup</>}
                    </button>
                </div>

                {/* Reset Card */}
                <div className="glass-panel p-8 flex flex-col items-center text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <div className="icon-ring bg-status-danger/10 mb-6 border border-status-danger/20">
                        <Trash2 size={32} style={{ color: 'var(--status-danger)' }} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Factory Reset</h3>
                    <p className="text-text-secondary text-sm mb-6">
                        Reset everything back to default sample data. This cannot be undone.
                    </p>
                    <button className="btn-danger w-full" onClick={handleReset} aria-label="Reset all data">
                        <RefreshCw size={18} /> Reset to Defaults
                    </button>
                </div>
            </div>

            {/* Backup History */}
            {backupHistory.length > 0 && (
                <div className="glass-panel p-6 mt-6 animate-slide-up">
                    <h3 className="text-lg font-bold mb-4"><Clock size={18} /> Backup History</h3>
                    <div className="history-list">
                        {backupHistory.map((b, i) => (
                            <div key={b.id || i} className="history-item">
                                <Database size={16} className="text-accent-primary" />
                                <span className="history-id">{b.id}</span>
                                <span className="history-time">{new Date(b.timestamp).toLocaleString()}</span>
                                <span className="history-records">{b.records} records</span>
                                <span className={`history-plan ${b.hasActivePlan ? 'active' : ''}`}>
                                    {b.hasActivePlan ? '✓ Plan' : '—'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Backup;

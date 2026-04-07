import React, { useState, useContext, useMemo } from 'react';
import { Database, Search, CheckCircle, RefreshCw, CheckSquare, XCircle } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import './StaffPortal.css';

const AssignmentManagement = () => {
    const { students } = useContext(AppContext);
    const depts = useMemo(() => [...new Set(students.map(s => s.department))].sort(), [students]);
    const [filterDept, setFilterDept] = useState('');
    const [filterYear, setFilterYear] = useState('');
    const [search, setSearch] = useState('');
    const [subject, setSubject] = useState('Assignment 1');
    const [statuses, setStatuses] = useState({});

    const subjects = [
        'Assignment 1', 'Assignment 2', 'Assignment 3',
        'Mini Project', 'Record Note', 'Observation Note'
    ];

    const filtered = useMemo(() => {
        return students.filter(s => {
            const matchDept = !filterDept || s.department === filterDept;
            const matchYear = !filterYear || String(s.year) === filterYear;
            const matchSrch = !search || s.name?.toLowerCase().includes(search.toLowerCase())
                                       || s.registerNumber?.toLowerCase().includes(search.toLowerCase());
            return matchDept && matchYear && matchSrch;
        }).slice(0, 60);
    }, [students, filterDept, filterYear, search]);

    const getStatus = (regNo) => statuses[`${regNo}_${subject}`] ?? null;

    const setStatus = (regNo, val) => {
        setStatuses(prev => ({ ...prev, [`${regNo}_${subject}`]: val }));
    };

    const markAll = (val) => {
        const batch = {};
        filtered.forEach(s => { batch[`${s.registerNumber}_${subject}`] = val; });
        setStatuses(prev => ({ ...prev, ...batch }));
    };

    const submitted = filtered.filter(s => getStatus(s.registerNumber) === 'submitted').length;

    return (
        <div className="sp-portal animate-fade-in">
            <div className="sp-portal-header">
                <div>
                    <h2 className="text-2xl font-bold">Assignment Tracking</h2>
                    <p className="text-text-secondary mt-1">Bulk manage student submissions and record status.</p>
                </div>
                <div className="sp-staff-badge">
                    <Database size={18} />
                    <span>Submission Control</span>
                </div>
            </div>

            <div className="sp-card sp-assign-controls mt-6">
                <div className="sp-control-row">
                    <div className="sp-form-group sp-control-item">
                        <label>Task Selecion</label>
                        <select value={subject} onChange={e => setSubject(e.target.value)}>
                            {subjects.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                        </select>
                    </div>
                    <div className="sp-form-group sp-control-item">
                        <label>Department</label>
                        <select value={filterDept} onChange={e => setFilterDept(e.target.value)}>
                            <option value="">All Departments</option>
                            {depts.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                    <div className="sp-form-group sp-control-item">
                        <label>Year</label>
                        <select value={filterYear} onChange={e => setFilterYear(e.target.value)}>
                            <option value="">All Years</option>
                            {['1', '2', '3', '4'].map(y => <option key={y} value={y}>Year {y}</option>)}
                        </select>
                    </div>
                </div>

                <div className="sp-bulk-btns mt-4 flex items-center gap-3">
                    <button className="btn-secondary sp-bulk-btn" onClick={() => markAll('submitted')}>
                        <CheckSquare size={14} /> Mark All Submitted
                    </button>
                    <button className="btn-secondary sp-bulk-btn" onClick={() => markAll('not_submitted')}>
                        <XCircle size={14} /> Mark All Pending
                    </button>
                    <button className="btn-secondary sp-bulk-btn" onClick={() => markAll(null)}>
                        <RefreshCw size={14} /> Reset Selection
                    </button>
                    
                    <div className="sp-assign-stats" style={{marginLeft: 'auto'}}>
                        <span className="sp-stat-pill sp-stat-green"><CheckCircle size={13} /> {submitted} / {filtered.length} Success</span>
                    </div>
                </div>
            </div>

            <div className="sp-card sp-table-card mt-6">
                <div className="sp-table-wrap">
                    <table className="sp-table">
                        <thead>
                            <tr>
                                <th>Reg Number</th>
                                <th>Name</th>
                                <th>Class</th>
                                <th>Status - {subject}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(s => {
                                const st = getStatus(s.registerNumber);
                                return (
                                    <tr key={s.registerNumber} className={st === 'submitted' ? 'row-green' : st === 'not_submitted' ? 'row-red' : ''}>
                                        <td className="sp-reg-cell">{s.registerNumber}</td>
                                        <td>{s.name}</td>
                                        <td>{s.department} (Y{s.year})</td>
                                        <td>
                                            <div className="sp-status-btns">
                                                <button
                                                    className={`sp-status-btn ${st === 'submitted' ? 'active-green' : ''}`}
                                                    onClick={() => setStatus(s.registerNumber, st === 'submitted' ? null : 'submitted')}>
                                                    <CheckCircle size={14} /> Done
                                                </button>
                                                <button
                                                    className={`sp-status-btn ${st === 'not_submitted' ? 'active-red' : ''}`}
                                                    onClick={() => setStatus(s.registerNumber, st === 'not_submitted' ? null : 'not_submitted')}>
                                                    <XCircle size={14} /> Missed
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AssignmentManagement;

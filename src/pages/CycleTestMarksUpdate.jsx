import React, { useState, useContext, useMemo } from 'react';
import { CalendarCheck, Search, Save, CheckCircle, GraduationCap, ArrowLeft, Filter } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import './StaffPortal.css';

const CycleTestMarksUpdate = () => {
    const { students } = useContext(AppContext);
    const [filterDept, setFilterDept] = useState('');
    const [filterYear, setFilterYear] = useState('');
    const [search, setSearch] = useState('');
    const [examType, setExamType] = useState('Cycle Test 1');
    const [marks, setMarks] = useState({});
    const [saved, setSaved] = useState(false);

    const depts = useMemo(() => [...new Set(students.map(s => s.department))].sort(), [students]);
    const examTypes = ['Cycle Test 1', 'Cycle Test 2', 'Cycle Test 3'];
    const MAX_MARK = 100;

    const filtered = useMemo(() => {
        return students.filter(s => {
            const matchDept = !filterDept || s.department === filterDept;
            const matchYear = !filterYear || String(s.year) === filterYear;
            const matchSrch = !search || s.name?.toLowerCase().includes(search.toLowerCase())
                                       || s.registerNumber?.toLowerCase().includes(search.toLowerCase());
            return matchDept && matchYear && matchSrch;
        }).slice(0, 50);
    }, [students, filterDept, filterYear, search]);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    const setMark = (regNo, val) => {
        const v = val === '' ? '' : Math.min(MAX_MARK, Math.max(0, Number(val)));
        setMarks(prev => ({ ...prev, [`${regNo}_${examType}`]: v }));
    };

    const getMark = (regNo) => marks[`${regNo}_${examType}`] ?? '';

    return (
        <div className="sp-portal animate-fade-in">
            <div className="sp-portal-header">
                <div>
                    <h2 className="text-2xl font-bold">Cycle Test Management</h2>
                    <p className="text-text-secondary mt-1">Manage performance records for Cycle Test 1, 2, and 3.</p>
                </div>
                <div className="sp-staff-badge" style={{ background: 'rgba(168, 85, 247, 0.1)', color: 'var(--accent-purple)' }}>
                    <CalendarCheck size={18} />
                    <span>Cycle Test</span>
                </div>
            </div>

            <div className="sp-card sp-assign-controls mt-6">
                <div className="sp-control-row">
                    <div className="sp-form-group sp-control-item">
                        <label>Cycle Phase</label>
                        <select value={examType} onChange={e => setExamType(e.target.value)}>
                            {examTypes.map(et => <option key={et} value={et}>{et} (/100)</option>)}
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
                    <div className="sp-form-group sp-control-item sp-search-wrap">
                        <label>Search Student</label>
                        <div className="sp-search-box">
                            <Search size={14} />
                            <input placeholder="Name or Register No." value={search} onChange={e => setSearch(e.target.value)} />
                        </div>
                    </div>
                </div>

                <div className="sp-save-row mt-4">
                    {saved && <span className="sp-save-ok"><CheckCircle size={14} /> Record updated Successfully!</span>}
                    <button className="btn-primary sp-save-btn" onClick={handleSave} style={{ background: 'var(--accent-purple)' }}>
                        <Save size={15} /> Save Cycle Marks
                    </button>
                </div>
            </div>

            <div className="sp-card sp-table-card mt-6">
                <div className="sp-table-wrap">
                    <table className="sp-table">
                        <thead>
                            <tr>
                                <th>Reg Number</th>
                                <th>Name</th>
                                <th>Section</th>
                                <th>{examType} Mark (max 100)</th>
                                <th>Scale</th>
                                <th>Grade</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(s => {
                                const m = getMark(s.registerNumber);
                                const pct = m !== '' ? Math.round((Number(m) / MAX_MARK) * 100) : null;
                                const grade = pct === null ? '—'
                                    : pct >= 90 ? 'O'
                                    : pct >= 80 ? 'A+'
                                    : pct >= 70 ? 'A'
                                    : pct >= 60 ? 'B+'
                                    : pct >= 50 ? 'B'
                                    : 'F';
                                return (
                                    <tr key={s.registerNumber}>
                                        <td className="sp-reg-cell">{s.registerNumber}</td>
                                        <td>{s.name}</td>
                                        <td>{s.department} - Year {s.year}</td>
                                        <td>
                                            <input
                                                type="number"
                                                className="sp-mark-input"
                                                value={m}
                                                onChange={e => setMark(s.registerNumber, e.target.value)}
                                                placeholder="0"
                                            />
                                        </td>
                                        <td>
                                            {pct !== null && (
                                                <div className="sp-mark-bar" style={{ width: '80px' }}>
                                                    <div className="sp-mark-fill" style={{ width: `${pct}%`, background: pct < 50 ? '#ef4444' : pct >= 80 ? '#10b981' : '#f59e0b' }} />
                                                </div>
                                            )}
                                        </td>
                                        <td><span className={`sp-grade-badge ${pct === null ? '' : pct < 50 ? 'grade-f' : 'grade-a'}`}>{grade}</span></td>
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

export default CycleTestMarksUpdate;

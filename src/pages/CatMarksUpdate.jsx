import React, { useState, useContext, useMemo } from 'react';
import { Award, Search, Save, CheckCircle, GraduationCap, ArrowLeft, Filter } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import './StaffPortal.css';

const CatMarksUpdate = () => {
    const { students } = useContext(AppContext);
    const [filterDept, setFilterDept] = useState('');
    const [filterYear, setFilterYear] = useState('');
    const [search, setSearch] = useState('');
    const [examType, setExamType] = useState('CAT 1');
    const [marks, setMarks] = useState({});
    const [saved, setSaved] = useState(false);

    const depts = useMemo(() => [...new Set(students.map(s => s.department))].sort(), [students]);
    const examTypes = ['CAT 1', 'CAT 2', 'CAT 3'];
    const MAX_MARK = 50;

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
                    <h2 className="text-2xl font-bold">Update CAT Marks</h2>
                    <p className="text-text-secondary mt-1">Academic record management for CAT 1, 2, and 3.</p>
                </div>
                <div className="sp-staff-badge" style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-secondary)' }}>
                    <Award size={18} />
                    <span>CAT Marks</span>
                </div>
            </div>

            <div className="sp-card sp-assign-controls mt-6">
                <div className="sp-control-row">
                    <div className="sp-form-group sp-control-item">
                        <label>CAT Phase</label>
                        <select value={examType} onChange={e => setExamType(e.target.value)}>
                            {examTypes.map(et => <option key={et} value={et}>{et} (/50)</option>)}
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
                    {saved && <span className="sp-save-ok"><CheckCircle size={14} /> Marks uploaded to server!</span>}
                    <button className="btn-primary sp-save-btn" onClick={handleSave}>
                        <Save size={15} /> Upload CAT Marks
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
                                <th>{examType} Mark (max 50)</th>
                                <th>Percentage</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(s => {
                                const m = getMark(s.registerNumber);
                                const pct = m !== '' ? Math.round((Number(m) / MAX_MARK) * 100) : 0;
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
                                                placeholder="Enter mark"
                                            />
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <div className="sp-mark-bar" style={{ flex: 1, minWidth: '60px' }}>
                                                    <div className="sp-mark-fill" style={{ width: `${pct}%`, background: pct < 50 ? '#ef4444' : '#10b981' }} />
                                                </div>
                                                <span style={{ fontSize: '0.8rem', minWidth: '35px' }}>{pct}%</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`status-badge ${m === '' ? 'urgent' : 'available'}`} style={{fontSize:'0.7rem', padding:'2px 8px'}}>
                                                {m === '' ? 'Pending' : 'Entered'}
                                            </span>
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

export default CatMarksUpdate;

import React, { useState, useContext, useMemo } from 'react';
import {
  Bell, Send, CheckSquare, Square, BookOpen, Award,
  Filter, Search, Users, Hash, Layers, ChevronDown,
  CheckCircle, XCircle, AlertCircle, RefreshCw, Save,
  GraduationCap, ClipboardList, MessageSquare
} from 'lucide-react';
import { AppContext } from '../context/AppContext';
import './StaffPortal.css';

// ── Tabs ─────────────────────────────────────────────────────────────
const TABS = [
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'assignments',   label: 'Assignments',   icon: ClipboardList },
  { id: 'marks',         label: 'Marks Entry',   icon: GraduationCap },
];

// ── Departments & Sections from context ─────────────────────────────
const TARGET_OPTIONS = [
  { value: 'all',        label: 'All Students' },
  { value: 'dept',       label: 'By Department' },
  { value: 'section',    label: 'By Section' },
  { value: 'register',   label: 'By Register Number' },
];

const EXAM_TYPES = ['Cycle Test 1', 'Cycle Test 2', 'Cycle Test 3', 'CAT 1', 'CAT 2', 'CAT 3'];

// ── Notification Panel ────────────────────────────────────────────────
const NotificationPanel = ({ students }) => {
  const depts    = useMemo(() => [...new Set(students.map(s => s.department))].sort(), [students]);
  const sections = useMemo(() => [...new Set(students.map(s => s.section || s.year + ''))].sort(), [students]);

  const [targetType, setTargetType]   = useState('all');
  const [targetDept, setTargetDept]   = useState('');
  const [targetSec,  setTargetSec]    = useState('');
  const [regInput,   setRegInput]     = useState('');
  const [title,      setTitle]        = useState('');
  const [message,    setMessage]      = useState('');
  const [type,       setType]         = useState('info');
  const [sent,       setSent]         = useState(false);
  const [history,    setHistory]      = useState([]);

  const recipientCount = useMemo(() => {
    if (targetType === 'all') return students.length;
    if (targetType === 'dept' && targetDept) return students.filter(s => s.department === targetDept).length;
    if (targetType === 'section' && targetSec) return students.filter(s => String(s.section || s.year) === targetSec).length;
    if (targetType === 'register') {
      const regs = regInput.split(',').map(r => r.trim()).filter(Boolean);
      return regs.length;
    }
    return 0;
  }, [targetType, targetDept, targetSec, regInput, students]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!title || !message) return;
    const entry = {
      id: Date.now(),
      title, message, type,
      target: targetType === 'all' ? 'All Students'
             : targetType === 'dept' ? `Dept: ${targetDept}`
             : targetType === 'section' ? `Section: ${targetSec}`
             : `Reg: ${regInput}`,
      recipients: recipientCount,
      sentAt: new Date().toLocaleTimeString(),
    };
    setHistory(prev => [entry, ...prev.slice(0, 9)]);
    setSent(true);
    setTitle(''); setMessage('');
    setTimeout(() => setSent(false), 3500);
  };

  return (
    <div className="sp-panel-grid">
      {/* Compose */}
      <div className="sp-card">
        <h3 className="sp-card-title"><MessageSquare size={16} /> Compose Notification</h3>

        <form onSubmit={handleSend} className="sp-form">
          {/* Targeting */}
          <div className="sp-form-group">
            <label>Target Audience</label>
            <select value={targetType} onChange={e => { setTargetType(e.target.value); setTargetDept(''); setTargetSec(''); setRegInput(''); }}>
              {TARGET_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          {targetType === 'dept' && (
            <div className="sp-form-group">
              <label>Select Department</label>
              <select value={targetDept} onChange={e => setTargetDept(e.target.value)} required>
                <option value="">-- Choose Department --</option>
                {depts.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          )}

          {targetType === 'section' && (
            <div className="sp-form-group">
              <label>Select Section / Year</label>
              <select value={targetSec} onChange={e => setTargetSec(e.target.value)} required>
                <option value="">-- Choose Section --</option>
                {sections.map(s => <option key={s} value={s}>Year / Section {s}</option>)}
              </select>
            </div>
          )}

          {targetType === 'register' && (
            <div className="sp-form-group">
              <label>Register Numbers (comma-separated)</label>
              <textarea
                placeholder="e.g. 21EC001, 21EC002, 21CS003"
                value={regInput}
                onChange={e => setRegInput(e.target.value)}
                rows={2}
                required
              />
            </div>
          )}

          {/* Notification type */}
          <div className="sp-form-group">
            <label>Type</label>
            <div className="sp-type-pills">
              {['info','warning','success','urgent'].map(t => (
                <button key={t} type="button"
                  className={`sp-type-pill sp-type-${t} ${type === t ? 'active' : ''}`}
                  onClick={() => setType(t)}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="sp-form-group">
            <label>Title</label>
            <input type="text" placeholder="e.g. Assignment Due Reminder" value={title}
              onChange={e => setTitle(e.target.value)} required />
          </div>

          <div className="sp-form-group">
            <label>Message</label>
            <textarea rows={4} placeholder="Write your notification here..."
              value={message} onChange={e => setMessage(e.target.value)} required />
          </div>

          {/* Recipient preview */}
          <div className="sp-recipient-bar">
            <Users size={14} />
            <span>Sending to <strong>{recipientCount}</strong> student{recipientCount !== 1 ? 's' : ''}</span>
          </div>

          {sent && (
            <div className="sp-success-alert">
              <CheckCircle size={16} /> Notification sent successfully!
            </div>
          )}

          <button type="submit" className="btn-primary sp-send-btn">
            <Send size={16} /> Push Notification
          </button>
        </form>
      </div>

      {/* History */}
      <div className="sp-card">
        <h3 className="sp-card-title"><Bell size={16} /> Sent History</h3>
        {history.length === 0 ? (
          <div className="sp-empty-state">
            <Bell size={32} />
            <p>No notifications sent yet.</p>
          </div>
        ) : (
          <div className="sp-notif-history">
            {history.map(h => (
              <div key={h.id} className={`sp-notif-item sp-type-${h.type}`}>
                <div className="sp-notif-meta">
                  <span className={`sp-notif-badge sp-type-${h.type}`}>{h.type}</span>
                  <span className="sp-notif-time">{h.sentAt} · {h.recipients} recipients</span>
                </div>
                <p className="sp-notif-title">{h.title}</p>
                <p className="sp-notif-body">{h.message}</p>
                <p className="sp-notif-target">{h.target}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ── Assignment Tracker Panel ──────────────────────────────────────────
const AssignmentPanel = ({ students }) => {
  const depts   = useMemo(() => [...new Set(students.map(s => s.department))].sort(), [students]);
  const [filterDept, setFilterDept] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [search,     setSearch]     = useState('');
  const [subject,    setSubject]    = useState('Assignment 1');
  const [statuses,   setStatuses]   = useState({});

  const subjects = [
    'Assignment 1','Assignment 2','Assignment 3',
    'Mini Project','Record Note','Observation Note'
  ];
  const years = ['1','2','3','4'];

  const filtered = useMemo(() => {
    return students.filter(s => {
      const matchDept = !filterDept || s.department === filterDept;
      const matchYear = !filterYear || String(s.year) === filterYear;
      const matchSrch = !search    || s.name?.toLowerCase().includes(search.toLowerCase())
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

  const submitted   = filtered.filter(s => getStatus(s.registerNumber) === 'submitted').length;
  const notSubmitted= filtered.filter(s => getStatus(s.registerNumber) === 'not_submitted').length;

  return (
    <div className="sp-assign-page">
      {/* Controls */}
      <div className="sp-assign-controls sp-card">
        <div className="sp-control-row">
          <div className="sp-form-group sp-control-item">
            <label>Assignment / Task</label>
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
              {years.map(y => <option key={y} value={y}>Year {y}</option>)}
            </select>
          </div>
          <div className="sp-form-group sp-control-item sp-search-wrap">
            <label>Search</label>
            <div className="sp-search-box">
              <Search size={14} />
              <input placeholder="Name or Reg No." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="sp-assign-stats">
          <span className="sp-stat-pill sp-stat-green"><CheckCircle size={13} /> {submitted} Submitted</span>
          <span className="sp-stat-pill sp-stat-red"><XCircle size={13} /> {notSubmitted} Not Submitted</span>
          <span className="sp-stat-pill sp-stat-grey">· {filtered.length - submitted - notSubmitted} Pending</span>
        </div>

        <div className="sp-bulk-btns">
          <button className="btn-secondary sp-bulk-btn" onClick={() => markAll('submitted')}>
            <CheckSquare size={14} /> Mark All Submitted
          </button>
          <button className="btn-secondary sp-bulk-btn" onClick={() => markAll('not_submitted')}>
            <XCircle size={14} /> Mark All Not Submitted
          </button>
          <button className="btn-secondary sp-bulk-btn" onClick={() => markAll(null)}>
            <RefreshCw size={14} /> Reset All
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="sp-card sp-table-card">
        <div className="sp-table-wrap">
          <table className="sp-table">
            <thead>
              <tr>
                <th>Reg Number</th>
                <th>Name</th>
                <th>Department</th>
                <th>Year</th>
                <th>Status — {subject}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => {
                const st = getStatus(s.registerNumber);
                return (
                  <tr key={s.registerNumber} className={st === 'submitted' ? 'row-green' : st === 'not_submitted' ? 'row-red' : ''}>
                    <td className="sp-reg-cell">{s.registerNumber}</td>
                    <td>{s.name}</td>
                    <td>{s.department}</td>
                    <td>Year {s.year}</td>
                    <td>
                      <div className="sp-status-btns">
                        <button
                          className={`sp-status-btn ${st === 'submitted' ? 'active-green' : ''}`}
                          onClick={() => setStatus(s.registerNumber, st === 'submitted' ? null : 'submitted')}>
                          <CheckCircle size={14} /> Yes
                        </button>
                        <button
                          className={`sp-status-btn ${st === 'not_submitted' ? 'active-red' : ''}`}
                          onClick={() => setStatus(s.registerNumber, st === 'not_submitted' ? null : 'not_submitted')}>
                          <XCircle size={14} /> No
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

// ── Marks Entry Panel ─────────────────────────────────────────────────
const MarksPanel = ({ students }) => {
  const depts   = useMemo(() => [...new Set(students.map(s => s.department))].sort(), [students]);
  const [filterDept, setFilterDept] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [search,     setSearch]     = useState('');
  const [examType,   setExamType]   = useState('Cycle Test 1');
  const [marks,      setMarks]      = useState({});
  const [saved,      setSaved]      = useState(false);

  const MAX_MARKS = {
    'Cycle Test 1': 100, 'Cycle Test 2': 100, 'Cycle Test 3': 100,
    'CAT 1': 50,         'CAT 2': 50,         'CAT 3': 50,
  };

  const filtered = useMemo(() => {
    return students.filter(s => {
      const matchDept = !filterDept || s.department === filterDept;
      const matchYear = !filterYear || String(s.year) === filterYear;
      const matchSrch = !search    || s.name?.toLowerCase().includes(search.toLowerCase())
                                   || s.registerNumber?.toLowerCase().includes(search.toLowerCase());
      return matchDept && matchYear && matchSrch;
    }).slice(0, 60);
  }, [students, filterDept, filterYear, search]);

  const getMark = (regNo) => marks[`${regNo}_${examType}`] ?? '';

  const setMark = (regNo, val) => {
    const max = MAX_MARKS[examType];
    const v = val === '' ? '' : Math.min(max, Math.max(0, Number(val)));
    setMarks(prev => ({ ...prev, [`${regNo}_${examType}`]: v }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const entered  = filtered.filter(s => getMark(s.registerNumber) !== '').length;
  const avg      = entered > 0
    ? (filtered.reduce((sum, s) => sum + (Number(getMark(s.registerNumber)) || 0), 0) / entered).toFixed(1)
    : '—';

  return (
    <div className="sp-assign-page">
      {/* Controls */}
      <div className="sp-card sp-assign-controls">
        <div className="sp-control-row">
          <div className="sp-form-group sp-control-item">
            <label>Exam / Test</label>
            <select value={examType} onChange={e => setExamType(e.target.value)}>
              {EXAM_TYPES.map(et => <option key={et} value={et}>{et} (/{MAX_MARKS[et]})</option>)}
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
              {['1','2','3','4'].map(y => <option key={y} value={y}>Year {y}</option>)}
            </select>
          </div>
          <div className="sp-form-group sp-control-item sp-search-wrap">
            <label>Search</label>
            <div className="sp-search-box">
              <Search size={14} />
              <input placeholder="Name or Reg No." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="sp-marks-stats">
          <span className="sp-stat-pill sp-stat-blue"><Award size={13} /> {entered} / {filtered.length} Entered</span>
          <span className="sp-stat-pill sp-stat-grey">Avg: <strong>{avg}</strong></span>
          <span className="sp-stat-pill sp-stat-grey">Max: <strong>{MAX_MARKS[examType]}</strong></span>
        </div>

        <div className="sp-save-row">
          {saved && <span className="sp-save-ok"><CheckCircle size={14} /> Marks saved!</span>}
          <button className="btn-primary sp-save-btn" onClick={handleSave}>
            <Save size={15} /> Save All Marks
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="sp-card sp-table-card">
        <div className="sp-table-wrap">
          <table className="sp-table">
            <thead>
              <tr>
                <th>Reg Number</th>
                <th>Name</th>
                <th>Department</th>
                <th>Year</th>
                <th>{examType} <span className="sp-max-tag">/{MAX_MARKS[examType]}</span></th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => {
                const m   = getMark(s.registerNumber);
                const max = MAX_MARKS[examType];
                const pct = m !== '' ? Math.round((Number(m) / max) * 100) : null;
                const grade = pct === null ? '—'
                  : pct >= 90 ? 'O'
                  : pct >= 80 ? 'A+'
                  : pct >= 70 ? 'A'
                  : pct >= 60 ? 'B+'
                  : pct >= 50 ? 'B'
                  : 'F';
                const gradeClass = pct === null ? '' : pct < 50 ? 'grade-f' : pct >= 80 ? 'grade-a' : 'grade-b';

                return (
                  <tr key={s.registerNumber}>
                    <td className="sp-reg-cell">{s.registerNumber}</td>
                    <td>{s.name}</td>
                    <td>{s.department}</td>
                    <td>Year {s.year}</td>
                    <td>
                      <div className="sp-mark-input-wrap">
                        <input
                          type="number"
                          min="0"
                          max={max}
                          placeholder="—"
                          value={m}
                          onChange={e => setMark(s.registerNumber, e.target.value)}
                          className="sp-mark-input"
                        />
                        {m !== '' && (
                          <div className="sp-mark-bar">
                            <div className="sp-mark-fill" style={{
                              width: `${pct}%`,
                              background: pct < 50 ? '#ef4444' : pct >= 80 ? '#10b981' : '#f59e0b'
                            }} />
                          </div>
                        )}
                      </div>
                    </td>
                    <td><span className={`sp-grade-badge ${gradeClass}`}>{grade}</span></td>
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

// ── Main StaffPortal Component ────────────────────────────────────────
const StaffPortal = () => {
  const { students } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('notifications');

  return (
    <div className="sp-portal animate-fade-in">
      {/* Page header */}
      <div className="sp-portal-header">
        <div>
          <h2 className="text-2xl font-bold">Staff Portal</h2>
          <p className="text-text-secondary mt-1">
            Send notifications, track assignments, and update student marks.
          </p>
        </div>
        <div className="sp-staff-badge">
          <GraduationCap size={18} />
          <span>Staff Access</span>
        </div>
      </div>

      {/* Tab bar */}
      <div className="sp-tab-bar">
        {TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`sp-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Panel content */}
      <div className="sp-tab-content">
        {activeTab === 'notifications' && <NotificationPanel students={students} />}
        {activeTab === 'assignments'   && <AssignmentPanel   students={students} />}
        {activeTab === 'marks'         && <MarksPanel        students={students} />}
      </div>
    </div>
  );
};

export default StaffPortal;

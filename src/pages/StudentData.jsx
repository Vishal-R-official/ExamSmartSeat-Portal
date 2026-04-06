import React, { useContext, useState, useRef } from 'react';
import { AppContext } from '../context/AppContext';
import { Search, Plus, Upload, Filter, Trash2, Edit, X, CheckCircle2, FileUp } from 'lucide-react';
import './StudentData.css';

const StudentData = () => {
    const { students, addStudent, updateStudent, deleteStudent, importStudents } = useContext(AppContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'registerNumber', direction: 'asc' });
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [filterDept, setFilterDept] = useState('');
    const [filterYear, setFilterYear] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [importResult, setImportResult] = useState(null);
    const fileInputRef = useRef(null);

    const [newStudent, setNewStudent] = useState({
        registerNumber: '', name: '', department: '', year: '1', subjectCode: '', subjectName: '', hall: '', seat: '', section: ''
    });
    const [editData, setEditData] = useState({});

    // Unique departments and years for filtering
    const departments = [...new Set(students.map(s => s.department))].sort();
    const years = [...new Set(students.map(s => s.year))].sort();

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
        setSortConfig({ key, direction });
    };

    const sortedStudents = [...students].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    const filteredStudents = sortedStudents.filter(s => {
        const matchesSearch = !searchTerm ||
            s.registerNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.subjectCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (s.hall || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (s.seat || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDept = !filterDept || s.department === filterDept;
        const matchesYear = !filterYear || s.year === filterYear;
        return matchesSearch && matchesDept && matchesYear;
    });

    const handleAddSubmit = (e) => {
        e.preventDefault();
        addStudent(newStudent);
        setNewStudent({ registerNumber: '', name: '', department: '', year: '1', subjectCode: '', subjectName: '' });
        setShowAddForm(false);
    };

    const handleEditStart = (student) => {
        setEditingId(student.id);
        setEditData({ ...student });
    };

    const handleEditSave = () => {
        updateStudent(editingId, editData);
        setEditingId(null);
        setEditData({});
    };

    const handleEditCancel = () => {
        setEditingId(null);
        setEditData({});
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            deleteStudent(id);
        }
    };

    // CSV Import
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const text = evt.target.result;
                const lines = text.split('\n').filter(l => l.trim());
                if (lines.length < 2) {
                    setImportResult({ success: false, message: 'CSV must have header + at least 1 data row' });
                    return;
                }

                // Parse header
                const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
                const requiredFields = ['registernumber', 'name', 'department', 'year', 'subjectcode', 'subjectname'];
                const fieldMap = {
                    'registernumber': 'registerNumber', 'register_number': 'registerNumber', 'reg_no': 'registerNumber',
                    'name': 'name', 'student_name': 'name', 'studentname': 'name',
                    'department': 'department', 'dept': 'department',
                    'year': 'year',
                    'subjectcode': 'subjectCode', 'subject_code': 'subjectCode', 'sub_code': 'subjectCode',
                    'subjectname': 'subjectName', 'subject_name': 'subjectName', 'sub_name': 'subjectName',
                };

                const columnMap = {};
                headers.forEach((h, i) => {
                    const mapped = fieldMap[h.replace(/\s+/g, '').toLowerCase()];
                    if (mapped) columnMap[mapped] = i;
                });

                // Parse data rows
                const parsed = [];
                for (let i = 1; i < lines.length; i++) {
                    const values = lines[i].split(',').map(v => v.trim());
                    if (values.length < 4) continue;

                    parsed.push({
                        registerNumber: values[columnMap.registerNumber] || `IMPORT_${i}`,
                        name: values[columnMap.name] || 'Unknown',
                        department: values[columnMap.department] || 'GEN',
                        year: values[columnMap.year] || '1',
                        subjectCode: values[columnMap.subjectCode] || 'GEN',
                        subjectName: values[columnMap.subjectName] || 'General',
                    });
                }

                if (parsed.length > 0) {
                    const count = importStudents(parsed);
                    setImportResult({ success: true, message: `Successfully imported ${count} students!` });
                } else {
                    setImportResult({ success: false, message: 'No valid student records found in CSV' });
                }
            } catch (err) {
                setImportResult({ success: false, message: `Import error: ${err.message}` });
            }
            // Reset file input
            e.target.value = '';
        };
        reader.readAsText(file);
    };

    return (
        <div className="student-data-page animate-fade-in">
            <div className="page-header">
                <div>
                    <h2 className="text-2xl font-bold">Student Database</h2>
                    <p className="text-text-secondary mt-1">
                        {filteredStudents.length} of {students.length} students shown
                    </p>
                </div>
                <div className="header-actions">
                    <button className="btn-secondary" onClick={() => setShowFilters(!showFilters)} aria-label="Toggle Filters">
                        <Filter size={18} /> Filter
                    </button>
                    <button className="btn-secondary" onClick={() => fileInputRef.current?.click()} aria-label="Import CSV">
                        <Upload size={18} /> Import CSV
                    </button>
                    <input ref={fileInputRef} type="file" accept=".csv,.txt" style={{ display: 'none' }}
                           onChange={handleFileUpload} aria-label="Select CSV file" />
                    <button className="btn-primary" onClick={() => setShowAddForm(!showAddForm)} aria-label="Add Student">
                        <Plus size={18} /> Add Student
                    </button>
                </div>
            </div>

            {/* Import Result */}
            {importResult && (
                <div className={`import-result glass-panel mb-4 ${importResult.success ? 'success' : 'error'}`}
                     role="alert">
                    {importResult.success ? <CheckCircle2 size={18} /> : <X size={18} />}
                    <span>{importResult.message}</span>
                    <button className="close-btn" onClick={() => setImportResult(null)} aria-label="Dismiss">
                        <X size={14} />
                    </button>
                </div>
            )}

            {/* Filters */}
            {showFilters && (
                <div className="filter-bar glass-panel mb-4 animate-slide-up">
                    <div className="filter-group">
                        <label>Department</label>
                        <select value={filterDept} onChange={e => setFilterDept(e.target.value)}
                                aria-label="Filter by department">
                            <option value="">All Departments</option>
                            {departments.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                    <div className="filter-group">
                        <label>Year</label>
                        <select value={filterYear} onChange={e => setFilterYear(e.target.value)}
                                aria-label="Filter by year">
                            <option value="">All Years</option>
                            {years.map(y => <option key={y} value={y}>Year {y}</option>)}
                        </select>
                    </div>
                    <button className="btn-text" onClick={() => { setFilterDept(''); setFilterYear(''); }}>
                        Clear Filters
                    </button>
                </div>
            )}

            {/* Add Form */}
            {showAddForm && (
                <div className="add-student-form glass-panel animate-slide-up mb-4">
                    <h3 className="text-lg font-semibold mb-4">Add New Student</h3>
                    <form onSubmit={handleAddSubmit} className="form-grid">
                        <div className="form-group">
                            <label>Register Number</label>
                            <input required type="text" value={newStudent.registerNumber}
                                   onChange={e => setNewStudent({ ...newStudent, registerNumber: e.target.value })}
                                   placeholder="e.g. 21CSE101" />
                        </div>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input required type="text" value={newStudent.name}
                                   onChange={e => setNewStudent({ ...newStudent, name: e.target.value })}
                                   placeholder="e.g. John Doe" />
                        </div>
                        <div className="form-group">
                            <label>Department</label>
                            <input required type="text" value={newStudent.department}
                                   onChange={e => setNewStudent({ ...newStudent, department: e.target.value })}
                                   placeholder="e.g. CSE" />
                        </div>
                        <div className="form-group">
                            <label>Year</label>
                            <select value={newStudent.year}
                                    onChange={e => setNewStudent({ ...newStudent, year: e.target.value })}>
                                <option value="1">1st Year</option>
                                <option value="2">2nd Year</option>
                                <option value="3">3rd Year</option>
                                <option value="4">4th Year</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Subject Code</label>
                            <input required type="text" value={newStudent.subjectCode}
                                   onChange={e => setNewStudent({ ...newStudent, subjectCode: e.target.value })}
                                   placeholder="e.g. AI" />
                        </div>
                        <div className="form-group">
                            <label>Subject Name</label>
                            <input required type="text" value={newStudent.subjectName}
                                   onChange={e => setNewStudent({ ...newStudent, subjectName: e.target.value })}
                                   placeholder="e.g. Artificial Intelligence" />
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn-primary">Add Student</button>
                            <button type="button" className="btn-secondary" onClick={() => setShowAddForm(false)}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Search */}
            <div className="search-bar glass-panel mb-4">
                <Search size={20} className="search-icon" />
                <input type="text" placeholder="Search by name, register number, or subject..."
                       value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                       aria-label="Search students" />
            </div>

            {/* Table */}
            <div className="table-container glass-panel">
                <table className="data-table" role="table" aria-label="Student data table">
                    <thead>
                        <tr>
                            {['registerNumber', 'name', 'department', 'year', 'subjectCode', 'hall', 'seat', 'section'].map(key => (
                                <th key={key} onClick={() => handleSort(key)} className="sortable"
                                    role="columnheader" aria-sort={sortConfig.key === key ? sortConfig.direction === 'asc' ? 'ascending' : 'descending' : 'none'}>
                                    {key === 'registerNumber' ? 'Reg. No' :
                                     key === 'subjectCode' ? 'Subject Code' :
                                     key === 'hall' ? 'Hall No' :
                                     key === 'seat' ? 'Seat No' :
                                     key === 'section' ? 'Sec' :
                                     key.charAt(0).toUpperCase() + key.slice(1)}
                                    {sortConfig.key === key && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
                                </th>
                            ))}
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.map((student) => (
                            <tr key={student.id}>
                                {editingId === student.id ? (
                                    <>
                                        <td><input value={editData.registerNumber} onChange={e => setEditData({ ...editData, registerNumber: e.target.value })} /></td>
                                        <td><input value={editData.name} onChange={e => setEditData({ ...editData, name: e.target.value })} /></td>
                                        <td><input value={editData.department} onChange={e => setEditData({ ...editData, department: e.target.value })} /></td>
                                        <td><input value={editData.year} onChange={e => setEditData({ ...editData, year: e.target.value })} style={{ width: '50px' }} /></td>
                                        <td><input value={editData.subjectCode} onChange={e => setEditData({ ...editData, subjectCode: e.target.value })} /></td>
                                        <td><input value={editData.hall || ''} onChange={e => setEditData({ ...editData, hall: e.target.value })} /></td>
                                        <td><input value={editData.seat || ''} onChange={e => setEditData({ ...editData, seat: e.target.value })} style={{ width: '60px' }} /></td>
                                        <td><input value={editData.section || ''} onChange={e => setEditData({ ...editData, section: e.target.value })} style={{ width: '40px' }} /></td>
                                        <td className="actions-cell">
                                            <button className="icon-btn success" onClick={handleEditSave} aria-label="Save">
                                                <CheckCircle2 size={16} />
                                            </button>
                                            <button className="icon-btn" onClick={handleEditCancel} aria-label="Cancel edit">
                                                <X size={16} />
                                            </button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td className="font-mono">{student.registerNumber}</td>
                                        <td>{student.name}</td>
                                        <td><span className="dept-badge">{student.department}</span></td>
                                        <td>{student.year}</td>
                                        <td><span className="subject-badge">{student.subjectCode}</span></td>
                                        <td><span className="hall-badge">{student.hall || '—'}</span></td>
                                        <td><span className="seat-badge">{student.seat || '—'}</span></td>
                                        <td>{student.section || '—'}</td>
                                        <td className="actions-cell">
                                            <button className="icon-btn" onClick={() => handleEditStart(student)} aria-label="Edit student">
                                                <Edit size={16} />
                                            </button>
                                            <button className="icon-btn danger" onClick={() => handleDelete(student.id)} aria-label="Delete student">
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                        {filteredStudents.length === 0 && (
                            <tr>
                                <td colSpan="9" className="empty-state">
                                    No students match your search/filter criteria
                                </td>

                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* CSV Format Hint */}
            <div className="csv-hint glass-panel mt-4 p-4">
                <FileUp size={16} /> <strong>CSV Import Format:</strong> Your CSV should have headers:
                <code>RegisterNumber, Name, Department, Year, SubjectCode, SubjectName</code>
            </div>
        </div>
    );
};

export default StudentData;

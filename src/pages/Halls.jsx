import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Plus, CheckCircle2, XCircle, Users, Trash2 } from 'lucide-react';
import './Halls.css';

const Halls = () => {
    const { halls, addHall, deleteHall, toggleHallAvailability } = useContext(AppContext);
    const [showAddForm, setShowAddForm] = useState(false);

    const [newHall, setNewHall] = useState({
        hallNumber: '', blockName: '', tables: 30, studentsPerTable: 2
    });

    const handleAddSubmit = (e) => {
        e.preventDefault();
        addHall(newHall);
        setNewHall({ hallNumber: '', blockName: '', tables: 30, studentsPerTable: 2 });
        setShowAddForm(false);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this hall?')) {
            deleteHall(id);
        }
    };

    const totalCapacity = halls.reduce((sum, h) => sum + h.capacity, 0);
    const availableCount = halls.filter(h => h.isAvailable).length;

    return (
        <div className="halls-page animate-fade-in">
            <div className="page-header">
                <div>
                    <h2 className="text-2xl font-bold">Exam Halls Management</h2>
                    <p className="text-text-secondary mt-1">
                        {availableCount} of {halls.length} halls available | Total capacity: {totalCapacity}
                    </p>
                </div>
                <button className="btn-primary" onClick={() => setShowAddForm(!showAddForm)} aria-label="Add Exam Hall">
                    <Plus size={18} /> Add Exam Hall
                </button>
            </div>

            {showAddForm && (
                <div className="add-hall-form glass-panel animate-slide-up mb-6">
                    <h3 className="text-lg font-semibold mb-4">Configure New Hall</h3>
                    <form onSubmit={handleAddSubmit} className="form-grid">
                        <div className="form-group">
                            <label>Hall ID / Room Number</label>
                            <input required type="text" value={newHall.hallNumber}
                                   onChange={e => setNewHall({ ...newHall, hallNumber: e.target.value })}
                                   placeholder="e.g. A101" />
                        </div>
                        <div className="form-group">
                            <label>Building / Block Name</label>
                            <input required type="text" value={newHall.blockName}
                                   onChange={e => setNewHall({ ...newHall, blockName: e.target.value })}
                                   placeholder="e.g. Computing Block" />
                        </div>
                        <div className="form-group">
                            <label>Number of Tables</label>
                            <input required type="number" min="1" value={newHall.tables}
                                   onChange={e => setNewHall({ ...newHall, tables: parseInt(e.target.value) || 0 })} />
                        </div>
                        <div className="form-group">
                            <label>Students Per Table</label>
                            <select value={newHall.studentsPerTable}
                                    onChange={e => setNewHall({ ...newHall, studentsPerTable: parseInt(e.target.value) })}>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                            </select>
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn-primary">Add Hall</button>
                            <button type="button" className="btn-secondary" onClick={() => setShowAddForm(false)}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="halls-grid" role="list" aria-label="Exam halls">
                {halls.map((hall) => (
                    <div key={hall.id} className={`hall-card glass-panel animate-slide-up ${!hall.isAvailable ? 'unavailable' : ''}`}
                         role="listitem">
                        <div className="hall-card-header">
                            <h3 className="hall-number">{hall.hallNumber}</h3>
                            <div className="hall-card-actions">
                                <button
                                    className={`status-toggle ${hall.isAvailable ? 'available' : 'unavailable'}`}
                                    onClick={() => toggleHallAvailability(hall.id)}
                                    aria-label={`Toggle availability for ${hall.hallNumber}`}
                                >
                                    {hall.isAvailable ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                                    {hall.isAvailable ? 'Available' : 'Unavailable'}
                                </button>
                                <button className="icon-btn danger" onClick={() => handleDelete(hall.id)}
                                        aria-label={`Delete ${hall.hallNumber}`}>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                        <p className="hall-block">{hall.blockName}</p>
                        <div className="hall-details">
                            <div className="hall-detail">
                                <span className="detail-label">Tables</span>
                                <span className="detail-value">{hall.tables}</span>
                            </div>
                            <div className="hall-detail">
                                <span className="detail-label">Per Table</span>
                                <span className="detail-value">{hall.studentsPerTable}</span>
                            </div>
                            <div className="hall-detail">
                                <span className="detail-label">Capacity</span>
                                <span className="detail-value highlight">
                                    <Users size={14} /> {hall.capacity}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Halls;

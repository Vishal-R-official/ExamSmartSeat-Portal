import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Search, MapPin, Calendar, Clock, QrCode, Building, BookOpen, Users } from 'lucide-react';
import './StudentPortal.css';

const COURSE_NAMES = {
    'EC23631': 'Analog and Digital Circuits',
    'EC23V24': 'VLSI Design',
    'O23AL11': 'Engineering Mathematics',
    'EC23431': 'Digital System Design using VLSI',
    'CS23413': 'Operating Systems',
    'AD23412': 'Machine Learning',
    'ME23413': 'Thermal Engineering',
    'MA23411': 'Discrete Mathematics',
    'BT23413': 'Biochemistry'
};

const getBlock = (hall) => {
    if (!hall) return '—';
    if (hall.startsWith('A')) return 'A Block';
    if (hall.startsWith('B0') || hall.startsWith('B1')) return 'Ground Floor Block';
    if (hall.startsWith('B2') || hall.startsWith('B3')) return 'Upper Floor Block';
    if (hall.startsWith('C')) return 'C Block';
    if (hall.startsWith('GB')) return 'GB Block';
    return hall;
};

const StudentPortal = () => {
    const { students } = useContext(AppContext);
    const [searchReg, setSearchReg] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);
    const [showQR, setShowQR] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        setHasSearched(true);
        setShowQR(false);
        const term = searchReg.trim().toLowerCase();
        const found = students.find(s =>
            s.registerNumber.toLowerCase() === term ||
            s.registerNumber.toLowerCase().includes(term)
        );
        setSearchResult(found || null);
    };

    return (
        <div className="student-portal-wrapper">
            <div className="portal-container glass-panel animate-slide-up">

                <div className="portal-header">
                    <div className="portal-logo-ring">
                        <MapPin size={32} className="text-accent-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-center text-gradient mb-2">Student Seat Lookup</h2>
                    <p className="text-text-secondary text-center text-sm">
                        CAT-2 · 27 March 2026 · Afternoon Session
                    </p>
                </div>

                <form className="portal-search-form" onSubmit={handleSearch}>
                    <div className="search-input-wrapper">
                        <Search className="search-icon" size={20} />
                        <input
                            type="text"
                            placeholder="Enter Register Number (e.g. 2117230020001)"
                            value={searchReg}
                            onChange={(e) => setSearchReg(e.target.value)}
                            required
                            autoFocus
                        />
                    </div>
                    <button type="submit" className="btn-primary w-full mt-4">
                        <Search size={16} /> Find My Seat
                    </button>
                </form>

                {hasSearched && (
                    <div className="portal-results animate-fade-in mt-6 pt-6">

                        {searchResult ? (
                            <div className="seat-found-card">
                                {/* Student Info */}
                                <div className="student-header text-center mb-6">
                                    <div className="student-avatar">
                                        {searchResult.name.charAt(0)}
                                    </div>
                                    <h3 className="text-xl font-bold mt-3">{searchResult.name}</h3>
                                    <p className="text-accent-primary font-mono text-sm mt-1">{searchResult.registerNumber}</p>
                                    <span className="dept-pill">
                                        {searchResult.department} &bull; {searchResult.examYear || `Year ${searchResult.year}`} &bull; Section {searchResult.section}
                                    </span>
                                </div>

                                {/* Hall + Seat Big Boxes */}
                                <div className="seat-highlight-row">
                                    <div className="seat-highlight-box hall-box">
                                        <Building size={20} className="box-icon" />
                                        <span className="box-label">Hall No.</span>
                                        <span className="box-value massive">{searchResult.hall || '—'}</span>
                                        <span className="box-sub">{getBlock(searchResult.hall)}</span>
                                    </div>
                                    <div className="seat-highlight-box seat-box">
                                        <MapPin size={20} className="box-icon" />
                                        <span className="box-label">Seat No.</span>
                                        <span className="box-value massive">{searchResult.seat || '—'}</span>
                                        <span className="box-sub">Assigned Seat</span>
                                    </div>
                                </div>

                                {/* Detail Grid */}
                                <div className="seat-details-grid mt-4">
                                    <div className="detail-box">
                                        <span className="box-label"><BookOpen size={12} /> Subject Code</span>
                                        <span className="box-value">{searchResult.subjectCode}</span>
                                    </div>
                                    <div className="detail-box">
                                        <span className="box-label"><BookOpen size={12} /> Subject</span>
                                        <span className="box-value truncate" title={COURSE_NAMES[searchResult.subjectCode]}>
                                            {COURSE_NAMES[searchResult.subjectCode] || searchResult.subjectCode}
                                        </span>
                                    </div>
                                    <div className="detail-box">
                                        <span className="box-label"><Calendar size={12} /> Exam Date</span>
                                        <span className="box-value">27 Mar 2026</span>
                                    </div>
                                    <div className="detail-box">
                                        <span className="box-label"><Clock size={12} /> Session</span>
                                        <span className="box-value">Afternoon · 1:30 PM</span>
                                    </div>
                                </div>

                                {/* QR Section */}
                                <div className="mt-6 text-center">
                                    {!showQR ? (
                                        <button className="btn-secondary w-full flex justify-center gap-2" onClick={() => setShowQR(true)}>
                                            <QrCode size={18} /> Show Entry QR Code
                                        </button>
                                    ) : (
                                        <div className="qr-simulation animate-fade-in mx-auto">
                                            <div className="qr-box">
                                                <div className="qr-pattern"></div>
                                                <div className="qr-pattern p2"></div>
                                                <div className="qr-pattern p3"></div>
                                                <div className="qr-dot d1"></div>
                                                <div className="qr-dot d2"></div>
                                                <div className="qr-dot d3"></div>
                                            </div>
                                            <p className="text-xs text-text-muted mt-3 font-mono">
                                                {searchResult.registerNumber} · {searchResult.hall} · {searchResult.seat}
                                            </p>
                                            <p className="text-xs text-text-muted mt-1">Scan at hall entrance to verify</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                        ) : (
                            <div className="empty-result text-center py-4">
                                <MapPin size={48} className="mx-auto text-status-warning mb-3 opacity-80" />
                                <h3 className="text-lg font-semibold text-status-warning">Student Not Found</h3>
                                <p className="text-text-secondary text-sm mt-1">
                                    "<strong>{searchReg}</strong>" not found in the seating list.
                                </p>
                                <p className="text-text-muted text-xs mt-2">Please verify your register number and try again.</p>
                            </div>
                        )}
                    </div>
                )}

                <div className="portal-footer-note">
                    <Users size={12} /> {students.length.toLocaleString()} students · CAT-2 II &amp; III Year Seating
                </div>
            </div>
        </div>
    );
};

export default StudentPortal;

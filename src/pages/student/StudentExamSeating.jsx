import React, { useState, useContext } from 'react';
import { Search, MapPin, Building, BookOpen, Calendar, Clock, Download, CheckCircle } from 'lucide-react';
import { StudentContext } from '../../context/StudentContext';
import ScrollReveal from '../../components/student/ScrollReveal';

const COURSE_NAMES = {
  'EC23631': 'Analog and Digital Circuits', 'EC23V24': 'VLSI Design',
  'O23AL11': 'Engineering Mathematics', 'CS23413': 'Operating Systems',
  'AD23412': 'Machine Learning', 'ME23413': 'Thermal Engineering',
  'MA23411': 'Discrete Mathematics',
};

const getBlock = (hall) => {
  if (!hall) return '—';
  if (hall.startsWith('A')) return 'A Block';
  if (hall.startsWith('B0') || hall.startsWith('B1')) return 'Ground Block';
  if (hall.startsWith('B2') || hall.startsWith('B3')) return 'Upper Block';
  if (hall.startsWith('C')) return 'C Block';
  if (hall.startsWith('GB')) return 'GB Block';
  return hall;
};

const StudentExamSeating = () => {
  const { currentStudent, searchStudent } = useContext(StudentContext);
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearched(true);
    setResult(searchStudent(query || currentStudent?.registerNumber));
  };

  const handleMySeating = () => {
    if (currentStudent) {
      setQuery(currentStudent.registerNumber);
      setSearched(true);
      setResult(currentStudent);
    }
  };

  return (
    <div>
      <ScrollReveal>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>Exam Seating</h1>
        <p style={{ color: 'var(--sp-text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          CAT-2 · 27 March 2026 · Afternoon Session
        </p>
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <div className="sp-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--sp-text-muted)' }} />
              <input className="sp-input" style={{ paddingLeft: 40, width: '100%' }}
                placeholder="Enter Register Number" value={query}
                onChange={(e) => setQuery(e.target.value)} />
            </div>
            <button type="submit" className="sp-btn sp-btn-primary"><Search size={16} /> Search</button>
            <button type="button" className="sp-btn sp-btn-outline" onClick={handleMySeating}>My Seat</button>
          </form>
        </div>
      </ScrollReveal>

      {searched && (
        <ScrollReveal>
          {result ? (
            <div className="sp-card sp-seat-result">
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--sp-success)', fontSize: '0.82rem', fontWeight: 600, marginBottom: '1rem' }}>
                <CheckCircle size={16} /> Verified Seat Allocation
              </div>
              <div className="sp-seat-avatar">{result.name.charAt(0)}</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0.5rem 0 0.25rem' }}>{result.name}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--sp-primary)', fontFamily: 'monospace' }}>{result.registerNumber}</p>
              <span className="sp-badge sp-badge-primary" style={{ marginTop: '0.5rem' }}>
                {result.department} · {result.examYear || `Year ${result.year}`} · Sec {result.section}
              </span>

              <div className="sp-seat-boxes">
                <div className="sp-seat-box">
                  <div className="sp-seat-box-label"><Building size={14} style={{ marginRight: 4 }} />Hall No.</div>
                  <div className="sp-seat-box-value">{result.hall}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--sp-text-muted)', marginTop: 2 }}>{getBlock(result.hall)}</div>
                </div>
                <div className="sp-seat-box">
                  <div className="sp-seat-box-label"><MapPin size={14} style={{ marginRight: 4 }} />Seat No.</div>
                  <div className="sp-seat-box-value">{result.seat}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--sp-text-muted)', marginTop: 2 }}>Assigned Seat</div>
                </div>
              </div>

              <div className="sp-seat-details">
                <div className="sp-seat-detail">
                  <div className="sp-seat-detail-label"><BookOpen size={11} /> Subject</div>
                  <div className="sp-seat-detail-value">{COURSE_NAMES[result.subjectCode] || result.subjectCode}</div>
                </div>
                <div className="sp-seat-detail">
                  <div className="sp-seat-detail-label"><BookOpen size={11} /> Code</div>
                  <div className="sp-seat-detail-value">{result.subjectCode}</div>
                </div>
                <div className="sp-seat-detail">
                  <div className="sp-seat-detail-label"><Calendar size={11} /> Date</div>
                  <div className="sp-seat-detail-value">27 Mar 2026</div>
                </div>
                <div className="sp-seat-detail">
                  <div className="sp-seat-detail-label"><Clock size={11} /> Session</div>
                  <div className="sp-seat-detail-value">Afternoon · 1:30 PM</div>
                </div>
              </div>

              <button className="sp-btn sp-btn-outline" style={{ width: '100%', justifyContent: 'center', marginTop: '1.5rem' }}>
                <Download size={16} /> Download Seat Slip
              </button>
            </div>
          ) : (
            <div className="sp-card" style={{ padding: '3rem', textAlign: 'center' }}>
              <MapPin size={48} style={{ color: 'var(--sp-warning)', marginBottom: '1rem', opacity: 0.7 }} />
              <h3 style={{ fontWeight: 700, color: 'var(--sp-warning)', marginBottom: '0.5rem' }}>Student Not Found</h3>
              <p style={{ color: 'var(--sp-text-secondary)', fontSize: '0.9rem' }}>
                "{query}" was not found. Please verify and try again.
              </p>
            </div>
          )}
        </ScrollReveal>
      )}
    </div>
  );
};

export default StudentExamSeating;

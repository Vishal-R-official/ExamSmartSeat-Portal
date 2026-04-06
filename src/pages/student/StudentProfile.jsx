import React, { useContext } from 'react';
import { User, Mail, BookOpen, Award, Calendar, MapPin, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StudentContext } from '../../context/StudentContext';
import ScrollReveal from '../../components/student/ScrollReveal';

const StudentProfile = () => {
  const { currentStudent, studentLogout } = useContext(StudentContext);
  const navigate = useNavigate();
  const s = currentStudent || {};

  const details = [
    { icon: <User size={16} />, label: 'Name', value: s.name },
    { icon: <BookOpen size={16} />, label: 'Register No.', value: s.registerNumber },
    { icon: <Award size={16} />, label: 'Department', value: s.department },
    { icon: <Calendar size={16} />, label: 'Year / Section', value: `Year ${s.year || '—'} · Sec ${s.section || '—'}` },
    { icon: <MapPin size={16} />, label: 'Exam Hall', value: s.hall || '—' },
    { icon: <Mail size={16} />, label: 'Email', value: `${(s.registerNumber || '').toLowerCase()}@ritchennai.edu.in` },
  ];

  const handleLogout = () => { studentLogout(); navigate('/'); };

  return (
    <div>
      <ScrollReveal>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>My Profile</h1>
      </ScrollReveal>

      <ScrollReveal delay={80}>
        <div className="sp-card" style={{ padding: '2rem', textAlign: 'center', marginBottom: '1.5rem' }}>
          <div className="sp-seat-avatar" style={{ width: 80, height: 80, fontSize: '2rem', margin: '0 auto 1rem' }}>
            {s.name?.charAt(0) || 'S'}
          </div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>{s.name}</h2>
          <p style={{ color: 'var(--sp-primary)', fontFamily: 'monospace', fontSize: '0.9rem', margin: '0.25rem 0' }}>{s.registerNumber}</p>
          <span className="sp-badge sp-badge-primary">{s.department}</span>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={160}>
        <div className="sp-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Student Information</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            {details.map((d, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'rgba(248,250,252,0.8)', borderRadius: 'var(--sp-radius-xs)' }}>
                <span style={{ color: 'var(--sp-primary)' }}>{d.icon}</span>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--sp-text-muted)', fontWeight: 600 }}>{d.label}</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{d.value || '—'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={240}>
        <div className="sp-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Attendance Overview</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ position: 'relative', width: 80, height: 80 }}>
              <svg width="80" height="80" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(148,163,184,0.15)" strokeWidth="8" />
                <circle cx="40" cy="40" r="34" fill="none" stroke="url(#grad)" strokeWidth="8"
                  strokeDasharray={`${87 * 2.136} ${100 * 2.136}`} strokeLinecap="round"
                  transform="rotate(-90 40 40)" />
                <defs><linearGradient id="grad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#3b82f6" /><stop offset="100%" stopColor="#10b981" /></linearGradient></defs>
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem' }}>87%</div>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1rem' }}>Good Standing</div>
              <div style={{ color: 'var(--sp-text-secondary)', fontSize: '0.85rem' }}>Minimum required: 75%</div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={300}>
        <button className="sp-btn sp-btn-outline" style={{ color: 'var(--sp-danger)', borderColor: 'rgba(239,68,68,0.3)' }} onClick={handleLogout}>
          <LogOut size={16} /> Logout
        </button>
      </ScrollReveal>
    </div>
  );
};

export default StudentProfile;

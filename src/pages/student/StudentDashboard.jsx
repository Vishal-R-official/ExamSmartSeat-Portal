import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Calendar, ClipboardList, BookOpen, TrendingUp, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { StudentContext } from '../../context/StudentContext';
import { mockAssignments, mockAnnouncements, mockCatMarks, mockCycleMarks } from '../../data/studentMockData';
import ScrollReveal from '../../components/student/ScrollReveal';

const StudentDashboard = () => {
  const { currentStudent } = useContext(StudentContext);
  const pending = mockAssignments.filter(a => a.status === 'pending').length;

  const statCards = [
    { label: 'Attendance', value: '87%', icon: <TrendingUp size={22} />, bg: 'rgba(16,185,129,0.1)', color: '#10b981' },
    { label: 'Upcoming Exams', value: '3', icon: <FileText size={22} />, bg: 'rgba(59,130,246,0.1)', color: '#3b82f6' },
    { label: 'Pending Tasks', value: pending, icon: <ClipboardList size={22} />, bg: 'rgba(245,158,11,0.1)', color: '#f59e0b' },
    { label: "Today's Classes", value: '4', icon: <Clock size={22} />, bg: 'rgba(139,92,246,0.1)', color: '#8b5cf6' },
  ];

  const quickActions = [
    { label: 'Check Exam Seat', to: '/student/exam-seating', icon: <FileText size={18} /> },
    { label: 'View Timetable', to: '/student/timetable', icon: <Calendar size={18} /> },
    { label: 'View Assignments', to: '/student/assignments', icon: <ClipboardList size={18} /> },
    { label: 'Browse Resources', to: '/student/resources', icon: <BookOpen size={18} /> },
  ];

  return (
    <div>
      <ScrollReveal>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Hello, {currentStudent?.name?.split(' ')[0]} 👋</h1>
          <p style={{ color: 'var(--sp-text-secondary)', fontSize: '0.95rem' }}>
            {currentStudent?.department} · Year {currentStudent?.year} · Section {currentStudent?.section}
          </p>
        </div>
      </ScrollReveal>

      {/* Stats */}
      <div className="sp-stats-grid" style={{ marginBottom: '2rem' }}>
        {statCards.map((s, i) => (
          <ScrollReveal key={i} delay={i * 80}>
            <div className="sp-card sp-stat-card">
              <div className="sp-stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
              <div className="sp-stat-value">{s.value}</div>
              <div className="sp-stat-label">{s.label}</div>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* Quick Actions */}
      <ScrollReveal delay={100}>
        <div className="sp-section-header"><h2 className="sp-section-title">Quick Actions</h2></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
          {quickActions.map((a, i) => (
            <Link key={i} to={a.to} className="sp-card" style={{
              padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem',
              textDecoration: 'none', color: 'var(--sp-text)', fontWeight: 600, fontSize: '0.88rem'
            }}>
              <span style={{ color: 'var(--sp-primary)' }}>{a.icon}</span>
              {a.label}
            </Link>
          ))}
        </div>
      </ScrollReveal>

      {/* Academic Performance - CAT & Cycle Tests */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        {/* CAT Marks Sector */}
        <ScrollReveal delay={150}>
          <div className="sp-section-header">
            <h2 className="sp-section-title">Continuous Assessment (CAT) Marks</h2>
            <TrendingUp size={16} style={{ color: 'var(--sp-primary)' }} />
          </div>
          <div className="sp-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {mockCatMarks.map((m, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.88rem' }}>
                    <span style={{ fontWeight: 600 }}>{m.subject}</span>
                    <span style={{ fontWeight: 700, color: 'var(--sp-primary)' }}>{m.score}/{m.total}</span>
                  </div>
                  <div className="sp-progress" style={{ height: '6px' }}>
                    <div className="sp-progress-bar" style={{ 
                      width: `${(m.score / m.total) * 100}%`,
                      background: `linear-gradient(90deg, var(--sp-primary), var(--sp-secondary))`
                    }} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--sp-border)', textAlign: 'right' }}>
              <Link to="/student/marks" style={{ color: 'var(--sp-primary)', fontSize: '0.82rem', fontWeight: 600, textDecoration: 'none' }}>
                View Full Results →
              </Link>
            </div>
          </div>
        </ScrollReveal>

        {/* Cycle Test Sector */}
        <ScrollReveal delay={200}>
          <div className="sp-section-header">
            <h2 className="sp-section-title">Cycle Test Statistics</h2>
            <FileText size={16} style={{ color: 'var(--sp-accent)' }} />
          </div>
          <div className="sp-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {mockCycleMarks.map((c, idx) => (
                <div key={idx} style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                  padding: '0.85rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--sp-radius-xs)',
                  border: '1px solid var(--sp-border)'
                }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{c.test}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--sp-text-muted)' }}>Status: {c.status}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, color: 'var(--sp-accent)' }}>{c.average > 0 ? `${c.average}%` : '—'}</div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 600 }}>{c.rank > 0 ? `Rank #${c.rank}` : 'Pending'}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* Announcements */}
      <ScrollReveal delay={250}>
        <div className="sp-section-header"><h2 className="sp-section-title">Announcements</h2></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {mockAnnouncements.map((a) => (
            <div key={a.id} className="sp-card" style={{ padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: a.urgent ? 'rgba(239,68,68,0.1)' : 'rgba(59,130,246,0.08)',
                color: a.urgent ? '#ef4444' : '#3b82f6', flexShrink: 0
              }}>
                {a.urgent ? <AlertTriangle size={18} /> : <CheckCircle size={18} />}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.92rem', marginBottom: 2 }}>{a.title}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--sp-text-secondary)' }}>{a.description}</div>
              </div>
              {a.urgent && <span className="sp-badge sp-badge-danger" style={{ marginLeft: 'auto', flexShrink: 0 }}>Urgent</span>}
            </div>
          ))}
        </div>
      </ScrollReveal>
    </div>
  );
};


export default StudentDashboard;

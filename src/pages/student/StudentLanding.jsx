import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, LayoutDashboard, MapPin, Calendar, BookOpen, Shield, Users, Building, Award, Sun, Moon } from 'lucide-react';
import { StudentContext } from '../../context/StudentContext';
import HeroOrb from '../../components/student/HeroOrb';
import ScrollReveal from '../../components/student/ScrollReveal';
import '../../styles/StudentPortal.css';

const features = [
  { icon: <MapPin size={28} />, title: 'Exam Seating', desc: 'Instantly find your hall, seat, and block for all CAT exams.', color: '#3b82f6' },
  { icon: <Calendar size={28} />, title: 'Timetable', desc: 'View your weekly class schedule with real-time highlights.', color: '#06b6d4' },
  { icon: <BookOpen size={28} />, title: 'Resources', desc: 'Download notes, question papers, and lab manuals.', color: '#8b5cf6' },
  { icon: <Award size={28} />, title: 'Assignments', desc: 'Track deadlines, progress, and submission status.', color: '#10b981' },
];

const StudentLanding = () => {
  const { isStudentAuth, stats, theme, toggleTheme } = useContext(StudentContext);
  const navigate = useNavigate();

  return (
    <div className="student-app" style={{ overflowX: 'hidden' }}>
      {/* Theme Toggle Button */}
      <button 
        className="sp-btn sp-glass" 
        onClick={toggleTheme} 
        style={{ position: 'fixed', top: '1.5rem', right: '1.5rem', padding: '10px', zIndex: 100, borderRadius: '50%' }}
        title="Toggle Theme"
      >
        {theme === 'dark' ? <Sun size={20} color="var(--sp-text)" /> : <Moon size={20} color="var(--sp-text)" />}
      </button>
      {/* Hero Section */}
      <section className="sp-hero">
        <div className="sp-hero-bg" />
        <HeroOrb />
        <div className="sp-hero-content">
          <p className="sp-hero-subtitle">Rajalakshmi Institute of Technology</p>
          <h1 className="sp-hero-title">SmartSeat Student Portal</h1>
          <p className="sp-hero-desc">
            A unified platform for exam seating, academic tracking, and student services.
            Everything you need, one click away.
          </p>
          <div className="sp-hero-actions">
            {isStudentAuth ? (
              <>
                <Link to="/student/exam-seating" className="sp-btn sp-btn-primary">
                  <Search size={18} /> Check My Seat
                </Link>
                <Link to="/student/dashboard" className="sp-btn sp-btn-outline">
                  <LayoutDashboard size={18} /> Go to Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link to="/student-login" className="sp-btn sp-btn-primary">
                  <Search size={18} /> Check My Seat
                </Link>
                <Link to="/student-login" className="sp-btn sp-btn-outline">
                  <LayoutDashboard size={18} /> Student Login
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ padding: '4rem 2rem', background: 'var(--sp-bg-card)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <ScrollReveal>
            <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', fontFamily: 'var(--sp-font)', color: 'var(--sp-text)' }}>
              Rajalakshmi Institute of Technology
            </h2>
            <p style={{ textAlign: 'center', color: 'var(--sp-text-secondary)', marginBottom: '1.5rem', fontFamily: 'var(--sp-font)' }}>
              Empowering students with a digital campus experience. Managing academic excellence for {stats.totalStudents.toLocaleString()} students across {stats.departments.length} departments.
            </p>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <Link to="/about" className="sp-btn sp-btn-outline" style={{ display: 'inline-flex' }}>
                 Discover R.I.T.
              </Link>
            </div>
          </ScrollReveal>
          <div className="sp-stats-grid">
            {[
              { value: stats.totalStudents.toLocaleString(), label: 'Students Registered', icon: <Users size={22} />, bg: 'rgba(59,130,246,0.1)', color: '#3b82f6' },
              { value: stats.halls.length, label: 'Exam Halls', icon: <Building size={22} />, bg: 'rgba(6,182,212,0.1)', color: '#06b6d4' },
              { value: stats.departments.length, label: 'Departments', icon: <Award size={22} />, bg: 'rgba(139,92,246,0.1)', color: '#8b5cf6' },
              { value: stats.subjects.length, label: 'Subjects', icon: <BookOpen size={22} />, bg: 'rgba(16,185,129,0.1)', color: '#10b981' },
            ].map((stat, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="sp-card sp-stat-card">
                  <div className="sp-stat-icon" style={{ background: stat.bg, color: stat.color }}>{stat.icon}</div>
                  <div className="sp-stat-value">{stat.value}</div>
                  <div className="sp-stat-label">{stat.label}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ background: 'var(--sp-bg)' }}>
        <div className="sp-features-grid">
          {features.map((f, i) => (
            <ScrollReveal key={i} delay={i * 120}>
              <div className="sp-card sp-feature-card">
                <div className="sp-feature-icon" style={{ background: `${f.color}15`, color: f.color }}>
                  {f.icon}
                </div>
                <h3 className="sp-feature-title">{f.title}</h3>
                <p className="sp-feature-desc">{f.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Kinetic Text Section */}
      <section className="sp-kinetic-section">
        <div className="sp-marquee-content">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="sp-kinetic-word">
              SMARTSEAT — STREAMLINING EXAMS — 
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '2rem', textAlign: 'center', background: '#1e293b', color: '#94a3b8',
        fontFamily: 'var(--sp-font)', fontSize: '0.85rem'
      }}>
        <div style={{ marginBottom: '0.5rem' }}>
          <Link to="/login" style={{ color: '#60a5fa', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Shield size={14} /> Admin Portal
          </Link>
        </div>
        <p>© 2026 SmartSeat · Rajalakshmi Institute of Technology</p>
      </footer>
    </div>
  );
};

export default StudentLanding;

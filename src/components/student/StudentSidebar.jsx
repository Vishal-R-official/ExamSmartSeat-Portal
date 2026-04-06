import React, { useContext } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, FileText, Calendar, ClipboardList, Bell, BookOpen, User, HelpCircle, X, Shield } from 'lucide-react';
import { StudentContext } from '../../context/StudentContext';

const navItems = [
  { path: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/student/exam-seating', label: 'Exam Seating', icon: FileText },
  { path: '/student/timetable', label: 'Timetable', icon: Calendar },
  { path: '/student/assignments', label: 'Assignments', icon: ClipboardList },
  { path: '/student/notifications', label: 'Notifications', icon: Bell },
  { path: '/student/resources', label: 'Resources', icon: BookOpen },
  { path: '/student/profile', label: 'Profile', icon: User },
  { path: '/student/help', label: 'Help', icon: HelpCircle },
];

const StudentSidebar = ({ isOpen, onClose }) => {
  const { currentStudent } = useContext(StudentContext);

  return (
    <>
      <div className={`sp-sidebar-overlay ${isOpen ? 'show' : ''}`} onClick={onClose} />
      <aside className={`sp-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sp-sidebar-header">
          <div className="sp-sidebar-logo">S</div>
          <span className="sp-sidebar-brand">SmartSeat</span>
          <button className="sp-sidebar-close" onClick={onClose}><X size={20} /></button>
        </div>

        <nav className="sp-sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `sp-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => { if (window.innerWidth < 768) onClose?.(); }}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sp-sidebar-footer">
          {currentStudent && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div className="sp-avatar">{currentStudent.name?.charAt(0)}</div>
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--sp-text)' }}>
                  {currentStudent.name}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--sp-text-muted)' }}>
                  {currentStudent.department} · Year {currentStudent.year}
                </div>
              </div>
            </div>
          )}
          <Link to="/login" className="sp-sidebar-admin-link">
            <Shield size={14} />
            Admin Portal
          </Link>
        </div>
      </aside>
    </>
  );
};

export default StudentSidebar;

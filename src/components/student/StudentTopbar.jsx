import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, LogOut, Sun, Moon } from 'lucide-react';
import { StudentContext } from '../../context/StudentContext';
import { mockNotifications } from '../../data/studentMockData';

const StudentTopbar = ({ onMenuClick }) => {
  const { currentStudent, studentLogout, theme, toggleTheme } = useContext(StudentContext);
  const navigate = useNavigate();
  const [showNotifs, setShowNotifs] = useState(false);
  const unreadCount = mockNotifications.filter(n => !n.read).length;

  const handleLogout = () => {
    studentLogout();
    navigate('/');
  };

  return (
    <header className="sp-topbar">
      <div className="sp-topbar-left">
        <button className="sp-menu-btn" onClick={onMenuClick}><Menu size={24} /></button>
        <span className="sp-topbar-greeting">
          Hello, <strong>{currentStudent?.name || 'Student'}</strong> 👋
        </span>
      </div>
      <div className="sp-topbar-right">
        <button className="sp-btn sp-btn-ghost" onClick={toggleTheme} title="Toggle Theme" style={{ padding: '8px' }}>
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        
        <div style={{ position: 'relative' }}>
          <button className="sp-notification-btn" onClick={() => setShowNotifs(!showNotifs)}>
            <Bell size={20} />
            {unreadCount > 0 && <span className="sp-notif-badge">{unreadCount}</span>}
          </button>
          {showNotifs && (
            <div style={{
              position: 'absolute', top: '100%', right: 0, marginTop: 8,
              width: 320, maxHeight: 400, overflowY: 'auto',
              background: 'var(--sp-bg-card)', backdropFilter: 'blur(16px)',
              border: '1px solid var(--sp-border)', borderRadius: 'var(--sp-radius)',
              boxShadow: 'var(--sp-shadow-lg)', zIndex: 200,
              animation: 'sp-page-in 0.25s ease'
            }}>
              <div style={{ padding: '1rem', borderBottom: '1px solid var(--sp-border)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--sp-text)' }}>
                Notifications
              </div>
              {mockNotifications.slice(0, 5).map(n => (
                <div key={n.id} style={{
                  padding: '0.75rem 1rem', borderBottom: '1px solid var(--sp-border)',
                  background: n.read ? 'transparent' : 'rgba(59,130,246,0.04)',
                  cursor: 'pointer'
                }}
                onClick={() => { setShowNotifs(false); navigate('/student/notifications'); }}
                >
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--sp-text)' }}>{n.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--sp-text-muted)', marginTop: 2 }}>{n.time}</div>
                </div>
              ))}
              <div style={{ padding: '0.75rem', textAlign: 'center' }}>
                <button className="sp-btn sp-btn-ghost" style={{ fontSize: '0.82rem' }}
                  onClick={() => { setShowNotifs(false); navigate('/student/notifications'); }}>
                  View All
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="sp-avatar" style={{ cursor: 'pointer' }} onClick={() => navigate('/student/profile')}>
          {currentStudent?.name?.charAt(0) || 'S'}
        </div>
        <button className="sp-btn sp-btn-ghost" onClick={handleLogout} title="Logout" style={{ padding: '8px' }}>
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};

export default StudentTopbar;

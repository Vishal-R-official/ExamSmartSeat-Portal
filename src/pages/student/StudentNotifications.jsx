import React from 'react';
import { FileText, ClipboardList, Info, Bell } from 'lucide-react';
import { mockNotifications } from '../../data/studentMockData';
import ScrollReveal from '../../components/student/ScrollReveal';

const typeIcons = { exam: <FileText size={18} />, assignment: <ClipboardList size={18} />, general: <Info size={18} /> };
const typeColors = { exam: '#3b82f6', assignment: '#f59e0b', general: '#8b5cf6' };

const StudentNotifications = () => {
  return (
    <div>
      <ScrollReveal>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>Notifications</h1>
        <p style={{ color: 'var(--sp-text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Stay updated with latest announcements</p>
      </ScrollReveal>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {mockNotifications.map((n, i) => (
          <ScrollReveal key={n.id} delay={i * 60}>
            <div className="sp-card" style={{
              padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start',
              borderLeft: n.read ? 'none' : `3px solid ${typeColors[n.type]}`,
              background: n.read ? 'var(--sp-bg-card)' : 'rgba(255,255,255,0.9)'
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: `${typeColors[n.type]}15`, color: typeColors[n.type]
              }}>
                {typeIcons[n.type] || <Bell size={18} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{n.title}</div>
                  {!n.read && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--sp-primary)', flexShrink: 0, marginTop: 6 }} />}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--sp-text-secondary)', marginTop: 4, lineHeight: 1.5 }}>{n.message}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--sp-text-muted)', marginTop: 6 }}>{n.time}</div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
};

export default StudentNotifications;

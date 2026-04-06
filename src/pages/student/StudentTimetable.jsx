import React, { useState } from 'react';
import { mockTimetable } from '../../data/studentMockData';
import ScrollReveal from '../../components/student/ScrollReveal';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const today = days[new Date().getDay() - 1] || 'Monday';

const StudentTimetable = () => {
  const [activeDay, setActiveDay] = useState(today);
  const dayData = mockTimetable.find(d => d.day === activeDay);

  return (
    <div>
      <ScrollReveal>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>Timetable</h1>
        <p style={{ color: 'var(--sp-text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Your weekly class schedule
        </p>
      </ScrollReveal>

      <ScrollReveal delay={80}>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {days.map(d => (
            <button key={d} onClick={() => setActiveDay(d)}
              className={`sp-btn ${d === activeDay ? 'sp-btn-primary' : 'sp-btn-outline'}`}
              style={{ fontSize: '0.82rem', padding: '0.5rem 1rem' }}>
              {d.slice(0, 3)}
              {d === today && <span style={{ marginLeft: 4, fontSize: '0.7rem' }}>●</span>}
            </button>
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal delay={150}>
        <div className="sp-card" style={{ overflow: 'hidden' }}>
          <table className="sp-timetable" style={{ width: '100%' }}>
            <thead>
              <tr><th>Time</th><th>Subject</th><th>Code</th><th>Room</th><th>Type</th></tr>
            </thead>
            <tbody>
              {dayData?.slots.map((slot, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600, whiteSpace: 'nowrap', fontSize: '0.85rem' }}>{slot.time}</td>
                  <td style={{ fontWeight: 600 }}>{slot.subject}</td>
                  <td><span className="sp-badge sp-badge-primary">{slot.code}</span></td>
                  <td>{slot.room}</td>
                  <td>
                    <span className={`sp-slot-type sp-slot-${slot.type}`}>
                      {slot.type.charAt(0).toUpperCase() + slot.type.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ScrollReveal>
    </div>
  );
};

export default StudentTimetable;

import React, { useState } from 'react';
import { CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { mockAssignments } from '../../data/studentMockData';
import ScrollReveal from '../../components/student/ScrollReveal';

const filters = ['all', 'pending', 'overdue', 'completed'];

const StudentAssignments = () => {
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? mockAssignments : mockAssignments.filter(a => a.status === filter);

  return (
    <div>
      <ScrollReveal>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>Assignments</h1>
        <p style={{ color: 'var(--sp-text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Track your tasks and deadlines</p>
      </ScrollReveal>

      <ScrollReveal delay={80}>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`sp-btn ${f === filter ? 'sp-btn-primary' : 'sp-btn-outline'}`}
              style={{ fontSize: '0.82rem', padding: '0.5rem 1rem', textTransform: 'capitalize' }}>
              {f} {f !== 'all' && `(${mockAssignments.filter(a => a.status === f).length})`}
            </button>
          ))}
        </div>
      </ScrollReveal>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {filtered.map((a, i) => (
          <ScrollReveal key={a.id} delay={i * 60}>
            <div className="sp-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 2 }}>{a.task}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--sp-text-secondary)' }}>
                    {a.subject} · {a.code}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {a.status === 'completed' ? (
                      <CheckCircle size={16} style={{ color: 'var(--sp-success)' }} />
                  ) : (
                      <AlertTriangle size={16} style={{ color: 'var(--sp-danger)' }} />
                  )}
                  <span className={`sp-badge ${a.status === 'completed' ? 'sp-badge-success' : 'sp-badge-danger'}`}>
                    {a.status === 'completed' ? 'Completed' : 'Not Submitted'}
                  </span>
                </div>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--sp-text-primary)', marginBottom: '1rem', lineHeight: '1.4' }}>
                  Complete the aforementioned task and verify it against the rubric. Contact your lab assistant for extensions or queries.
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--sp-text-muted)', marginTop: '0.5rem' }}>
                Deadline: {new Date(a.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
};

export default StudentAssignments;

import React, { useState } from 'react';
import { Download, FileText, BookOpen, FlaskConical } from 'lucide-react';
import { mockResources } from '../../data/studentMockData';
import ScrollReveal from '../../components/student/ScrollReveal';

const categories = ['All', 'Notes', 'Question Papers', 'Lab Manuals'];
const catIcons = { Notes: <BookOpen size={16} />, 'Question Papers': <FileText size={16} />, 'Lab Manuals': <FlaskConical size={16} /> };

const StudentResources = () => {
  const [cat, setCat] = useState('All');
  const filtered = cat === 'All' ? mockResources : mockResources.filter(r => r.category === cat);

  return (
    <div>
      <ScrollReveal>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>Resources</h1>
        <p style={{ color: 'var(--sp-text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Download notes, question papers, and lab manuals</p>
      </ScrollReveal>
      <ScrollReveal delay={80}>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {categories.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className={`sp-btn ${c === cat ? 'sp-btn-primary' : 'sp-btn-outline'}`}
              style={{ fontSize: '0.82rem', padding: '0.5rem 1rem' }}>{c}</button>
          ))}
        </div>
      </ScrollReveal>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
        {filtered.map((r, i) => (
          <ScrollReveal key={r.id} delay={i * 60}>
            <div className="sp-card" style={{ padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(59,130,246,0.08)', color: 'var(--sp-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {catIcons[r.category] || <FileText size={20} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.title}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--sp-text-muted)', marginTop: 2 }}>{r.subject} · {r.size}</div>
              </div>
              <button className="sp-btn sp-btn-ghost" style={{ padding: 8, color: 'var(--sp-primary)' }} title="Download">
                <Download size={18} />
              </button>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
};

export default StudentResources;

import React, { useState } from 'react';
import { ChevronDown, Mail, Phone, MapPin } from 'lucide-react';
import { mockFAQs } from '../../data/studentMockData';
import ScrollReveal from '../../components/student/ScrollReveal';

const StudentHelp = () => {
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <div>
      <ScrollReveal>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>Help & Support</h1>
        <p style={{ color: 'var(--sp-text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Find answers or reach out for help</p>
      </ScrollReveal>

      <ScrollReveal delay={80}>
        <div className="sp-card" style={{ marginBottom: '1.5rem', overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.25rem 0.5rem', fontWeight: 700, fontSize: '1.05rem' }}>Frequently Asked Questions</div>
          {mockFAQs.map((faq, i) => (
            <div className="sp-faq-item" key={i}>
              <button className="sp-faq-question" onClick={() => setOpenIdx(openIdx === i ? null : i)}>
                {faq.q}
                <ChevronDown size={18} className={`sp-faq-icon ${openIdx === i ? 'open' : ''}`} />
              </button>
              {openIdx === i && <div className="sp-faq-answer">{faq.a}</div>}
            </div>
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal delay={160}>
        <div className="sp-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem' }}>Contact Us</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            {[
              { icon: <Mail size={18} />, label: 'Email', value: 'examcell@ritchennai.edu.in' },
              { icon: <Phone size={18} />, label: 'Phone', value: '+91 44 6780 2042' },
              { icon: <MapPin size={18} />, label: 'Office', value: 'Room A1-102, Main Block' },
            ].map((c, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', padding: '0.75rem', background: 'rgba(248,250,252,0.8)', borderRadius: 'var(--sp-radius-xs)' }}>
                <span style={{ color: 'var(--sp-primary)' }}>{c.icon}</span>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--sp-text-muted)', fontWeight: 600 }}>{c.label}</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{c.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
};

export default StudentHelp;

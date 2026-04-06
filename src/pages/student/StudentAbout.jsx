import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronDown, GraduationCap, Building2, MapPin, BookOpen } from 'lucide-react';
import '../../styles/StudentAbout.css';

// Reusable animated section component linking directly to the scroll timeline
const ScrollSection = ({ number, title, desc, Icon }) => {
  const sectionRef = useRef(null);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (sectionRef.current) {
            const rect = sectionRef.current.getBoundingClientRect();
            const vh = window.innerHeight;
            
            // Progress goes from 0 (just entering bottom of screen) to 1 (just leaving top of screen)
            let progress = (vh - rect.top) / (vh + rect.height);
            progress = Math.max(0, Math.min(1, progress));
            
            // --scroll-center curve: 0 at edges, 1 in the middle
            let pCenter = Math.max(0, 1 - Math.abs(progress - 0.5) * 2);
            
            // --scroll-offset: -0.5 (entering) to 0 (middle) to +0.5 (leaving)
            let pOffset = progress - 0.5;

            sectionRef.current.style.setProperty('--scroll-center', pCenter.toFixed(4));
            sectionRef.current.style.setProperty('--scroll-offset', pOffset.toFixed(4));
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // init

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="kin-section" ref={sectionRef}>
      <div className="kin-content">
        <div className="kin-number">{number}</div>
        
        {/* Kinetic Title - Stretches letter by letter via scroll */}
        <h2 className="kin-title">
          {title.split('').map((char, i) => (
            <span 
              key={i} 
              className="kin-anim-char" 
              style={{ '--char-idx': i }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </h2>

        {/* Scrub Description - Fades in word by word via scroll */}
        <p className="kin-desc">
          {desc.split(' ').map((word, i, arr) => (
            <span 
              key={i} 
              className="kin-anim-word" 
              style={{ '--word-p': i / arr.length }}
            >
              {word}{' '}
            </span>
          ))}
        </p>
      </div>
      <div className="kin-visual">
        <div className="kin-visual-inner">
          <Icon size={120} strokeWidth={1} />
        </div>
      </div>
    </div>
  );
};

const StudentAbout = () => {
  return (
    <div className="about-page">
      <div className="about-back-btn">
        <Link to="/" className="sp-btn sp-glass" style={{ padding: '10px 16px', background: 'rgba(255,255,255,0.05)' }}>
          <ArrowLeft size={18} /> Back to Portal
        </Link>
      </div>

      {/* Hero Section */}
      <div className="about-hero">
        <h1 className="about-hero-title" data-text="DISCOVER R.I.T.">
          DISCOVER R.I.T.
        </h1>
        <p className="about-hero-subtitle">
          Pioneering the future of digital academic infrastructure and seamless exam management at Rajalakshmi Institute of Technology.
        </p>
        <div className="scroll-indicator">
          <ChevronDown size={32} />
        </div>
      </div>

      {/* Scrolling Narrative Sections */}
      <div className="about-sections">
        <ScrollSection 
          number="01"
          title="The College"
          desc="Rajalakshmi Institute of Technology is dedicated to producing world-class engineers. With state-of-the-art facilities and a massive digital ecosystem, we ensure every student experiences a flawless academic journey from enrollment to graduation."
          Icon={GraduationCap}
        />

        <ScrollSection 
          number="02"
          title="Exam Management"
          desc="Exams are stressful enough without logistical chaos. SmartSeat is our proprietary engine that digitally routes thousands of students into optimized seating arrangements, guaranteeing zero conflicts and upholding the highest standards of academic integrity."
          Icon={Building2}
        />

        <ScrollSection 
          number="03"
          title="Exam Centers"
          desc="Operating across 45 dedicated testing blocks, our centers are fully monitored through the SmartSeat live dashboard. From the main auditorium to specialized lab hubs, our infrastructure scales to handle massive concurrency effortlessly."
          Icon={MapPin}
        />

        <ScrollSection 
          number="04"
          title="Subjects & Tracking"
          desc="Navigating your curriculum is seamless. Our integrated portals track deep metrics across every subject, mapping your performance against global outcomes to push you toward pure academic excellence."
          Icon={BookOpen}
        />
      </div>
    </div>
  );
};

export default StudentAbout;

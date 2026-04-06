import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, ArrowRight, Shield } from 'lucide-react';
import { StudentContext } from '../../context/StudentContext';
import '../../styles/StudentPortal.css';

const StudentLogin = () => {
  const { studentLogin, isStudentAuth } = useContext(StudentContext);
  const navigate = useNavigate();
  const [regNumber, setRegNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isStudentAuth) {
    navigate('/student/dashboard', { replace: true });
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const result = studentLogin(regNumber);
      if (result.success) {
        navigate('/student/dashboard');
      } else {
        setError(result.error);
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="student-app">
      <div className="sp-login-page">
        <div className="sp-card sp-login-card">
          <div className="sp-sidebar-logo" style={{ margin: '0 auto 1.25rem', width: 52, height: 52, fontSize: '1.4rem' }}>S</div>
          <h2>Student Portal Login</h2>
          <p>Enter your register number to access the SmartSeat Student Portal</p>
          <form onSubmit={handleSubmit}>
            <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
              <Search size={18} style={{
                position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                color: 'var(--sp-text-muted)'
              }} />
              <input
                className="sp-input"
                style={{ paddingLeft: 40 }}
                type="text"
                placeholder="e.g. 2117230020001"
                value={regNumber}
                onChange={(e) => setRegNumber(e.target.value)}
                required
                autoFocus
              />
            </div>
            {error && <div className="sp-login-error">{error}</div>}
            <button
              type="submit"
              className="sp-btn sp-btn-primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}
              disabled={loading}
            >
              {loading ? 'Verifying...' : <><ArrowRight size={18} /> Access Portal</>}
            </button>
          </form>
          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--sp-border)' }}>
            <Link to="/" style={{ color: 'var(--sp-text-muted)', fontSize: '0.82rem', textDecoration: 'none' }}>
              ← Back to Home
            </Link>
            <span style={{ margin: '0 0.75rem', color: 'var(--sp-border)' }}>|</span>
            <Link to="/login" style={{
              color: 'var(--sp-text-muted)', fontSize: '0.82rem', textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: 4
            }}>
              <Shield size={12} /> Admin Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;

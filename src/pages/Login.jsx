import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, LogIn, Settings2, AlertCircle, Shield, Users, ArrowLeft, Mail } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import './Login.css';

const Login = () => {
    const [step, setStep] = useState('role'); // 'role' | 'form'
    const [role, setRole] = useState('admin'); // 'admin' | 'staff'

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    
    // For staff, we only need email
    const [email, setEmail] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login, isAuthenticated, currentUser } = useContext(AppContext);

    // Redirect if already logged in
    useEffect(() => {
        if (isAuthenticated && currentUser) {
            if (currentUser.role === 'staff') {
                navigate('/admin/staff-portal', { replace: true });
            } else {
                navigate('/admin/dashboard', { replace: true });
            }
        }
    }, [isAuthenticated, currentUser, navigate]);

    if (isAuthenticated) return null;

    const handleRoleSelect = (selectedRole) => {
        setRole(selectedRole);
        setError('');
        setStep('form');
    };

    const handleBack = () => {
        setStep('role');
        setError('');
        setUsername('');
        setPassword('');
        setEmail('');
    };

    const handleLogin = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        setTimeout(() => {
            let result;
            if (role === 'admin') {
                result = login(username, password, 'admin');
            } else {
                result = login(email, '', 'staff');
            }
            
            setIsLoading(false);

            if (result.success) {
                if (role === 'staff') {
                    navigate('/admin/staff-portal');
                } else {
                    navigate('/admin/dashboard');
                }
            } else {
                setError(result.error);
            }
        }, 600);
    };

    return (
        <div className="login-container">
            {/* Spectacular Background Effects */}
            <div className="login-blob blob-1"></div>
            <div className="login-blob blob-2"></div>
            <div className="login-blob blob-3"></div>
            
            <div className="login-grid-overlay"></div>

            <div className="login-content-wrapper">
                {step === 'role' ? (
                    <div className="role-selection-view animate-fade-in">
                        <div className="login-header-large">
                            <div className="logo-pulse">
                                <Settings2 size={48} className="text-accent-primary" />
                            </div>
                            <h1 className="login-title-large text-gradient">SmartSeat Portal</h1>
                            <p className="login-subtitle">Please select your access tier to continue.</p>
                        </div>

                        <div className="role-cards-container">
                            <button 
                                className="role-card admin-card glass-panel"
                                onClick={() => handleRoleSelect('admin')}
                                aria-label="Admin Access"
                            >
                                <div className="role-icon-wrapper admin-icon">
                                    <Shield size={36} />
                                </div>
                                <h2>Admin Access</h2>
                                <p>Exam cell operations, seating generation, and master controls.</p>
                            </button>

                            <button 
                                className="role-card staff-card glass-panel"
                                onClick={() => handleRoleSelect('staff')}
                                aria-label="Staff Access"
                            >
                                <div className="role-icon-wrapper staff-icon">
                                    <Users size={36} />
                                </div>
                                <h2>Staff Access</h2>
                                <p>Student welfare, marks entry, and assignment tracking.</p>
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="login-card glass-panel animate-slide-up">
                        <button className="back-button" onClick={handleBack} aria-label="Back to role selection">
                            <ArrowLeft size={20} />
                            <span>Back</span>
                        </button>
                        
                        <div className="login-header">
                            <div className={`login-logo ${role === 'admin' ? 'admin-theme' : 'staff-theme'}`}>
                                {role === 'admin' ? <Shield size={32} /> : <Users size={32} />}
                            </div>
                            <h2 className="login-title text-gradient">
                                {role === 'admin' ? 'Admin Login' : 'Staff Login'}
                            </h2>
                            <p className="login-subtitle">
                                {role === 'admin' ? 'Access the master control panel' : 'Access the staff management portal'}
                            </p>
                        </div>

                        {error && (
                            <div className="login-error" role="alert" aria-live="polite">
                                <AlertCircle size={16} />
                                <span>{error}</span>
                            </div>
                        )}

                        <form className="login-form" onSubmit={handleLogin}>
                            {role === 'admin' ? (
                                <>
                                    <div className="input-group">
                                        <div className="input-icon">
                                            <User size={20} />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Admin Username"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            required
                                            aria-label="Username"
                                            autoComplete="username"
                                        />
                                    </div>

                                    <div className="input-group">
                                        <div className="input-icon">
                                            <Lock size={20} />
                                        </div>
                                        <input
                                            type="password"
                                            placeholder="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            aria-label="Password"
                                            autoComplete="current-password"
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="input-group">
                                        <div className="input-icon">
                                            <Mail size={20} />
                                        </div>
                                        <input
                                            type="email"
                                            placeholder="Staff Email (@staff.ritchennai.edu.in)"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            aria-label="Staff Email"
                                            autoComplete="email"
                                        />
                                    </div>
                                </>
                            )}

                            <button type="submit" className={`login-btn ${role === 'admin' ? 'btn-primary' : 'btn-staff'}`} disabled={isLoading}>
                                {isLoading ? (
                                    <span className="loading-spinner"></span>
                                ) : (
                                    <>
                                        <LogIn size={20} />
                                        Access Portal
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="login-footer">
                            {role === 'admin' ? (
                                <p>Default credentials: <strong>admin</strong> / <strong>1234</strong></p>
                            ) : (
                                <p>Email must end with <strong>@staff.ritchennai.edu.in</strong></p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;

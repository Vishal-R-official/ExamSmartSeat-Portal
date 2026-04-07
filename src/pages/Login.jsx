import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, LogIn, AlertCircle, Shield, Users, ArrowLeft, Mail } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import './Login.css';

const Login = () => {
    const [step, setStep] = useState('role_selection'); // role_selection, provider_login
    const [selectedRole, setSelectedRole] = useState(null); // admin, staff
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    const navigate = useNavigate();
    const { login, isAuthenticated, currentUser } = useContext(AppContext);

    // Redirect if already logged in
    useEffect(() => {
        if (isAuthenticated && currentUser) {
            navigate('/admin/dashboard', { replace: true });
        }
    }, [isAuthenticated, currentUser, navigate]);

    if (isAuthenticated) return null;

    const handleRoleSelect = (role) => {
        setSelectedRole(role);
        setStep('provider_login');
        setError('');
        setUsername('');
        setPassword('');
    };

    const handleBack = () => {
        setStep('role_selection');
        setSelectedRole(null);
        setError('');
    };

    const handleLogin = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        setTimeout(() => {
            const result = login(username, password, selectedRole);
            setIsLoading(false);

            if (result.success) {
                navigate('/admin/dashboard');
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

            <div className="login-content-wrapper animate-slide-up">
                {step === 'role_selection' ? (
                    <div className="login-card glass-panel">
                        <div className="login-header">
                            <div className="login-logo text-accent-primary mb-4" style={{display:'flex', justifyContent:'center'}}>
                                <Shield size={48} />
                            </div>
                            <h1 className="login-title text-gradient">SmartSeat Portal</h1>
                            <p className="login-subtitle">Identify your access clearance</p>
                        </div>
                        
                        <div className="role-selection-grid mt-6">
                            <button 
                                className="role-btn admin-role glass-panel p-6"
                                onClick={() => handleRoleSelect('admin')}
                            >
                                <div className="role-icon admin-theme">
                                    <Shield size={28} />
                                </div>
                                <h3 className="text-xl font-bold mt-3">Admin Access</h3>
                                <p className="text-sm text-text-muted mt-2">Full system control and seating map orchestration</p>
                            </button>

                            <button 
                                className="role-btn staff-role glass-panel p-6"
                                onClick={() => handleRoleSelect('staff')}
                            >
                                <div className="role-icon staff-theme text-subj-purple" style={{background: 'rgba(139, 92, 246, 0.1)'}}>
                                    <Users size={28} />
                                </div>
                                <h3 className="text-xl font-bold mt-3">Staff Access</h3>
                                <p className="text-sm text-text-muted mt-2">Manage markings, cycle tests, and student records</p>
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="login-card glass-panel animate-fade-in">
                        <button className="back-btn" onClick={handleBack}>
                            <ArrowLeft size={18} /> Back
                        </button>
                        
                        <div className="login-header mt-4">
                            <div className={`login-logo ${selectedRole === 'admin' ? 'admin-theme' : 'staff-theme'}`}>
                                {selectedRole === 'admin' ? <Shield size={32} /> : <Users size={32} />}
                            </div>
                            <h1 className="login-title text-gradient">
                                {selectedRole === 'admin' ? 'Admin Gateway' : 'Staff Gateway'}
                            </h1>
                            <p className="login-subtitle">
                                {selectedRole === 'admin' ? 'Secure Master Control Panel' : 'Academic Record Management'}
                            </p>
                        </div>

                        {error && (
                            <div className="login-error" role="alert">
                                <AlertCircle size={16} />
                                <span>{error}</span>
                            </div>
                        )}

                        <form className="login-form" onSubmit={handleLogin}>
                            {selectedRole === 'admin' ? (
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
                                            autoComplete="current-password"
                                        />
                                    </div>
                                </>
                            ) : (
                                <div className="input-group">
                                    <div className="input-icon">
                                        <Mail size={20} />
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="Institutional Email (@staff.ritchennai.edu.in)"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                        autoComplete="email"
                                    />
                                </div>
                            )}

                            <button 
                                type="submit" 
                                className={`login-btn ${selectedRole === 'admin' ? 'btn-primary' : 'btn-purple'}`} 
                                disabled={isLoading}
                                style={selectedRole === 'staff' ? { background: 'linear-gradient(135deg, var(--subj-purple), #6d28d9)', color: 'white', border: 'none', padding: '0.8rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', width: '100%', marginTop: '1rem' } : {}}
                            >
                                {isLoading ? (
                                    <span className="loading-spinner"></span>
                                ) : (
                                    <>
                                        <LogIn size={20} />
                                        {selectedRole === 'admin' ? 'Authenticate' : 'Verify Email Address'}
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="login-footer">
                            <p>Authorized personnel only.</p>
                            {selectedRole === 'admin' ? (
                                <p>Default: <strong>admin</strong> / <strong>1234</strong></p>
                            ) : (
                                <p>Example: <strong>demo@staff.ritchennai.edu.in</strong></p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;

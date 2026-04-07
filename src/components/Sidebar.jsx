import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Users, Building, Settings2,
    Search, AlertTriangle, Database, CalendarCheck,
    LogOut, Home, X
} from 'lucide-react';
import { AppContext } from '../context/AppContext';
import './Sidebar.css';

const Sidebar = ({ isOpen, onToggle }) => {
    const { logout, currentUser } = useContext(AppContext);
    const navigate = useNavigate();
    // ── Admin items ───────────────────────────────────────────────
    const adminItems = [
        { path: '/',                         label: 'Home Page',         icon: Home },
        { path: '/admin/dashboard',         label: 'Dashboard',         icon: LayoutDashboard },
        { path: '/admin/students',           label: 'Student Data',      icon: Users },
        { path: '/admin/halls',              label: 'Hall Management',   icon: Building },
        { path: '/admin/seating-generator',  label: 'Seating Generator', icon: Settings2 },
        { path: '/admin/interactive-map',    label: 'Exam Seating Plan', icon: CalendarCheck },
        { path: '/admin/monitoring',         label: 'Live Monitoring',   icon: AlertTriangle },
        { path: '/admin/student-portal',     label: 'Student Lookup',    icon: Search },
        { path: '/admin/backup',             label: 'Backup & Restore',  icon: Database },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && <div className="sidebar-overlay" onClick={onToggle} aria-hidden="true" />}

            <aside className={`sidebar glass-panel ${isOpen ? 'open' : ''}`} role="navigation" aria-label="Main Navigation">
                <div className="sidebar-header">
                    <div className="logo-icon">
                        <Settings2 size={28} className="text-accent-primary" />
                    </div>
                    <h2 className="sidebar-title text-gradient">SmartSeat</h2>
                    <button className="sidebar-close-btn" onClick={onToggle} aria-label="Close menu">
                        <X size={20} />
                    </button>
                </div>

                <nav className="sidebar-nav" aria-label="Navigation links">

                    {/* ── ADMIN SECTION ── */}
                    {currentUser?.role === 'admin' && (
                        <>
                            <div className="sidebar-section-label">Admin Control</div>
                            {adminItems.map((item, index) => {
                                const Icon = item.icon;
                                return (
                                    <NavLink
                                        key={`admin-${index}`}
                                        to={item.path}
                                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                                        onClick={() => { if (window.innerWidth < 768) onToggle?.(); }}
                                        aria-label={item.label}
                                    >
                                        <Icon size={20} className="nav-icon" aria-hidden="true" />
                                        <span>{item.label}</span>
                                    </NavLink>
                                );
                            })}
                        </>
                    )}

                    {/* ── STAFF SECTION ── */}
                    {currentUser?.role === 'staff' && (
                        <>
                            <div className="sidebar-section-label">Staff Portal</div>
                            <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                                <Home size={20} className="nav-icon" />
                                <span>Home Page</span>
                            </NavLink>
                            <NavLink to="/admin/staff-portal" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                                <LayoutDashboard size={20} className="nav-icon" />
                                <span>Staff Dashboard</span>
                            </NavLink>
                            <NavLink to="/admin/student-welfare" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                                <Users size={20} className="nav-icon" />
                                <span>Student Welfare</span>
                            </NavLink>
                            
                            <div className="sidebar-section-label" style={{marginTop: '1.5rem'}}>Academic Management</div>
                            <NavLink to="/admin/assignments" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                                <Database size={20} className="nav-icon" />
                                <span>Assignment Management</span>
                            </NavLink>
                            <NavLink to="/admin/cat-marks" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                                <Settings2 size={20} className="nav-icon" />
                                <span>Update CAT Marks</span>
                            </NavLink>
                            <NavLink to="/admin/cycle-test-marks" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                                <CalendarCheck size={20} className="nav-icon" />
                                <span>Update Cycle Test Marks</span>
                            </NavLink>
                        </>
                    )}
                </nav>

                <div className="sidebar-footer">
                    {currentUser && (
                        <div className="user-info">
                            <div className="user-avatar">{currentUser.name?.charAt(0) || 'A'}</div>
                            <div className="user-details">
                                <span className="user-name">{currentUser.name}</span>
                                <span className="user-role">{currentUser.role}</span>
                            </div>
                        </div>
                    )}
                    <button className="logout-btn" onClick={handleLogout} aria-label="Logout">
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;

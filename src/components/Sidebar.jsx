import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Users, Building, Settings2,
    Search, AlertTriangle, Database, CalendarCheck,
    LogOut, GraduationCap, Heart, X, ChevronDown
} from 'lucide-react';
import { AppContext } from '../context/AppContext';
import './Sidebar.css';

const Sidebar = ({ isOpen, onToggle }) => {
    const { logout, currentUser } = useContext(AppContext);
    const navigate = useNavigate();
    const [staffExpanded, setStaffExpanded] = useState(false);

    // ── Admin-only items (seating management) ──────────────────────────
    const adminItems = [
        { path: '/admin/dashboard',         label: 'Dashboard',         icon: LayoutDashboard },
        { path: '/admin/students',           label: 'Student Data',      icon: Users },
        { path: '/admin/halls',              label: 'Hall Management',   icon: Building },
        { path: '/admin/seating-generator',  label: 'Seating Generator', icon: Settings2 },
        { path: '/admin/interactive-map',    label: 'Exam Seating Plan', icon: CalendarCheck },
        { path: '/admin/monitoring',         label: 'Live Monitoring',   icon: AlertTriangle },
        { path: '/admin/student-portal',     label: 'Student Lookup',    icon: Search },
        { path: '/admin/backup',             label: 'Backup & Restore',  icon: Database },
    ];

    // ── Staff-accessible items ─────────────────────────────────────────
    const staffItems = [
        { path: '/admin/student-welfare', label: 'Student Welfare',  icon: Heart },
        { path: '/admin/staff-portal',    label: 'Staff Portal',     icon: GraduationCap },
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
                            <div className="sidebar-section-label">Admin</div>
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
                    {currentUser?.role === 'admin' && <div className="sidebar-divider" />}
                    {(currentUser?.role === 'staff' || currentUser?.role === 'admin') && (
                        <>
                            <button
                                className="sidebar-section-toggle"
                                onClick={() => setStaffExpanded(p => !p)}
                                aria-expanded={staffExpanded}
                                style={currentUser?.role === 'staff' ? { paddingLeft: '1rem', marginTop: '1rem' } : undefined}
                            >
                                <span className="sidebar-section-label" style={{ margin: 0 }}>
                                    {currentUser?.role === 'staff' ? 'Staff Menu' : 'Staff Access'}
                                </span>
                                <ChevronDown size={14} className={`sidebar-chevron ${(staffExpanded || currentUser?.role === 'staff') ? 'open' : ''}`} />
                            </button>

                            {(staffExpanded || currentUser?.role === 'staff') && staffItems.map((item, index) => {
                                const Icon = item.icon;
                                return (
                                    <NavLink
                                        key={`staff-${index}`}
                                        to={item.path}
                                        className={({ isActive }) => `nav-item nav-item-staff ${isActive ? 'active' : ''}`}
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

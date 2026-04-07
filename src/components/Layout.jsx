import React, { useState, useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, Sun, Moon } from 'lucide-react';
import Sidebar from './Sidebar';
import { AppContext } from '../context/AppContext';
import './Layout.css';

const Layout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { theme, toggleTheme } = useContext(AppContext);

    return (
        <div className="app-layout">
            <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
            <main className="main-content">
                <header className="top-header glass-panel">
                    <div className="header-left">
                        <button className="mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}
                                aria-label="Toggle navigation menu">
                            <Menu size={24} />
                        </button>
                        <div>
                            <h1 className="page-title">Exam Cell Administration</h1>
                            <p className="page-subtitle">Smart Seating Arrangement System</p>
                        </div>
                    </div>
                    <div className="header-right">
                        <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle Theme" title="Toggle Theme">
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <div className="status-badge available" aria-label="System status">
                            <span className="dot" aria-hidden="true"></span>
                            System Active
                        </div>
                    </div>
                </header>

                <div className="page-container animate-fade-in">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;

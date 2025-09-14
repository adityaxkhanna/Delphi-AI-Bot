
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import './Dashboard.css';

const Dashboard = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth <= 768
  );
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // THEME: init from localStorage or OS preference
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light';
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  // Apply theme to <body data-theme="...">
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) setMobileSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navigate = useNavigate();

  const toggleSidebar = () => {
    if (isMobile) setMobileSidebarOpen(o => !o);
    else setSidebarCollapsed(c => !c);
  };

  const handleSignOut = () => {
    console.log('Sign out clicked');
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <Sidebar
        collapsed={sidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        isMobile={isMobile}
        onToggle={toggleSidebar}
      />

      {isMobile && mobileSidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className={`dashboard-content ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <header className="dashboard-header">
          <button
            className="sidebar-toggle"
            onClick={toggleSidebar}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>

          <div className="header-content">
            <h1>Delphi AI Bot</h1>
          </div>

          {/* Theme toggle */}
          <button
            className="theme-toggle"
            onClick={() => setTheme(t => (t === 'dark' ? 'light' : 'dark'))}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '☀ Light' : '🌙 Dark'}
          </button>

          <button
            className="sign-out-button"
            onClick={handleSignOut}
            aria-label="Sign out"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16,17 21,12 16,7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span>Sign Out</span>
          </button>
        </header>

        <main className="dashboard-main">{children}</main>
      </div>
    </div>
  );
};

export default Dashboard;

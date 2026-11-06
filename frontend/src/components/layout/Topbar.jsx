import { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  User,
  LogOut,
  Building2,
  GraduationCap,
  Users,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import Badge from '../common/Badge';

export const Topbar = ({
  activePage,
  onOpenSidebar,
  searchQuery,
  onSearchChange,
  onNavigate,
}) => {
  const { user, role, activeUniversity, logout, loginAsDemoRole } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);

  const profileRef = useRef(null);
  const notificationRef = useRef(null);
  const roleSwitcherRef = useRef(null);

  // Close popovers on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
      if (roleSwitcherRef.current && !roleSwitcherRef.current.contains(e.target)) {
        setRoleSwitcherOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name) => {
    if (!name) return 'SA';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const notifications = [
    {
      id: 1,
      title: 'Mid-Term Exam Schedule Published',
      time: '1 hour ago',
      type: 'info',
      unread: true,
    },
    {
      id: 2,
      title: 'Face Attendance System Operational',
      time: 'Today, 08:30 AM',
      type: 'success',
      unread: true,
    },
    {
      id: 3,
      title: 'CS301 Assignment 2 Due Friday',
      time: 'Yesterday',
      type: 'warning',
      unread: false,
    },
  ];

  const roleLabels = {
    student: 'Student',
    faculty: 'Faculty Member',
    parent: 'Parent / Guardian',
    admin: 'Administrator',
  };

  const roleColors = {
    student: 'blue',
    faculty: 'purple',
    parent: 'green',
    admin: 'orange',
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          className="icon-button mobile-menu"
          onClick={onOpenSidebar}
          aria-label="Open navigation menu"
        >
          <Menu size={22} />
        </button>
        <div>
          <p className="breadcrumb">
            {activeUniversity?.code || 'PORTAL'} / {roleLabels[role] || 'Workspace'}
          </p>
          <h2>{activePage}</h2>
        </div>
      </div>

      <div className="topbar-actions">
        {/* Search Input */}
        <label className="search-box">
          <Search size={17} />
          <input
            type="search"
            placeholder="Search portal..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <kbd>⌕</kbd>
        </label>

        {/* Role Switcher Pill (Quick demo switcher for academic project review) */}
        <div className="role-switcher-container" ref={roleSwitcherRef}>
          <button
            className={`role-pill-btn pill-${roleColors[role] || 'blue'}`}
            onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
            title="Switch portal role view"
          >
            <span className="role-pill-dot" />
            <span className="role-pill-text">{roleLabels[role] || role}</span>
            <ChevronDown size={14} />
          </button>

          {roleSwitcherOpen && (
            <div className="dropdown-panel role-dropdown">
              <div className="dropdown-header">
                <strong>Switch Role Portal</strong>
                <span>Experience role-specific workflows</span>
              </div>
              <div className="dropdown-menu-list">
                <button
                  className={`dropdown-item ${role === 'student' ? 'active' : ''}`}
                  onClick={() => {
                    loginAsDemoRole('student');
                    setRoleSwitcherOpen(false);
                    onNavigate('Dashboard');
                  }}
                >
                  <GraduationCap size={16} />
                  <div>
                    <strong>Student Portal</strong>
                    <span>Live profile & attendance</span>
                  </div>
                </button>
                <button
                  className={`dropdown-item ${role === 'faculty' ? 'active' : ''}`}
                  onClick={() => {
                    loginAsDemoRole('faculty');
                    setRoleSwitcherOpen(false);
                    onNavigate('Dashboard');
                  }}
                >
                  <Users size={16} />
                  <div>
                    <strong>Faculty Portal</strong>
                    <span>Class rosters & assignments</span>
                  </div>
                </button>
                <button
                  className={`dropdown-item ${role === 'parent' ? 'active' : ''}`}
                  onClick={() => {
                    loginAsDemoRole('parent');
                    setRoleSwitcherOpen(false);
                    onNavigate('Dashboard');
                  }}
                >
                  <ShieldCheck size={16} />
                  <div>
                    <strong>Parent Portal</strong>
                    <span>Ward progress & attendance</span>
                  </div>
                </button>
                <button
                  className={`dropdown-item ${role === 'admin' ? 'active' : ''}`}
                  onClick={() => {
                    loginAsDemoRole('admin');
                    setRoleSwitcherOpen(false);
                    onNavigate('Dashboard');
                  }}
                >
                  <Building2 size={16} />
                  <div>
                    <strong>Administrator Console</strong>
                    <span>Universities & system health</span>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Notifications Dropdown */}
        <div className="notification-wrapper" ref={notificationRef}>
          <button
            className="icon-button notification-button"
            aria-label="Notifications"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
          >
            <Bell size={19} />
            <span className="notification-dot" />
          </button>

          {notificationsOpen && (
            <div className="dropdown-panel notification-dropdown">
              <div className="dropdown-header">
                <strong>Notifications</strong>
                <Badge variant="blue" size="sm">3 new</Badge>
              </div>
              <div className="dropdown-menu-list">
                {notifications.map((item) => (
                  <div key={item.id} className="notification-item">
                    <div className="notification-text">
                      <p className="notification-title">{item.title}</p>
                      <span className="notification-time">{item.time}</span>
                    </div>
                    {item.unread && <span className="unread-indicator" />}
                  </div>
                ))}
              </div>
              <div className="dropdown-footer">
                <button
                  className="dropdown-footer-link"
                  onClick={() => {
                    setNotificationsOpen(false);
                    onNavigate('Reports');
                  }}
                >
                  View all announcements
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="topbar-divider" />

        {/* User Profile Menu */}
        <div className="profile-wrapper" ref={profileRef}>
          <button
            className="profile-button"
            onClick={() => setProfileOpen(!profileOpen)}
            aria-expanded={profileOpen}
          >
            <div className="profile-avatar">{getInitials(user?.fullName)}</div>
            <div className="profile-copy">
              <strong>{user?.fullName || 'User Account'}</strong>
              <span>{roleLabels[role] || 'Member'}</span>
            </div>
            <ChevronDown size={15} />
          </button>

          {profileOpen && (
            <div className="dropdown-panel profile-dropdown">
              <div className="dropdown-user-header">
                <div className="user-avatar-lg">{getInitials(user?.fullName)}</div>
                <div>
                  <strong>{user?.fullName}</strong>
                  <p>{user?.email || 'user@studentai.edu'}</p>
                  <span className="user-dept">{user?.department || 'Computer Science'}</span>
                </div>
              </div>

              <div className="dropdown-menu-list">
                <button
                  className="dropdown-item"
                  onClick={() => {
                    setProfileOpen(false);
                    onNavigate('Settings');
                  }}
                >
                  <User size={16} />
                  <span>Account & Profile</span>
                </button>
                <div className="dropdown-divider" />
                <button
                  className="dropdown-item dropdown-item-danger"
                  onClick={() => {
                    setProfileOpen(false);
                    logout();
                  }}
                >
                  <LogOut size={16} />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;

import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CalendarDays,
  ClipboardCheck,
  BookOpen,
  MessageSquareText,
  FileText,
  Settings,
  CircleHelp,
  Building2,
  LogOut,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/useAuth';

// Role-specific navigation definitions
const navigationByRole = {
  student: [
    { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'Attendance', label: 'My Attendance', icon: ClipboardCheck },
    { id: 'Timetable', label: 'Timetable', icon: CalendarDays },
    { id: 'Assignments', label: 'Assignments', icon: BookOpen },
    { id: 'AI Assistant', label: 'AI Assistant', icon: MessageSquareText },
    { id: 'Reports', label: 'Academic Reports', icon: FileText },
  ],
  faculty: [
    { id: 'Dashboard', label: 'Faculty Hub', icon: LayoutDashboard },
    { id: 'Students', label: 'Student Directory', icon: Users },
    { id: 'Attendance', label: 'Class Attendance', icon: ClipboardCheck },
    { id: 'Timetable', label: 'Teaching Schedule', icon: CalendarDays },
    { id: 'Assignments', label: 'Manage Assignments', icon: BookOpen },
    { id: 'Reports', label: 'Grading Reports', icon: FileText },
    { id: 'AI Assistant', label: 'AI Assistant', icon: MessageSquareText },
  ],
  parent: [
    { id: 'Dashboard', label: 'Parent Portal', icon: LayoutDashboard },
    { id: 'Attendance', label: "Ward's Attendance", icon: ClipboardCheck },
    { id: 'Timetable', label: 'Class Schedule', icon: CalendarDays },
    { id: 'Assignments', label: 'Assignments Tracker', icon: BookOpen },
    { id: 'Reports', label: 'Progress Reports', icon: FileText },
    { id: 'AI Assistant', label: 'Parent Guide AI', icon: MessageSquareText },
  ],
  admin: [
    { id: 'Dashboard', label: 'Admin Console', icon: LayoutDashboard },
    { id: 'Universities', label: 'Universities', icon: Building2 },
    { id: 'Students', label: 'Student Accounts', icon: Users },
    { id: 'Faculty', label: 'Faculty Directory', icon: GraduationCap },
    { id: 'Attendance', label: 'University Attendance', icon: ClipboardCheck },
    { id: 'Reports', label: 'Institutional Analytics', icon: FileText },
    { id: 'AI Assistant', label: 'AI Operations', icon: MessageSquareText },
  ],
};

export const Sidebar = ({
  activePage,
  onNavigate,
  isOpen,
  onClose,
  searchFilter = '',
}) => {
  const { user, role, activeUniversity, logout } = useAuth();

  const roleNavItems = navigationByRole[role] || navigationByRole.student;

  const filteredItems = roleNavItems.filter((item) =>
    item.label.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const getInitials = (name) => {
    if (!name) return 'SA';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <>
      {isOpen && (
        <button
          className="mobile-overlay"
          aria-label="Close navigation overlay"
          onClick={onClose}
        />
      )}

      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        {/* Brand Header */}
        <div className="brand">
          <div className="brand-mark">
            <Building2 size={24} />
          </div>
          <div>
            <h1>StudentAI</h1>
            <p>UNIVERSITY PORTAL</p>
          </div>
          <button
            className="icon-button sidebar-close"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Institution Card */}
        <div className="institution">
          <div className="institution-icon">
            <GraduationCap size={20} />
          </div>
          <div className="institution-copy">
            <strong>{activeUniversity?.name || 'StudentAI University'}</strong>
            <span>Code: {activeUniversity?.code || 'SA-01'}</span>
          </div>
        </div>

        {/* Navigation Section */}
        <p className="nav-heading">
          {role ? `${role.toUpperCase()} MENU` : 'MAIN MENU'}
        </p>

        <nav className="navigation">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                className={`nav-item ${isActive ? 'nav-active' : ''}`}
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
              >
                <Icon size={18} strokeWidth={1.9} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="sidebar-bottom">
          <button
            className={`nav-item ${activePage === 'Settings' ? 'nav-active' : ''}`}
            onClick={() => {
              onNavigate('Settings');
              onClose();
            }}
          >
            <Settings size={18} strokeWidth={1.9} />
            <span>Settings & Preferences</span>
          </button>

          <div className="help-card">
            <div className="help-icon">
              <CircleHelp size={18} />
            </div>
            <strong>AI Academic Support</strong>
            <p>Instant answers on syllabus, courses & ERP operations.</p>
            <button
              onClick={() => {
                onNavigate('AI Assistant');
                onClose();
              }}
            >
              Ask StudentAI <span>→</span>
            </button>
          </div>

          {/* User info footer */}
          <div className="sidebar-footer">
            <div className="footer-avatar">
              {getInitials(user?.fullName)}
            </div>
            <div className="footer-copy">
              <strong>{user?.fullName || 'User Account'}</strong>
              <span>{role.charAt(0).toUpperCase() + role.slice(1)}</span>
            </div>
            <button
              className="icon-button logout-btn"
              onClick={logout}
              title="Sign out of portal"
              aria-label="Sign out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

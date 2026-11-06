import { useState } from 'react';
import {
  Building2,
  GraduationCap,
  Users,
  ShieldCheck,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import { useNotification } from '../../context/useNotification';
import Button from '../../components/common/Button';
import FormField from '../../components/forms/FormField';
import Badge from '../../components/common/Badge';

export const LoginPage = ({ onNavigateToRegister, onLoginSuccess }) => {
  const { universities, login, loginAsDemoRole, activeUniversity, selectUniversity, backendHealthy } = useAuth();
  const { showNotification } = useNotification();

  const [selectedRole, setSelectedRole] = useState('student');
  const [selectedUniId, setSelectedUniId] = useState(activeUniversity?._id || (universities[0]?._id || ''));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Role credential presets
  const sampleCredentials = {
    student: {
      email: 'kavya.panicker@studentai.edu',
      password: 'SecurePassword123',
      label: 'Fill Sample Student (kavya.panicker)',
      btnText: 'Sign In to Student Portal',
    },
    faculty: {
      email: 'dr.mitchell@studentai.edu',
      password: 'FacultyPassword123',
      label: 'Fill Sample Faculty (dr.mitchell)',
      btnText: 'Sign In to Faculty Portal',
    },
    parent: {
      email: 'robert.miller@example.com',
      password: 'ParentPassword123',
      label: 'Fill Sample Parent (robert.miller)',
      btnText: 'Sign In to Parent Portal',
    },
    admin: {
      email: 'admin@studentai.edu',
      password: 'AdminPassword123',
      label: 'Fill Sample Admin (admin)',
      btnText: 'Sign In to Administrator Console',
    },
  };

  const handleRoleChange = (newRole) => {
    setSelectedRole(newRole);
    setErrors({});
    setEmail('');
    setPassword('');
  };

  const handleUniversityChange = (e) => {
    const uniId = e.target.value;
    setSelectedUniId(uniId);
    const found = universities.find((u) => u._id === uniId);
    if (found) selectUniversity(found);
  };

  const validate = () => {
    const errs = {};
    if (!selectedUniId) errs.university = 'Please select your university';
    if (!email.trim()) errs.email = 'Email address is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Enter a valid email address';
    if (!password) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    if (selectedRole !== 'student') {
      // Role is faculty, parent, or admin -> enter interactive role portal with profile
      setTimeout(() => {
        loginAsDemoRole(selectedRole);
        showNotification({
          type: 'info',
          title: `${selectedRole.toUpperCase()} Portal Access`,
          message: `Logged in as ${email}. (Backend role endpoints scheduled for next phase).`,
        });
        setIsLoading(false);
        if (onLoginSuccess) onLoginSuccess();
      }, 350);
      return;
    }

    try {
      await login({
        universityId: selectedUniId,
        email,
        password,
      });

      showNotification({
        type: 'success',
        title: 'Authentication Successful',
        message: 'Welcome back to StudentAI Academic Portal.',
      });

      if (onLoginSuccess) onLoginSuccess();
    } catch (err) {
      const errMsg = err.message || 'Login failed. Please verify credentials.';
      setErrors({ form: errMsg });
      showNotification({
        type: 'error',
        title: 'Authentication Error',
        message: errMsg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillCredentials = () => {
    const preset = sampleCredentials[selectedRole];
    if (preset) {
      setEmail(preset.email);
      setPassword(preset.password);
      if (universities.length > 0 && !selectedUniId) {
        setSelectedUniId(universities[0]._id);
        selectUniversity(universities[0]);
      }
    }
  };

  const currentPreset = sampleCredentials[selectedRole] || sampleCredentials.student;

  return (
    <div className="auth-page-container">
      <div className="auth-card-wrapper">
        {/* Brand Banner */}
        <div className="auth-brand-header">
          <div className="auth-brand-icon">
            <Building2 size={28} />
          </div>
          <h2>StudentAI</h2>
          <p className="auth-brand-subtitle">UNIVERSITY MANAGEMENT & ACADEMIC PORTAL</p>
        </div>

        {/* Backend status indicator */}
        <div className="auth-system-status">
          <span className={`status-led ${backendHealthy ? 'led-green' : 'led-amber'}`} />
          <span>
            Backend API: {backendHealthy ? 'Online (http://localhost:5000)' : 'Connecting or Offline'}
          </span>
        </div>

        {/* Role Selection Tabs */}
        <div className="auth-role-tabs">
          {[
            { id: 'student', label: 'Student', icon: GraduationCap },
            { id: 'faculty', label: 'Faculty', icon: Users },
            { id: 'parent', label: 'Parent / Family', icon: ShieldCheck },
            { id: 'admin', label: 'Admin', icon: Building2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isTabActive = selectedRole === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                className={`auth-role-tab ${isTabActive ? 'active' : ''}`}
                onClick={() => handleRoleChange(tab.id)}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {errors.form && (
            <div className="auth-error-alert" role="alert">
              <AlertCircle size={16} />
              <span>{errors.form}</span>
            </div>
          )}

          {/* Role Status Tag */}
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {selectedRole.toUpperCase()} LOGIN
            </span>
            <Badge variant={selectedRole === 'student' ? 'success' : 'warning'} size="sm">
              {selectedRole === 'student' ? 'LIVE DATABASE API' : 'BACKEND REQUIRED (PREVIEW)'}
            </Badge>
          </div>

          {/* University Selector */}
          <div className="form-field-group">
            <label htmlFor="university-select" className="form-field-label">
              Institution / University <span className="field-required-asterisk">*</span>
            </label>
            <select
              id="university-select"
              value={selectedUniId}
              onChange={handleUniversityChange}
              className="form-input-control"
            >
              {universities.length === 0 ? (
                <option value="">Loading universities from backend...</option>
              ) : (
                universities.map((uni) => (
                  <option key={uni._id} value={uni._id}>
                    {uni.name} ({uni.code})
                  </option>
                ))
              )}
            </select>
            {errors.university && <p className="form-field-error">{errors.university}</p>}
          </div>

          {/* Email Form Field */}
          <FormField
            label={selectedRole === 'student' ? 'University Email' : `${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Email`}
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={
              selectedRole === 'student'
                ? 'kavya.panicker@studentai.edu'
                : selectedRole === 'faculty'
                ? 'dr.mitchell@studentai.edu'
                : selectedRole === 'parent'
                ? 'robert.miller@example.com'
                : 'admin@studentai.edu'
            }
            required
            error={errors.email}
          />

          {/* Password Form Field */}
          <div className="form-field-group">
            <label htmlFor="password-input" className="form-field-label">
              Password <span className="field-required-asterisk">*</span>
            </label>
            <div className="form-input-wrapper">
              <input
                id="password-input"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="form-input-control"
              />
              <button
                type="button"
                className="input-eye-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="form-field-error">{errors.password}</p>}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            icon={LogIn}
            className="auth-submit-btn"
          >
            {currentPreset.btnText}
          </Button>

          <div className="auth-helper-row">
            <button
              type="button"
              className="auth-link-btn"
              onClick={handleFillCredentials}
            >
              {currentPreset.label}
            </button>
            {selectedRole === 'student' && (
              <>
                <span className="auth-link-divider">•</span>
                <button
                  type="button"
                  className="auth-link-btn font-semibold"
                  onClick={onNavigateToRegister}
                >
                  Register New Student
                </button>
              </>
            )}
          </div>
        </form>

        <div className="auth-footer-notes">
          <span>StudentAI Academic ERP Platform</span>
          <span>Role-Isolated Architecture</span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

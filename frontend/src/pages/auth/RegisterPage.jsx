import { useState } from 'react';
import {
  GraduationCap,
  UserPlus,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import { useNotification } from '../../context/useNotification';
import Button from '../../components/common/Button';
import FormField from '../../components/forms/FormField';

export const RegisterPage = ({ onNavigateToLogin }) => {
  const { universities, register, activeUniversity } = useAuth();
  const { showNotification } = useNotification();

  const [formData, setFormData] = useState({
    universityId: activeUniversity?._id || (universities[0]?._id || ''),
    fullName: '',
    email: '',
    studentId: '',
    password: '',
    confirmPassword: '',
    department: 'Computer Science and Engineering',
    semester: 1,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.universityId) errs.universityId = 'Please select your university';
    if (!formData.fullName.trim()) errs.fullName = 'Full name is required';
    if (!formData.studentId.trim()) errs.studentId = 'Student ID / Roll Number is required';
    if (!formData.email.trim()) errs.email = 'Email address is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Enter a valid email address';
    if (!formData.password) errs.password = 'Password is required';
    else if (formData.password.length < 8) errs.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    try {
      await register({
        universityId: formData.universityId,
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        studentId: formData.studentId,
        department: formData.department,
        semester: Number(formData.semester),
      });

      setIsSuccess(true);
      showNotification({
        type: 'success',
        title: 'Registration Successful',
        message: 'Your student account has been created. You can now log in.',
      });
    } catch (err) {
      const errMsg = err.message || 'Registration failed. Please check inputs.';
      setErrors({ form: errMsg });
      showNotification({
        type: 'error',
        title: 'Registration Failed',
        message: errMsg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="auth-page-container">
        <div className="auth-card-wrapper text-center">
          <div className="auth-success-circle">
            <CheckCircle2 size={42} />
          </div>
          <h2 className="mt-4">Account Registered!</h2>
          <p className="auth-success-desc">
            Student account for <strong>{formData.fullName}</strong> ({formData.studentId}) has been successfully
            registered in the university database.
          </p>
          <Button
            variant="primary"
            size="lg"
            onClick={onNavigateToLogin}
            className="w-full mt-6"
          >
            Proceed to Student Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page-container">
      <div className="auth-card-wrapper register-card">
        <button
          type="button"
          onClick={onNavigateToLogin}
          className="auth-back-link"
        >
          <ArrowLeft size={16} />
          <span>Back to Sign In</span>
        </button>

        <div className="auth-brand-header">
          <div className="auth-brand-icon">
            <GraduationCap size={28} />
          </div>
          <h2>Student Registration</h2>
          <p className="auth-brand-subtitle">ENROLL YOUR OFFICIAL UNIVERSITY ACCOUNT</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {errors.form && (
            <div className="auth-error-alert" role="alert">
              <AlertCircle size={16} />
              <span>{errors.form}</span>
            </div>
          )}

          {/* University selector */}
          <div className="form-field-group">
            <label htmlFor="reg-university" className="form-field-label">
              University / Institution <span className="field-required-asterisk">*</span>
            </label>
            <select
              id="reg-university"
              name="universityId"
              value={formData.universityId}
              onChange={handleChange}
              className="form-input-control"
            >
              {universities.map((uni) => (
                <option key={uni._id} value={uni._id}>
                  {uni.name} ({uni.code})
                </option>
              ))}
            </select>
            {errors.universityId && <p className="form-field-error">{errors.universityId}</p>}
          </div>

          <div className="form-grid-2">
            <FormField
              label="Full Legal Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="e.g. Alex Johnson"
              required
              error={errors.fullName}
            />

            <FormField
              label="Student ID / Roll Number"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              placeholder="e.g. STU2026-CS-042"
              required
              error={errors.studentId}
            />
          </div>

          <FormField
            label="Official Student Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="e.g. alex.j@university.example"
            required
            error={errors.email}
          />

          <div className="form-grid-2">
            <div className="form-field-group">
              <label htmlFor="reg-dept" className="form-field-label">
                Department
              </label>
              <select
                id="reg-dept"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="form-input-control"
              >
                <option value="Computer Science and Engineering">Computer Science & Engineering</option>
                <option value="Electronics and Communication">Electronics & Communication</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Civil Engineering">Civil Engineering</option>
                <option value="Electrical Engineering">Electrical Engineering</option>
              </select>
            </div>

            <div className="form-field-group">
              <label htmlFor="reg-semester" className="form-field-label">
                Current Semester
              </label>
              <select
                id="reg-semester"
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                className="form-input-control"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <option key={sem} value={sem}>
                    Semester {sem}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-field-group">
              <label htmlFor="reg-password" className="form-field-label">
                Password (min 8 chars) <span className="field-required-asterisk">*</span>
              </label>
              <div className="form-input-wrapper">
                <input
                  id="reg-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 8 characters"
                  className="form-input-control"
                />
                <button
                  type="button"
                  className="input-eye-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="form-field-error">{errors.password}</p>}
            </div>

            <FormField
              label="Confirm Password"
              name="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter password"
              required
              error={errors.confirmPassword}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            icon={UserPlus}
            className="auth-submit-btn mt-3"
          >
            Create Student Account
          </Button>

          <div className="auth-helper-row justify-center">
            <span>Already have an account?</span>
            <button
              type="button"
              className="auth-link-btn font-semibold"
              onClick={onNavigateToLogin}
            >
              Sign In Instead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;

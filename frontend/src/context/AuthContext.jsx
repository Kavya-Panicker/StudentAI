import { useState, useEffect, useCallback } from 'react';
import { AuthContext } from './authContextInstance';
import { getStoredToken, clearStoredAuth } from '../api/client';
import { loginStudent, registerStudent, getStudentProfile, checkBackendHealth } from '../api/authApi';
import { getUniversities } from '../api/universityApi';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('studentai_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [role, setRole] = useState(() => {
    return localStorage.getItem('studentai_role') || 'student';
  });

  const [activeUniversity, setActiveUniversity] = useState(() => {
    try {
      const saved = localStorage.getItem('studentai_university');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [universities, setUniversities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [backendHealthy, setBackendHealthy] = useState(null);

  // Load universities from backend API
  const fetchUniversities = useCallback(async () => {
    try {
      const response = await getUniversities();
      if (response && response.data) {
        setUniversities(response.data);
        if (!activeUniversity && response.data.length > 0) {
          const first = response.data[0];
          setActiveUniversity(first);
          localStorage.setItem('studentai_university', JSON.stringify(first));
        }
      }
    } catch (err) {
      console.warn('Could not load universities from backend:', err.message);
    }
  }, [activeUniversity]);

  // Initial session verification & health probe
  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      // Probe backend health
      try {
        const health = await checkBackendHealth();
        if (isMounted) setBackendHealthy(health.success === true);
      } catch {
        if (isMounted) setBackendHealthy(false);
      }

      await fetchUniversities();

      const token = getStoredToken();
      const savedRole = localStorage.getItem('studentai_role');

      if (token && savedRole === 'student') {
        try {
          const res = await getStudentProfile();
          if (res && res.data && isMounted) {
            setUser(res.data);
            localStorage.setItem('studentai_user', JSON.stringify(res.data));
          } else if (isMounted) {
            clearStoredAuth();
            setUser(null);
          }
        } catch (err) {
          console.warn('Session verification failed, logging out:', err.message);
          if (isMounted) {
            clearStoredAuth();
            setUser(null);
          }
        }
      }

      if (isMounted) setIsLoading(false);
    };

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, [fetchUniversities]);

  // Student login via real backend API
  const login = async ({ universityId, email, password }) => {
    const res = await loginStudent({ universityId, email, password });
    if (res.success && res.token) {
      setUser(res.data);
      setRole('student');
      localStorage.setItem('studentai_user', JSON.stringify(res.data));
      localStorage.setItem('studentai_role', 'student');

      const foundUni = universities.find((u) => u._id === universityId);
      if (foundUni) {
        setActiveUniversity(foundUni);
        localStorage.setItem('studentai_university', JSON.stringify(foundUni));
      }

      return res;
    }
    throw new Error(res.message || 'Login failed');
  };

  // Student registration via real backend API
  const register = async (formData) => {
    const res = await registerStudent(formData);
    return res;
  };

  // Demo role switcher for testing Faculty, Parent, and Admin views
  const loginAsDemoRole = (targetRole, customUni = null) => {
    const uni = customUni || activeUniversity || (universities[0] || { name: 'StudentAI University', code: 'SA001' });

    let demoUserData = null;
    if (targetRole === 'faculty') {
      demoUserData = {
        id: 'FAC-DEMO-01',
        fullName: 'Dr. Sarah Mitchell',
        email: 'dr.mitchell@studentai.edu',
        department: 'Computer Science and Engineering',
        designation: 'Associate Professor',
        courses: ['CS301 - Data Structures', 'CS402 - Machine Learning'],
      };
    } else if (targetRole === 'parent') {
      demoUserData = {
        id: 'PAR-DEMO-01',
        fullName: 'Robert Miller',
        email: 'robert.miller@example.com',
        wardName: 'Alex Miller',
        wardStudentId: 'STU2026-CS-042',
        wardDepartment: 'Computer Science & Engineering',
        wardSemester: 4,
      };
    } else if (targetRole === 'admin') {
      demoUserData = {
        id: 'ADM-DEMO-01',
        fullName: 'System Administrator',
        email: 'admin@studentai.edu',
        role: 'Super Administrator',
        accessLevel: 'Full ERP Control',
      };
    }

    setUser(demoUserData);
    setRole(targetRole);
    setActiveUniversity(uni);
    localStorage.setItem('studentai_user', JSON.stringify(demoUserData));
    localStorage.setItem('studentai_role', targetRole);
    localStorage.setItem('studentai_university', JSON.stringify(uni));
  };

  // Logout
  const logout = () => {
    clearStoredAuth();
    setUser(null);
    setRole('student');
  };

  const selectUniversity = (uni) => {
    setActiveUniversity(uni);
    localStorage.setItem('studentai_university', JSON.stringify(uni));
  };

  const value = {
    user,
    role,
    activeUniversity,
    universities,
    isLoading,
    backendHealthy,
    isAuthenticated: !!user,
    login,
    register,
    loginAsDemoRole,
    logout,
    selectUniversity,
    reloadUniversities: fetchUniversities,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

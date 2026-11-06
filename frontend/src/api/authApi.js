/**
 * StudentAI Authentication & Student API Service
 * Interacts with /api/students and /api/health
 */

import { apiClient, setStoredToken, clearStoredAuth } from './client';

export const loginStudent = async ({ universityId, email, password }) => {
  const result = await apiClient('/api/students/login', {
    method: 'POST',
    body: JSON.stringify({
      universityId,
      email: email.trim(),
      password,
    }),
  });

  if (result.token) {
    setStoredToken(result.token);
  }

  return result;
};

export const registerStudent = async (studentData) => {
  return await apiClient('/api/students', {
    method: 'POST',
    body: JSON.stringify({
      universityId: studentData.universityId,
      fullName: studentData.fullName.trim(),
      email: studentData.email.trim(),
      password: studentData.password,
      studentId: studentData.studentId.trim(),
      department: studentData.department || 'Computer Science and Engineering',
      semester: Number(studentData.semester) || 1,
    }),
  });
};

export const getStudentProfile = async () => {
  return await apiClient('/api/students/me', {
    method: 'GET',
  });
};

export const checkBackendHealth = async () => {
  return await apiClient('/api/health', {
    method: 'GET',
  });
};

export const logoutStudent = () => {
  clearStoredAuth();
};


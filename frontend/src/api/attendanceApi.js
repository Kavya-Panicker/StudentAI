/**
 * StudentAI Attendance & Face Recognition API Service
 * Interacts with /api/attendance and /api/face
 */

import { apiClient } from './client';

/**
 * Fetch attendance history for the authenticated student.
 * Backend route: GET /api/attendance/me (Protected by JWT)
 */
export const getMyAttendance = async () => {
  return await apiClient('/api/attendance/me', {
    method: 'GET',
  });
};

/**
 * Probe Python Face Recognition microservice status via Node.js proxy.
 * Backend route: GET /api/face/health
 */
export const checkFaceServiceHealth = async () => {
  return await apiClient('/api/face/health', {
    method: 'GET',
  });
};


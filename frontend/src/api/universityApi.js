/**
 * StudentAI University Management API Service
 * Interacts with /api/universities
 */

import { apiClient } from './client';

export const getUniversities = async () => {
  return await apiClient('/api/universities', {
    method: 'GET',
  });
};

export const createUniversity = async (universityData) => {
  return await apiClient('/api/universities', {
    method: 'POST',
    body: JSON.stringify({
      name: universityData.name.trim(),
      code: universityData.code.trim().toUpperCase(),
      email: universityData.email.trim(),
      address: universityData.address?.trim() || '',
    }),
  });
};


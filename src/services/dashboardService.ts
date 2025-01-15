import { request } from '@/core/api/apiService';

export async function getMadrasahStats() {
  try {
    const response = await request('/dashboard/stats');
    return response?.data;
  } catch (error) {
    return {
      totalMadrasahs: 0,
      boysMadrasahs: 0,
      girlsMadrasahs: 0,
      totalZones: 0,
      currentYearExaminees: 0,
      totalRegisteredExaminees: 0
    };
  }
}

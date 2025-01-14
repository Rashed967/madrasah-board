import { request } from '@/core/api/apiService';

export async function getMadrasahStats() {
  try {
    const response = await request('/dashboard/stats');
    console.log(' Get Dashboard Stats Response:', response);
    return response?.data;
  } catch (error) {
    console.error(' Error fetching dashboard stats:', error);
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

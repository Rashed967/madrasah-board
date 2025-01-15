import { create } from 'zustand';

export interface DashboardStats {
  totalMadrasahs: number;
  boysMadrasahs: number;
  girlsMadrasahs: number;
  totalZones: number;
  currentYearExaminees: number;
  totalRegisteredExaminees: number;
}

interface DashboardStore {
  stats: DashboardStats;
  setStats: (stats: DashboardStats) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}


export const useDashboardStore = create<DashboardStore>((set) => ({
  stats: {
    totalMadrasahs: 0,
    boysMadrasahs: 0,
    girlsMadrasahs: 0,
    totalZones: 0,
    currentYearExaminees: 0,
    totalRegisteredExaminees: 0
  },
  setStats: (stats) => set({ stats }),
  isLoading: true,
  setIsLoading: (loading) => set({ isLoading: loading })
}));

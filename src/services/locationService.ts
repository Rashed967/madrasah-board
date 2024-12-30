import policeStationsData from '@/data/policeStations.json';
import subDistrictsData from '@/data/subDistricts.json';

export function getSubDistricts(district: string): string[] {
  return subDistrictsData[district as keyof typeof subDistrictsData] || [];
}

export function getPoliceStations(district: string, subDistrict: string): string[] {
  const districtData = policeStationsData[district as keyof typeof policeStationsData];
  if (!districtData) return [];
  
  return districtData[subDistrict as keyof typeof districtData] || [];
}

// Add type safety
export type LocationData = {
  [key: string]: string[] | { [key: string]: string[] };
};

// Ensure type safety for the imported JSON data
export const policeStations = policeStationsData as LocationData;
export const subDistricts = subDistrictsData as LocationData;

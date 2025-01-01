import { MadrasahNames, MadrasahAddress, MadrasahInformation, EducationalPersonInfo, ChairmanMutawalli } from './madrasah';

export interface MadrasahFormData {
  // Madrasah Names
  bengaliName: string;
  arabicName: string;
  englishName: string;

  // Contact Info
  communicatorName: string;
  email: string;
  contactNo1: string;
  contactNo2: string;
  description: string;

  // Address
  division: string;
  district: string;
  subDistrict: string;
  policeStation: string;
  village: string;
  holdingNumber: string;
  zone: string;
  courierAddress: string;

  // Madrasah Information
  highestMarhala: string;
  totalStudent: number;
  totalTeacherAndStaff: number;
  madrasahType: string;

  // Muhtamim Information
  muhtamimName: string;
  muhtamimNID: string;
  muhtamimMobile: string;
  muhtamimEducation: string;

  // Chairman/Mutawalli Information
  mutawalliName: string;
  mutawalliNID: string;
  mutawalliMobile: string;
  mutawalliDesignation: string;

  // Educational Secretary Information
  shikkhaSocheebName: string;
  shikkhaSocheebNID: string;
  shikkhaSocheebMobile: string;
  shikkhaSocheebEducation: string;
}

export interface MadrasahAPIData {
  madrasahNames: MadrasahNames;
  email: string;
  contactNo1: string;
  contactNo2: string;
  description: string;
  communicatorName: string;
  address: MadrasahAddress;
  madrasah_information: MadrasahInformation;
  muhtamim?: EducationalPersonInfo;
  chairman_mutawalli?: ChairmanMutawalli;
  educational_secretory?: EducationalPersonInfo;
}

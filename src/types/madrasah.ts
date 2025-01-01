import { ApiResponse } from '@/services/apiService';

export interface MadrasahNames {
  bengaliName: string;
  arabicName: string;
  englishName: string;
}

export interface MadrasahAddress {
  division: string;
  district: string;
  subDistrict: string;
  policeStation: string;
  village: string;
  holdingNumber: string;
  zone: string;
  courierAddress: string;
}

export interface MadrasahInformation {
  _id?: string;
  highestMarhala: string;
  totalStudents: number;
  totalTeacherAndStuff: number;
  madrasahType: string;
}

export interface EducationalPersonInfo {
  _id?: string;
  name: string;
  nidNumber: string;
  contactNo: string;
  highestEducationQualification: string;
}

export interface ChairmanMutawalli {
  _id?: string;
  name: string;
  nidNumber: string;
  contactNo: string;
  designation: string;
}

export interface BaseMadrasah {
  _id?: string;
  madrasahNames: MadrasahNames;
  code: string;
  email: string;
  description: string;
  communicatorName: string;
  contactNo1: string;
  contactNo2: string;
  address: MadrasahAddress;
  madrasah_information: MadrasahInformation;
  ilhakImage?: string;
  muhtamim?: EducationalPersonInfo;
  chairman_mutawalli?: ChairmanMutawalli;
  educational_secretory?: EducationalPersonInfo;
}

export interface Madrasah extends BaseMadrasah {
  muhtamim: EducationalPersonInfo;
  chairman_mutawalli: ChairmanMutawalli;
  educational_secretory: EducationalPersonInfo;
}

export interface MadrasahData extends BaseMadrasah {
  muhtamim: EducationalPersonInfo;
  chairman_mutawalli: ChairmanMutawalli;
  educational_secretory: EducationalPersonInfo;
}

export type MadrasahApiResponse = ApiResponse<Madrasah>;
export type MadrasahListApiResponse = ApiResponse<Madrasah[]>;

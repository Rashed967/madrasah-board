import { ApiResponse } from './common';

export interface MadrasahNames {
  bengaliName: string;
  arabicName: string;
  englishName: string;
}

export interface MadrasahAddress {
  _id: string;
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
  _id: string;
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
  _id: string;
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

export interface MadrasahBasicInfoUpdate {
  madrasahNames: {
    bengaliName?: string;
    arabicName?: string;
    englishName?: string;
  };
  description?: string;
  email?: string;
  communicatorName?: string;
  contactNo1?: string;
  contactNo2?: string;
  ilhakImage?: string;
}

export interface MadrasahApiResponse {
  success: boolean;
  message: string;
  data: any;
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface MadrasahListApiResponse {
  success: boolean;
  message: string;
  data: Madrasah[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

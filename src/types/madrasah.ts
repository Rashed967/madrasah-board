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
  highestMarhala: string;
  totalStudents: number;
  totalTeacherAndStuff: number;
  madrasahType: string;
}

export interface PersonInfo {
  name: string;
  contactNo: string;
  nidNumber: string;
}

export interface EducationalPersonInfo extends PersonInfo {
  highestEducationalQualification: string;
}

export interface ChairmanMutawalli extends PersonInfo {
  designation: string;
}

export interface MadrasahRegistrationData {
  madrasahNames: MadrasahNames;
  email: string;
  communicatorName: string;
  contactNo1: string;
  contactNo2: string;
  description: string;
  address: MadrasahAddress;
  madrasah_information: MadrasahInformation;
  muhtamim: EducationalPersonInfo;
  chairman_mutawalli: ChairmanMutawalli;
  educational_secretory: EducationalPersonInfo;
  ilhakImage: string;
}

export interface MadrasahRegistrationResponse {
  success: boolean;
  message: string;
  data?: {
    madrasah: MadrasahRegistrationData;
  };
  madrasah: MadrasahRegistrationData;
}

import { BaseMadrasah, MadrasahNames, MadrasahInformation, MadrasahAddress } from '@/types/madrasah';
import { EducationalPersonInfo, ChairmanMutawalli, BasePersonInfo } from '@/types/person';

type MadrasahRegistrationData = {
  madrasahNames: MadrasahNames;
  address: MadrasahAddress;
  madrasah_information: MadrasahInformation;
  muhtamim?: EducationalPersonInfo;
  chairman_mutawalli?: ChairmanMutawalli;
  educational_secretory?: EducationalPersonInfo;
  email?: string;
  contactNo1?: string;
  contactNo2?: string;
}

const removeEmptyFields = <T>(obj: T): T => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => {
      if (typeof value === 'string') return value !== '';
      if (typeof value === 'number') return value !== 0;
      return value != null;
    })
  ) as T;
};

export { removeEmptyFields };

export const transformMadrasahNames = (formData: any): Pick<MadrasahRegistrationData, 'madrasahNames'> => ({
  madrasahNames: removeEmptyFields({
    bengaliName: formData.nameInBangla || '',
    arabicName: formData.nameInArabic || '',
    englishName: formData.nameInEnglish || ''
  })
});

export const transformAddress = (formData: any): Pick<MadrasahRegistrationData, 'address'> => ({
  address: removeEmptyFields({
    division: formData.division || '',
    district: formData.district || '',
    subDistrict: formData.subDistrict || '',
    policeStation: formData.policeStation || '',
    village: formData.village || '',
    holdingNumber: formData.holdingNumber || '',
    zone: formData.zone || '',
    courierAddress: formData.courierAddress || ''
  })
});

export const transformMadrasahInfo = (formData: any): Pick<MadrasahRegistrationData, 'madrasah_information'> => ({
  madrasah_information: removeEmptyFields({
    highestMarhala: formData.highestMarhala || '',
    totalStudents: Number(formData.totalStudent) || 0,
    totalTeacherAndStuff: Number(formData.totalTeacherAndStaff) || 0,
    madrasahType: formData.madrasahType || ''
  })
});

const transformBasePersonInfo = (data: any): BasePersonInfo => ({
  name: data.name || '',
  nidNumber: data.nid || '',
  contactNo: data.contactNo || '',
});

export const transformMuhtamim = (formData: any): Partial<Pick<MadrasahRegistrationData, 'muhtamim'>> => {
  const data = removeEmptyFields({
    ...transformBasePersonInfo({
      name: formData.muhtamimName,
      nid: formData.muhtamimNID,
      contactNo: formData.muhtamimMobile,
      email: formData.muhtamimEmail,
      image: formData.muhtamimImage,
    }),
    highestEducationalQualification: formData.muhtamimEducation || ''
  });
  
  return Object.keys(data).length > 0 ? { muhtamim: data } : {};
};

export const transformChairmanMutawalli = (formData: any): Partial<Pick<MadrasahRegistrationData, 'chairman_mutawalli'>> => {
  const data = removeEmptyFields({
    ...transformBasePersonInfo({
      name: formData.mutawalliName,
      nid: formData.mutawalliNID,
      contactNo: formData.mutawalliMobile,
      email: formData.mutawalliEmail,
      image: formData.mutawalliImage,
    }),
    designation: formData.mutawalliDesignation || ''
  });
  
  return Object.keys(data).length > 0 ? { chairman_mutawalli: data } : {};
};

export const transformEducationalSecretary = (formData: any): Partial<Pick<MadrasahRegistrationData, 'educational_secretory'>> => {
  const data = removeEmptyFields({
    ...transformBasePersonInfo({
      name: formData.shikkhaSocheebName,
      nidNumber: formData.shikkhaSocheebNID,
      mobile: formData.shikkhaSocheebMobile,
    }),
    highestEducationalQualification: formData.shikkhaSocheebEducation || ''
  });
  
  return Object.keys(data).length > 0 ? { educational_secretory: data } : {};
};

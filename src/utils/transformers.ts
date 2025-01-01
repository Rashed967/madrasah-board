import { MadrasahFormData, MadrasahAPIData } from '@/types/forms';
import { BasePersonInfo } from '@/types/person';

export const removeEmptyFields = <T>(obj: T): T => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => {
      if (typeof value === 'string') return value !== '';
      if (typeof value === 'number') return value !== 0;
      return value != null;
    })
  ) as T;
};

export const transformFormToAPI = (formData: Partial<MadrasahFormData>): Partial<MadrasahAPIData> => {
  const result: Partial<MadrasahAPIData> = {
    // Madrasah Names
    madrasahNames: removeEmptyFields({
      bengaliName: formData.bengaliName || '',
      arabicName: formData.arabicName || '',
      englishName: formData.englishName || ''
    }),

    // Contact Info
    communicatorName: formData.communicatorName,
    email: formData.email,
    contactNo1: formData.contactNo1,
    contactNo2: formData.contactNo2,
    description: formData.description,

    // Address
    address: removeEmptyFields({
      division: formData.division || '',
      district: formData.district || '',
      subDistrict: formData.subDistrict || '',
      policeStation: formData.policeStation || '',
      village: formData.village || '',
      holdingNumber: formData.holdingNumber || '',
      zone: formData.zone || '',
      courierAddress: formData.courierAddress || ''
    }),

    // Madrasah Information
    madrasah_information: removeEmptyFields({
      highestMarhala: formData.highestMarhala || '',
      totalStudents: Number(formData.totalStudent) || 0,
      totalTeacherAndStuff: Number(formData.totalTeacherAndStaff) || 0,
      madrasahType: formData.madrasahType || ''
    })
  };

  // Muhtamim (Optional)
  if (formData.muhtamimName || formData.muhtamimNID || formData.muhtamimMobile || formData.muhtamimEducation) {
    result.muhtamim = removeEmptyFields({
      name: formData.muhtamimName || '',
      nidNumber: formData.muhtamimNID || '',
      contactNo: formData.muhtamimMobile || '',
      highestEducationalQualification: formData.muhtamimEducation || ''
    });
  }

  // Chairman/Mutawalli (Optional)
  if (formData.mutawalliName || formData.mutawalliNID || formData.mutawalliMobile || formData.mutawalliDesignation) {
    result.chairman_mutawalli = removeEmptyFields({
      name: formData.mutawalliName || '',
      nidNumber: formData.mutawalliNID || '',
      contactNo: formData.mutawalliMobile || '',
      designation: formData.mutawalliDesignation || ''
    });
  }

  // Educational Secretary (Optional)
  if (formData.shikkhaSocheebName || formData.shikkhaSocheebNID || formData.shikkhaSocheebMobile || formData.shikkhaSocheebEducation) {
    result.educational_secretory = removeEmptyFields({
      name: formData.shikkhaSocheebName || '',
      nidNumber: formData.shikkhaSocheebNID || '',
      contactNo: formData.shikkhaSocheebMobile || '',
      highestEducationalQualification: formData.shikkhaSocheebEducation || ''
    });
  }

  return removeEmptyFields(result);
};

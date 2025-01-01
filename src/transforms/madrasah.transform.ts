import { MadrasahFormData, MadrasahAPIData } from '@/types/forms';
import { removeEmptyFields } from './utils.transform';

/**
 * Transforms madrasah form data to API format
 * @param formData Form data from the client
 * @returns Transformed data in API format
 */
export const transformMadrasahFormToAPI = (formData: Partial<MadrasahFormData>): Partial<MadrasahAPIData> => {
  const result: Partial<MadrasahAPIData> = {
    // Madrasah Names
    madrasahNames: removeEmptyFields({
      bengaliName: formData.nameInBangla || '',
      arabicName: formData.nameInArabic || '',
      englishName: formData.nameInEnglish || ''
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

/**
 * Transforms API response to form data format
 * @param apiData Data from the API
 * @returns Transformed data in form format
 */
export const transformAPIToMadrasahForm = (apiData: Partial<MadrasahAPIData>): Partial<MadrasahFormData> => {
  return {
    // Madrasah Names
    bengaliName: apiData.madrasahNames?.bengaliName || '',
    arabicName: apiData.madrasahNames?.arabicName || '',
    englishName: apiData.madrasahNames?.englishName || '',

    // Contact Info
    communicatorName: apiData.communicatorName || '',
    email: apiData.email || '',
    contactNo1: apiData.contactNo1 || '',
    contactNo2: apiData.contactNo2 || '',
    description: apiData.description || '',

    // Address
    division: apiData.address?.division || '',
    district: apiData.address?.district || '',
    subDistrict: apiData.address?.subDistrict || '',
    policeStation: apiData.address?.policeStation || '',
    village: apiData.address?.village || '',
    holdingNumber: apiData.address?.holdingNumber || '',
    zone: apiData.address?.zone || '',
    courierAddress: apiData.address?.courierAddress || '',

    // Madrasah Information
    highestMarhala: apiData.madrasah_information?.highestMarhala || '',
    totalStudent: apiData.madrasah_information?.totalStudents || 0,
    totalTeacherAndStaff: apiData.madrasah_information?.totalTeacherAndStuff || 0,
    madrasahType: apiData.madrasah_information?.madrasahType || '',

    // Muhtamim Information
    muhtamimName: apiData.muhtamim?.name || '',
    muhtamimNID: apiData.muhtamim?.nidNumber || '',
    muhtamimMobile: apiData.muhtamim?.contactNo || '',
    muhtamimEducation: apiData.muhtamim?.highestEducationalQualification || '',

    // Chairman/Mutawalli Information
    mutawalliName: apiData.chairman_mutawalli?.name || '',
    mutawalliNID: apiData.chairman_mutawalli?.nidNumber || '',
    mutawalliMobile: apiData.chairman_mutawalli?.contactNo || '',
    mutawalliDesignation: apiData.chairman_mutawalli?.designation || '',

    // Educational Secretary Information
    shikkhaSocheebName: apiData.educational_secretory?.name || '',
    shikkhaSocheebNID: apiData.educational_secretory?.nidNumber || '',
    shikkhaSocheebMobile: apiData.educational_secretory?.contactNo || '',
    shikkhaSocheebEducation: apiData.educational_secretory?.highestEducationalQualification || ''
  };
};

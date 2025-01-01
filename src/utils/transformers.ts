import { BaseMadrasah, MadrasahNames, MadrasahInformation, MadrasahAddress } from '@/types/madrasah';
import { EducationalPersonInfo, ChairmanMutawalli, BasePersonInfo } from '@/types/person';

export const transformMadrasahNames = (formData: any): MadrasahNames => ({
  bengaliName: formData.nameInBangla || '',
  arabicName: formData.nameInArabic || '',
  englishName: formData.nameInEnglish || ''
});

export const transformAddress = (formData: any): MadrasahAddress => ({
  _id: formData._id || '',
  division: formData.division || '',
  district: formData.district || '',
  subDistrict: formData.subDistrict || '',
  policeStation: formData.policeStation || '',
  village: formData.village || '',
  holdingNumber: formData.holdingNumber || '',
  zone: formData.zone || '',
  courierAddress: formData.courierAddress || ''
});

export const transformMadrasahInfo = (formData: any): MadrasahInformation => ({
  _id: formData._id || '',
  highestMarhala: formData.highestMarhala || '',
  totalStudents: Number(formData.totalStudent) || 0,
  totalTeacherAndStuff: Number(formData.totalTeacherAndStaff) || 0,
  madrasahType: formData.madrasahType || ''
});

const transformBasePersonInfo = (data: any): BasePersonInfo => ({
  _id: data._id || '',
  name: data.name || '',
  nidNumber: data.nid || '',
  contactNo: data.contactNo || '',
});

export const transformMuhtamim = (formData: any): EducationalPersonInfo => ({
  ...transformBasePersonInfo({
    name: formData.muhtamimName,
    nid: formData.muhtamimNID,
    mobile: formData.muhtamimMobile,
    email: formData.muhtamimEmail,
    image: formData.muhtamimImage,
  }),
  highestEducationQualification: formData.muhtamimHighestEducation || ''
});

export const transformChairmanMutawalli = (formData: any): ChairmanMutawalli => ({
  ...transformBasePersonInfo({
    name: formData.mutawalliName,
    nid: formData.mutawalliNID,
    mobile: formData.mutawalliMobile,
    email: formData.mutawalliEmail,
    image: formData.mutawalliImage,
  }),
  designation: formData.mutawalliDesignation || ''
});

export const transformEducationalSecretary = (formData: any): EducationalPersonInfo => ({
  ...transformBasePersonInfo({
    name: formData.shikkhaSocheebName,
    nidNumber: formData.shikkhaSocheebNID,
    mobile: formData.shikkhaSocheebMobile,
  }),
  highestEducationQualification: formData.shikkhaSocheebHighestEducation || ''
});

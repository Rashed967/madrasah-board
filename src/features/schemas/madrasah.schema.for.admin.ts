import chairmanMutawalliDesignation from '@/data/chairman_mutawalli.designation';
import courierAddressOptions from '@/data/courierAddress.options';
import { madrasahTypes } from '@/data/madrasahTypes';
import marhalaNames from '@/data/marhala.names';
import { z } from 'zod';

const phoneRegex = /^01[3-9]\d{8}$/;

// madrasah schema from admin
export const madrasahSchemaForAdmin = z.object({
  madrasahNames: z.object({
    bengaliName: z.string().min(1, 'বাংলা নাম আবশ্যক'),
    arabicName: z.string().min(1, 'আরবি নাম আবশ্যক'),
    englishName: z.string().optional(),
  }),
  description: z.string().optional(),
  email: z.string().email('সঠিক ইমেইল দিন'),
  communicatorName: z.string().min(1, 'যোগাযোগকারীর নাম আবশ্যক'),
  contactNo1: z.string().regex(phoneRegex, 'সঠিক মোবাইল নম্বর দিন'),
  contactNo2: z.string().regex(phoneRegex, 'সঠিক মোবাইল নম্বর দিন'),
  
  address: z.object({
    division: z.string().min(1, 'বিভাগ আবশ্যক'),
    district: z.string().min(1, 'জেলা আবশ্যক'),
    subDistrict: z.string().min(1, 'উপজেলা আবশ্যক'),
    policeStation: z.string().min(1, 'থানা আবশ্যক'),
    village: z.string().min(1, 'গ্রাম আবশ্যক'),
    holdingNumber: z.string().optional(),
    zone: z.string().min(1, 'জোন আবশ্যক'),
    courierAddress: z.enum(courierAddressOptions as [string, ...string[]], {
      errorMap: () => ({ message: 'চিঠি প্রেরণের মাধ্যম নির্বাচন করুন' }),
    }),
  }),

  madrasah_information: z.object({
    highestMarhala: z.enum(marhalaNames as [string, ...string[]], {
      errorMap: () => ({ message: 'সর্বোচ্চ মারহালা নির্বাচন করুন' }),
    }),
    totalStudents: z.number().min(0, 'শিক্ষার্থীর সংখ্যা ০ এর চেয়ে বেশি হতে হবে').optional(),
    totalTeacherAndStuff: z.number().min(0, 'শিক্ষক ও কর্মচারীর সংখ্যা ০ এর চেয়ে বেশি হতে হবে').optional(),
    madrasahType: z.enum(madrasahTypes as [string, ...string[]], {
      errorMap: () => ({ message: 'মাদরাসার ধরণ নির্বাচন করুন' }),
    }),
  }),

  muhtamim: z.object({
    name: z.string().optional(),
    contactNo: z.string().optional(),
    nidNumber: z.string().optional(),
    highestEducationalQualification: z.string().optional(),
    code: z.string().optional(),
  }).optional(),

  chairman_mutawalli: z.object({
    name: z.string().optional(),
    contactNo: z.string().optional(),
    nidNumber: z.string().optional(),
    designation: z.enum(chairmanMutawalliDesignation as [string, ...string[]], {
      errorMap: () => ({ message: 'পদবী নির্বাচন করুন' }),
    }),
    code: z.string().optional(),
  }).optional().or(z.null()),

  educational_secretory: z.object({
    name: z.string().optional(),
    contactNo: z.string().optional(),
    nidNumber: z.string().optional(),
    highestEducationalQualification: z.string().optional(),
    code: z.string().optional(),
  }).optional().or(z.null()),

  ilhakImage: z.string().optional(),
});

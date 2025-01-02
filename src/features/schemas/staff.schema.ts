import chairmanMutawalliDesignation from '@/data/chairman_mutawalli.designation';
import { z } from 'zod';

const phoneRegex = /^01[3-9]\d{8}$/;

// মুহতামিমের স্কিমা
export const muhtamimSchema = z.object({
  name: z.string().min(1, 'মুহতামিমের নাম আবশ্যক'),
  contactNo: z.string().regex(phoneRegex, 'সঠিক মোবাইল নম্বর দিন'),
  nidNumber: z.string().min(1, 'এনআইডি নম্বর আবশ্যক'),
  highestEducationalQualification: z.string().min(1, 'শিক্ষাগত যোগ্যতা আবশ্যক'),
  code: z.string().optional(),
});

// মুতাওয়াল্লি/সভাপতির স্কিমা
export const mutawalliSchema = z.object({
  name: z.string().min(1, 'নাম আবশ্যক'),
  contactNo: z.string().regex(phoneRegex, 'সঠিক মোবাইল নম্বর দিন'),
  nidNumber: z.string().min(1, 'এনআইডি নম্বর আবশ্যক'),
  designation: z.enum(chairmanMutawalliDesignation as [string, ...string[]], {
    errorMap: () => ({ message: 'পদবী নির্বাচন করুন' }),
  }),
  code: z.string().optional(),
});

// শিক্ষা সচিবের স্কিমা
export const educationalSecretarySchema = z.object({
  name: z.string().min(1, 'শিক্ষা সচিবের নাম আবশ্যক'),
  contactNo: z.string().regex(phoneRegex, 'সঠিক মোবাইল নম্বর দিন'),
  nidNumber: z.string().min(1, 'এনআইডি নম্বর আবশ্যক'),
  highestEducationalQualification: z.string().min(1, 'শিক্ষাগত যোগ্যতা আবশ্যক'),
  code: z.string().optional(),
});

import { z } from 'zod';

const phoneRegex = /^01[3-9]\d{8}$/;

export const contactSchema = z.object({
  comunicatorName: z.string().min(1, 'নাম আবশ্যক'),
  contactNo: z.string().regex(phoneRegex, 'সঠিক মোবাইল নম্বর দিন'),
  nidNumber: z.string().optional(),
  highestEducationalQualification: z.string().optional(),
});

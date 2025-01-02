import { z } from 'zod';
import { addressSchema } from './address.schema';
import { madrasahInfoSchema } from './madrasah-info.schema';
import { muhtamimSchema, mutawalliSchema, educationalSecretarySchema } from './staff.schema';

const phoneRegex = /^01[3-9]\d{8}$/;


// madrasah schema from public
export const madrasahSchema = z.object({
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
  
  address: addressSchema,
  madrasah_information: madrasahInfoSchema,
  
  // স্টাফ ইনফরমেশন
  muhtamim: muhtamimSchema.partial(),
  chairman_mutawalli: mutawalliSchema.partial(),
  educational_secretory: educationalSecretarySchema.partial(),
  
  ilhakImage: z.string().optional(),
});

import { z } from 'zod';

export const madrasahNamesSchema = z.object({
  bengaliName: z.string().optional(),
  arabicName: z.string().optional(),
  englishName: z.string().optional(),
});

export const basicInfoSchema = z.object({
  madrasahNames: madrasahNamesSchema.optional(),
  communicatorName: z.string().optional(),
  email: z.string().email('সঠিক ইমেইল দিন').optional(),
  contactNo1: z
    .string()
    .regex(/^01\d{9}$/, 'সঠিক মোবাইল নম্বর দিন (১১ ডিজিট)')
    .optional(),
  contactNo2: z
    .string()
    .regex(/^01\d{9}$/, 'সঠিক মোবাইল নম্বর দিন (১১ ডিজিট)')
    .optional(),
  description: z.string().optional(),
});

export type TBasicInfo = z.infer<typeof basicInfoSchema>;

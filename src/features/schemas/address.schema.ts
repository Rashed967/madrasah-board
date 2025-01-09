import { z } from 'zod';

export const addressSchema = z.object({
  division: z.string().min(1, 'বিভাগ আবশ্যক').optional(),
  district: z.string().min(1, 'জেলা আবশ্যক').optional(),
  subDistrict: z.string().min(1, 'উপজেলা আবশ্যক').optional(),
  policeStation: z.string().min(1, 'থানা আবশ্যক').optional(),
  village: z.string().min(1, 'গ্রাম আবশ্যক').optional(),
  holdingNumber: z.string().optional().optional(),
  zone: z.string().optional(),
  courierAddress: z.enum(['কুরিয়ার', 'ডাক'], {
    errorMap: () => ({ message: 'চিঠি প্রেরণের মাধ্যম নির্বাচন করুন' }),
  }).optional(),
});

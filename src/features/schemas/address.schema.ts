import { z } from 'zod';

export const addressSchema = z.object({
  division: z.string().min(1, 'বিভাগ আবশ্যক'),
  district: z.string().min(1, 'জেলা আবশ্যক'),
  subDistrict: z.string().min(1, 'উপজেলা আবশ্যক'),
  policeStation: z.string().min(1, 'থানা আবশ্যক'),
  village: z.string().min(1, 'গ্রাম আবশ্যক'),
  holdingNumber: z.string().optional(),
  zone: z.string().optional(),
  courierAddress: z.enum(['কুরিয়ার', 'ডাক'], {
    errorMap: () => ({ message: 'চিঠি প্রেরণের মাধ্যম নির্বাচন করুন' }),
  }),
});

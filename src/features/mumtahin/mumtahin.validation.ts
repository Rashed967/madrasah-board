import { z } from 'zod';

const phoneRegex = /^(\+8801|01)[0-9]{9}$/;

const createHallGuardValidation = z.object({
  body: z.object({
    name: z.string({
      required_error: "Name is required",
    }),
    contactNo: z.string({
      required_error: "Contact number is required",
    }).regex(phoneRegex, "Invalid BD mobile number"),
    nagadAccountNo: z.string({
      required_error: "Nagad account number is required",
    }).regex(phoneRegex, "Invalid BD mobile number"),
    madrasah: z.string({
      required_error: "Madrasah ID is required",
    }),
    hallGuardType: z.enum(['হলগার্ড', 'পরীক্ষক', 'উভয়'], {
      required_error: "hallGuardType is required",
    }),
    educationalQualification: z.string({
      required_error: "Educational qualification ID is required",
    }),
    teachingQualification: z.string({
      required_error: "Teaching qualification ID is required",
    }),
    status: z.enum(['এক্টিভ', 'ব্লকড'], {
      required_error: "Status is required",
    }),
  }),
});


export const hallGuardValidationSchemas = {
  createHallGuardValidation,
  updateHallGuardValidation: createHallGuardValidation.partial()
};

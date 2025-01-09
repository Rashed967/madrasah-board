import { z } from 'zod';

export const zoneSchema = z.object({
  name: z.string()
    .min(1, 'জোনের নাম দিতে হবে')
    .max(100, 'জোনের নাম ১০০ অক্ষরের বেশি হতে পারবে না'),
  allDistricts: z.array(z.string())
    .min(1, 'কমপক্ষে একটি জেলা নির্বাচন করতে হবে')
    .optional()
}).strict();

export type ZoneInput = z.infer<typeof zoneSchema>;

export const validateZone = (data: unknown) => {
  try {
    const validatedData = zoneSchema.parse(data);
    return {
      success: true,
      data: validatedData
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => err.message);
      return {
        success: false,
        errors: errorMessages
      };
    }
    return {
      success: false,
      errors: ['অজানা সমস্যা হয়েছে']
    };
  }
};

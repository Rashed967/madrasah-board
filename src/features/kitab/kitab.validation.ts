import { z } from 'zod';

const createKitabZodSchema = z.object({
    body: z.object({
        name: z.object({
            bengaliName: z.string({
                required_error: 'বাংলা নাম আবশ্যক',
            }),
            arabicName: z.string().optional(),
        }),
        fullMarks: z.number({
            required_error: 'ফুল মার্কস আবশ্যক',
        }),
    }),
});

const updateKitabZodSchema = z.object({
    body: z.object({
        name: z
            .object({
                bengaliName: z.string().optional(),
                arabicName: z.string().optional(),
            })
            .optional(),
        fullMarks: z.number().optional(),
    }),
});

export const KitabValidation = {
    createKitabZodSchema,
    updateKitabZodSchema,
};

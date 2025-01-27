import { z } from 'zod';

const createMarhalaZodSchema = z.object({
    body: z.object({
        name: z.object({
            bengaliName: z.string({
                required_error: 'বাংলা নাম আবশ্যক',
            }),
            arabicName: z.string().optional(),
        }).optional(),
        marhalaCategory: z.string({
            required_error: 'মারহালার ক্যাটাগরি আবশ্যক'
        }),
        marhalaType: z.string({
            required_error: 'মারহালার ধরণ আবশ্যক'
        }),
        listOfKitabs: z.array(
            z.string({required_error: 'কিতাবের নাম আবশ্যক'})
        ).optional()
    }),
});

export const MarhalaValidation = {
    createMarhalaZodSchema
};

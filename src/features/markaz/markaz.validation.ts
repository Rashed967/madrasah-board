import { z } from 'zod';

const createMarkazValidationSchema = z.object({
    body: z.object({
        madrasah: z.string({
            required_error: 'একটি মাদ্রাসা সিলেক্ট করতে হবে '}),
        allMadrasah: z.array(z.string()).optional(),
        code: z.string({
            required_error: 'মারকায কোড আবশ্যক',
        })
    }),
});

const updateMarkazValidationSchema = z.object({
    body: z.object({
        madrasah: z.string().optional(),
        allMadrasah: z.array(z.string()).optional(),
        code: z.string().optional(),
    }),
});

export const MarkazValidation = {
    createMarkazValidationSchema,
    updateMarkazValidationSchema
};

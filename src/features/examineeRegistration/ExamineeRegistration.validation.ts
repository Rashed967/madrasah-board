// regestered examine validation using regestered examinee model.ts, this model -> const regesteredExamineSchema = new Schema<IRegesteredExamine>({

import { z } from 'zod';

const createRegesteredExamineValidationSchema = z.object({
    body: z.object({
        examineeName: z.object({
            bengaliName: z.string({
                required_error: 'বাংলা নাম আবশ্যক',
            }),
            arabicName: z.string({
                required_error: 'আরবী নাম আবশ্যক',
            }),
            englishName: z.string().optional(),
        }),
        fatherName: z.object({
            bengaliName: z.string({
                required_error: 'পিতার বাংলা নাম আবশ্যক',
            }),
            arabicName: z.string().optional(),
            englishName: z.string().optional(),
        }),
        motherName: z.object({
            bengaliName: z.string({
                required_error: 'পিতার বাংলা নাম আবশ্যক',
            }),
            arabicName: z.string().optional(),
            englishName: z.string().optional(),
        }),
        nid_or_birth_certificate_number: z.string({
            required_error: 'জাতীয় পরিচয় নম্বর আবশ্যক',
        }),
        birthDate: z.string({
            required_error: 'জন্ম তারিখ আবশ্যক',
        }),
        exam: z.string({
            required_error: 'একটি পরীক্ষা নির্বাচন আবশ্যক',
        }),
        madrasah: z.string({
            required_error: 'মাদ্রাসা আবশ্যক',
        }),
        preExamineeRegistration: z.string({
            required_error: 'প্রাক নিবন্ধন নির্বাচন আবশ্যক',
        }),
        marhala: z.string({
            required_error: 'মারহালা আবশ্যক',
        }),
        imageUrl: z.string().optional()
    }),
});


// Update Regestered Examine Schema

const updateRegesteredExamineValidationSchema = z.object({
    body: z.object({
        examineeName: z.object({
            bengaliName: z.string().optional(),
            arabicName: z.string().optional(),
            englishName: z.string().optional(),
        }).optional(),
        fatherName: z.object({
            bengaliName: z.string().optional(),
            arabicName: z.string().optional(),
            englishName: z.string().optional(),
        }).optional(),
        nid_birth_certificate_number: z.string().optional(),
        birthDate: z.string().optional(),
        exam: z.string().optional(),
        madrasah: z.string().optional(),
        imageUrl: z.string().optional()
    }),
});

export const RegesteredExamineValidation = {
    createRegesteredExamineValidationSchema,
    updateRegesteredExamineValidationSchema
};  
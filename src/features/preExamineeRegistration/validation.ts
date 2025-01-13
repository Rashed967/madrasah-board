import { z } from "zod";
import { PAYMENT_METHOD, TRANSACTION_CATEGORY, TRANSACTION_TYPE } from "../transaction/transaction.constants";
 
// Create Pre Examinee Registration using this model

const createPreExamineeRegistrationValidationSchema = z.object({
    preExaminneRegistrationDetails : z.object({
        exam: z.string({
            required_error: 'পরীক্ষা নির্ধারন আবশ্যক',
        }).nonempty('পরীক্ষা নির্ধারন আবশ্যক'),
        madrasah: z.string({
            required_error: 'মাদ্রাসা নির্ধারন আবশ্যক',
        }).nonempty('মাদ্রাসা নির্ধারন আবশ্যক'),
        examineesPerMahala: z.array(z.object({
            marhalaName: z.string({
                required_error: 'মাহালার নাম আবশ্যক',
            }).nonempty('মাহালার নাম আবশ্যক'),
            totalExamineesSlots: z.number({
                required_error: 'পরীক্ষার স্লট আবশ্যক',
            }),
            startingRegistrationNumber: z.number().optional(),
            endingRegistrationNumber: z.number().optional(),
        })),
        totalFeesAmount: z.number({
            required_error: 'মোট ফি আবশ্যক',
        }),
    }),

    transactionDetails: z.object({
        amount: z.number({
            required_error: 'আমাউন্ট আবশ্যক',}).nonnegative('আমাউন্ট আবশ্যক').min(1, 'মোট টাকা এর পরিমান দিতে হবে'),
        transactionType: z.enum([...TRANSACTION_TYPE, ''] as [string, ...string[]]).optional(),
        transactionCategory: z.enum([...TRANSACTION_CATEGORY, ''] as [string, ...string[]]).optional(),
        description: z.string().optional(),
        paymentMethod: z.enum([...PAYMENT_METHOD, ''] as [string, ...string[]]).optional(),
    })
});

const updatePreExamineeRegistrationValidationSchema = z.object({
    body: z.object({
        exam: z.string().optional(),
        madrasah: z.string().optional(),
        examineesPerMahala: z.array(z.object({
            marhalaName: z.string().optional(),
            totalExamineesSlots: z.number().optional(),
            startingRegistrationNumber: z.number().optional(),
            endingRegistrationNumber: z.number().optional(),
        })).optional(),
        totalFeesAmount: z.number().optional(),
    })
});


export const PreExamineeRegistrationValidation = {  
    createPreExamineeRegistrationValidationSchema,
    updatePreExamineeRegistrationValidationSchema,
};
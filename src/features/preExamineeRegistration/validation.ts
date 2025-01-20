import { z } from "zod";
import { PAYMENT_METHOD, TRANSACTION_CATEGORY } from "../transaction/transaction.constants";
 
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
    }),

    transactionDetails: z.object({
        totalAmount: z.number({required_error:  'টোটাল আমাউন্ট আবশ্যক'}),
        paidAmount: z.number({required_error:  'পেইড আমাউন্ট আবশ্যক'}),
        transactionCategory: z.string({
            required_error: 'ট্রান্স্যাকশন ক্যাটাগরি আবশ্যক',
        }).nonempty('ট্রান্স্যাকশন ক্যাটাগরি আবশ্যক'),
        description: z.string().optional(),
        paymentDetails: z.array(
            z.object({
              amount: z.number({
                required_error: 'এমাউন্ট আবশ্যক'
              }),
              paymentMethod: z.string({
                required_error: 'পেমেন্ট মেথড আবশ্যক',
              }).nonempty('পেমেন্ট মেথড আবশ্যক'),
              referenceNumber: z.string().optional()
            })
          ),
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
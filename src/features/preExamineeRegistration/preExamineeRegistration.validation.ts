import { z } from "zod";
import { PAYMENT_METHOD, TRANSACTION_CATEGORY, TRANSACTION_TYPE } from "../transaction/transaction.constants";
 
// Create Pre Examinee Registration using this model

const createPreExamineeRegistrationValidationSchema = z.object({
            exam: z.string({
                required_error: 'পরীক্ষা নির্ধারন আবশ্যক',
            }),
            madrasah: z.string({
                required_error: 'মাদ্রাসা নির্ধারন আবশ্যক',
            }),
            examineesPerMahala: z.array(z.object({
                marhalaName: z.string({
                    required_error: 'মাহালার নাম আবশ্যক',
                }),
                totalExamineesSlots: z.number({
                    required_error: 'পরীক্ষার স্লট আবশ্যক',
                }),
                startingRegistrationNumber: z.number().optional(),
                endingRegistrationNumber: z.number().optional(),
            })),
            totalFeesAmount: z.number({
                required_error: 'মোট ফি আবশ্যক',
            }),
});

// validaton schem for updating pre examinee registration
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
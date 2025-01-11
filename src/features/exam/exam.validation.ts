import { z } from 'zod';


const feeStructureSchema = z.object({
    marhala: z.string(),
    amount: z.number({required_error: "ফি আবশ্যক"}).min(1, "০ এর চেয়ে বেশি হতে হবে"),
});


const createExamValidationSchema = z.object({
        examName: z.string({required_error: "পরীক্ষা নাম আবশ্যক"}).nonempty("পরীক্ষা নাম আবশ্যক"),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        registrationStartNumber: z.number({required_error: "রেজিস্ট্রেশন শুরুর নম্বর আবশ্যক"}).min(1, "০ এর চেয়ে বেশি হতে হবে"),
        preRegistrationFee: z.number({required_error: "প্রাক নিবন্ধন ফি আবশ্যক"}).min(1, "০ এর চেয়ে বেশি হতে হবে"),
        examFeeForBoys: z.array(feeStructureSchema).optional(),
        examFeeForGirls: z.array(feeStructureSchema).optional()
});

 const updateExamValidationSchema = z.object({
        examName: z.string().optional(),
        startDate: z.string().transform((str) => new Date(str)).optional(),
        endDate: z.string().transform((str) => new Date(str)).optional(),
        registrationStartNumber: z.number().positive().optional(),
        preRegistrationFee: z.number().nonnegative().optional(),
        examFeeForBoys: z.array(feeStructureSchema).optional(),
        examFeeForGirls: z.array(feeStructureSchema).optional(),
});


export const ExamValidationSchemas = {
    createExamValidationSchema,
    updateExamValidationSchema
};
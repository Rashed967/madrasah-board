import { z } from 'zod'

const feeStructureSchema = z.object({
  marhala: z.string(),
  examFeeForRegularStudent: z.number().min(1, '০ এর চেয়ে বেশি হতে হবে'),
  examFeeForIrregularStudent: z.number().min(1, '০ এর চেয়ে বেশি হতে হবে'),
  lateExamFeeForRegularStudent: z.number().min(1, '০ এর চেয়ে বেশি হতে হবে'),
  lateExamFeeForIrregularStudent: z.number().min(1, '০ এর চেয়ে বেশি হতে হবে'),
  startRollNumber: z
  .number({ required_error: 'রোল নম্বর শুরুর নম্বর আবশ্যক' })
  .min(1, '০ এর চেয়ে বেশি হতে হবে'),
})

const createExamValidationSchema = z.object({
  examName: z
    .string({ required_error: 'পরীক্ষা নাম আবশ্যক' })
    .nonempty('পরীক্ষা নাম আবশ্যক'),
  registrationStartNumber: z
    .number({ required_error: 'রেজিস্ট্রেশন শুরুর নম্বর আবশ্যক' })
    .min(1, '০ এর চেয়ে বেশি হতে হবে'),
  registrationFeeForRegularStudent: z.number().min(1, '০ এর চেয়ে বেশি হতে হবে'),
  registrationFeeForIrregularStudent: z.number().min(1, '০ এর চেয়ে বেশি হতে হবে'),
  lateRegistrationFeeForRegularStudent: z.number().min(1, '০ এর চেয়ে বেশি হতে হবে'),
  lateRegistrationFeeForIrregularStudent: z.number().min(1, '০ এর চেয়ে বেশি হতে হবে'),
  examFeeForBoys: z.array(feeStructureSchema),
  examFeeForGirls: z.array(feeStructureSchema)
})

const updateExamValidationSchema = z.object({
  examName: z.string().optional(),
  registrationStartNumber: z.number().positive().optional(),
  startRollNumber: z.number().positive().optional(),
  registrationFeeForRegularStudent: z.number().min(0).optional(),
  registrationFeeForIrregularStudent: z.number().min(0).optional(),
  lateRegistrationFeeForRegularStudent: z.number().min(0).optional(),
  lateRegistrationFeeForIrregularStudent: z.number().min(0).optional(),
  examFeeForBoys: z.array(feeStructureSchema).optional(),
  examFeeForGirls: z.array(feeStructureSchema).optional()
})

export const ExamValidationSchemas = {
  createExamValidationSchema,
  updateExamValidationSchema
}

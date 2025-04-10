import { z } from 'zod'
import { PAYMENT_METHOD } from '../transaction/transaction.constants'

// Create Pre Examinee Registration using this model

const createPreExamineeRegistrationValidationSchema = z.object({
  preExaminneRegistrationDetails: z.object({
    exam: z
      .string({
        required_error: 'পরীক্ষা নির্ধারন আবশ্যক'
      })
      .nonempty('পরীক্ষা নির্ধারন আবশ্যক'),
    madrasah: z
      .string({
        required_error: 'মাদ্রাসা নির্ধারন আবশ্যক'
      })
      .nonempty('মাদ্রাসা নির্ধারন আবশ্যক'),
    examineesPerMahala: z.array(
      z.object({
        marhala: z
          .string({
            required_error: 'মারহালার নাম আবশ্যক'
          })
          .nonempty('মাহালার নাম আবশ্যক'),
        regularExamineesSlots: z
          .number({
            required_error: 'নিয়মিত পরীক্ষার্থীর সংখ্যা আবশ্যক'
          })
          .min(0, 'নিয়মিত পরীক্ষার্থীর সংখ্যা ০ বা তার বেশি হতে হবে'),
        irregularExamineesSlots: z
          .number({
            required_error: 'অনিয়মিত পরীক্ষার্থীর সংখ্যা আবশ্যক'
          })
          .min(0, 'অনিয়মিত পরীক্ষার্থীর সংখ্যা ০ বা তার বেশি হতে হবে'),
        startingRegistrationNumber: z.number({
          required_error: 'শুরুর রেজিস্ট্রেশন নম্বর আবশ্যক'
        }),
        endingRegistrationNumber: z.number({
          required_error: 'শেষ রেজিস্ট্রেশন নম্বর আবশ্যক'
        })
      })
    )
  }),

  transactionDetails: z.object({
    totalAmount: z.number({ required_error: 'টোটাল আমাউন্ট আবশ্যক' }),
    paidAmount: z.number({ required_error: 'পেইড আমাউন্ট আবশ্যক' }),
    description: z.string().optional(),
    paymentDetails: z.array(
      z.object({
        amount: z.number({
          required_error: 'এমাউন্ট আবশ্যক'
        }),
        paymentMethod: z
          .string({
            required_error: 'পেমেন্ট মেথড আবশ্যক'
          })
          .nonempty('পেমেন্ট মেথড আবশ্যক'),
        referenceNumber: z.string().optional()
      })
    )
  })
})

const updatePreExamineeRegistrationValidationSchema = z.object({
  body: z.object({
    exam: z.string().optional(),
    madrasah: z.string().optional(),
    examineesPerMahala: z
      .array(
        z.object({
          marhalaName: z.string().optional(),
          regularExamineesSlots: z.number().optional(),
          irregularExamineesSlots: z.number().optional(),
          startingRegistrationNumber: z.number().optional(),
          endingRegistrationNumber: z.number().optional()
        })
      )
      .optional(),
    totalFeesAmount: z.number().optional()
  })
})

export const PreExamineeRegistrationValidation = {
  createPreExamineeRegistrationValidationSchema,
  updatePreExamineeRegistrationValidationSchema
}

// board info validation with zod
import { z } from 'zod'

const createBoardInfoValidationSchema = z.object({
  body: z.object({
    boardName: z.object({
      bengaliName: z.string(),
      englishName: z.string().optional(),
      arabicName: z.string().optional()
    }),
    contactNo1: z.string(),
    contactNo2: z.string().optional(),
    email: z.string().optional(),
    address: z.string(),
    registrationNo: z.string().optional(),
    logo: z.string(),
    foundationYear: z.string().optional(),
    founder: z.string().optional(),
    chairman: z.string().optional(),
    secretary: z.string().optional(),
    examController: z.string().optional(),
    examControllerContactNo: z.string().optional()
  })
})

// update board info validation schema
const updateBoardInfoValidationSchema = z.object({
  body: z.object({
    boardName: z
      .object({
        bengaliName: z.string().optional(),
        englishName: z.string().optional(),
        arabicName: z.string().optional()
      })
      .optional(),
    contactNo1: z.string().optional(),
    contactNo2: z.string().optional(),
    email: z.string().optional(),
    address: z.string().optional(),
    registrationNo: z.string().optional(),
    logo: z.string().optional(),
    foundationYear: z.string().optional(),
    founder: z.string().optional(),
    chairman: z.string().optional(),
    secretary: z.string().optional(),
    examController: z.string().optional(),
    examControllerContactNo: z.string().optional()
  })
})

export const BoardInfoValidationSchemas = {
  createBoardInfoValidationSchema,
  updateBoardInfoValidationSchema
}

import { z } from 'zod';
import { madrasahTypes } from '@/data/madrasahTypes';
import marhalaNames from '@/data/marhala.names';

export const createMadrasahInfoSchema = z.object({
  highestMarhala: z.enum(marhalaNames as [string, ...string[]], {
    errorMap: () => ({ message: 'সর্বোচ্চ মারহালা নির্বাচন করুন' }),
  }),
  totalStudents: z.number().min(0, 'শিক্ষার্থীর সংখ্যা ০ এর চেয়ে বেশি হতে হবে'),
  totalTeacherAndStuff: z.number().min(0, 'শিক্ষক ও কর্মচারীর সংখ্যা ০ এর চেয়ে বেশি হতে হবে'),
  madrasahType: z.enum([...madrasahTypes] as [string, ...string[]], {
    errorMap: () => ({ message: 'মাদরাসার ধরণ নির্বাচন করুন' }),
  }),
});


// update madrasah information zod schema, all fields are optional
export const updateMadrasahInfoSchema = createMadrasahInfoSchema.partial();

const madrasahInfoSchemas  = {
  createMadrasahInfoSchema,
  updateMadrasahInfoSchema,
}

export default madrasahInfoSchemas
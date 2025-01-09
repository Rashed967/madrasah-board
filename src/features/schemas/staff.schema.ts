import chairmanMutawalliDesignation from '@/data/chairman_mutawalli.designation';
import { z } from 'zod';

const phoneRegex = /^01[3-9]\d{8}$/;

// Base schema for all staff members
const baseStaffSchema = z.object({
  name: z.string().min(1, 'নাম দিতে হবে'),
  contactNo: z.string().regex(phoneRegex, 'সঠিক মোবাইল নম্বর দিন'),
  nidNumber: z.string().min(10, 'সঠিক এনআইডি নম্বর দিন').max(17, 'সঠিক এনআইডি নম্বর দিন'),
  code: z.string().optional(),
});

// Muhtamim specific schema
export const createMuhtamimSchema = baseStaffSchema.extend({
  highestEducationalQualification: z.string().min(1, 'শিক্ষাগত যোগ্যতা দিতে হবে'),
});

// Mutawalli specific schema
export const createMutawalliSchema = baseStaffSchema.extend({
  designation: z.enum(chairmanMutawalliDesignation as [string, ...string[]], {
    errorMap: () => ({ message: 'পদবি নির্বাচন করুন' }),
  }),
});

// Educational Secretary specific schema
export const createEducationalSecretarySchema = baseStaffSchema.extend({
  highestEducationalQualification: z.string().min(1, 'শিক্ষাগত যোগ্যতা দিতে হবে'),
});

// Update schemas (all fields optional)
export const updateMuhtamimSchema = createMuhtamimSchema.partial();
export const updateMutawalliSchema = createMutawalliSchema.partial();
export const updateEducationalSecretarySchema = createEducationalSecretarySchema.partial();

const staffSchemas = {
  createMuhtamimSchema,
  createMutawalliSchema,
  createEducationalSecretarySchema,
  updateMuhtamimSchema,
  updateMutawalliSchema,
  updateEducationalSecretarySchema,
};

export default staffSchemas;

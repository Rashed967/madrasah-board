import z from 'zod';

const createZoneValidation = z.object({
  body: z.object({
    name: z.string({required_error: 'জোনের নাম আবশ্যক'}),
    allDistricts: z.array(z.string()).optional(),
    allMarkazs: z.array(z.string()).optional(),
  })
});

const updateZoneValidation = z.object({
  body: z.object({
    name: z.string().optional(),
    allDistricts: z.array(z.string()).optional(),
    allMarkazs: z.array(z.string()).optional(),
  })
});

// Schema for district list operations
const updateDistrictListValidation = z.object({
  body: z.object({
    operation: z.enum(['add', 'remove', 'clear'], {
      required_error: 'Operation type is required',
    }),
    districts: z.array(
      z.string({
        required_error: 'District name must be a valid string',
      })
    ).optional(),
  }).refine(data => {
    // districts is required for add/remove operations
    if (data.operation !== 'clear' && (!data.districts || data.districts.length === 0)) {
      return false;
    }
    return true;
  }, {
    message: 'Districts are required for add/remove operations',
  }),
});

// Schema for markaz list operations
const updateMarkazListValidation = z.object({
  body: z.object({
    operation: z.enum(['add', 'remove', 'clear'], {
      required_error: 'Operation type is required',
    }),
    markazIds: z.array(
      z.string({
        required_error: 'Markaz ID must be a valid string',
      })
    ).optional(),
  }).refine(data => {
    // markazIds is required for add/remove operations
    if (data.operation !== 'clear' && (!data.markazIds || data.markazIds.length === 0)) {
      return false;
    }
    return true;
  }, {
    message: 'MarkazIds are required for add/remove operations',
  }),
});

export const ZoneValidation = {
  createZoneValidation,
  updateZoneValidation,
  updateDistrictListValidation,
  updateMarkazListValidation
};
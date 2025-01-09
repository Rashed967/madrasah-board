/**
 * Removes empty fields from an object
 * @param obj Object to remove empty fields from
 * @returns Object without empty fields
 */
export const removeEmptyFields = <T>(obj: T): T => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => {
      if (typeof value === 'string') return value !== '';
      if (typeof value === 'number') return value !== 0;
      return value != null;
    })
  ) as T;
};

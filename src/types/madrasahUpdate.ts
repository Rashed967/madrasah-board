// Types for update operations - all fields are optional
export interface MadrasahBasicInfoUpdate {
  madrasahNames?: {
    bengaliName?: string;
    arabicName?: string;
    englishName?: string;
  };
  description?: string;
  email?: string;
  communicatorName?: string;
  contactNo1?: string;
  contactNo2?: string;
  ilhakImage?: string;
}

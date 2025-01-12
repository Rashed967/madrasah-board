


// transaction category constans 
export const TRANSACTION_TYPE = ['income', 'expense'] as const;

export const TRANSACTION_TYPE_LABELS = [
    { value: 'income', label: 'আয়' },
    { value: 'expense', label: 'ব্যয়' },
]

export const TRANSACTION_CATEGORY = [
  'registrationFee',
  'examFee',
  'ilhakFee',
  'inspectionFee',
  'couponFee',
  'annualFee',
  'donation',
  'other',
] as const;


export const TRANSACTION_CATEGORY_LABELS = [
  { value: 'registrationFee', label: 'নিবন্ধন ফি' },
  { value: 'examFee', label: 'পরীক্ষা ফি' },
  { value: 'ilhakFee', label: 'ইলহাক ফি' },
  { value: 'inspectionFee', label: 'পরীদর্শন ফি' },
  { value: 'couponFee', label: 'কুপন ফি' },
  { value: 'annualFee', label: 'বার্ষিক ফি' },
  { value: 'donation', label: 'দান' },
  { value: 'other', label: 'অন্যান্য' },
]

export const PAYMENT_METHOD = [
  'cash',
  'cheque',
  'mobile_banking',
  'bank_transfer',
] as const;

export const PAYMENT_METHOD_LABELS = [
  { value: 'cash', label: 'নগদ' },
  { value: 'cheque', label: 'চেক' },
  { value: 'mobile_banking', label: 'মোবাইল ব্যাংকিং' },
  { value: 'bank_transfer', label: 'ব্যাংক ট্রান্সফার' },
];


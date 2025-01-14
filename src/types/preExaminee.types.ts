export interface ExamType {
  _id: string;
  examName: string;
  preRegistrationFee: number;
  currentRegistrationNumber: number;
  registrationStartNumber: number;
}

export interface MarhalaExaminee {
  marhalaName: string;
  totalExamineesSlots: number;
  startingRegistrationNumber: number;
  endingRegistrationNumber: number;
  totalFeesAmount: number;
}

export interface TransactionDetails {
  amount: number;
  transactionType: string;
  transactionCategory: string;
  description: string;
  paymentMethod: string;
}

export interface PreExamineeRegistrationData {
  preExaminneRegistrationDetails: {
    exam: string;
    madrasah: string;
    examineesPerMahala: MarhalaExaminee[];
    totalFeesAmount: number;
  };
  transactionDetails: TransactionDetails;
}

export interface StatusDialogState {
  isOpen: boolean;
  type: 'success' | 'error';
  title: string;
  message: string;
}

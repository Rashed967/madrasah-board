export interface ExamType {
  _id: string
  examName: string
  preRegistrationFee: number
  currentRegistrationNumber: number
  registrationStartNumber: number
}

export interface MarhalaExaminee {
  marhala: string
  marhalaName?: string
  totalExamineesSlots: number
  startingRegistrationNumber: number
  endingRegistrationNumber: number
}

export type TPaymentMethod =
  | 'cash'
  | 'cheque'
  | 'mobile_banking'
  | 'bank_transfer'

export interface IPaymentDetail {
  amount: number
  paymentMethod: TPaymentMethod
  referenceNumber?: string
  paymentDate?: string
}

export interface TransactionDetails {
  totalAmount: number
  paidAmount?: number
  transactionCategory: string
  description?: string
  paymentDetails: IPaymentDetail[] // Changed from single paymentMethod to array of payment details
}

export interface PreExamineeRegistrationData {
  preExaminneRegistrationDetails: {
    exam: string
    madrasah: string
    examineesPerMahala: MarhalaExaminee[]
    // totalFeesAmount: number;
  }
  transactionDetails: TransactionDetails
  receiptNo?: string
  code?: string
  madrasahAddress?: string
  totalAmountInWords?: string
}

export interface StatusDialogState {
  isOpen: boolean
  type: 'success' | 'error'
  title: string
  message: string
}

export interface ExamType {
  _id: string
  examName: string
  endRegistrationDate: string
  registrationStartNumber: number
  currentRegistrationNumber: number
  registrationFeeForRegularStudent: number
  registrationFeeForIrregularStudent: number
  lateRegistrationFeeForRegularStudent: number
  lateRegistrationFeeForIrregularStudent: number
  examFeeForBoys: Array<{
    marhala: string
    examFeeForRegularStudent: number
    examFeeForIrregularStudent: number
    lateExamFeeForRegularStudent: number
    lateExamFeeForIrregularStudent: number
    startRollNumber: number
    currentRollNumber: number
  }>
  examFeeForGirls: Array<{
    marhala: string
    examFeeForRegularStudent: number
    examFeeForIrregularStudent: number
    lateExamFeeForRegularStudent: number
    lateExamFeeForIrregularStudent: number
    startRollNumber: number
    currentRollNumber: number
  }>
}


export interface MarhalaExaminee {
  marhala: string
  marhalaName?: string
  regularExamineesSlots: number
  irregularExamineesSlots: number
  startingRegistrationNumber: number
  endingRegistrationNumber: number
}

export type TPaymentMethod =
  | 'cash'
  | 'cheque'
  | 'mobile_banking'
  | 'bank_transfer'

export interface PaymentDetail {
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
  paymentDetails: PaymentDetail[] // Changed from single paymentMethod to array of payment details
}

export interface PreExamineeRegistrationData {
  preExaminneRegistrationDetails: {
    exam: string
    madrasah: string
    examineesPerMahala: MarhalaExaminee[]
    isLateRegistrationFeeTaken?: boolean
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

import { Types } from 'mongoose'


export interface IExamineesPerMahala {
  _id?: Types.ObjectId
  marhala: {
    name: {
      bengaliName: string
    }
  }
  marhalaName?: string
  regularExamineesSlots: number
  irregularExamineesSlots: number
  startingRegistrationNumber: number
  endingRegistrationNumber: number
}

interface ITransactionDetails {
  totalAmount: number
  paidAmount: number
  transactionCategory: string
  description?: string
  paymentDetails: Array<{
    amount: number
    paymentMethod: string
    referenceNumber?: string
  }>
}

export interface IPreExamineeRegistration {
  _id?: Types.ObjectId
  exam: Types.ObjectId
  madrasah: Types.ObjectId
  examineesPerMahala: IExamineesPerMahala[]
  transactionDetails: ITransactionDetails
  receiptNo?: number
  transactionId?: string
  isDeleted?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export default IPreExamineeRegistration

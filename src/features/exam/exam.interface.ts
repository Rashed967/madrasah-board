import { Types } from 'mongoose'

// exam status
export type TExamStatus = 'upcoming' | 'ongoing' | 'completed'

export interface IExamFeeForExaminee {
  marhala: string
  examFeeForRegularStudent: number
  examFeeForIrregularStudent: number
  lateExamFeeForRegularStudent: number
  lateExamFeeForIrregularStudent: number
  startRollNumber?: number
  currentRollNumber?: number
}

interface IExam {
  _id?: Types.ObjectId
  examName: string
  examYear?: string
  registrationStartNumber: number
  currentRegistrationNumber?: number

  preExamineeRegistrations?: Types.ObjectId[]
  mumtahins?: Types.ObjectId[]
  totalMumtahin?: number
  totalPreRegisteredExaminee?: {
    boys: number
    girls: number
    total: number
  }
  totalRegisteredExaminee?: {
    boys: number
    girls: number
    total: number
  }
  passRate?: number
  resultPublicationDate?: Date
  registrationFeeForRegularStudent: number
  registrationFeeForIrregularStudent: number
  lateRegistrationFeeForRegularStudent: number
  lateRegistrationFeeForIrregularStudent: number
  examFeeForBoys: IExamFeeForExaminee[]
  examFeeForGirls: IExamFeeForExaminee[]
  registeredExaminees?: Types.ObjectId[]
  status?: TExamStatus
  createdAt?: Date
  updatedAt?: Date
}

export default IExam

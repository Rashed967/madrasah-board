interface IExamFee {
  marhala: string
  examFeeForRegularStudent: number
  examFeeForIrregularStudent: number
  lateExamFeeForRegularStudent: number
  lateExamFeeForIrregularStudent: number
  startRollNumber: number
  currentRollNumber: number
  _id: string
}

export interface IExam {
  _id: string
  examName: string
  endRegistrationDate: string
  examFeeCollectionEndDate: string | null
  registrationStartNumber: number
  currentRegistrationNumber: number
  examFeeForBoys: IExamFee[]
  examFeeForGirls: IExamFee[]
  isDeleted: boolean
  isCompleted: boolean
  createdAt: string
  updatedAt: string
} 
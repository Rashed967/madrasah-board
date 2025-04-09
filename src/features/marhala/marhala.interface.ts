import { Types } from 'mongoose'

export type IMarhalaName = {
  bengaliName: string
  arabicName?: string
}

// marhala category e
export type MarhalaCategory = 'hifz' | 'darsiyat'

export type IMarhala = {
  _id?: Types.ObjectId
  code: number
  name: IMarhalaName
  listOfKitabs: Types.ObjectId[]
  isDeleted?: boolean
  marhalaType: 'boys' | 'girls'
  marhalaCategory: MarhalaCategory
  level: number
  createdAt?: Date
  updatedAt?: Date
}

export type CreateMarhalaData = {
  name: IMarhalaName
  listOfKitabs: string[]
  marhalaType: 'boys' | 'girls'
  marhalaCategory: MarhalaCategory
}

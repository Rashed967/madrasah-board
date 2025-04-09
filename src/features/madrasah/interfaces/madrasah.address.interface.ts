export type TCourierAddress = 'কুরিয়ার' | 'ডাক'

export interface IMadrasahAddress {
  division: string
  district: string
  subDistrict_policeStation: string
  postOffice: string
  village: string
  holdingNumber: string
  zone: string
  courierAddress: TCourierAddress
}

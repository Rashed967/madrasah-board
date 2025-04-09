interface IBoardInfo {
  boardName: {
    bengaliName: string
    englishName?: string
    arabicName?: string
  }
  contactNo1: string
  contactNo2: string
  email?: string
  address: string
  registrationNo?: string
  logo: string
  foundationYear?: string
  founder?: string
  chairman?: string
  secretary?: string
  examController?: string
  examControllerContactNo?: string
  createdAt?: Date
  updatedAt?: Date
}

export default IBoardInfo

import { Types } from "mongoose";

 export interface IExamineesPerMahala {
    _id?: Types.ObjectId,
    marhalaName: string,
    totalExamineesSlots: number,
    startingRegistrationNumber: number,
    endingRegistrationNumber: number,
}

export interface IPreExamineeRegistration {
    _id? : Types.ObjectId,
    exam: Types.ObjectId,
    madrasah: Types.ObjectId,
    examineesPerMahala:  IExamineesPerMahala[],
    totalExaminees?: number,
    totalFeesAmount?: number,
    transactionId?: string,
    isDeleted?: boolean,
    createdAt?: Date,
    updatedAt?: Date
}       


export default IPreExamineeRegistration
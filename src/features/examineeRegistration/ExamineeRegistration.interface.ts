import { Types } from "mongoose";

// examinee name object type
export interface IExamineeName {
    bengaliName: string;
    arabicName: string;
    englishName?: string;
}

// examinee father object type
export interface IGuardianName {
    bengaliName: string;
    arabicName?: string;
    englishName?: string;
}

export type TExamineeStatus = 'নির্বাচিত' | 'অনির্বাচিত'

// examinee object type 
export interface IRegesteredExaminee {
    _id?: Types.ObjectId;
    exam: Types.ObjectId;
    madrasah: Types.ObjectId;
    preExamineeRegistration: Types.ObjectId;
    marhala: Types.ObjectId;
    examineeName: IExamineeName;
    fatherName: IGuardianName;
    motherName: IGuardianName;
    nid_or_birth_certificate_number: string;
    birthDate: Date;
    registrationNumber: number;
    marks: Types.ObjectId;
    imageUrl?: string;
    examineeStatus: TExamineeStatus;
    roll: number;
    isDeleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}


// examinee registration object type for api response
export interface IRegesteredExamineeResponse {
    _id: Types.ObjectId;
    exam: Types.ObjectId;
    madrasah: {
        _id: Types.ObjectId;
        madrasahNames: {
            bengaliName: string;
            arabicName: string;
            englishName: string;
        };
    };
    preExamineeRegistration: Types.ObjectId;
    marhala: {
        _id: Types.ObjectId;
        name: {
            bengaliName: string;
            arabicName: string;
            englishName: string;
        };
    };
    examineeName: IExamineeName;
    fatherName: IGuardianName;
    motherName: IGuardianName;
    nid_or_birth_certificate_number: string;
    birthDate: Date;    
    registrationNumber: number;
    marks: Types.ObjectId;
    imageUrl?: string;
    examineeStatus: TExamineeStatus;
    roll: number;
    isDeleted?: boolean;
    createdAt?: Date;
}   

export default IRegesteredExaminee
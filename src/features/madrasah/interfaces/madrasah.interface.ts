import {Types} from 'mongoose';
import { TCourierAddress } from './madrasah.address.interface';
import { TMutawalliDesignation } from './mutawalli.interface';

export enum ENUM_MADRASAH_STATUS {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
    BLOCKED = 'blocked'
}

export interface IMadrasahNames {
    bengaliName: string;
    arabicName: string;
    englishName?: string;
}

export type TMadrasahType = "বালক" | "বালিকা";

export interface IMadrasah {
    _id: string;
    user: string;
    madrasahNames: {
        bengaliName: string;
        arabicName: string;
        englishName?: string;
    };
    code: string;
    email: string;
    communicatorName: string;
    contactNo1: string;
    contactNo2: string;
    description: string;
    ilhakImage: string;
    address: {
        division: string;
        district: string;
        subDistrict: string;
        policeStation: string;
        village: string;
        holdingNumber: string;
        zone: string;
        courierAddress: TCourierAddress;
    };
    muhtamim: {
        name: string;
        contactNo: string;
        nidNumber: string;
        highestEducationalQualification: string;
        code: string;
    };
    chairman_mutawalli: {
        name: string;
        contactNo: string;
        nidNumber: string;
        designation: TMutawalliDesignation;
        code: string;
    };
    educational_secretory: {
        name: string;
        contactNo: string;
        nidNumber: string;
        highestEducationalQualification: string;
        madrasah?: Types.ObjectId;
        code: string;
    };
    madrasah_information: {
        highestMarhala: string;
        totalStudents: number;
        totalTeacherAndStuff: number;
        madrasahType: TMadrasahType;
    };

    madrasahResult: string[];
    isDeleted?: boolean;
    status: 'pending' | 'approved' | 'rejected' | 'blocked';
    registrationToken?: string;
    registrationTokenExpiry?: Date;
    userAccountCreated?: boolean;
    createdAt: Date;
    updatedAt: Date;
}

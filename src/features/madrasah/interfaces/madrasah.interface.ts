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
    ilhakPdf: string;
    address: {
        _id?: '';
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
        _id?: '';
        name: string;
        contactNo: string;
        nidNumber: string;
        highestEducationalQualification: string;
        code: string;
    };
    chairman_mutawalli: {
        _id?: '';
        name: string;
        contactNo: string;
        nidNumber: string;
        designation: TMutawalliDesignation;
        code: string;
    };
    educational_secretory: {
        _id?: '';
        name: string;
        contactNo: string;
        nidNumber: string;
        highestEducationalQualification: string;
        madrasah?: '';
        code: string;
    };
    madrasah_information: {
        _id?: '';
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

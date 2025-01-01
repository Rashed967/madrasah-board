

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

export interface IMadrasahAddress {
    _id?: string;
    division: string;
    district: string;
    subDistrict: string;
    policeStation: string;
    village: string;
    holdingNumber: string;
    zone: string;
    courierAddress: string;
}

export interface IMadrasahInformation {
    _id?: string;
    highestMarhala: string;
    totalStudents: number;
    totalTeacherAndStuff: number;
    madrasahType: string;
}

export interface IBasePersonInfo {
    _id?: string;
    name: string;
    nidNumber: string;
    contactNo: string;
}

export interface IEducationalPersonInfo extends IBasePersonInfo {
    highestEducationalQualification: string;
}

export interface IChairmanMutawalli extends IBasePersonInfo {
    designation: string;
}

export interface IMadrasahFilters {
    searchTerm?: string;
    code?: string;
    email?: string;
    status?: string;
    select?: string;
}

export interface IMadrasah {
    _id?: string;
    user?: string;
    madrasahNames: IMadrasahNames;
    code: string;
    email?: string;
    communicatorName?: string;
    contactNo1?: string;
    contactNo2?: string;
    description?: string;
    ilhakImage?: string;
    address: IMadrasahAddress | string;
    muhtamim?: IEducationalPersonInfo | string;
    chairman_mutawalli?: IChairmanMutawalli | string;
    educational_secretory?: IEducationalPersonInfo | string;
    madrasah_information: IMadrasahInformation | string;
    madrasahResult?: string[];
    isDeleted?: boolean;
    status: ENUM_MADRASAH_STATUS;
    registrationToken?: string;
    registrationTokenExpiry?: Date;
    userAccountCreated?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

// Form data interface for client-side
export interface IMadrasahFormData {
    // Madrasah Names
    bengaliName: string;
    arabicName: string;
    englishName?: string;

    // Contact Info
    communicatorName?: string;
    email?: string;
    contactNo1?: string;
    contactNo2?: string;
    description?: string;

    // Address
    division: string;
    district: string;
    subDistrict: string;
    policeStation: string;
    village: string;
    holdingNumber: string;
    zone: string;
    courierAddress: string;

    // Madrasah Information
    highestMarhala: string;
    totalStudent: number;
    totalTeacherAndStaff: number;
    madrasahType: string;

    // Muhtamim Information
    muhtamimName: string;
    muhtamimNID: string;
    muhtamimMobile: string;
    muhtamimEducation: string;

    // Chairman/Mutawalli Information
    mutawalliName: string;
    mutawalliNID: string;
    mutawalliMobile: string;
    mutawalliDesignation: string;

    // Educational Secretary Information
    shikkhaSocheebName: string;
    shikkhaSocheebNID: string;
    shikkhaSocheebMobile: string;
    shikkhaSocheebEducation: string;
}

// API response type
export interface IMadrasahApiResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: IMadrasah | null;
}

import { Types } from "mongoose";

export interface IMuhtamim {
    _id?: Types.ObjectId | string;
    name: string;
    contactNo: string;
    nidNumber: string;
    highestEducationalQualification: string;
    code: string;
}

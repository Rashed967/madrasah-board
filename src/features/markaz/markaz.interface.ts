// markaz interface

import { Types } from "mongoose";
import { IMadrasah } from "../madrasah/interfaces";

export interface IMarkaz {
    _id?: Types.ObjectId;
    madrasah?: Types.ObjectId;
    allMadrasah: Types.ObjectId[];
    code: string;
    isDeleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}



export interface IMarkazResponse {
    _id?: Types.ObjectId | string;
    madrasah?: IMadrasah;
    allMadrasah?: IMadrasah[];
    code: string;
    zone?: string;
    allMadrasahInMarkaz?: IMadrasah[];
    isDeleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IMarkazApiResponse {
    success: boolean;
    message: string;
    data: {
        markaz: IMarkazResponse;
        allMadrasahInMarkaz: IMadrasah[];
    };
}

export default IMarkaz
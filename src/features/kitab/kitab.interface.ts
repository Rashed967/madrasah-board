import {Types } from 'mongoose';

export type IKitabName = {
    bengaliName: string | '';
    arabicName?: string;
};

export type IKitab = {
    _id?: Types.ObjectId;
    name: IKitabName;
    code?: number;
    fullMarks: number;
    isDeleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
};
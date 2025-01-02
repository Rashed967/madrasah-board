import { Types } from 'mongoose';

export interface IZone {
  _id?: Types.ObjectId;
  name: string;
  code: string;
  allDistricts?: string[];
  allMarkazs?: Types.ObjectId[];
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

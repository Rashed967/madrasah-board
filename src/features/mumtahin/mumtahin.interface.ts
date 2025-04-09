import { Document, Types } from 'mongoose';
import { IMadrasah } from '../madrasah/interfaces';
import { IMarhala } from '../marhala/marhala.interface';
import { IKitab } from '../kitab/kitab.interface';

export interface IHallGuard extends Document {
  name: string;
  contactNo: string;
  nagadAccountNo: string;
  madrasah: Types.ObjectId | string;
  hallGuardType: 'হলগার্ড' | 'পরীক্ষক' | 'উভয়';
  educationalQualification: Types.ObjectId | string;
  teachingQualification: Types.ObjectId | string;
  status: 'এক্টিভ' | 'ব্লকড';
  createdAt?: Date;
  updatedAt?: Date;
}


export interface IHallGuardResponse extends Document {
  name: string;
  contactNo: string;
  nagadAccountNo: string;
  madrasah: IMadrasah;
  hallGuardType: 'হলগার্ড' | 'পরীক্ষক' | 'উভয়';
  educationalQualification: IMarhala;
  teachingQualification: IKitab;
  status: 'এক্টিভ' | 'ব্লকড';
  createdAt?: Date;
  updatedAt?: Date;
}



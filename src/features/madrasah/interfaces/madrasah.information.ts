import { TMadrasahType } from './madrasah.interface';

export interface IMadrasahInformation {
    highestMarhala: string;
    totalStudents: number;
    totalTeacherAndStuff: number;
    madrasahType: TMadrasahType;
}

export default IMadrasahInformation
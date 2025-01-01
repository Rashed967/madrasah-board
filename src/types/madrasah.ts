import { ApiResponse } from '@/services/apiService';
import {
  IMadrasah,
  IMadrasahNames,
  IMadrasahAddress,
  IMadrasahInformation,
  IEducationalPersonInfo,
  IChairmanMutawalli
} from './global/madrasah.types';

// Re-export types from global
export type {
  IMadrasah as Madrasah,
  IMadrasahNames as MadrasahNames,
  IMadrasahAddress as MadrasahAddress,
  IMadrasahInformation as MadrasahInformation,
  IEducationalPersonInfo as EducationalPersonInfo,
  IChairmanMutawalli as ChairmanMutawalli
};

export type MadrasahApiResponse = ApiResponse<IMadrasah>;

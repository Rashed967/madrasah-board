import {
  IBasePersonInfo,
  IEducationalPersonInfo,
  IChairmanMutawalli
} from './global/madrasah.types';

// Re-export types from global
export type {
  IBasePersonInfo as BasePersonInfo,
  IEducationalPersonInfo as EducationalPersonInfo,
  IChairmanMutawalli as ChairmanMutawalli
};

// Type guards
export const isEducationalPerson = (person: IBasePersonInfo): person is IEducationalPersonInfo => {
  return 'highestEducationalQualification' in person;
};

export const isChairmanMutawalli = (person: IBasePersonInfo): person is IChairmanMutawalli => {
  return 'designation' in person;
};

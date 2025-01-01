export interface BasePersonInfo {
  _id?: string;
  name: string;
  nidNumber: string;
  contactNo: string;
}

export interface EducationalPersonInfo extends BasePersonInfo {
  highestEducationalQualification: string;
}

export interface ChairmanMutawalli extends BasePersonInfo {
  designation: string;
}

// Type guards
export const isEducationalPerson = (person: BasePersonInfo): person is EducationalPersonInfo => {
  return 'highestEducationQualification' in person;
};

export const isChairmanMutawalli = (person: BasePersonInfo): person is ChairmanMutawalli => {
  return 'designation' in person;
};

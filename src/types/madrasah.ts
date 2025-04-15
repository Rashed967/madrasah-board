interface MadrasahNames {
    bengaliName: string;
    arabicName: string;
    englishName: string;
    _id: string;
    id: string;
  }
  
  interface MadrasahAddress {
    _id: string;
    division: string;
    district: string;
    subDistrict_policeStation: string;
    postOffice: string;
    village: string;
    holdingNumber: string;
    id: string;
  }
  
  interface MadrasahInformation {
    _id: string;
    madrasahType: string;
    totalStudents: number;
    totalTeacherAndStuff: number;
    id: string;
  }
  
  interface Madrasah {
    _id: string;
    madrasahNames: MadrasahNames;
    code: string;
    email: string;
    communicatorName: string;
    contactNo1: string;
    contactNo2: string;
    address: MadrasahAddress;
    madrasah_information: MadrasahInformation;
    id: string;
  }

export default Madrasah;

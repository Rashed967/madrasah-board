import { post, get } from './apiService';
import { MadrasahRegistrationData, MadrasahRegistrationResponse, MadrasahInformation, EducationalPersonInfo, ChairmanMutawalli } from '@/types/madrasah';
import { getCurrentUser } from './authService';

interface ApiMeta {
  total: number;
  page: number;
  limit: number;
}

interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta: ApiMeta;
}

interface ServerResponse {
  success: boolean;
  statusCode: number;
  message: string;
  meta: ApiMeta;
  data: Madrasah[];
}

export interface MadrasahListResponse {
  success: boolean;
  message: string;
  data: Madrasah[] ;
  meta: {
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

export interface Madrasah {
  _id: string;
  madrasahNames: {
    bengaliName: string;
    arabicName: string;
    englishName: string;
    _id: string;
    id: string;
  };
  code: string;
  email: string;
  contactNo1: string;
  contactNo2: string;
  address: {
    _id: string;
    division: string;
    district: string;
    subDistrict: string;
    policeStation: string;
    village: string;
  };
  madrasah_information: {
    _id: string;
    highestMarhala: string;
    madrasahType: string;
  };
  muhtamim: {
    name: string;
  } | null;
}

export async function registerMadrasah(formData: any): Promise<MadrasahRegistrationResponse> {
  const user = getCurrentUser();
  const isAdmin = user?.role === 'admin' || user?.role === 'super-admin';

  const registrationData: Partial<MadrasahRegistrationData> = {
    madrasahNames: {
      bengaliName: formData.nameInBangla,
      arabicName: formData.nameInArabic,
      englishName: formData.nameInEnglish
    },
    email: formData.email,
    contactNo1: formData.contactNo1,
    contactNo2: formData.contactNo2,
    communicatorName: formData.communicatorName,
    description: formData.description,
    address: {
      division: formData.division,
      district: formData.district,
      subDistrict: formData.subDistrict,
      policeStation: formData.policeStation,
      village: formData.village,
      holdingNumber: formData.holdingNumber || '',
      zone: formData.zone,
      courierAddress: formData.courierAddress
    },
    ilhakImage: formData.madrasahIlhakimage
  };

  // Only add madrasah information if any field is filled
  const madrasahInfoFields: Partial<MadrasahInformation> = {
    highestMarhala: formData.highestMarhala,
    totalStudents: formData.totalStudent ? Number(formData.totalStudent) : undefined,
    totalTeacherAndStuff: formData.totalTeacherAndStaff ? Number(formData.totalTeacherAndStaff) : undefined,
    madrasahType: formData.madrasahType
  };

  if (Object.values(madrasahInfoFields).some(value => value !== undefined)) {
    registrationData.madrasah_information = madrasahInfoFields as MadrasahInformation;
  }

  // Only add muhtamim if any field is filled
  const muhtamimFields: Partial<EducationalPersonInfo> = {
    name: formData.muhtamimName,
    contactNo: formData.muhtamimMobile,
    nidNumber: formData.muhtamimNID,
    highestEducationalQualification: formData.muhtamimEducation
  };

  if (Object.values(muhtamimFields).some(value => value)) {
    registrationData.muhtamim = muhtamimFields as EducationalPersonInfo;
  }

  // Only add mutawalli if any field is filled
  const mutawalliFields: Partial<ChairmanMutawalli> = {
    name: formData.mutawalliName,
    contactNo: formData.mutawalliMobile,
    nidNumber: formData.mutawalliNID,
    designation: formData.mutawalliDesignation
  };

  if (Object.values(mutawalliFields).some(value => value)) {
    registrationData.chairman_mutawalli = mutawalliFields as ChairmanMutawalli;
  }

  // Only add shikkha sochib if any field is filled
  const shikkhaFields: Partial<EducationalPersonInfo> = {
    name: formData.shikkhaSocheebName,
    contactNo: formData.shikkhaSocheebMobile,
    nidNumber: formData.shikkhaSocheebNID,
    highestEducationalQualification: formData.shikkhaSocheebEducation
  };

  if (Object.values(shikkhaFields).some(value => value)) {
    registrationData.educational_secretory = shikkhaFields as EducationalPersonInfo;
  }

  // Basic validation for required fields
  const validateFields = () => {
    const errors = [];
    
    // Check if madrasahNames are present and not empty
    if (!registrationData.madrasahNames?.bengaliName) errors.push('বাংলা নাম আবশ্যক');
    if (!registrationData.madrasahNames?.arabicName) errors.push('আরবি নাম আবশ্যক');
    if (!registrationData.madrasahNames?.englishName) errors.push('ইংরেজি নাম আবশ্যক');
    
    // Check contact info
    if (!registrationData.communicatorName) errors.push('যোগাযোগকারীর নাম আবশ্যক');
    if (!registrationData.contactNo1) errors.push('মোবাইল নম্বর আবশ্যক');
    if (!registrationData.email) errors.push('ইমেইল আবশ্যক');
    
    // Check address fields
    if (!registrationData.address?.division) errors.push('বিভাগ আবশ্যক');
    if (!registrationData.address?.district) errors.push('জেলা আবশ্যক');
    if (!registrationData.address?.subDistrict) errors.push('উপজেলা আবশ্যক');
    if (!registrationData.address?.policeStation) errors.push('থানা আবশ্যক');
    if (!registrationData.address?.village) errors.push('গ্রাম আবশ্যক');
    if (!registrationData.address?.zone) errors.push('জোন আবশ্যক');
    if (!registrationData.address?.courierAddress) errors.push('চিঠি প্রেরণের মাধ্যম আবশ্যক');
    
    // Check madrasah information
    if (!registrationData.madrasah_information?.highestMarhala) errors.push('সর্বোচ্চ মারহালা আবশ্যক');
    
    return errors;
  };

  const validationErrors = validateFields();
  if (validationErrors.length > 0) {
    console.log('Validation errors:', validationErrors);
    throw new Error(`অনুগ্রহ করে নিম্নলিখিত তথ্য পূরণ করুন:\n${validationErrors.join('\n')}`);
  }

  console.log('Final registration data:', JSON.stringify(registrationData, null, 2));

  // Validate required fields based on user role
  const requiredFields = {
    'madrasahNames.bengaliName': 'মাদরাসার বাংলা নাম',
    'email': 'ইমেইল',
    'contactNo1': 'মোবাইল-১',
    'contactNo2': 'মোবাইল-২',
    'address.division': 'বিভাগ',
    'address.district': 'জেলা',
    'address.subDistrict': 'উপজেলা',
    'address.village': 'গ্রাম/মহল্লা',
    'address.zone': 'জোন',
    'address.courierAddress': 'চিঠি প্রেরণের মাধ্যম',
  };

  // Add additional required fields for non-admin users
  if (!isAdmin) {
    Object.assign(requiredFields, {
      'madrasahInformation.madrasahType': 'মাদরাসার ধরন',
      'madrasahInformation.highestMarhala': 'সর্বোচ্চ মারহালা',
      'madrasahInformation.totalStudents': 'মোট শিক্ষার্থী',
      'madrasahInformation.totalTeacherAndStuff': 'মোট শিক্ষক/শিক্ষিকা',
      'muhtamim.name': 'মুহতামিমের নাম',
      'muhtamim.contactNo': 'মুহতামিমের মোবাইল',
      'muhtamim.nidNumber': 'মুহতামিমের এনআইডি',
      'chairmanMutawalli.name': 'সভাপতি/মুতাওয়াল্লির নাম',
      'chairmanMutawalli.contactNo': 'সভাপতি/মুতাওয়াল্লির মোবাইল',
      'chairmanMutawalli.nidNumber': 'সভাপতি/মুতাওয়াল্লির এনআইডি',
      'educationalSecretary.name': 'শিক্ষা সচিবের নাম',
      'educationalSecretary.contactNo': 'শিক্ষা সচিবের মোবাইল',
      'educationalSecretary.nidNumber': 'শিক্ষা সচিবের এনআইডি'
    });
  }

  // Check for missing required fields
  const missingFields = Object.entries(requiredFields)
    .filter(([key]) => {
      const value = key.split('.').reduce((obj, k) => obj?.[k], registrationData as any);
      return !value;
    })
    .map(([_, label]) => label);

  if (missingFields.length > 0) {
    throw new Error(`অনুগ্রহ করে নিম্নলিখিত তথ্য পূরণ করুন:\n${missingFields.join('\n')}`);
  }

  // Make API call to create madrasah
  try {
    console.log('Making API call to:', '/madrasah/create-by-admin');
    console.log('Request data:', registrationData);
    const response = await post<MadrasahRegistrationResponse>('/madrasah/create-by-admin', registrationData);
    console.log('API Response:', response);
    return {
      success: response.success,
      message: response.message,
      data: response.data,
      madrasah: response.data?.madrasah
    };
  } catch (error: any) {
    console.error('API Error:', error);
    return {
      success: false,
      message: error?.response?.data?.message || 'মাদরাসা নিবন্ধন করতে সমস্যা হয়েছে',
      madrasah: {} as MadrasahRegistrationData
    };
  }
}

export async function getAllMadrasahs(
  page: number = 1,
  limit: number = 10,
  filters: Record<string, any> = {}
): Promise<MadrasahListResponse> {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters
    }).toString();

    const url = `/madrasah?select=-chairman_mutawalli,-educational_secretory,-madrasahResult,-user,-registrationToken,-registrationTokenExpiry&${queryParams}`;
    const response = await get<ServerResponse>(url);

    console.log('API Response:', response);

    // Ensure meta exists, if not use defaults
    const defaultMeta = {
      total: 0,
      page: 1,
      limit: 10
    };

    const responseMeta = response?.meta || defaultMeta;

    console.log('Response Meta:', responseMeta);

    const madrasahs = Array.isArray(response.data) ? response.data : [];

    return {
      success: response.success,
      message: response.message,
      data: madrasahs,
      meta: {
        totalItems: responseMeta.total,
        itemsPerPage: responseMeta.limit,
        totalPages: Math.ceil(responseMeta.total / responseMeta.limit),
        currentPage: responseMeta.page
      }
    };
  } catch (error) {
    console.error('Error fetching madrasahs:', error);
    throw error;
  }
}

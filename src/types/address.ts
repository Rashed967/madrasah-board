export interface MadrasahAddress {
  _id?: string;
  division?: string;
  district?: string;
  subDistrict?: string;
  policeStation?: string;
  village?: string;
  holdingNumber?: string;
  zone?: string;
  courierAddress?: string;
}

export interface AddressUpdateResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data?: MadrasahAddress;
}

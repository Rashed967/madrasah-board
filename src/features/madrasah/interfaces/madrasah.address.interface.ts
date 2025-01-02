export type TCourierAddress = "কুরিয়ার" | "ডাক";

export interface IMadrasahAddress {
    division: string;
    district: string;
    subDistrict: string;
    policeStation: string;
    village: string;
    holdingNumber: string;
    zone: string;
    courierAddress: TCourierAddress;
}

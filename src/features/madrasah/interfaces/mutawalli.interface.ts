export type TMutawalliDesignation = 
    | "সভাপতি" 
    | "চেয়ারম্যান" 
    | "মোতাওয়াল্লী" 
    | "সেক্রেটারি" 
    | "ডিরেক্টর" 
    | "প্রিন্সিপাল";

export interface IMutawalli {
    name: string;
    contactNo: string;
    nidNumber: string;
    designation: TMutawalliDesignation;
    code: string;
}

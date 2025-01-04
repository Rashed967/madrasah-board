export type TMutawalliDesignation = 
    | "সভাপতি" 
    | "মুতাওয়াল্লি" 
    | "সেক্রেটারি" ;

export interface IMutawalli {
    name: string;
    contactNo: string;
    nidNumber: string;
    designation: TMutawalliDesignation;
    code: string;
}

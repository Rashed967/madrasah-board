import { post } from "@/core/api/apiService"

interface StudentInfo {
    registrationNo: number,
    rollNo: number
}

interface MadrasahWiseAdmidCardInfo {
    madrasahId: string
    examId: string
}

// get personal admit card info 
export const getPersonalAdmitCardInfo = async (studentInfo: StudentInfo) => {
    try {
        const response = await post(`/admit-card/personal`, studentInfo)
        return response
    } catch (error: any) {
        return error
    }
}


export const getMadrasahWiseAdmitCardInfo = async (payload: MadrasahWiseAdmidCardInfo) => {
    try {
        const response = await post(`/admit-card/by-madrasah`, payload)
        return response
    } catch (error: any) {
        return error
    }
}
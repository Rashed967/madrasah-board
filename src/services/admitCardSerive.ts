import { post } from "@/core/api/apiService"

interface StudentInfo {
    registrationNo: number,
    rollNo: number
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
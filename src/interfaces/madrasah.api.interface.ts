import { IMadrasah } from "@/features/madrasah/interfaces";


// API response type
export default interface IMadrasahApiResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: IMadrasah | null;
}
// board info service file, functional

import { get, post, patch } from '@/core/api/apiService'
import { ApiResponse } from '@/core/api/apiService'
import IBoardInfo from './boardInfo.interface'

const MAIN_URL = process.env.NEXT_PUBLIC_MAIN_URL

export async function createBoardInfo(boardInfoData: IBoardInfo) {
  try {
    const response = await post(`/board-info`, boardInfoData)
    return response
  } catch (error) {
    return {
      success: false,
      data: null,
      message: 'বোর্ড তৈরি করতে সমস্যা হয়েছে'
    }
  }
}

// get single board info
// const id = '67bb52249fbe4879db797d88'; // fro dev db
const id = '67bb52249fbe4879db797d88'; // for production db
export async function getBoardInfo() {
  try {
    const response = await get(`/board-info/${id}`)
    return response
  } catch (error) {
    return {
      success: false,
      data: null,
      message: 'বোর্ড তৈরি করতে সমস্যা হয়েছে'
    }
  }
}

// update single board info
export async function updateBoardInfo(id: string, boardInfoData: IBoardInfo) {
  try {
    const response = await patch(`/board-info/${id}`, boardInfoData)
    return response
  } catch (error) {
    return {
      success: false,
      data: null,
      message: 'বোর্ড তৈরি করতে সমস্যা হয়েছে'
    }
  }
}

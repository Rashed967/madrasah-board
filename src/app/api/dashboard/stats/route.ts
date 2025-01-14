import { NextResponse } from 'next/server';
import { request } from '@/core/api/apiService';

export async function GET() {
  try {
    const response = await request('/dashboard/stats');

    return NextResponse.json({
      success: true,
      statusCode: 200,
      message: 'Dashboard stats fetched successfully',
      data: response.data
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      {
        success: false,
        statusCode: 500,
        message: 'Failed to fetch dashboard stats',
        data: null
      },
      { status: 500 }
    );
  }
}

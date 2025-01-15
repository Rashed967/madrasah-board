import { NextResponse } from 'next/server';
import { validateRequest } from '@/middleware/validateRequest';
import { zoneSchema } from '@/app/dashboard/zone/validations/zoneValidation';
import { request } from '@/core/api/apiService';

export async function POST(req: Request) {
  return validateRequest(zoneSchema, async (validatedData) => {
    try {
      const response = await request('/zones', {
        method: 'POST',
        body: JSON.stringify({
          name: validatedData.name,
          allDistricts: validatedData.allDistricts,
        }),
      });

      if (!response.success) {
        return NextResponse.json(
          { 
            success: false, 
            message: response.message || 'জোন তৈরি করতে সমস্যা হয়েছে' 
          },
          { status: response.statusCode || 500 }
        );
      }

      return NextResponse.json({
        success: true,
        data: response.data,
        message: 'জোন সফলভাবে তৈরি করা হয়েছে'
      });
    } catch (error) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'জোন তৈরি করতে সমস্যা হয়েছে' 
        },
        { status: 500 }
      );
    }
  })(req);
}

import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/middleware/validateRequest';
import { zoneSchema, ZoneInput } from './zone.validations';
import { createZone } from './zone.services';


export async function POST(req: NextRequest) {
  return validateRequest<ZoneInput>(zoneSchema, async (validatedData) => {
    try {
      const response = await createZone(validatedData);

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
      console.error('Error creating zone:', error);
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

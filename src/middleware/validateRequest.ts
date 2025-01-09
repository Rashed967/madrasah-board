import { NextResponse } from 'next/server';
import { z } from 'zod';

export function validateRequest<T>(
  schema: z.Schema<T>,
  handler: (validatedData: T) => Promise<NextResponse>
) {
  return async (request: Request) => {
    try {
      const body = await request.json();
      const validationResult = schema.safeParse(body);

      if (!validationResult.success) {
        const { errors } = validationResult.error;
        
        return NextResponse.json(
          { 
            success: false, 
            errors: errors.map(err => err.message)
          },
          { status: 400 }
        );
      }

      return handler(validationResult.data);
    } catch (error) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'ডেটা প্রসেস করতে সমস্যা হয়েছে' 
        },
        { status: 500 }
      );
    }
  };
}

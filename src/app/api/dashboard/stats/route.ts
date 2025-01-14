import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get all madrasah counts
    const [totalMadrasah, boysMadrasah, girlsMadrasah] = await Promise.all([
      prisma.madrasah.count({
        where: { isDeleted: false }
      }),
      prisma.madrasah.count({
        where: {
          isDeleted: false,
          madrasahType: 'boys'
        }
      }),
      prisma.madrasah.count({
        where: {
          isDeleted: false,
          madrasahType: 'girls'
        }
      })
    ]);

    return NextResponse.json({
      success: true,
      statusCode: 200,
      message: 'Dashboard stats fetched successfully',
      data: {
        totalMadrasah,
        totalBoysMadrasah: boysMadrasah,
        totalGirlsMadrasah: girlsMadrasah
      }
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

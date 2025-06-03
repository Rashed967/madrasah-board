import { NextResponse } from 'next/server'

// hello response route

export async function GET() {
  return NextResponse.json({ message: 'Hello, Next.js!' })
}
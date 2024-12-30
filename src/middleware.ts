import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  // Get the token from localStorage (client-side only)
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    // We'll handle auth check in the layout component
    return NextResponse.next()
  }
  
  return NextResponse.next()
}
 
export const config = {
  matcher: '/dashboard/:path*',
}

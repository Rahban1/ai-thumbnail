import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Check for required environment variables on API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const requiredEnvVars = ['GEMINI_API_KEY', 'OPENAI_API_KEY'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.error(`Missing environment variables: ${missingVars.join(', ')}`);
      return NextResponse.json(
        { 
          error: 'Server configuration error',
          message: 'Missing required API keys. Please check server configuration.' 
        },
        { status: 500 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*'
};
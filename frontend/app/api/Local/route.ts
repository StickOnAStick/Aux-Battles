import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const cookieStore = cookies();
    const token = cookieStore.get('token');
    
    return new Response('Hello, Next.js!', {
      status: 200,
      headers: { 'Set-Cookie': `token=${token}` }
    });
}
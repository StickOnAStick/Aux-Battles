import { NextResponse } from 'next/server'
import PocketBase from 'pocketbase';

export async function GET(request: Request) {
  
  const pb = new PocketBase('http://127.0.0.1:8091');

  const data = pb.authStore

  let date = new Date();
  date.setDate(date.getDate() + 2) //2 days from load

  const load = pb.authStore.exportToCookie({
    maxAge: 2 * 60 * 60 * 24, //2 days
    expires: date
  }, )

  return NextResponse.json({load});

}
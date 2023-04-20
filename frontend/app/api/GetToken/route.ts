import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers';

export async function GET(req: NextRequest, res: NextResponse){

    const cookieStore = cookies();
    const token = cookieStore.get('token');
    console.log("token: ", token);

    return NextResponse.json(token?.value);

}
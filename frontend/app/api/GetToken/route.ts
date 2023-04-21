import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers';

export async function GET(req: NextRequest, res: NextResponse){

    console.log("token:" , req.cookies.get('token'));
    
    const data = req.cookies.get('token');
    
    if(data?.value){
    return NextResponse.next()
    }
}
import { NextRequest, NextResponse } from "next/server";
import { generateToken } from "./global/functions/generateToken";

export function middleware(req: NextRequest, res: NextResponse) {
    //Beta: Add cookie token to signed users as well to prevent unnecessary re-login
    const response = NextResponse.next();

    const token = generateToken(40);

    response.cookies.set('token', token);
    console.log("response: ", response.cookies);

    return response;
}


export const config = {
    matcher: '/',
}
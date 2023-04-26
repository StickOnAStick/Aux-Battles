import { NextRequest, NextResponse } from "next/server";
import { generateToken } from "./global/functions/generateToken";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

export function middleware(req: NextRequest, res: NextResponse) {
    //Beta: Add cookie token to signed users as well to prevent unnecessary re-login
    const response = NextResponse.next();
    const existingCookie: ResponseCookie | undefined = req.cookies.get('token');
    console.log("Existing cookie: ", existingCookie?.value);
    if(!existingCookie?.value) {
        const token: string = generateToken(40);
        const expiry = new Date();
        expiry.setTime(expiry.getTime()+(2 * 24 * 60 * 60 * 1000))
        response.cookies.set('token', token, {expires: expiry});
    }
    return response;
}


export const config = {
    matcher: '/',
}
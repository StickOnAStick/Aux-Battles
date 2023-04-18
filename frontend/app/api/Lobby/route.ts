import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest){
    //check if the joining user's token (from cookie or auth model), is a valid token for the given lobby
    //Check if signed
    //Check token or Auth if signed
    //Fetch lobby data from pb
    //If valid, continue,
    //Else, navigate to home screen and prompt with: "Cannot join session"
    console.log(request);
    
    return NextResponse.json('Hello world', {
        status: 200
    })
} 
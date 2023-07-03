import { NextResponse } from "next/server";

export async function GET() {
    const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
    const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET
    const BASIC_TOKEN = (Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64"));

    try{
    const response = await fetch(`https://accounts.spotify.com/api/token?cache-bust=${Date.now()}`, {
        method: "POST",
        headers: {
            "Authorization": `Basic ${BASIC_TOKEN}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body:`grant_type=client_credentials`,
    });
    
    if(!response.ok) return NextResponse.json("Error fetching spotify key", {status: 500})
    const data = await response.json();
    
    return NextResponse.json(data, {status: 200});   
    }catch(error){
        return NextResponse.json("Error fetching spotify key", {status: 500})
    }
}
import {NextApiRequest, NextApiResponse} from 'next/types';
export async function GET(req: NextApiRequest, res: NextApiResponse) {
    try{
        const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
        const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET
        const BASIC_TOKEN = (Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64"));

        const response = await fetch(`https://accounts.spotify.com/api/token?cache-bust=${Date.now()}`, {
            method: "POST",
            headers: {
                "Authorization": `Basic ${BASIC_TOKEN}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body:`grant_type=client_credentials`,
        });
        
        const data = await response.json();
        res.status(200).json(data);
    }
    catch(error){
        if(error instanceof Error){
            res.status(500).json({error: error.message})
        }
    }
}
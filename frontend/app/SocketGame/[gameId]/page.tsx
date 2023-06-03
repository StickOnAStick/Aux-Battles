import { ExpandedGameData } from "@/global/types/Unions";
import PocketBase from 'pocketbase';
import { redirect } from 'next/navigation';
import { io } from "socket.io-client";
import { cookies } from 'next/headers'
import { PackData, Packs } from "@/global/types/Packs";

/**
 * Gets PB game Data.
 * 
 * @param gameId PB ID of the game 
 */
async function getGameInfo(gameId: string): Promise<ExpandedGameData> {
    const pb = new PocketBase(process.env.POCKETBASE_URL);
    const data: ExpandedGameData = await pb.collection('games').getOne(gameId, {
        expand: "guests,players"
    });
    if(!data.id) return redirect('/');
    return data;
}

async function fetchPackData(gameData: ExpandedGameData): Promise<PackData>{
    const pb = new PocketBase('http://127.0.0.1:8091');
    const pack: Packs = await pb.collection('packs').getOne(gameData.pack);
    if(!pack.id) return redirect('/');
    return pack.packData;
}


export default async function Game({
    params
}: {
    params: {
        gameId: string,
    }
}){

    const cookieStore = cookies();
    const token = cookieStore.get('token'); 
    if(!token){
        new Error('Please enable cookies to continue');
        return redirect('/');
    }
    const gameData = await getGameInfo(params.gameId);
    const [packData, {isHost, localUser}] = await Promise.all([
        fetchPackData(data),
        getUserInfo(data, token.value)
    ])
    
    const socket = io('http://localhost:8080');
    socket.emit('Client-Ready', )

    return (
        <div>
            <ol>
                <li>{params.gameId}</li>
                <li>{gameData.guests[0]}</li>
            </ol>
            
        </div>
    );
}
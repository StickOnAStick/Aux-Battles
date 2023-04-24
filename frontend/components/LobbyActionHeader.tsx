'use client';

import { Packs } from "@/global/types/Packs";
import Image from 'next/image';
import { useEffect, useState } from "react";
import PocketBase, { LocalAuthStore } from 'pocketbase';
import { GameData, GameDataPayload } from "@/global/types/GameData";
import { Guests } from "@/global/types/Guests";
import { useRouter } from "next/navigation";
import { LobbyData } from "@/global/types/LobbyData";
import { Users } from "@/global/types/Users";

async function createGame(
    data: LobbyData,
    token: string | undefined, 
    setError: React.Dispatch<React.SetStateAction<Error | null>>,
    router: typeof useRouter.prototype,    
)
{
    if(!token) return setError(new Error("Please Enable cookies to continue"));

    const pb = new PocketBase("http://127.0.0.1:8091");
    const model = pb.authStore.model;

    if(!model){ //guest

        const localUser: Guests = await pb.collection('guests').getFirstListItem(`token="${token}"`);
        if(!localUser) return router.push('/');
        if(localUser.id !== data.host) return setError(new Error("Only host can start!"));
 
        const gameData: GameDataPayload = {
            id: data.id,
            type: "Local",
            pack: "w4oudqe45it58g9", //Change to selected pack when feature is added
            spotApiKey: 'c8c748a25aeb4392bf458167ae5deccb',
            round: 1,
            players: data.players,
            guests: data.guests,
        }

        await pb.collection('games').create(gameData)
        .then((response)=> router.push(`/Game/${response.id}`))
        .catch((e)=> setError(new Error("Failed to create game")));

    }else{ //user
        if(model.id === data.host){
            await pb.collection('game').create()
        }
    }
}


export default function LobbyActionHeader({
    data,
    localToken
}:{
    data: LobbyData
    localToken: string | undefined,
}){
    const router = useRouter();

    const [error, setError] = useState<Error | null>(null);
    const [screenWidth, setScreenWidth] = useState<number>(0);

    useEffect(()=>{
        setScreenWidth(window.innerWidth);
    },[]);


    return (
        <div className=" flex flex-col gap-2 justify-between border-b-2 border-primary-content pb-4 border-opacity-50">
            <div className="flex">
                    <Image src={`http://127.0.0.1:8091/api/files/packs/${data?.expand.packs.at(0).id as string}/${data?.expand.packs.at(0).image as string}`} 
                            width={screenWidth >= 500 ? 100 : 60} height={screenWidth >= 500 ? 100 : 60} alt="Pack Image" 
                            className='rounded-md' style={{width: 'auto', height: '100%'}} />
                <h1 className='font-bold xs:text-3xl text-xl'>{data.expand.packs.at(0).name}</h1>
            </div>
            <button className='btn btn-success btn-md xs:btn-lg bg-opacity-70 rounded-md my-1 text-white font-bold tracking-wide'
                onClick={()=> createGame(data, localToken, setError, router) }>
                Start
            </button>
            { error && 
                <div className="btn btn-warning font-bold tracking-wide text-md xs:text-lg" onClick={()=>setError(null)}>{error.message}</div>
            }
        </div>
    );
}
'use client';
import Image from 'next/image';
import { useEffect, useState } from "react";
import PocketBase from 'pocketbase';
import {  GameDataPayload } from "@/global/types/GameData";
import { Guests } from "@/global/types/Guests";
import { useRouter } from "next/navigation";
import { LobbyData } from "@/global/types/LobbyData";
import { Users } from '@/global/types/Users';
import { update } from 'react-spring';

async function createGame(
    data: LobbyData,
    token: string | undefined, 
    setError: React.Dispatch<React.SetStateAction<Error | null>>,
    router: typeof useRouter.prototype,  
)
{
    if(!token) return setError(new Error("Please Enable cookies to continue"));

    const pb = new PocketBase("http://127.0.0.1:8091");
    const updatedLobby: LobbyData = await pb.collection('lobbys').getOne(data.id);
    if((updatedLobby.guests.length + updatedLobby.players.length) < 2) return setError(new Error("Invite players to play"));
    
    const model = pb.authStore.model;
    //Update game select 

    
    if(!model){ //guest -> Move to api to prevent API Key leaking
        const localUser: Guests = await pb.collection('guests').getFirstListItem(`token="${token}"`);
        
        if(!localUser) return router.push('/');
        if(localUser.id !== data.host) return setError(new Error("Only host can start!"));
        
        const gameData: GameDataPayload = { 
            id: data.id,
            type: "Local",
            pack: "w4oudqe45it58g9", //Change to selected pack when feature is added
            spotApiKey: 'c8c748a25aeb4392bf458167ae5deccb', //
            round: 1,
            players: updatedLobby.players,
            guests: updatedLobby.guests,
        }
        let promiseArray: Promise<Guests | Users | undefined>[] = []; //parallel requests
        
        console.log("Game Creation data: " , updatedLobby);
        
        for(const playerId of updatedLobby.players) {
            console.log("Player id: ", playerId);
            const localRequest = new PocketBase('http://127.0.0.1:8091');
            promiseArray.push(pb.collection('users').update(playerId, { currentGame: gameData.id, currentLobby: ""  }));
        }
        for(const guestId of updatedLobby.guests) {
            console.log("Guest Id: ", guestId)
            promiseArray.push(pb.collection('guests').update(guestId, { currentGame: gameData.id, currentLobby: ""  }));
        }

        await Promise.all(promiseArray)
        .catch((e)=>{console.log("Promise array: ", e);});

        await pb.collection('games').create(gameData)
        .then(async (e)=> {
            await pb.collection('lobbys').update(data.id, {gameStart: true});
            router.replace(`/Game/${gameData.id}`);
        })
        .catch((e)=> setError(new Error("Failed to create game")));
        
        console.log("Hit after navigation")
        pb.collection('lobbys').delete(data.id);
    }else{ //user
        if(model.id === data.host){
            //await pb.collection('game').create()
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
        return () => { setError(null) }
    },[router, data]);


    return (
        <div className=" flex flex-col md:flex-row justify-between border-b-2 border-primary-content pb-4 border-opacity-80">
            <div className="flex gap-3 items-center">
                    <Image src={`http://127.0.0.1:8091/api/files/packs/${data?.expand.packs.at(0).id as string}/${data?.expand.packs.at(0).image as string}`} 
                            width={screenWidth >= 500 ? 100 : 60} height={screenWidth >= 500 ? 100 : 60} alt="Pack Image" 
                            className='rounded-md' style={{width: 'auto', height: '100%'}} />
                <h1 className='font-bold xs:text-3xl text-3xl text-center'>{data.expand.packs.at(0).name}</h1>
            </div>
            <div className='flex flex-col items-center'>
                <button className='btn btn-success btn-md xs:btn-lg bg-opacity-70 w-f rounded-md my-1 text-white font-bold tracking-wide'
                    onClick={()=> createGame(data, localToken, setError, router) }>
                    Start
                </button>
                { error && 
                    <div className="btn btn-warning btn-sm xs:btn-md font-bold tracking-wide text-md xs:text-lg" onClick={()=>setError(null)}>{error.message}</div>
                }
            </div>
        </div>
    );
}
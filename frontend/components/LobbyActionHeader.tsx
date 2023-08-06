'use client';
import Image from 'next/image';
import { useEffect, useState } from "react";
import PocketBase from 'pocketbase';
import {  GameDataPayload } from "@/global/types/GameData";
import { Guests } from "@/global/types/Guests";
import { useRouter } from "next/navigation";
import { LobbyData } from "@/global/types/LobbyData";
import { GameState } from '@/global/types/GameSocket';
import { socket } from '@/global/functions/socket';
import { Packs } from '@/global/types/Packs';
import LoadingSpinner from './LoadingSpinner';

async function createGame(
    data: LobbyData,
    token: string | undefined, 
    setError: React.Dispatch<React.SetStateAction<Error | null>>,
    router: typeof useRouter.prototype,  
)
{
    if(!token) return setError(new Error("Please Enable cookies to continue"));

    const pb = new PocketBase(process.env.POCKETBASE_URL);
    const updatedLobby: LobbyData = await pb.collection('lobbys').getOne(data.id);
    if((updatedLobby.guests.length + updatedLobby.players.length) <= 2) return setError(new Error("Invite players to play"));
    
    const model = pb.authStore.model;
    if(!model){ //guest -> Move to api route to prevent API Key leaking
        const localUser: Guests = await pb.collection('guests').getFirstListItem(`token="${token}"`);
        
        if(!localUser.id) return router.push('/');
        if(localUser.id !== data.host) return setError(new Error("Only host can start!"));

        const clientIdList = updatedLobby.players.concat(updatedLobby.guests);

        const gameData: GameDataPayload = { 
            id: data.id,
            type: "Local",
            pack: "81lq23qhz63z0w0", //Change to selected pack when feature is added
            round: 1,
            players: updatedLobby.players,
            guests: updatedLobby.guests,
            scores: 
                {
                    ids: clientIdList,
                    scores: new Array<number>(updatedLobby.guests.length + updatedLobby.players.length)
                },
            host: localUser.id,
        }

        const game = await pb.collection('games').create(gameData);
        if(!game.id) return setError(new Error("Could not create game"));
        await pb.collection('lobbys').update(game.id, {gameStart: true});
        
        socket.emit("Create-Game", {
            id: game.id,
            clients: clientIdList,
            connectedClients: [],
            activePlayers: ["", ""],
            queuedSongs: [null, null],
            pack: {
                id: data.expand.packs.at(0).id,
                name: data.expand.packs.at(0).name,
                data: data.expand.packs.at(0).packData
            },
            playerVotes: [[] as string[], [] as string[]],
            scores: {
                ids: clientIdList,
                scores: new Array<number>(clientIdList.length)
            },
            roundTimerExpiry: 0,
            voteTimerExpiry: 0,
            currentRound: 0, // Start at round 0 for display pack to work
            maxRounds: 15,
        } as GameState);

        router.replace(`/Game/${game.id}`);
        setTimeout(()=>{
            pb.collection('lobbys').delete(data.id);
        },3000);
        return;
        
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
    const [loading, setLoading] = useState<boolean>(false);
    const [packSelection, setPackSelection] = useState<Packs | null>(null)

    useEffect(()=>{
        setScreenWidth(window.innerWidth);
        return () => { setError(null) }
    },[router, data]);


    return (
        <div className=" flex flex-row justify-between border-b-2 border-primary-content pb-4 border-opacity-80">
            <div className="flex gap-3 items-center">
                    <Image src={`${process.env.POCKETBASE_URL}/api/files/packs/${data?.expand.packs.at(0).id as string}/${data?.expand.packs.at(0).image as string}`} 
                            width={screenWidth >= 500 ? 100 : 60} height={screenWidth >= 500 ? 100 : 60} alt="Pack Image" 
                            className='rounded-md' style={{width: 'auto', height: '100%'}} />
                <h1 className='font-bold xs:text-3xl text-2xl text-center'>{data.expand.packs.at(0).name}</h1>
            </div>
            <div className='flex flex-col gap-1 items-center w-28'>
                <button className='btn btn-success btn-md w-full xs:btn-lg bg-opacity-70 rounded-md my-1 text-white font-bold tracking-wide'
                    onClick={()=>{ createGame(data, localToken, setError, router); setLoading(true); const delay = setTimeout(()=>setLoading(false),1500); clearTimeout(delay)}}>
                    {
                        loading ? 
                        <LoadingSpinner/>
                        :
                        <span>Start</span>
                    }
                </button>
                <button className='btn btn-sm btn-primary rounded-md text-accent font-bold tracking-wide'>
                    Change pack
                </button>
                { error && 
                    <div className="btn btn-warning btn-sm xs:btn-md font-bold tracking-wide text-md xs:text-lg" onClick={()=>setError(null)}>{error.message}</div>
                }
            </div>
        </div>
    );
}
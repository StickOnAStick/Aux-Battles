'use client';
import Image from 'next/image';
import { Suspense, useEffect, useState } from "react";
import PocketBase, { RecordSubscription } from 'pocketbase';
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
    packSelection: Packs, 
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
            pack: packSelection.id,
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

async function checkIsHost(data: LobbyData, localToken: string | undefined, setIsHost: React.Dispatch<React.SetStateAction<boolean>>): Promise<void> {

    const pb = new PocketBase(process.env.POCKETBASE_URL);
    console.log("Hit model check: ", pb.authStore.model, "\nPb modelId: ", pb.authStore.model?.id, "\tHost Id: ", data.host)

    if(pb.authStore.model){
        console.log("Hit model check: ", pb.authStore.model.id == data.host, "\nPb modelId: ", pb.authStore.model.id, "\tHost Id: ", data.host)
        setIsHost(pb.authStore.model.id == data.host);
        return
    }
    const guest = await pb.collection('guests').getFirstListItem(`token="${localToken}"`)
    .catch((e)=>console.log("Could not find user"));
    if(!guest){return setIsHost(false)}
    return setIsHost(guest.id == data.host);
}

export default function LobbyActionHeader({
    data,
    localToken,
}:{
    data: LobbyData
    localToken: string | undefined,
}){
    
    const router = useRouter();
    
    const [error, setError] = useState<Error | null>(null);
    const [screenWidth, setScreenWidth] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [packSelection, setPackSelection] = useState<Packs>(data.expand.selectedPack as Packs);
    const [isHost, setIsHost] = useState<boolean>(false);
    

    useEffect(()=>{
        checkIsHost(data, localToken, setIsHost);
        setScreenWidth(window.innerWidth);
        return () => { setError(null) }
    },[router, data, localToken]);


    return (
        <div className=" flex flex-row justify-between border-b-2 border-primary-content pb-4 border-opacity-80">
            <div className="flex gap-3 items-center">
                    <Image src={`${process.env.POCKETBASE_URL}/api/files/packs/${packSelection.id as string}/${packSelection.image as string}`} 
                            width={screenWidth >= 500 ? 100 : 60} height={screenWidth >= 500 ? 100 : 60} alt="Pack Image" 
                            className='rounded-md overflow-clip' style={{width: 'auto', height: '100%'}} />
                <div className='flex flex-col justify-start gap-3'>
                    <h1 className='font-bold xs:text-3xl text-2xl'>{packSelection.name}</h1>
                    <p>
                        {packSelection?.desc}
                    </p>
                </div>
            </div>
            <div className='flex flex-col gap-1 items-center w-28'>
                <button className='btn btn-success btn-md w-full xs:btn-lg bg-opacity-70 rounded-md my-1 text-white font-bold tracking-wide'
                    onClick={()=>{ createGame(data, localToken, packSelection, setError, router); setLoading(true); const delay = setTimeout(()=>setLoading(false),1500); clearTimeout(delay)}}>
                    {
                        loading ? 
                        <LoadingSpinner/>
                        :
                        <span>Start</span>
                    }
                </button>
                {
                    isHost &&
                    <label htmlFor='select-pack' className='btn btn-sm btn-accent rounded-md font-bold tracking-wide'>
                        Change pack
                    </label>
                }
                
                
                <Suspense fallback={<></>}>
                <input type='checkbox' id="select-pack" className='modal-toggle'/>
                <div className='modal'>
                    <div className='modal-box'>
                        <h3 className='font-bold'>Select a pack!</h3>
                        <div className='flex overflow-scroll scroll-smooth scrollbar carousel-center max-w p-4 space-x-4 bg-base-100 rounded-box'>
                            {
                                data.expand.packs.map((pack: Packs, index: number) => {
                                    return (
                                        <label htmlFor='select-pack' onClick={()=>{setPackSelection(pack); updatePackSelection(data.id, pack.id)}} className='carousel-item bg-base-200 p-1 rounded-lg' key={pack.id} id={`slide:${index}`}>
                                            <div className='flex flex-col'>
                                                <Image priority={false} src={`${process.env.POCKETBASE_URL}/api/files/packs/${pack.id as string}/${pack.image as string}`}
                                                width={screenWidth >= 500 ? 100 : 80} height={screenWidth >= 500 ? 100 : 80} alt="Pack Image" className='overflow-clip h-full w-full aspect-square'
                                                />
                                                <h3 className='text-center font-semibold'>{pack.name}</h3>
                                            </div>
                                        </label>
                                    );
                                })
                            }
                        </div>
                        <div className='flex justify-start'>
                            <div className='modal-action'>
                                <label htmlFor='select-pack' className='btn btn-accent'>Close</label>
                            </div>
                        </div>
                    </div>
                </div>
                </Suspense>

                { error && 
                    <div className="btn btn-warning btn-sm xs:btn-md font-bold tracking-wide text-md xs:text-lg" onClick={()=>setError(null)}>{error.message}</div>
                }
            </div>
        </div>
    );
}

async function updatePackSelection(lobbyId: string, packId: string){
    const pb = new PocketBase(process.env.POCKETBASE_URL);
    await pb.collection('lobbys').update(lobbyId, {selectedPack: packId});
}
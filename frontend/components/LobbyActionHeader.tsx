'use client';
import Image from 'next/image';
import { Suspense, useEffect, useState } from "react";
import PocketBase, { RecordSubscription, UnsubscribeFunc } from 'pocketbase';
import {  GameDataPayload } from "@/global/types/GameData";
import { Guests } from "@/global/types/Guests";
import { useRouter } from "next/navigation";
import { GameData } from '@/global/types/GameData';
import { LobbyData } from "@/global/types/LobbyData";
import { GameState } from '@/global/types/GameSocket';
import { socket } from '@/global/functions/socket';
import { Packs } from '@/global/types/Packs';
import LoadingSpinner from './LoadingSpinner';
import { ExpandedLobbyData } from '@/global/types/Unions';

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

        const game = await pb.collection('games').create<GameData>(gameData);
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
            const clientIdList = updatedLobby.players.concat(updatedLobby.guests);

            // Create pocketbase record
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
                hostUser: model.id,
            }
            console.log(gameData);
            const game = await pb.collection('games').create<GameData>(gameData)
            .catch((e)=>console.log(e));
            if(!game) return setError(new Error("Could not create game"));
            await pb.collection('lobbys').update(game.id, {gameStart: true});

            // Create socketIo map 
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
        }
    }
}

async function checkIsHost(data: LobbyData, localToken: string | undefined, setIsHost: React.Dispatch<React.SetStateAction<boolean>>): Promise<void> {

    const pb = new PocketBase(process.env.POCKETBASE_URL);
    if(pb.authStore.model){
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
    data: ExpandedLobbyData,
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
        return () => { setError(null); setLoading(false); }
    },[router, data, localToken]);

    useEffect(()=>{
        const pb = new PocketBase(process.env.POCKETBASE_URL);

        console.log("Subscribing to: ", data);
        
        const unsubscribe = pb.collection('lobbys').subscribe(data.id, 
            async function (e: RecordSubscription<LobbyData>){
                if(!e.record) {closeConnections(unsubscribe); return;}
                console.log(e);
                console.log(data);

                const pack = data.expand.packs.find(pack => e.record?.selectedPack == pack.id);
                if(!pack) return setError(new Error("Pack is not currently available"));
                setPackSelection(pack);
        })
        async function closeConnections(unsubscribe: Promise<UnsubscribeFunc | void>){
            const unsub = await unsubscribe;
            if(!unsub) return;
            unsub();
        }
        return () => {
            closeConnections(unsubscribe);
        }
    })


    return (
        <div className=" flex flex-col sm:flex-row justify-center sm:justify-between border-b-2 items-center border-primary-content mb-4 border-opacity-80 w-full pb-4">
            <div className="flex flex-col sm:flex-row sm:w-full gap-3 items-center justify-start">
                    <Image src={`${process.env.POCKETBASE_URL}/api/files/packs/${packSelection.id as string}/${packSelection.image as string}`} 
                            width={screenWidth >= 500 ? 120 : screenWidth-20} height={screenWidth >= 500 ? 120 : screenWidth-20} alt="Pack Image" 
                            className='rounded-md overflow-clip aspect-square' style={{width: 'auto', height: '100%'}} />
                <div className='flex flex-col flex-grow w-full items-center sm:items-start justify-between gap-1 mb-2'>
                    <h1 className='font-bold sm:text-4xl text-2xl break-all overflow-hidden'>
                        {packSelection.name}
                    </h1>
                    <p className=' sm:overflow-visible w-10/12 text-md'>
                        {packSelection?.desc}
                    </p>
                </div>
            </div>
            <div className='flex flex-col gap-1 items-end justify-end w-full'>
                <button className='btn btn-success btn-md w-full sm:w-1/4 md:w-1/5 bg-opacity-70 rounded-md my-1 text-white font-bold tracking-wide'
                    onClick={()=>{ createGame(data, localToken, packSelection, setError, router); setLoading(true); const delay = setTimeout(()=>setLoading(false),1500); clearTimeout(delay)}}>
                    {
                        loading ? 
                        <LoadingSpinner/>
                        :
                        <span className='text-xl'>Start</span>
                    }
                </button>
                {
                    isHost &&
                    <label htmlFor='select-pack' className='btn w-full sm:w-1/4 md:w-1/5  btn-sm btn-accent rounded-md font-bold text-primary tracking-wide'>
                        Change pack
                    </label>
                }
                
                
                <Suspense fallback={<></>}>
                <input type='checkbox' id="select-pack" className='modal-toggle'/>
                <div className='modal'>
                    <div className='modal-box'>
                        <h3 className='font-bold text-2xl'>Select a pack!</h3>
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
                <div className='flex w-full justify-center'>
                    <div className="btn btn-warning btn-sm xs:btn-md w-full font-bold tracking-wide text-md xs:text-md" 
                        onClick={()=>{setError(null); setLoading(false)}}>
                        {error.message}
                    </div>
                </div>
                }
            </div>
        </div>
    );
}

async function updatePackSelection(lobbyId: string, packId: string){
    const pb = new PocketBase(process.env.POCKETBASE_URL);
    await pb.collection('lobbys').update(lobbyId, {selectedPack: packId});
}
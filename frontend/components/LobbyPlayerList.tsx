'use client';

import { LobbyData } from "@/global/types/LobbyData";
import { Users } from "@/global/types/Users";
import { Guests, GuestsPayload } from "@/global/types/Guests";
import ActionCard from "./ActionCard";
import { useEffect, useState } from "react";
import { UsersOrGuests } from "@/global/types/Unions";
import PocketBase, { RecordSubscription, UnsubscribeFunc } from 'pocketbase';
import { ExpandedLobbyData } from "@/global/types/Unions";
import { useRouter } from 'next/navigation';
import { socket } from "@/global/functions/socket";
import Lobby from "@/app/(Game Select)/[lobbyId]/page";

export default function LobbyPlayerList({
    initalState,
    localToken
}:{
    initalState: ExpandedLobbyData,
    localToken: string 
}){
    const router = useRouter();
    const [playerList, setPlayerList] = useState<(Users | Guests)[]>();
    const [playerCount, setPlayerCount] = useState<number>(initalState.players.length + initalState.guests.length);

    useEffect( () => {
         
        const pb = new PocketBase(process.env.POCKETBASE_URL);
         //init & subscribe
        const unsubscribe = pb.collection('lobbys').subscribe(initalState.id, 
            function (e: RecordSubscription<LobbyData>) {
                if(!e.record) router.push("/");
                update(e.record);
        });

        async function closeConnections(unsubscribe: Promise<UnsubscribeFunc | void>){
            const unsub = await unsubscribe;
            if(!unsub) return router.push("/");
            unsub()
        };

        async function update(data: LobbyData){
            setPlayerCount(data.players.length + data.guests.length);
            await pb.collection('lobbys').getOne(data.id, {
                expand: "guests,players,packs"
            }).then( async (res) => {
                socket.on("ConnectToGame", () => {
                    router.replace(`/Game/${data.id}`)
                })
                //@ts-ignore
                const combined: UsersOrGuests[] = [...(res.expand?.players ?? []), ...(res.expand?.guests ?? [])]
                setPlayerList(combined);
                return;
            })
            .catch((e)=> {
                router.replace('/');
                return;
            })  
        }
        
        return () => {
            closeConnections(unsubscribe);
        }
    }, [playerList, initalState, router, localToken])

    return(
        <div className='font-bold text-2xl flex justify-center gap-4 mt-3 mb-5 w-full'>
            <div className="flex flex-col sm:w-1/2 w-full gap-4">
                <span className="flex justify-between w-full">
                    Players
                    <h1>{playerCount}/20</h1>
                </span>
                <ul className=' font-medium rounded-md text-xl flex flex-col items-center gap-5'>
                        { //For joining players
                            playerList?.map((user: Users | Guests) => {
                                if(user.avatar){
                                    return <ActionCard typeData={user as Users} key={user.id} host={ user.id === initalState.host }/> 
                                }
                                return <ActionCard typeData={user as Guests} key={user.id} host={ user.id === initalState.host}/>
                            })
                        }
                        {/* Users */}
                        {!playerList && initalState?.expand.players?.map((user: Users) => {
                            return (
                                <ActionCard typeData={user} key={user.id} host={ user.id === initalState.host }/>
                            );
                        })} 
                        {/**Guests */}
                        {!playerList && initalState?.expand.guests?.map((guest: Guests) => {
                            return (
                                <ActionCard typeData={guest} key={guest.id} host={ guest.id === initalState.host }/>
                            );
                        })}
                </ul>
            </div>
        </div>
    );

}
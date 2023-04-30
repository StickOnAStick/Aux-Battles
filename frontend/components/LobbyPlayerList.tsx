'use client';

import { LobbyData } from "@/global/types/LobbyData";
import { Users } from "@/global/types/Users";
import { Guests } from "@/global/types/Guests";
import ActionCard from "./ActionCard";
import { useEffect, useState } from "react";
import { UsersOrGuests } from "@/global/types/Unions";
import PocketBase, { RecordSubscription, UnsubscribeFunc } from 'pocketbase';
import { ExpandedLobbyData } from "@/global/types/Unions";
import { useRouter } from 'next/navigation';

export default function LobbyPlayerList({
    initalState
}:{
    initalState: ExpandedLobbyData
}){
    const router = useRouter();
    const [playerList, setPlayerList] = useState<(Users | Guests)[]>();
    const [playerCount, setPlayerCount] = useState<number>(1);

    useEffect( () => {
        const pb = new PocketBase('http://127.0.0.1:8091');

        async function update(data: LobbyData){
            setPlayerCount(data.players.length + data.guests.length);
            await pb.collection('lobbys').getOne(data.id, {
                expand: "guests,players,packs"
            }).then( async (res) => {
                
                if(res.gameStart){
                    const checkIfGame = await pb.collection('games').getOne(res.id);
                    if(!checkIfGame) {
                        router.replace('/');
                        return;
                    }
                    router.replace(`/Game/${checkIfGame.id}`);
                    return;
                }
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

        async function closeConnections(unsubscribe: Promise<UnsubscribeFunc | void>){
            const unsub = await unsubscribe;
            if(!unsub) return router.push("/");
            unsub()
        }
        //init & subscribe
        const unsubscribe = pb.collection('lobbys').subscribe(initalState.id, 
            function (e: RecordSubscription<ExpandedLobbyData>) {
                if(!e.record) router.push("/"); //Handle client side leaving on lobby close as well as game start
                //Add game start logic
                update(e.record);
        });

        setPlayerCount(initalState.players.length + initalState.guests.length)
        return () => {
            closeConnections(unsubscribe);
        }
    }, [playerList, initalState, router])

    return(
        <div className='font-bold text-2xl flex flex-col gap-4 mt-3 mb-5'>
            <span className="flex justify-between">
                Players
                <h1>{playerCount}/20</h1>
            </span>
            <ul className=' font-medium rounded-md p-3 text-xl flex flex-col gap-5'>
                    {
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
    );

}
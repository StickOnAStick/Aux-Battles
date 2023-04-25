'use client';

import { LobbyData } from "@/global/types/LobbyData";
import { Users } from "@/global/types/Users";
import { Guests } from "@/global/types/Guests";
import ActionCard from "./ActionCard";
import { useEffect, useState } from "react";
import { UsersOrGuests } from "@/global/types/Unions";
import PocketBase, { RecordSubscription } from 'pocketbase';
import { ExpandedLobbyData } from "@/global/types/Unions";

export default function LobbyPlayerList({
    initalState
}:{
    initalState: ExpandedLobbyData
}){
    
    const [playerList, setPlayerList] = useState<UsersOrGuests[] | undefined>(undefined);

    useEffect( ()=>{
        const pb = new PocketBase('http://127.0.0.1:8091');
        async function update(data: ExpandedLobbyData){
            const combined = [...data?.expand.players, ...data?.expand.guests]
            console.log(combined);
            setPlayerList(combined);
        }   

        pb.collection('lobbys').subscribe(initalState.id, function (e: RecordSubscription<ExpandedLobbyData>) {
            console.log(e.record);
            update(e.record);
        });

        return () => {
            pb.collection('lobbys').unsubscribe(initalState.id);
        }
        
    }, [playerList, initalState.id])

    return(
        <div className='font-bold text-2xl flex flex-col gap-4 mt-3 mb-5'>
            Players
            <ul className=' font-medium rounded-md p-3 text-xl flex flex-col gap-5'>
                {/**Signed users */}
                {initalState?.expand.players?.map((user: Users) => {
                    return (
                        <ActionCard typeData={user} key={user.id} host={ user.id === initalState.host }/>
                    );
                })}
                {/**Guests */}
                {initalState?.expand.guests?.map((guest: Guests) => {
                    return (
                        <ActionCard typeData={guest} key={guest.id} host={ guest.id === initalState.host }/>
                    );
                })}  
            </ul>
        </div>
    );

}
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

    useEffect( ()=>{
        const pb = new PocketBase('http://127.0.0.1:8091');

        async function update(data: LobbyData){
            const userData: ExpandedLobbyData = await pb.collection('lobbys').getOne(data.id, {
                expand: "guests,players,packs"
            })
            const combined: UsersOrGuests[] = [...(userData.expand?.players ?? []), ...(userData.expand?.guests ?? [])]
            setPlayerList(combined);
        }

        async function closeConnections(unsubscribe: Promise<UnsubscribeFunc | void>){

            const unsub = await unsubscribe;
            if(!unsub) return router.push("/");
            unsub().then((res)=> console.log("Response: ", res))
            .catch((e)=>console.log("unsubError", e));
        }
        //init & subscribe
        const unsubscribe = pb.collection('lobbys').subscribe(initalState.id, 
            async function (e: RecordSubscription<ExpandedLobbyData>) {
                console.log("Subscription: ", e.record)
                if(!e.record) { //Handle client side leaving on lobby close as well as game start
                    router.push("/");//Add game start logic
                }
                update(e.record);
        })
        .catch((e)=>{
            console.log(e);
        })

        return () => {
            closeConnections(unsubscribe);
        }
    }, [playerList, initalState.id, router])

    return(
        <div className='font-bold text-2xl flex flex-col gap-4 mt-3 mb-5'>
            Players
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
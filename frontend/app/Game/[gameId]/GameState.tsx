'use client';
import PocketBase, { UnsubscribeFunc, RecordSubscription} from 'pocketbase';
import { useEffect, useState } from 'react';
import { ExpandedGameData, UsersOrGuests } from '@/global/types/Unions';

export default function GameState({
    gameId,
    initialData,
    activePlayers,
    timer
    
}:{
    gameId: string,
    initialData: ExpandedGameData,
    activePlayers: UsersOrGuests[],
    timer: number | null
    
}){
    const [active, setActivePlayers] = useState<UsersOrGuests[]>(activePlayers);
    const [time, setTime] = useState<number | null>(timer);

    useEffect(() => {
       
        if(time != null){
            setInterval((iter)=> {
                setTime(time-1);
            }, 1000)
        }
    },[timer, time])


    return(
        <div className="absolute bottom-5 left-0 flex justify-between w-full lg:w-9/12 px-8">
            <div className="bg-base-300 border-2 border-primary border-opacity-60 rounded-lg w-3/12 md:w-1/6 text-center align-middle py-3 text-lg sm:text-xl font-bold overflow-hidden">{active[0] && active[0].username}</div>
            <div className="w-1/2 md:w-4/6 flex justify-center">
                {timer && 
                    <span className="countdown font-mono text-4xl">
                    {/* @ts-ignore */}
                        <span style={{"--value":time}}></span>
                    </span>
                }
            </div>
            <div className="bg-base-300 border-2 border-primary border-opacity-60 rounded-lg w-3/12 md:w-1/6 text-center align-middle py-3 text-lg sm:text-xl font-bold overflow-hidden">{active[1] && active[1].username}</div>
        </div>
    );
}
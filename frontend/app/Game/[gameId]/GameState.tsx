'use client';
import PocketBase, { UnsubscribeFunc, RecordSubscription} from 'pocketbase';
import { useState } from 'react';
import { ExpandedGameData, UsersOrGuests } from '@/global/types/Unions';

export default function GameState({
    gameId,
    initialData,
    activePlayers
    
}:{
    gameId: string,
    initialData: ExpandedGameData,
    activePlayers: UsersOrGuests[]
    
}){
    const [active, setActivePlayers] = useState<UsersOrGuests[]>(activePlayers);
    console.log("Game State active players: ", active, "\nGame state props: ", activePlayers);

    return(
        <div className="absolute bottom-5 left-0 flex justify-between w-full lg:w-9/12 px-8">
            <div className="bg-base-300 border border-primary border-opacity-60 rounded-lg w-3/12 md:w-1/6 text-center">{active[0] && active[0].username}</div>
            <div className="w-1/2 md:w-4/6 flex justify-center">
                <span className="countdown font-mono text-4xl">
                    {/* @ts-ignore */}
                    <span style={{"--value":60}}></span>
                </span>
            </div>
            <div className="bg-base-300 border border-primary border-opacity-60 rounded-lg w-3/12 md:w-1/6 text-center">{active[1] && active[1].username}</div>
        </div>
    );
}
'use client';
import PocketBase, { UnsubscribeFunc, RecordSubscription} from 'pocketbase';
import { Guests } from "@/global/types/Guests";
import { Users } from "@/global/types/Users";
import { useEffect, useState } from 'react';
import { GameData } from '@/global/types/GameData';
import { useRouter } from 'next/navigation';
import { ExapandedGameData } from '@/global/types/Unions';

async function fetchGameData(gameId: string, router: typeof useRouter.prototype): Promise<ExapandedGameData> {
    const pb = new PocketBase('http://127.0.0.1:8091');
    await pb.collection('games').update(gameId, )
    const data: ExapandedGameData = await pb.collection('games').getOne(gameId, {
        expand: "guests,players"
    });
    if(!data.id) return router.redirect('/');
    return data;
}

export default async function GameState({
    gameId,
    localToken
}:{
    gameId: string,
    localToken: string
}){
    const router = useRouter();
    const initalData: ExapandedGameData = await fetchGameData(gameId, router);
    const [activePlayers, setActivePlayers] = useState<Guests[]>();
    let active: Guests[] = [];
    initalData.expand.guests?.map((guest: Guests) => {
        if(guest.id === initalData.activeGuests[0] || guest.id === initalData.activeGuests[1]) return active.push(guest);
    })
    setActivePlayers(active);

    useEffect(()=> {
        const pb = new PocketBase('http://127.0.0.1:8091');

        const unsub = pb.collection('games').subscribe(gameId, 
            function (rec: RecordSubscription<GameData>){
                if(!rec.record) return router.push('/');
                update(rec.record);
        })

        async function update(data: GameData){
            
        }

        async function closeConnections(unsubscribe: Promise<UnsubscribeFunc | void>){
            const unsub = await unsubscribe;
            if(!unsub) return router.push("/");
            unsub()
        };

        return () => {
            closeConnections(unsub);
        }

    },[gameId, router])

    return(
        <div className="absolute bottom-5 left-0 flex justify-between w-full lg:w-9/12 px-8">
            <div className="bg-red-400 rounded-lg w-3/12 md:w-1/6 text-center">{activePlayers && `${activePlayers[0].username}`}</div>
            <div className="w-1/2 md:w-4/6 flex justify-center">
                <span className="countdown font-mono text-4xl">
                    {/* @ts-ignore */}
                    <span style={{"--value":60}}></span>
                </span>
            </div>
            <div className="bg-red-400 rounded-lg w-3/12 md:w-1/6 text-center">{activePlayers && `${activePlayers[1].username}`}</div>
        </div>
    );
}
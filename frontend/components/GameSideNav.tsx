'use client';
import ActionCard from "@/components/ActionCard";
import ActionCardSuspense from "@/components/ActionCardSuspense";
import { Guests } from "@/global/types/Guests"
import { ExapandedGameData, UsersOrGuests } from "@/global/types/Unions";
import { Users } from "@/global/types/Users";
import { Suspense, useEffect, useState } from "react"
import PocketBase, { RecordSubscription } from 'pocketbase';
import { GameData } from "@/global/types/GameData";
import { useRouter } from "next/navigation";

export default function GameSideNav({
    playerList,
    activePlayers,
    gameId
}:{
    playerList: UsersOrGuests[],
    activePlayers: string[],
    gameId: string
}){

    const [players, setPlayers] = useState<UsersOrGuests[]>(playerList);
    const [active, setActive] = useState<string[]>(activePlayers);
    const router = useRouter();

    useEffect(() => {
        const pb = new PocketBase('http://127.0.0.1:8091');

        const unsub = pb.collection('games').subscribe(gameId, 
            function(rec: RecordSubscription<GameData>) {
                if(!rec.record) router.push("/");
                update(rec.record);
        })

        async function update(data: GameData){
            const updatedGame: ExapandedGameData = await pb.collection('games').getOne(data.id, {
                expand: "guests,players"
            });
            if(!updatedGame.id) return new Error("Could not find game session");
            setActive(updatedGame.activeGuests);
            const combined: UsersOrGuests[] = [...(updatedGame.expand?.players ?? []), ...(updatedGame.expand?.guests ?? [])]
            setPlayers(combined);
            console.log("Updated game data: ", updatedGame, "\nActivePlayers: ", active);
        }


    },[active, router, gameId])

    return (
        <div className="drawer-side flex flex-col">
            <label htmlFor="RHSDrawer" className="drawer-overlay"/>
            <ul className="menu gap-2 p-2 bg-base-200 bg-opacity-90 lg:bg-opacity-0 w-2/3 md:w-1/3 lg:w-auto">
                <Suspense fallback={<ActionCardSuspense isGame={true}/>}>
                    {
                        playerList.map((player: UsersOrGuests) => {
                            if(player.avatar) return (<ActionCard typeData={player as Users} host={false} key={player.id} active={player.id === active[0] || player.id === active[1]} isGame={true}/>)
                            return <ActionCard typeData={player as Guests} host={false} key={player.id} active={player.id === active[0] || player.id === active[1]} isGame={true}/>
                        })
                    }
                </Suspense> 
            </ul>
        </div>
    );
}
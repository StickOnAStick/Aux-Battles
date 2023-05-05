import GameState from "./GameState";
import SpotifySearch from '@/components/SpotifySearch';
import LeaveGame from "./LeaveGame";
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import GameSideNav from "@/components/GameSideNav";
import PocketBase from 'pocketbase';
import { ExpandedGameData, UsersOrGuests } from "@/global/types/Unions";
import { Guests } from "@/global/types/Guests";
import { selectTwoIds } from "@/global/functions/game";
import Spinner from "./Spinner";
import SpinnerSearchWrapper from "./SpinnerSearchWrapper";

async function fetchGameData(gameId: string): Promise<ExpandedGameData> {
    const pb = new PocketBase('http://127.0.0.1:8091');
    await pb.collection('games').update(gameId, )
    const data: ExpandedGameData = await pb.collection('games').getOne(gameId, {
        expand: "guests,players"
    });
    if(!data.id) return redirect('/');
    return data;
}

function getActivePlayers(gameData: ExpandedGameData, activeIds: string[]): UsersOrGuests[]{

    let activePlayers: UsersOrGuests[] = [];
    gameData.expand.guests?.map((guest: Guests) => {
        if(guest.id === activeIds[0] || guest.id === activeIds[1]) activePlayers.push(guest);
    })  
    return activePlayers;
}


export default async function Game({
    params
}:{
    params: {
        gameId: string,
    }
}){

    const data: ExpandedGameData = await fetchGameData(params.gameId);
    const playerList: UsersOrGuests[] = [...(data.expand?.players ?? []), ...(data.expand?.guests ?? [])]
    const activePlayers: UsersOrGuests[] = getActivePlayers(data, data.activeGuests);
    const cookieStore = cookies();
    const token = cookieStore.get('token');
    if(!token){
        new Error('Please enable cookies to continue');
        return redirect('/');
    }

    return (

        <div className=" min-h-screen ">
            {/* Player Drawer */}
            <div className="drawer drawer-mobile drawer-end">
                <input id="RHSDrawer" type="checkbox" className="drawer-toggle"/>
                <div className="drawer-content flex flex-col items-center justify-center">
                {/* Game content */}
                <div className="w-full h-full flex flex-col items-center">
                    <LeaveGame/>
                    <SpinnerSearchWrapper/>
                    <GameState gameId={params.gameId} initialData={data} activePlayers={activePlayers}/>
                </div>
                {/* Side Nav */}
                <label htmlFor="RHSDrawer" className="lg:hidden btn btn-square btn-accent text-primary border-primary border-opacity-20 drawer-button swap swap-rotate absolute top-2 right-2 ">
                        <input type="checkbox" />
                        <svg className="swap-off fill-current" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512"><path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z"/></svg>
                        <svg className="swap-on fill-current" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512"><polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49"/></svg>
                    </label>
                </div>
                
                <GameSideNav playerList={playerList} gameId={params.gameId} activePlayers={data.activeGuests}/>
            </div>
        </div>
    );
}
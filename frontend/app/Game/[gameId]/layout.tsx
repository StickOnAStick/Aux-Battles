
import { redirect } from 'next/navigation';
import { ExapandedGameData, ExpandedLobbyData } from "@/global/types/Unions";
import PocketBase from 'pocketbase';
import GameSideNav from '@/components/GameSideNav';
import { UsersOrGuests } from '@/global/types/Unions';
import { selectTwoIds } from '@/global/functions/game';
import { GameData } from '@/global/types/GameData';
import { cookies } from 'next/headers';
import { Guests } from '@/global/types/Guests';

async function fetchGameData(gameId: string): Promise<ExapandedGameData> {
    const pb = new PocketBase('http://127.0.0.1:8091');
    await pb.collection('games').update(gameId, )
    const data: ExapandedGameData = await pb.collection('games').getOne(gameId, {
        expand: 'guests,players'
    })
    if(!data.id) return redirect('/');
    return data;
}

async function initGame(gameData: ExapandedGameData, token: string | undefined, playerList: UsersOrGuests[])
{
    if(!token) redirect('/');
    if(!gameData.id) return new Error('Could not find game');

    const pb = new PocketBase('http://127.0.0.1:8091');
    
    if(!pb.authStore.model){
        const localUser: Guests = await pb.collection('guests').getFirstListItem(`token="${token}"`);
        if(!localUser) return redirect('/');
        const host: Guests = await pb.collection('guests').getOne(gameData.host);
        if(localUser.token != host.token) return; //Only host initalizes & runs game
        
        const playerIds: string[] = playerList.map((player)=> player.id);
        const activePlayers = selectTwoIds(playerIds);

        await pb.collection('games').update(gameData.id, { activeGuests: activePlayers})

    }else if(pb.authStore.model.id === gameData.host){
        
    }
}

export default async function GameLayout({
    children,
    params
}:{
    children: React.ReactNode,
    params: {
        gameId: string,
    }
}){
    const data: ExapandedGameData = await fetchGameData(params.gameId);
    const playerList: UsersOrGuests[] = [...(data.expand?.players ?? []), ...(data.expand?.guests ?? [])]
    const cookieStore = cookies();
    const localToken = cookieStore.get('token');
    await initGame(data, localToken?.value, playerList);

    return (
        <div className=" min-h-screen ">
            {/* Player Drawer */}
            <div className="drawer drawer-mobile drawer-end">
                <input id="RHSDrawer" type="checkbox" className="drawer-toggle"/>
                <div className="drawer-content flex flex-col items-center justify-center">
                    {/* Page Content here */}
                    {children}
                    <label htmlFor="RHSDrawer" className="lg:hidden btn btn-square btn-accent text-primary border-primary border-opacity-20 drawer-button swap swap-rotate absolute top-2 right-2 ">
                        <input type="checkbox" />
                        <svg className="swap-off fill-current" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512"><path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z"/></svg>
                        <svg className="swap-on fill-current" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512"><polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49"/></svg>
                    </label>
                </div>
                
                {/* Side Nav */}
                <GameSideNav playerList={playerList} gameId={params.gameId}/>
            </div>
            
        </div>
    )
}
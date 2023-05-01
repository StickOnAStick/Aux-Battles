import LobbyActionCard from "@/components/ActionCard";
import ActionCardSuspense from "@/components/ActionCardSuspense";
import { GameData } from "@/global/types/GameData"
import { Guests } from "@/global/types/Guests"
import { Users } from "@/global/types/Users";
import { Suspense } from "react"
import PocketBase from 'pocketbase';


async function fetchGameData(gameId: string): Promise<GameData> {
    const pb = new PocketBase('http://127.0.0.1:8091');
    const res: GameData = await pb.collection('games').getOne(gameId, {
        expand: "guests,players"
    });
    if (!res.id) throw new Error("Could not find game data");

    return res;
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
    const gameData = await fetchGameData(params.gameId);

    return (
        <div className=" min-h-screen ">
            {/* Player Drawer */}
            <div className="drawer drawer-mobile drawer-end">
                <input id="RHSDrawer" type="checkbox" className="drawer-toggle"/>
                <div className="drawer-content flex flex-col items-center justify-center">
                    {/* Page Content here */}
                    {children}
                    <label htmlFor="RHSDrawer" className="lg:hidden btn btn-square btn-warning text-primary-200 text-base-300 border-primary border-opacity-20 drawer-button swap swap-rotate absolute top-2 right-2 ">
                        <input type="checkbox" />
                        <svg className="swap-off fill-current" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512"><path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z"/></svg>
                        <svg className="swap-on fill-current" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512"><polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49"/></svg>
                    </label>
                </div>
                
                {/* Side Nav */}
                <div className="drawer-side flex flex-col">
                    <label htmlFor="RHSDrawer" className="drawer-overlay"/>
                    <ul className="menu gap-2 p-2 bg-base-200 bg-opacity-60 lg:bg-opacity-0">
                        <Suspense fallback={<ActionCardSuspense isGame={true}/>}>
                            { 
                                gameData?.expand.players?.map( (user: Users ) => {
                                return (<LobbyActionCard typeData={user} host={false} key={user.id} isGame={true} active={user.username === "Nicholas"}/>);
                            })
                            }
                            {
                                gameData?.expand.guests?.map((guest: Guests) => {
                                return ( <LobbyActionCard typeData={guest} host={false} key={guest.id} isGame={true}/>);
                            })
                            }
                        </Suspense> 
                    </ul>
                </div>

            </div>
            
        </div>
    )
}
import ActionCard from "@/components/ActionCard";
import ActionCardSuspense from "@/components/ActionCardSuspense";
import { Guests } from "@/global/types/Guests"
import { ExapandedGameData, UsersOrGuests } from "@/global/types/Unions";
import { Users } from "@/global/types/Users";
import { Suspense } from "react"

export default function GameSideNav({
    playerList,
    gameId
}:{
    playerList: UsersOrGuests[],
    gameId: string
}){
    return (
        <div className="drawer-side flex flex-col">
            <label htmlFor="RHSDrawer" className="drawer-overlay"/>
            <ul className="menu gap-2 p-2 bg-base-200 bg-opacity-90 lg:bg-opacity-0 w-2/3 md:w-1/3 lg:w-auto">
                <Suspense fallback={<ActionCardSuspense isGame={true}/>}>
                    {
                        playerList.map((player: UsersOrGuests) => {
                            if(player.avatar) return (<ActionCard typeData={player as Users} host={false} key={player.id} active={false} isGame={true}/>)
                            return <ActionCard typeData={player as Guests} host={false} key={player.id} active={false} isGame={true}/>
                        })
                    }
                </Suspense> 
            </ul>
        </div>
    );
}
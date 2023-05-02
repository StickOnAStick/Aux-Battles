import ActionCard from "@/components/ActionCard";
import ActionCardSuspense from "@/components/ActionCardSuspense";
import { Guests } from "@/global/types/Guests"
import { ExapandedGameData } from "@/global/types/Unions";
import { Users } from "@/global/types/Users";
import { Suspense } from "react"

export default function GameSideNav({
    gameData
}:{
    gameData: ExapandedGameData
}){
    return (
        <div className="drawer-side flex flex-col">
            <label htmlFor="RHSDrawer" className="drawer-overlay"/>
            <ul className="menu gap-2 p-2 bg-base-200 bg-opacity-90 lg:bg-opacity-0 w-2/3 md:w-1/3 lg:w-auto">
                <Suspense fallback={<ActionCardSuspense isGame={true}/>}>
                    { 
                        gameData?.expand.players?.map( (user: Users ) => {
                        return (<ActionCard typeData={user as Users} host={false} key={user.id} isGame={true} active={user.username === "Nicholas"}/>);
                    })
                    }
                    {
                        gameData?.expand.guests?.map((guest: Guests) => {
                        return ( <ActionCard typeData={guest as Guests} host={false} key={guest.id} isGame={true}/>);
                    })
                    }
                </Suspense> 
            </ul>
        </div>
    );
}
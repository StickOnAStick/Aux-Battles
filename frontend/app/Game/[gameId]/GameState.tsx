import { Guests } from "@/global/types/Guests";
import { Users } from "@/global/types/Users";

export default function GameState({
    users,
    guests,
}:{
    users?: Users[],
    guests?: Guests[],
}){
    return(
        <div className="absolute bottom-5">
            This is the game state
        </div>
    );
}
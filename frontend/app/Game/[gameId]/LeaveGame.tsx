'use client';
import { socket } from "@/global/functions/socket";
import { Guests } from "@/global/types/Guests";
import { useRouter } from 'next/navigation'

async function leaveGame(
    localUser: Guests,
    gameId: string,
    router: (typeof useRouter.prototype)
){
    socket.emit(("Client-Disconnect"), [localUser.id, gameId]);
    router.replace("/")
}

export default function LeaveGame({
    localUser,
    gameId
}:{
    localUser: Guests,
    gameId: string
}){
    const router = useRouter();
    return (
        <div className="flex justify-center py-2">
            <label htmlFor="AuxButton" className="btn btn-ghost z-10 text-4xl font-bold">
                {/* Add checks to see if user is host or guest. If Host, popup modal asking if they want to close the lobby. If Guest, ask if they want to leave lobby. If signed, ask if they want to leave or check something else?*/}
                Aux-Battles
            </label>
            <input type="checkbox" id="AuxButton" className="modal-toggle"/>
            <label className="modal bg-base-300 bg-opacity-5" htmlFor="AuxButton">
                <label className="modal-box relative modal-bottom sm:modal-middle bg-base-300 border-primary-content border">
                    <h2 className="text-3xl font-bold">Are you sure you want to leave?</h2>
                    <div className="modal-action flex justify-between">
                        <label className="btn btn-accent font-bold text-xl " htmlFor="AuxButton">Go back</label>
                        <button className="btn btn-primary text-accent font-bold text-xl" onClick={()=> leaveGame(localUser, gameId, router)}>Leave Lobby</button>
                    </div>
                </label>
            </label>
        </div> 
    );
}
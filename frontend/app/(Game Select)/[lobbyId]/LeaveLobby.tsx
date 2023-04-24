'use client';
import { Guests, GuestsPayload } from "@/global/types/Guests";
import { LobbyData, LobbyPayloadData } from "@/global/types/LobbyData";
import { useRouter } from "next/navigation";
import PocketBase from 'pocketbase';

async function leaveLobby(
    token: string | undefined, 
    router: (typeof useRouter.prototype), 
    host: string, 
    lobbyId: string,
    ){
    if(!token) return router.push('/');

    const pb = new PocketBase('http://127.0.0.1:8091');
    try{
    if(!pb.authStore.model){
        const localUser: Guests = await pb.collection('guests').getFirstListItem(`token="${token}"`);
        console.log(localUser.username)
        const guestData: GuestsPayload = {
            id: localUser.id,
            username: localUser.username,
            currentGame: null,
            currentLobby: null,
            token: localUser.token
        }
        
        await pb.collection('guests').update(localUser.id, guestData);
        
        if(localUser.id == host) { //Delete lobby if host
            
            await pb.collection('lobbys').delete(lobbyId);
            router.push('/');
        }else{ //Remove user if guest player
            
            const lobby: LobbyPayloadData = await pb.collection('lobbys').getOne(lobbyId);
            
            let updatedData: LobbyPayloadData = lobby;
            const index = updatedData.guests.indexOf(localUser.id); //Find user's id in returned data
            
            if(index !== -1) updatedData.guests.splice(index,1);
            
            try{
                await pb.collection('lobbys').update(lobbyId, updatedData);
                router.push('/');
            }catch(e){
                console.error(e);
            }
        }
    }else{
        //Remove user - TBI
    }
    }catch(e){
        console.log(e);
        router.push('/'); //Still navigate upon failure. Review
    }
}

export default function LeaveLobby({
    token,
    host,
    lobbyId,
}:{
    token: string | undefined,
    host: string,
    lobbyId: string,
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
                        <button className="btn btn-primary text-accent font-bold text-xl" onClick={()=> leaveLobby(token, router, host, lobbyId)}>Leave Lobby</button>
                    </div>
                </label>
            </label>
        </div> 
    );
}
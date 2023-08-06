'use client';
import LoadingSpinner from "@/components/LoadingSpinner";
import { Guests, GuestsPayload } from "@/global/types/Guests";
import { LobbyData, LobbyPayloadData } from "@/global/types/LobbyData";
import { Users } from "@/global/types/Users";
import { useRouter } from "next/navigation";
import PocketBase from 'pocketbase';
import { useState } from "react";

async function leaveLobby(
    token: string | undefined, 
    router: (typeof useRouter.prototype), 
    host: string, 
    lobbyId: string,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
    ){
    if(!token) return router.push('/');

    const pb = new PocketBase(process.env.POCKETBASE_URL);
    try{
    if(!pb.authStore.model){
        const localUser: Guests = await pb.collection('guests').getFirstListItem(`token="${token}"`);
        const guestData: GuestsPayload = {
            id: localUser.id,
            username: localUser.username,
            currentGame: '',
            currentLobby: '',
            token: localUser.token
        }

        await pb.collection('guests').update(localUser.id, guestData);
        
        if(localUser.id == host) { //Delete lobby if host
            await pb.collection('lobbys').delete(lobbyId);
            router.push('/');
            return;
        }else{ //Remove user if guest player
            
            const lobby: LobbyPayloadData = await pb.collection('lobbys').getOne(lobbyId);
            
            let updatedData: LobbyPayloadData = lobby;
            const index = updatedData.guests.indexOf(localUser.id); //Find user's id in returned data
            
            if(index !== -1) updatedData.guests.splice(index,1);
            
            setLoading(false);
            try{
                await pb.collection('lobbys').update(lobbyId, updatedData);
                router.push('/');
            }catch(e){
                console.log("Error leaving lobby: ", e);
            }
        }
    }else{
        console.log("User id: ", pb.authStore.model.id, "\tHost Id: ", host)
        if(pb.authStore.model.id == host){
            await pb.collection('lobbys').delete(lobbyId);
            router.push('/');
            return;
        }
        let lobbyData: LobbyPayloadData = await pb.collection('lobbys').getOne(lobbyId);
        
        const updateUser = await pb.collection('users').update(pb.authStore.model.id, { currentLobby: ""} as Users)
        .catch((e) => console.log(e)); 
        
        const index = lobbyData.players.indexOf(pb.authStore.model.id);
        if(index !== -1) lobbyData.players.splice(index,1);
        
        await pb.collection('lobbys').update(lobbyId, lobbyData)
        .catch((e) => {setLoading(false); console.log("Could not update lobby: ", e)});
        setLoading(false);
        router.push('/');
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
   const [loading, setLoading] = useState<boolean>(false);

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
                        <button className="btn btn-primary text-accent font-bold text-xl" onClick={()=> {leaveLobby(token, router, host, lobbyId, setLoading); setLoading(true);}}>
                            {loading ? <LoadingSpinner/> : "Leave Lobby"}
                        </button>
                    </div>
                </label>
            </label>
        </div> 
    );
}
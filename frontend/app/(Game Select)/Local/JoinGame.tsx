'use client';
import { ChangeEvent, useEffect, useState } from 'react';
import { LobbyPayloadData } from '@/global/types/LobbyData';
import { useRouter } from 'next/navigation';
import { Guests, GuestsPayload } from '@/global/types/Guests';
import PocketBase from 'pocketbase';

export default function JoinGame ({
    localToken
}:{
    localToken: string | undefined
}) {
    
    const pb = new PocketBase('http://127.0.0.1:8091'); 
    const router = useRouter();

    const [error, setError] = useState<Error | null>(null);
    const [joinData, setJoinData ] = useState({
        name: "",
        code: "",
    });

    useEffect(()=>{
        return setError(null); //clean up error state on deconstruct
    }, []);
    
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
        const {name, value} = event.target;
        setJoinData((prev)=> ({...prev, [name]: value}))
    }

    const handleJoinGame = async (): Promise<Error | void> => {
        //Check for valid input
        if(joinData.name == "" || joinData.code == "") 
        {
            setError(new Error("Please enter username or game code!"));
            return;
        }
        
        if(!localToken) return new Error("Please enable cookies to continue");

        const model = pb.authStore.model;
        console.log("hit");
        if(!model){

            //Check if existing lobby 
            try{
                const existingGuest: Guests | null = await pb.collection('guests').getFirstListItem(`token="${localToken}"`)
            
                if(existingGuest?.id) {
                    if(existingGuest?.currentGame) router.push(`/Game/${existingGuest.currentGame}`)
                    else router.push(`/${existingGuest.currentLobby}`)
                }
            }catch(e){
                console.log(e);
            }

            try{
                const lobby: LobbyPayloadData = await pb.collection('lobbys').getFirstListItem(`pass="${joinData.code}"`);

                if(!lobby.id) return;

                const guestData: GuestsPayload = {
                    username: joinData.name,
                    currentGame: '',
                    currentLobby: lobby.id,
                    token: localToken
                };
                const createGuest: Guests = await pb.collection('guests').create(guestData);

                //@ts-ignore
                const addGuestToLobby = await pb.collection('lobbys').update(lobby.id, lobby)
                .then(async (response) => {
                    //console.log(response);
                    router.push(`/${response.id}`);
                })
                .catch((error)=>console.error(error));
            }catch(e) {
                //@ts-ignore
                let _e: Error = e;
                setError(new Error(_e.message));
                return;
            }
        }
        else{
            console.log("TBD feature")
        }
    }

    
    return (
        <div className="rounded-xl bg-base-200 border-2 border-primary-content min-w-full">
            <div className="my-4 mx-3">
                <li className="flex flex-col font-bold tracking-wider gap-4 text-base-content">
                    <ul>
                        <h2 className="text-2xl mb-2">Guest:</h2>
                        <input type="text" name="name" placeholder="Name" onChange={handleInputChange} value={joinData.name} className="rounded px-2 py-1 text-lg border-2 bg-opacity-40 border-primary-content"></input>
                    </ul>
                    <ul>
                        <h2 className="text-2xl mb-2">Code:</h2>
                        <input type="text" name="code" placeholder="Game ID" onChange={handleInputChange} value={joinData.code} className="rounded px-2 py-1 text-lg border-2 bg-opacity-40 border-primary-content"></input>
                    </ul>
                    <ul className='flex flex-col gap-2'>
                        
                        <button onClick={() => handleJoinGame()}  className="btn btn-accent rounded-lg ease-in delay-0 hover:scale-105  min-w-full text-white font-extrabold text-2xl tracking-wide mt-2">
                            Join
                        </button>
                        { error &&
                        <div className="alert alert-warning shadow-lg rounded-lg">
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                <span>Warning: {error.message}</span>
                            </div>
                        </div>
                        }
                    </ul>
                </li>
            </div>
        </div>
    );
}
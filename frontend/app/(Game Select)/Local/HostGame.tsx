'use client';

import { RxKeyboard } from 'react-icons/rx';

import { pb } from '@/app/api/pocketbase';
import generateLocalPassword from '@/global/functions/generateLocalPass';
import { LobbyData, LobbyPayloadData } from '@/global/types/LobbyData';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useState } from 'react';
import { Guests } from '@/global/types/Guests';
import { store } from '@/global/store/store';
import { setGuest } from '@/global/store/guestSlice';

                                //Not good type
async function createLocalLobby(router: typeof useRouter.prototype, userName: string) {
    //Call from store when login feature is complete
    const model = pb.authStore.model;
    const pass = generateLocalPassword();

    if(userName == "") return new Error("Please enter a username");
    console.log(model);
    if(!model){
        //FetchLobbyBot() needs to be implimented later under API
        console.log("hit " + userName) 

        const guest: Guests = await pb.collection('guests').create({username: userName});
        console.log(guest);
        const data: LobbyPayloadData = {
            "chatroom": null,
            "pass": pass,
            "players": [],
            "gameType": false,
            "packs": ["w4oudqe45it58g9"],
            "host": guest.id,
            "guests": [guest.id]
        };
        console.log(data);

        const localLobby = await pb.collection('lobbys').create(data)
        .then((response)=> {
            store.dispatch(setGuest({
                id: guest.id,
                username: userName,
                currentGame: '',
                currentLobby: response.id
            }))
            console.log(store.getState())
            console.log(response);
            router.push(`/${response.id}`)
        })
        .catch((error)=> console.error(error));

        console.log(localLobby);
        
    }else{
        try {
            const user = await pb.collection('users').getOne(model.id);
            console.log("User " + user);
            
            const data: LobbyPayloadData = {
                "chatroom": null,
                "pass": pass,
                "players": [
                    user.id   
                ],
                "gameType": false,
                "packs": user.packs,
                "host": user.id,
                guests: []
            };

            const localLobby = await pb.collection('lobbys').create(data)
            .then(async (response)=>{
                const payload = {
                    currentLobby: response.id
                }

                await pb.collection('users').update(user.id, payload).then((response)=>console.log(response)).catch((error)=>console.log(error));
                router.push(`/${response.id}`)
            })
            .catch((error)=>console.error(error));
        }catch(error){
            console.log(error);
        }        
    }
}

export default function HostGame () {
    const router = useRouter();

    const [userName, setUserName] = useState<string>('');
    
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setUserName(event.target.value);
    }


    return (
        <>
            <label htmlFor="HostBtn"
            className="btn text-base-content pb-1 bg-base-300 rounded-lg border-2 border-primary-content min-w-full h-full hover:bg-accent hover:border-primary-focus hover:border-opacity-5 hover:shadow-md hover:shadow-base-300 hover:text-white hover:-translate-y-1">
                <div className="flex flex-col min-h-full gap-[0.125rem] font-extrabold tracking-wide text-xl justify-center ">
                    <RxKeyboard size={64} className="w-full"/>
                    <h1 >Host</h1>
                </div>
            </label>

            <input type="checkbox" id="HostBtn" className='modal-toggle'/>
            <label className="modal bg-base-300 bg-opacity-5" htmlFor='HostBtn'>
                <label className="modal-box relative modal-bottom sm:modal-middle bg-base-300 border-primary-content border ">
                    <h3 className="font-bold text-lg">Enter your username!</h3>
                    <input className="py-4 px-4 rounded-lg mt-2 font-bold text-xl" type="text" name="name" placeholder='Username' onChange={handleInputChange} value={userName}></input>
                    <div className="modal-action">
                        <button className="btn btn-error font-semibold" onClick={()=> createLocalLobby(router, userName)}>Create Lobby</button>
                    </div>
                </label>
            </label>
        </>
    );
}
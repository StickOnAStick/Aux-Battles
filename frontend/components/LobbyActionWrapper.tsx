'use client';
import {useState, useEffect} from 'react';
import { LobbyData } from '@/global/types/LobbyData';
import Image from 'next/image';
import { Users } from '@/global/types/Users';
import { Guests } from '@/global/types/Guests';
import ActionCard from './ActionCard';

export default function LobbyActionWrapper({
    lobbyId,
    data,
    className
}:{
    lobbyId: string,
    data: LobbyData,
    className?: string,
}){

    const [lobbyData, setLobbyData] = useState<LobbyData>(data);
    const [userCount, setUserCount] = useState<number>(1);
    const [readyCount, setReadyCount] = useState<number>(0);

    useEffect(() => {
        setLobbyData(data);
        setUserCount(lobbyData?.players.length + lobbyData?.guests.length);
    }, [lobbyId, data, lobbyData]);

    return (
        <div className={className + " flex justify-center mt-5 text-primary h-full flex-grow"}>
            <div className=" bg-base-300 border-2 border-primary-content rounded-lg w-full sm:w-10/12 md:w-2/3 p-5 flex flex-col justify-between">
                <div>
                    <div className=" flex justify-between border-b-2 border-primary-content pb-4 border-opacity-50">
                        <div className="flex gap-3">
                            <div className=' '>
                                <Image src={`http://127.0.0.1:8091/api/files/packs/${lobbyData?.expand.packs.at(0).id as string}/${lobbyData?.expand.packs.at(0).image as string}`} 
                                        width={100} height={100} alt="Pack Image" 
                                        className='rounded-md' style={{width: 'auto', height: '100%'}} />
                            </div>
                            <h1 className='font-bold xs:text-3xl text-xl '>{lobbyData?.expand.packs.at(0).name}</h1>
                        </div>
                        <div className='flex flex-col font-bold text-lg text-center gap-2'>
                            <span className=' tracking-widest'>{readyCount}/{userCount}</span>
                            <button className='btn btn-sm btn-disabled bg-success bg-opacity-70 xs:btn-md rounded-md my-1  btn-success text-white font-bold tracking-wide hover:bg-opacity-90 hover:scale-105'>Start</button>
                        </div>
                    </div>
                    
                    <div className='font-bold text-2xl flex flex-col gap-4 mt-3 mb-5'>
                        Players
                        <ul className=' font-medium rounded-md p-3 text-xl flex flex-col gap-5'>

                            {/**Signed users */}
                            {lobbyData?.expand.players?.map((user: Users) => {
                                return (
                                    <ActionCard typeData={user} key={user.id} host={ user.id === lobbyData.host }/>
                                );
                                })
                            }
                            {/**Guests */}
                            {lobbyData?.expand.guests?.map((guest: Guests) => {
                                return (
                                   <ActionCard typeData={guest} key={guest.id} host={ guest.id === lobbyData.host }/>
                                );
                            })}  
                        </ul>
                    </div>
                </div>

                <div className="flex justify-center">
                    <div className='flex flex-col gap-3'>
                        <span className=" font-semibold tracking-wide text-2xl">Code: <span className='text-2xl xs:text-4xl font-bold'>{lobbyData?.pass}</span></span>
                        <span className='mb-3 text-sm text-center'>Share this with your friends!</span>
                        <div className='w-full text-center'>
                            {/* Todo: For beta launch, have sharing feature complete  */}
                            <button className='btn btn-accent text-white font-extrabold tracking-wider text-3xl'>Share</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
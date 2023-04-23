'use client';

import { Packs } from "@/global/types/Packs";
import Image from 'next/image';
import { useEffect, useState } from "react";

export default function LobbyActionHeader({
    lobbyId,
    localToken,
    hostId,
    packs
}:{
    lobbyId: string,
    localToken: string | undefined,
    hostId: string,
    packs: Packs
}){

    const [screenWidth, setScreenWidth] = useState<number>(0);

    useEffect(()=>{
        setScreenWidth(window.innerWidth);
    },[]);


    return (
        <div className=" flex justify-between border-b-2 border-primary-content pb-4 border-opacity-50">
            <div className="flex gap-3">
                
                    <Image src={`http://127.0.0.1:8091/api/files/packs/${packs.id}/${packs.image}`} 
                            width={screenWidth >= 500 ? 100 : 60} height={screenWidth >= 500 ? 100 : 60} alt="Pack Image" 
                            className='rounded-md' style={{width: 'auto', height: '100%'}} />
                
                <h1 className='font-bold xs:text-3xl text-xl'>{packs.name}</h1>
            </div>
            <div className='flex flex-col font-bold text-lg text-center justify-center'>
                <button className='btn btn-md btn-success btn-disabled bg-success bg-opacity-70 xs:btn-lg rounded-md my-1 text-white font-bold tracking-wide'
                    onClick={()=>console.log("bing")}>
                    
                    Start
                </button>
            </div>
        </div>
    );
}
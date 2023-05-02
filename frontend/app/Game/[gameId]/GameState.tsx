'use client';
import PocketBase from 'pocketbase';
import { Guests } from "@/global/types/Guests";
import { Users } from "@/global/types/Users";
import { useEffect } from 'react';

export default function GameState({
    gameId,
    localToken
}:{
    gameId: string,
    localToken: string
}){

    useEffect(()=> {
        const pb = new PocketBase('http://127.0.0.1:8091');
        const unsubscribe = pb
    },[])

    return(
        <div className="absolute bottom-5 left-0 flex justify-between w-full lg:w-9/12 px-8">
            <div className="bg-red-400 rounded-lg w-3/12 md:w-1/6 text-center">h</div>
            <div className="w-1/2 md:w-4/6 flex justify-center">
                <span className="countdown font-mono text-4xl">
                    <span style={{"--value":60}}></span>
                </span>
            </div>
            <div className="bg-red-400 rounded-lg w-3/12 md:w-1/6 text-center">h</div>
        </div>
    );
}
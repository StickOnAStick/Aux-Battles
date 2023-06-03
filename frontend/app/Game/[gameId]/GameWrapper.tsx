'use client';
import SpotifySearch from "@/components/SpotifySearch";
import Spinner from "./Spinner";
import { SpotifyAccessTokenResponse } from "@/global/types/Spotify";
import GameState from "./GameState";
import { ExpandedGameData, UsersOrGuests } from "@/global/types/Unions";
import { useState, useEffect } from 'react';
import { Guests } from "@/global/types/Guests";
import { socket } from "./page";

interface SpotifyModal {
    spotifyModal: boolean,
    setSpotifyModal: React.Dispatch<React.SetStateAction<boolean>>
}


export default function GameWrapper({
    accessToken,
    gameId,
    /**
     * Initial game data. Contains expanded users, guests, and pack info.
     */
    initData,
    userToken,
    localUser
}:{
    accessToken: SpotifyAccessTokenResponse,
    gameId: string,
    initData: ExpandedGameData,
    userToken: string,
    localUser: Guests
}){

    useEffect(()=>{
        socket.on("Display-Pack", ()=>{
            setPackAnimation(true); 
            setTimeout(()=>{setPackAnimation(false)}, 1000);
        });

        socket.on("Active-Players", async ([ids, prompt]: [[string, string], number]) => {
            const user1 = initData.expand.guests.find(guest => guest.id === ids[0]);
            const user2 = initData.expand.guests.find(guest => guest.id === ids[1]);
            setActivePlayers([user1 == undefined ? null : user1, user2 == undefined ? null : user2])
            setSelectedPrompt(prompt);
        });

        socket.on("Round-Timer", (timer: number) => {
            setTimer(timer);
        });

        
    },[initData.expand.guests])

    const [selectedPrompt, setSelectedPrompt] = useState<number>(0);
    const [packAnimation, setPackAnimation] = useState<boolean>(false);
    const [spotifyModal, setSpotifyMdoal] = useState<boolean>(false);
    const [timer, setTimer] = useState<number | undefined>(undefined);
    const [activePlayers, setActivePlayers] = useState<[UsersOrGuests | null, UsersOrGuests | null]>([null, null]);

    return (
        <>
            <SpotifySearch isActive={spotifyModal} accessToken={accessToken}/>
            <Spinner prompts={initData.expand.pack.packData.prompts} selected={selectedPrompt}/>
            <GameState gameId={gameId} activePlayers={activePlayers} timer={timer}/>
        </>
    )
}
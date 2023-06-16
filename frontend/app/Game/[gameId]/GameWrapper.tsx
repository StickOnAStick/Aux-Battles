'use client';
import SpotifySearch from "@/components/SpotifySearch";
import Spinner from "./Spinner";
import { SpotifyAccessTokenResponse } from "@/global/types/Spotify";
import GameState from "./GameState";
import { ExpandedGameData, UsersOrGuests } from "@/global/types/Unions";
import { useState, useEffect } from 'react';
import { Guests } from "@/global/types/Guests";
import { socket } from "@/global/functions/socket";
import { Track } from '@/global/types/SpotifyAPI';

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

    const [selectedPrompt, setSelectedPrompt] = useState<number>(0);
    const [packAnimation, setPackAnimation] = useState<boolean>(false);
    const [spotifyModal, setSpotifyMdoal] = useState<boolean>(false);
    const [timer, setTimer] = useState<number>(0);
    const [activePlayers, setActivePlayers] = useState<[UsersOrGuests | undefined, UsersOrGuests | undefined]>([undefined, undefined]);
    
    useEffect(()=>{
        socket.emit("Client-Ready", {id: localUser.id, currentGame: gameId});
        socket.on("Navigate-To-Home", () => {
            console.log("Nav home")
        }) 
        socket.on("Display-Pack", ()=>{
            console.log("Display Pack animation")
            setPackAnimation(true); 
            setTimeout(()=>{setPackAnimation(false)}, 1000);
        });
        socket.on("Active-Players", ([ids, prompt]: [[string, string], number]) => {
            const user1 = initData.expand.guests.find(g => g.id === ids[0] as string);
            const user2 = initData.expand.guests.find(g => g.id === ids[1] as string);
            setActivePlayers([user1, user2]);
            setSelectedPrompt(prompt);
            if(localUser.id == user1?.id || user2?.id) setSpotifyMdoal(true);
            
        });
        socket.on("Round-Timer", (timer: number) => {
            setTimer(timer);
        });

    },[initData.expand.guests, activePlayers, timer, selectedPrompt, gameId, initData, localUser.id])

    useEffect(()=>{
        if(timer != 0){
            const delay = setTimeout(() =>{
                setTimer(prevTime => prevTime - 1);
                if(timer - 1 == 0 && (localUser.id == activePlayers[0]?.id || localUser.id == activePlayers[1]?.id)) {
                    clearTimeout(delay);
                    console.log("Sending expired timer signal with id: ", localUser.id);
                    socket.emit("Expired-Select-Timer", localUser.id);
                }
            }, 1000);
        }
    },[timer, activePlayers, localUser.id])

    return (
        <>
            <SpotifySearch isActive={spotifyModal} accessToken={accessToken} gameId={gameId} localUserId={localUser.id} prompt={initData.expand.pack.packData.prompts[selectedPrompt]}/>
            <Spinner prompts={initData.expand.pack.packData.prompts} selected={selectedPrompt}/>
            <GameState gameId={gameId} activePlayers={activePlayers} timer={timer} localUserId={localUser.id}/>
        </>
    )
}
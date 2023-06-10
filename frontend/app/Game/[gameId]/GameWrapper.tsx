'use client';
import SpotifySearch from "@/components/SpotifySearch";
import Spinner from "./Spinner";
import { SpotifyAccessTokenResponse } from "@/global/types/Spotify";
import GameState from "./GameState";
import { ExpandedGameData, UsersOrGuests } from "@/global/types/Unions";
import { useState, useEffect } from 'react';
import { Guests } from "@/global/types/Guests";
import { socket } from "@/global/functions/socket";

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
    const [timer, setTimer] = useState<number | undefined>(undefined);
    const [activePlayers, setActivePlayers] = useState<[UsersOrGuests | null, UsersOrGuests | null]>([null, null]);

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
            console.log("Active Id's recieved: ", ids, "\nCurrent PlayerID list: ", initData.guests);
            const user1 = initData.expand.guests.find(guest => guest.id === ids[0]);
            const user2 = initData.expand.guests.find(guest => guest.id === ids[1]);
            setActivePlayers([user1 == undefined ? null : user1, user2 == undefined ? null : user2])
            setSelectedPrompt(prompt);

            console.log("Acitve-Players Signal Recieved. \tActive clients: ", + activePlayers);
        });

        socket.on("Round-Timer", (timer: number) => {
            setTimer(timer);
            console.log("Round timer signal recieved.\tRound timer: ", timer);
        });


    },[initData.expand.guests, activePlayers, timer, selectedPrompt])


    return (
        <>
            <SpotifySearch isActive={spotifyModal} accessToken={accessToken}/>
            <Spinner prompts={initData.expand.pack.packData.prompts} selected={selectedPrompt}/>
            <GameState gameId={gameId} activePlayers={activePlayers} timer={timer}/>
        </>
    )
}
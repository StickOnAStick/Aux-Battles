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
import { useRouter } from "next/navigation";


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
    const [allowVoting, setAllowVoting] = useState<boolean>(true);

    const router = useRouter();

    useEffect(()=>{
        socket.emit("Client-Ready", {id: localUser.id, currentGame: gameId});
        socket.on("Navigate-To-Home", () => {
            console.log("Nav home")
            router.push("/")
        }) 
        socket.on("Display-Pack", ()=>{
            console.log("Display Pack animation")
            setPackAnimation(true); 
            setTimeout(()=>{setPackAnimation(false)}, 1000);
        });
        socket.on("Active-Players", ([ids, prompt]: [[string, string], number]) => {
            const user1 = initData.expand.guests.find(g => g.id === ids[0] as string);
            const user2 = initData.expand.guests.find(g => g.id === ids[1] as string);
            if(localUser.id === user1?.id || localUser.id === user2?.id){
                setAllowVoting(false);
                setSpotifyMdoal(true);
            }
            setActivePlayers([user1, user2]);
            setSelectedPrompt(prompt);
        });
        socket.on("Round-Timer", (timer: number) => {
            setTimer(timer);
        });
        

    },[initData.expand.guests, activePlayers, timer, selectedPrompt, gameId, initData, localUser.id, router])

    useEffect(()=>{
        if(timer != 0){
            const delay = setTimeout(() =>{
                setTimer(prevTime => prevTime - 1);                                                         // modal checks if in voting phase or not
                if(timer - 1 == 0 && (localUser.id == activePlayers[0]?.id || localUser.id == activePlayers[1]?.id) && spotifyModal) {
                    clearTimeout(delay);
                    setSpotifyMdoal(false);
                    console.log("Sending expired timer signal with id: ", localUser.id);
                    socket.emit("Expired-Select-Timer", localUser.id);
                }
            }, 1000);
        }
    },[timer, activePlayers, localUser.id, spotifyModal])

    return (
        <>
            <SpotifySearch isActive={spotifyModal} accessToken={accessToken} gameId={gameId} localUserId={localUser.id} prompt={initData.expand.pack.packData.prompts[selectedPrompt]}/>
            <Spinner prompts={initData.expand.pack.packData.prompts} selected={selectedPrompt} userId={localUser.id} votingAllowed={allowVoting}/>
            <GameState gameId={gameId} activePlayers={activePlayers} timer={timer} localUserId={localUser.id}/>
        </>
    )
}
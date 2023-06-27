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
import { RoundWinner, StatefulRoundWinners } from "@/global/functions/game";


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
    const [joinedGame, setJoinedGame] = useState<boolean>(false);
    const [selectedPrompt, setSelectedPrompt] = useState<number>(0);
    const [packAnimation, setPackAnimation] = useState<boolean>(false);
    const [spotifyModal, setSpotifyMdoal] = useState<boolean>(false);
    const [timer, setTimer] = useState<number>(0);
    const [activePlayers, setActivePlayers] = useState<[UsersOrGuests | undefined, UsersOrGuests | undefined]>([undefined, undefined]);
    const [allowVoting, setAllowVoting] = useState<boolean>(false);
    const [roundWinners, setRoundWinners] = useState<StatefulRoundWinners>({winners: [undefined, undefined], tracks: [undefined, undefined]})

    const router = useRouter();

    useEffect(()=>{
        if(!joinedGame){
            setJoinedGame(true);
            socket.emit("Client-Ready", {id: localUser.id, currentGame: gameId});
        }
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
            }else setAllowVoting(true);
            setActivePlayers([user1, user2]);
            setSelectedPrompt(prompt);
        });
        socket.on("Round-Timer", (timer: number) => {
            setTimer(timer);
        });
        socket.on("Display-Round-Winner", (roundWinners: RoundWinner) => {
            setAllowVoting(false);
            console.log("hit Display Round winners")
            //If id from round winner is provided, lookup and find. Else, set to undefined indicating no winner for given tuple position.
            const winner0 = roundWinners.winners[0] ? initData.expand.guests.find(g => g.id === roundWinners.winners[0] as string) : undefined;
            const winner1 = roundWinners.winners[1] ? initData.expand.guests.find(g => g.id === roundWinners.winners[1] as string) : undefined;
            setRoundWinners({winners: [winner0, winner1], tracks: [roundWinners.tracks[0], roundWinners.tracks[1]]});
            const clearWinners = setTimeout(()=>{
                setRoundWinners({winners: [undefined, undefined], tracks: [undefined, undefined]})
                clearTimeout(clearWinners);
            }, 10000);
            
        });
        

    },[initData.expand.guests, activePlayers, timer, selectedPrompt, gameId, initData, localUser.id, router, joinedGame])

    useEffect(()=>{
        if(timer != 0){
            const delay = setTimeout(() =>{
                setTimer(prevTime => prevTime - 1);                                           // modal checks if in selection phase
                if(timer - 1 == 0 && (localUser.id == activePlayers[0]?.id || localUser.id == activePlayers[1]?.id) && spotifyModal) {
                    setSpotifyMdoal(false);
                    console.log("Sending expired timer signal with id: ", localUser.id);
                    socket.emit("Expired-Select-Timer", localUser.id);
                    clearTimeout(delay);
                }
            }, 1000);
        }
    },[timer, activePlayers, localUser.id, spotifyModal, allowVoting])

    return (
        <>
            <SpotifySearch isActive={spotifyModal} accessToken={accessToken} gameId={gameId} localUserId={localUser.id} prompt={initData.expand.pack.packData.prompts[selectedPrompt]}/>
            <Spinner prompts={initData.expand.pack.packData.prompts} selected={selectedPrompt} userId={localUser.id} votingAllowed={allowVoting} roundWinners={roundWinners}/>
            <GameState gameId={gameId} activePlayers={activePlayers} timer={timer} localUserId={localUser.id}/>
        </>
    )
}
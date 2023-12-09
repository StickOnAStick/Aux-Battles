'use client';
import SpotifySearch from "@/components/SpotifySearch";
import Spinner from "./Spinner";
import { SpotifyAccessTokenResponse } from "@/global/types/Spotify";
import GameState from "./GameState";
import { ExpandedGameData, UsersOrGuests } from "@/global/types/Unions";
import { useState, useEffect } from 'react';
import { Guests } from "@/global/types/Guests";
import { socket } from "@/global/functions/socket";
import { useRouter } from "next/navigation";
import { RoundWinner, StatefulRoundWinners } from "@/global/functions/game";
import { Users } from "@/global/types/Users";


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
    localUser: Guests | Users
}){
    const [joinedGame, setJoinedGame] = useState<boolean>(false);
    const [selectedPrompt, setSelectedPrompt] = useState<number>(0);
    const [packAnimation, setPackAnimation] = useState<boolean>(false);
    const [spotifyModal, setSpotifyMdoal] = useState<boolean>(false);
    const [timer, setTimer] = useState<number>(0);
    const [activePlayers, setActivePlayers] = useState<[UsersOrGuests | undefined, UsersOrGuests | undefined]>([undefined, undefined]);
    const [allowVoting, setAllowVoting] = useState<boolean>(false);
    const [roundWinners, setRoundWinners] = useState<StatefulRoundWinners>({winners: [undefined, undefined], tracks: [undefined, undefined]})
    const [gameWinner, setGameWinner] = useState<[UsersOrGuests | undefined, number]>([undefined, 0])

    const router = useRouter();
    
    useEffect(()=>{
        if(!joinedGame){
            setJoinedGame(true);
            socket.emit("Client-Ready", {id: localUser.id, currentGame: gameId});
        }
        socket.on("Navigate-To-Home", () => {
            router.push("/")
        }) 
        socket.on("Display-Pack", ()=>{
            setPackAnimation(true); 
            setTimeout(()=>{setPackAnimation(false)}, 1000);
        });
        socket.on("Active-Players", ([ids, prompt]: [[string, string], number]) => {
            const user1 = initData.expand.guests.find(g => g.id === ids[0] as string);
            const user2 = initData.expand.guests.find(g => g.id === ids[1] as string);
            if(localUser.id === user1?.id || localUser.id === user2?.id){
                setAllowVoting(false);
                setSpotifyMdoal(true);
            }else {
                setAllowVoting(true);
                setSpotifyMdoal(false);
            }
            setActivePlayers([user1, user2]);
            
            setSelectedPrompt(prompt);
        });
        socket.on("Round-Timer", (timer: number) => {
            setTimer(timer);
        });
        socket.on("Display-Round-Winner", (roundWinners: RoundWinner) => {
            setAllowVoting(false);
            //If id from round winner is provided, lookup and find. Else, set to undefined indicating no winner for given tuple position.
            const winner0 = roundWinners.winners[0] ? initData.expand.guests.find(g => g.id === roundWinners.winners[0] as string) : undefined;
            const winner1 = roundWinners.winners[1] ? initData.expand.guests.find(g => g.id === roundWinners.winners[1] as string) : undefined;
            setRoundWinners({winners: [winner0, winner1], tracks: [roundWinners.tracks[0], roundWinners.tracks[1]]});
            const clearWinners = setTimeout(()=>{
                setActivePlayers([undefined, undefined]);
                setRoundWinners({winners: [undefined, undefined], tracks: [undefined, undefined]})
                clearTimeout(clearWinners);
            }, 10000);
            
        });
        socket.on("Game-Winner", ([id, score]: [string, number]) => {
            const winner = initData.expand.guests.find(g => g.id === id);
            setGameWinner([winner, score]);
        })
    },[initData.expand.guests, activePlayers, timer, selectedPrompt, gameId, initData, localUser.id, router, joinedGame])

    useEffect(()=>{
        if(timer != 0){
            const delay = setTimeout(() =>{
                // modal checks if in selection phase
                if(timer - 1 == 0 && (localUser.id == activePlayers[0]?.id || localUser.id == activePlayers[1]?.id) && spotifyModal) {
                    setSpotifyMdoal(false);
                    setTimer(0);
                    socket.emit("Expired-Select-Timer", localUser.id);
                    clearTimeout(delay);
                }
                setTimer(prevTime => prevTime - 1); 
            }, 1000);
            return () => {
                clearTimeout(delay);
            }
        }
    },[timer, activePlayers, localUser.id, spotifyModal, allowVoting])

    return (
        <>
            <SpotifySearch isActive={spotifyModal} accessToken={accessToken} gameId={gameId} localUserId={localUser.id} prompt={initData.expand.pack.packData.prompts[selectedPrompt]}/>
            <Spinner gameWinner={gameWinner} prompts={initData.expand.pack.packData.prompts} selected={selectedPrompt} userId={localUser.id} votingAllowed={allowVoting} roundWinners={roundWinners}/>
            {/* Conditional rendering of game state is REQUIRED, otherwise caching errors occur. Causing child to have old activeplayer values set. */}
            {activePlayers[0] && activePlayers[1] && <GameState gameId={gameId} activePlayers={activePlayers} timer={timer} localUserId={localUser.id}/>}
        </>
    )
}
'use client';
import SpotifySearch from "@/components/SpotifySearch";
import Spinner from "./Spinner";
import { SpotifyAccessTokenResponse } from "@/global/types/Spotify";
import GameState from "./GameState";
import { ExpandedGameData, UsersOrGuests } from "@/global/types/Unions";
import { useState, useEffect } from 'react';
import PocketBase from 'pocketbase';

interface SpotifyModal {
    spotifyModal: boolean,
    setSpotifyModal: React.Dispatch<React.SetStateAction<boolean>>
}

async function gameLoop(gameData: ExpandedGameData, spotfiyModal: SpotifyModal){
    const pb = new PocketBase('http://127.0.0.1:8091');

    


}

export default function GameWrapper({
    accessToken,
    gameId,
    initData,
    initActivePlayers,
    userToken
}:{
    accessToken: SpotifyAccessTokenResponse,
    gameId: string,
    initData: ExpandedGameData,
    initActivePlayers: UsersOrGuests[],
    userToken: string
}){
    const [spotifyModal, setSpotifyMdoal] = useState<boolean>(false);
    const [timer, setTimer] = useState<number>();




    return (
        <>
            <SpotifySearch isActive={spotifyModal} accessToken={accessToken}/>
            <Spinner />
            <GameState gameId={gameId} initialData={initData} activePlayers={initActivePlayers} timer={12}/>
        </>
    )
}
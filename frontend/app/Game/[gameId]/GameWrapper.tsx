'use client';
import SpotifySearch from "@/components/SpotifySearch";
import Spinner from "./Spinner";
import { SpotifyAccessTokenResponse } from "@/global/types/Spotify";
import GameState from "./GameState";
import { ExpandedGameData, UsersOrGuests } from "@/global/types/Unions";
import { useState, useEffect } from 'react';
import PocketBase from 'pocketbase';
import { PackData, Packs } from "@/global/types/Packs";
import { Guests } from "@/global/types/Guests";

interface SpotifyModal {
    spotifyModal: boolean,
    setSpotifyModal: React.Dispatch<React.SetStateAction<boolean>>
}

async function gameLoop(gameData: ExpandedGameData, spotfiyModal: SpotifyModal, userToken: string, packData: PackData, setTimer: React.Dispatch<React.SetStateAction<number | undefined>>){
    const pb = new PocketBase('http://127.0.0.1:8091');

    function spin(): string {
        const rand = Math.random();
        const selectedPrompt = packData.prompts[Math.floor(rand * packData.prompts.length)]
        return selectedPrompt;
    }

    async function selectionPhase(){
        const localUser = await pb.collection('guests').getFirstListItem(`token="${userToken}"`);
        if(localUser.id == gameData.activeGuests[0] || localUser.id == gameData.activeGuests[1]){
            spotfiyModal.setSpotifyModal(true);
            setTimer(60);
        }
    }
    await selectionPhase();
    
}

export default function GameWrapper({
    accessToken,
    gameId,
    initData,
    initActivePlayers,
    userToken,
    packData,
    isHost,
    localUser
}:{
    accessToken: SpotifyAccessTokenResponse,
    gameId: string,
    initData: ExpandedGameData,
    initActivePlayers: UsersOrGuests[],
    userToken: string,
    packData: PackData,
    isHost: boolean,
    localUser: Guests
}){
    const [spotifyModal, setSpotifyMdoal] = useState<boolean>(localUser.id == initActivePlayers[0].id || localUser.id == initActivePlayers[1].id);
    const [timer, setTimer] = useState<number | undefined>(undefined);

    if(isHost) gameLoop(initData, {spotifyModal: spotifyModal, setSpotifyModal: setSpotifyMdoal}, userToken, packData, setTimer);

    return (
        <>
            <SpotifySearch isActive={spotifyModal} accessToken={accessToken}/>
            <Spinner />
            <GameState gameId={gameId} initialData={initData} activePlayers={initActivePlayers} timer={timer}/>
        </>
    )
}
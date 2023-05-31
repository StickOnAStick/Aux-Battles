'use client'

import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

type GameState = {
    gameActive: boolean,
}

async function updateGameState(){

}

export default function ExperimentalGame({
    params
}:{
    params: {
        gameId: string,
    }
}){

    const [gameState, setGameState] = useState<boolean>(false);

    useEffect(()=>{
        socket.emit('client-ready');

        socket.on('fetch-game-state', () => {
            socket.emit('game-state', gameState);
        })
    },[])


    return (
        <div className="h-full flex flex-col justify-center items-center gap-4">
            Hello Game Server!
            <div className="flex flex-col w-1/4 gap-2">
                <button className="btn btn-info font-extrabold text-xl">
                    Check state
                </button>
                <button className="btn btn-accent">
                    Update state
                </button>
            </div>

            <span>Game State: []</span>
            <span></span>
        </div>
    );
}
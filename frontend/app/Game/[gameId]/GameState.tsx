'use client';
import { useEffect, useState } from 'react';
import {  UsersOrGuests } from '@/global/types/Unions';
import { Track } from '@/global/types/SpotifyAPI';
import { socket } from '@/global/functions/socket';
import { Client } from '@/global/types/GameSocket';
import Image from 'next/image';

export default function GameState({
    gameId,
    activePlayers,
    timer,
    localUserId,
}:{
    gameId: string,
    /**
     * Active player Id's from game server of active guests.
     */
    activePlayers: [UsersOrGuests | undefined, UsersOrGuests | undefined]
    timer: number,
    localUserId: string,
}){
    const [selectedTracks, setSelectedTracks] = useState<[Track | undefined, Track | undefined]>([undefined, undefined]);
    const [screenWidth, setScreenWidth] = useState<number>(0);

    useEffect(()=>{
        setScreenWidth(window.innerWidth);
    },[])

    useEffect(() => {
        
        socket.on("Display-Song", ({clientId, track}:{clientId: string, track: Track}) => {
            
            if(!activePlayers[0] || !activePlayers[1]) return;
            
            const index = clientId === activePlayers[0].id ? 0 : 1;
            setSelectedTracks((prev: [Track | undefined, Track | undefined]) => {
                if(index) return [track, prev[1]];
                else return [prev[0], track];
            })
        })
        socket.on("Display-Round-Winner", () => {
            setSelectedTracks([undefined, undefined]);
        })
    },[activePlayers, selectedTracks])

    return(
        <div className="absolute bottom-5 left-0 flex justify-between w-full lg:w-9/12 px-6 md:px-24">
            {activePlayers[0] != undefined && 
                <div className={(selectedTracks[0] != undefined ? "border-success " : "border-primary ") + " -z-20 bg-base-300 border-2 border-opacity-100 rounded-lg w-5/12 md:w-1/6 text-center align-middle text-lg sm:text-xl font-bold overflow-hidden "}>
                    {(selectedTracks[0] !== undefined && selectedTracks[0].album.images[1].height && selectedTracks[0].album.images[1].width) ?
                    <Image className='rounded-sm' src={selectedTracks[0].album.images[1].url} height={selectedTracks[0].album.images[1].height} width={selectedTracks[0].album.images[1].width} alt='album cover' />
                    :
                    <span className='flex flex-col h-full justify-center text-center'>{activePlayers[0] && activePlayers[0].username}</span>
                    }
                </div>
            }
            <div className="w-4/12 md:w-4/6 flex justify-center items-end">
                {timer!=undefined && //Check incase timer is -1 or unset
                    <span className="countdown font-mono text-5xl fond-bold align-bottom">
                    {/* @ts-ignore-next-line */}
                        <span style={{"--value":timer}}></span>
                    </span>
                }
            </div>

            {activePlayers[1] != undefined && 
                <div className={(selectedTracks[1] != undefined ? "border-success " : "border-primary ") + " -z-20 bg-base-300 border-2 rounded-lg w-5/12 md:w-1/6 text-center align-middle text-lg sm:text-xl font-bold overflow-hidden "}>
                    {(selectedTracks[1] !== undefined && selectedTracks[1].album.images[1].height && selectedTracks[1].album.images[1].width) ?
                    <Image className='rounded-sm' src={selectedTracks[1].album.images[1].url} height={screenWidth > 670 ?  selectedTracks[1].album.images[1].height : selectedTracks[1].album.images[1].height} width={screenWidth > 670 ?  selectedTracks[1].album.images[1].width : selectedTracks[1].album.images[1].width} alt='album cover' />
                    :
                    <span className='flex flex-col h-full justify-center text-center'>{activePlayers[1] && activePlayers[1].username}</span>
                    }
                </div>
            }
        </div>
        
        
    );
}
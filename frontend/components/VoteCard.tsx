'use client';
import { Track } from "@/global/types/SpotifyAPI";
import { Guests } from "@/global/types/Guests";
import Image from 'next/image';

export default function VoteCard({
    track,
    voteFunc,
    voteCount,
    winner
}:{
    track: Track,
    voteFunc: () => void ,
    voteCount: number,
    winner?: Guests | undefined
}){
    return (
    <button onClick={() => voteFunc()} className="flex flex-col justify-between bg-base-300 border border-primary rounded-lg w-[150px] sm:w-[300px] align-middle">
        
            <Image className="rounded-md" src={track.album.images[1].url} height={300} width={300} alt="album cover"/>
            <div className="flex flex-col flex-wrap justify-center py-1">
            <span className="text-lg text-center">{track.name}</span>
            <span className="text-base text-center font-thin">{track.artists[0].name}</span>
            </div>
            <span className=" font-bold text-lg flex justify-center w-full">{voteCount}</span>
            {
                winner?.id && <span className="fond-bold text-xl"></span>
            }
        
    </button> 
    );
}
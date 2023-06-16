import { useEffect, useState } from "react";
import { socket } from "@/global/functions/socket";
import { Track } from "@/global/types/SpotifyAPI";
import Image from 'next/image';

export default function Spinner({
  prompts,
  selected
}:{
  prompts: string[],
  selected: number  
}){
    useEffect(()=>{
      socket.on("Song-PlayBack", (track: Track) => {
        console.log("Song-Playback Hit!", track);
        setSongPlayBack(track);
      })
    },[])

    const [songPlayBack, setSongPlayBack] = useState<Track | undefined>(undefined);

    return (
        <div className="flex w-full text-6xl font-extrabold justify-center items-center h-full">
            {
              songPlayBack ?  
              <div className=" bg-base-300 border border-primary rounded-lg">
                <Image className="rounded-sm" src={songPlayBack.album.images[1].url} height={300} width={300} alt="album cover"/>
                <span>{songPlayBack.name}</span>
                <video autoPlay>
                  <source src={songPlayBack.preview_url} type="audio/mpeg"/>
                  Your Browser does not support audio playback.
                </video>
              </div>  
              :
              <>
              {prompts[selected]}
              </>
            }
        </div>
    );
}